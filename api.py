from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import json
import os
from datetime import timedelta, datetime, timezone
from db_client import prisma
from auth_utils import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES


from utils.ai_recommender import AIRecommendationGenerator
from routers import tools

app = FastAPI(title="SEO Audit API")
app.include_router(tools.router)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class AuditRequest(BaseModel):
    url: str # validated later in perform_audit to avoid Pydantic serialization issues with HttpUrl
    target_keywords: Optional[str] = None # comma separated keywords
    crawl: bool = False
    max_pages: int = 10

class FeedbackRequest(BaseModel):
    tone: str
    reward: int

import asyncio
from concurrent.futures import ThreadPoolExecutor
from redis import Redis, ConnectionError as RedisConnectionError
from rq import Queue
from rq.job import Job
import uuid

_executor = ThreadPoolExecutor(max_workers=4)
_inline_jobs: dict = {}  # fallback in-memory job store when Redis is unavailable

# Try to connect to Redis; gracefully fall back to inline execution if unavailable
try:
    redis_conn = Redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
                                socket_connect_timeout=2)
    redis_conn.ping()  # fail fast if Redis is not reachable
    q = Queue(connection=redis_conn)
    _redis_available = True
except Exception:
    redis_conn = None
    q = None
    _redis_available = False
    print("[WARNING] Redis unavailable — audits will run synchronously.")

def is_rate_limited(ip: str, limit: int = 5, window: int = 60) -> bool:
    """Simple fixed-window rate limiter using Redis"""
    try:
        key = f"rate_limit:login:{ip}"
        current = redis_conn.get(key)
        if current and int(current) >= limit:
            return True
        
        pipe = redis_conn.pipeline()
        pipe.incr(key)
        if not current:
            pipe.expire(key, window)
        pipe.execute()
    except Exception:
        pass
    return False

@app.post("/api/auth/register", response_model=Token)
async def register(user: UserRegister):
    existing = await prisma.user.find_unique(where={"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    
    new_user = await prisma.user.create(
        data={
            "email": user.email,
            "hashedPassword": hashed_password,
            "name": user.name,
            "subscription": {
                "create": {
                    "plan": "community",
                    "auditsRemaining": 999999,
                    "monthlyLimit": 999999,
                    "nextRenewalDate": datetime(2099, 1, 1, tzinfo=timezone.utc)
                }
            }
        },
        include={"subscription": True}
    )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    client_ip = request.client.host if request.client else "127.0.0.1"
    if is_rate_limited(client_ip, limit=10, window=60):
        raise HTTPException(status_code=429, detail="Too many login attempts. Please try again later.")
        
    user = await prisma.user.find_unique(where={"email": form_data.username})
    if not user or not verify_password(form_data.password, user.hashedPassword):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me")
async def read_users_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "subscription": current_user.subscription
    }

@app.post("/api/audit")
async def perform_audit(request: AuditRequest, current_user = Depends(get_current_user)):
    try:
        # Save history record
        record = await prisma.auditrecord.create(
            data={
                "userId": current_user.id,
                "url": request.url,
                "deepCrawl": request.crawl,
                "maxPages": request.max_pages
            }
        )

        from tasks import perform_audit_task

        if _redis_available:
            # Normal path: enqueue in Redis/RQ
            job = q.enqueue(perform_audit_task, request.url, request.crawl, request.max_pages, current_user.id, record.id, job_timeout=3600)
            job_id = job.id
        else:
            # Fallback: run synchronously in a thread pool, store result in memory
            job_id = str(uuid.uuid4())
            _inline_jobs[job_id] = {"status": "processing"}

            def _run_and_store(jid, url, crawl, max_pages, uid, rec_id):
                try:
                    result = perform_audit_task(url, crawl, max_pages, uid, rec_id)
                    _inline_jobs[jid] = result
                except Exception as exc:
                    _inline_jobs[jid] = {"status": "failed", "error": str(exc)}

            loop = asyncio.get_event_loop()
            loop.run_in_executor(_executor, _run_and_store, job_id, request.url, request.crawl, request.max_pages, current_user.id, record.id)

        return {
            "status": "queued",
            "job_id": job_id,
            "url": request.url,
            "audits_remaining": 999999
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit/status/{job_id}")
def get_audit_status(job_id: str):
    try:
        # Check in-memory fallback store first
        if job_id in _inline_jobs:
            return _inline_jobs[job_id]

        # Otherwise check Redis/RQ
        if not _redis_available:
            raise HTTPException(status_code=404, detail="Job not found.")

        job = Job.fetch(job_id, connection=redis_conn)
        if job.is_finished:
            return job.result
        elif job.is_failed:
            return {"status": "failed", "error": str(job.exc_info)}
        else:
            return {"status": "processing", "job_id": job_id}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Job not found or error fetching status.")

@app.get("/api/audit/recent")
async def get_recent_audits(current_user = Depends(get_current_user)):
    try:
        # Fetch last 10 audits with resultJson not null
        records = await prisma.auditrecord.find_many(
            where={
                "userId": current_user.id,
                "resultJson": {"not": None}
            },
            order={"createdAt": "desc"},
            take=10
        )
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit/history/{record_id}")
async def get_audit_history(record_id: str, current_user = Depends(get_current_user)):
    try:
        record = await prisma.auditrecord.find_unique(where={"id": record_id})
        if not record or record.userId != current_user.id:
            raise HTTPException(status_code=404, detail="Audit not found")
        if not record.resultJson:
            raise HTTPException(status_code=404, detail="Audit result not available")
        return json.loads(record.resultJson)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit/pdf/{record_id}")
async def get_pdf(record_id: str, current_user = Depends(get_current_user)):
    record = await prisma.auditrecord.find_unique(where={"id": record_id})
    if not record or record.userId != current_user.id:
        raise HTTPException(status_code=404, detail="Audit not found")
    filename = f"data/output/{record_id}.pdf"
    if not os.path.exists(filename):
        raise HTTPException(status_code=404, detail="PDF Report not found. Run the audit first.")
    return FileResponse(filename, media_type="application/pdf", filename=f"seo_report_{record_id}.pdf")

@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest, current_user = Depends(get_current_user)):
    try:
        record = await prisma.aifeedback.find_unique(where={"tone": request.tone})
        if record:
            await prisma.aifeedback.update(
                where={"tone": request.tone},
                data={
                    "trials": record.trials + 1,
                    "wins": record.wins + request.reward
                }
            )
        else:
            await prisma.aifeedback.create(
                data={
                    "tone": request.tone,
                    "trials": 1,
                    "wins": request.reward
                }
            )
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
