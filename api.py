from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import json
import os
from datetime import timedelta
from prisma import Prisma
from auth_utils import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

from crawler.website_crawler import crawl_website
from database.sqlite_manager import SQLiteManager
from utils.offpage_auditor import OffPageAuditor
from utils.recommendation_engine import RecommendationEngine
from utils.report_generator import ReportGenerator
from utils.ai_recommender import AIRecommendationGenerator

app = FastAPI(title="SEO Audit API")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prisma = Prisma()

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

from redis import Redis
from rq import Queue
from rq.job import Job

# Set up Redis and RQ Queue
redis_conn = Redis()
q = Queue(connection=redis_conn)

def is_rate_limited(ip: str, limit: int = 5, window: int = 60) -> bool:
    """Simple fixed-window rate limiter using Redis"""
    key = f"rate_limit:login:{ip}"
    current = redis_conn.get(key)
    if current and int(current) >= limit:
        return True
    
    pipe = redis_conn.pipeline()
    pipe.incr(key)
    if not current:
        pipe.expire(key, window)
    pipe.execute()
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
                    "plan": "free",
                    "auditsRemaining": 5,
                    "monthlyLimit": 5,
                    "nextRenewalDate": "2029-01-01T00:00:00Z"
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
        # Check subscription limits
        sub = current_user.subscription
        if not sub or sub.auditsRemaining <= 0:
            raise HTTPException(status_code=403, detail="Not enough audits remaining. Please upgrade your plan.")

        # Decrement limit
        await prisma.subscription.update(
            where={"id": sub.id},
            data={"auditsRemaining": sub.auditsRemaining - 1}
        )
        
        # Save history record
        await prisma.auditrecord.create(
            data={
                "userId": current_user.id,
                "url": request.url,
                "deepCrawl": request.crawl,
                "maxPages": request.max_pages
            }
        )

        # Parse keywords if provided
        target_kws = None
        if request.target_keywords:
            target_kws = [k.strip() for k in request.target_keywords.split(",") if k.strip()]
            
        # Enqueue the background task
        from tasks import perform_audit_task
        job = q.enqueue(perform_audit_task, request.url, request.crawl, request.max_pages, job_timeout=3600)
        
        return {
            "status": "queued",
            "job_id": job.id,
            "url": request.url,
            "audits_remaining": sub.auditsRemaining - 1
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit/status/{job_id}")
def get_audit_status(job_id: str):
    try:
        job = Job.fetch(job_id, connection=redis_conn)
        if job.is_finished:
            return job.result
        elif job.is_failed:
            return {"status": "failed", "error": str(job.exc_info)}
        else:
            return {"status": "processing", "job_id": job_id}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Job not found or error fetching status.")

@app.get("/api/audit/pdf")
def get_pdf(url: str):
    safe_name = os.path.basename(url.replace('https://', '').replace('http://', '').replace('/', '_'))
    filename = f"output/{safe_name}_seo_report.pdf"
    if os.path.exists(filename):
        return FileResponse(filename, media_type="application/pdf", filename=os.path.basename(filename))
    else:
        raise HTTPException(status_code=404, detail="PDF Report not found. Run the audit first.")
