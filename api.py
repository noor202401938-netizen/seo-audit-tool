from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import json
import os

from crawler.website_crawler import crawl_website
from database.sqlite_manager import SQLiteManager
from utils.offpage_auditor import OffPageAuditor
from utils.recommendation_engine import RecommendationEngine
from utils.report_generator import ReportGenerator
from utils.ai_recommender import AIRecommendationGenerator

app = FastAPI(title="SEO Audit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
db = SQLiteManager()

class AuditRequest(BaseModel):
    url: str
    target_keywords: Optional[str] = None # comma separated keywords
    crawl: bool = False
    max_pages: int = 10

from redis import Redis
from rq import Queue
from rq.job import Job

# Set up Redis and RQ Queue
redis_conn = Redis()
q = Queue(connection=redis_conn)

@app.post("/api/audit")
def perform_audit(request: AuditRequest):
    try:
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
            "url": request.url
        }
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
    filename = f"output/{url.replace('https://', '').replace('http://', '').replace('/', '_')}_seo_report.pdf"
    if os.path.exists(filename):
        return FileResponse(filename, media_type="application/pdf", filename=os.path.basename(filename))
    else:
        raise HTTPException(status_code=404, detail="PDF Report not found. Run the audit first.")
