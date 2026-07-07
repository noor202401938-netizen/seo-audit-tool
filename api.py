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

@app.post("/api/audit")
def perform_audit(request: AuditRequest):
    try:
        # Parse keywords if provided
        target_kws = None
        if request.target_keywords:
            target_kws = [k.strip() for k in request.target_keywords.split(",") if k.strip()]
            
        record = crawl_website(request.url, db, target_kws)
        if record:
            # Save the contact and general metadata
            db.save_contact(record)
            
            seo_reports_str = record.get("seo_reports", "{}")
            seo_reports = json.loads(seo_reports_str) if seo_reports_str else {}
            
            # 1. Calculate On-Page Score and normalize issues
            total_onpage_score = 0
            pages_count = 0
            all_normalized_issues = []
            
            # Clear previous issues
            db.clear_onpage_issues(request.url)
            
            for page_url, details in seo_reports.items():
                pages_count += 1
                report = details.get("report", {})
                score = report.get("score", 100)
                total_onpage_score += score
                
                # Normalize and save issues
                for raw_issue in report.get("issues", []):
                    norm_issue = RecommendationEngine.normalize_issue(
                        website=request.url,
                        page_url=page_url,
                        category=raw_issue.get("category", "On-Page"),
                        issue=raw_issue.get("issue", ""),
                        severity=raw_issue.get("severity", "Warning"),
                        fixes=raw_issue.get("fixes", ""),
                        automatable=raw_issue.get("automatable", False)
                    )
                    db.save_onpage_issue(norm_issue)
                    all_normalized_issues.append(norm_issue)
                    
            avg_onpage_score = round(total_onpage_score / pages_count) if pages_count > 0 else 100
            
            # 2. Perform Off-Page Audit
            offpage_data = OffPageAuditor.get_metrics(request.url, db)
            
            # Off-page score calculation: primarily driven by DA, adjusted by spam score
            da = offpage_data.get("domain_authority", 0)
            spam = offpage_data.get("spam_score", 0)
            # Simple formula: DA - 0.5 * Spam
            offpage_score = max(0, min(100, int(da - (0.5 * spam))))
            
            # Normalize and save offpage issues
            if spam > 20:
                spam_issue = RecommendationEngine.normalize_issue(
                    website=request.url,
                    page_url=request.url,
                    category="Off-Page",
                    issue=f"High Spam Score ({spam}%)",
                    severity="Warning",
                    fixes="Disavow spammy backlinks pointing to your site.",
                    automatable=False
                )
                db.save_onpage_issue(spam_issue)
                all_normalized_issues.append(spam_issue)
                
            if da < 30:
                da_issue = RecommendationEngine.normalize_issue(
                    website=request.url,
                    page_url=request.url,
                    category="Off-Page",
                    issue=f"Low Domain Authority (DA: {da})",
                    severity="Warning",
                    fixes="Focus on building high-quality editorial links from authoritative websites in your niche.",
                    automatable=False
                )
                db.save_onpage_issue(da_issue)
                all_normalized_issues.append(da_issue)

            # Save the audit score
            db.save_audit(request.url, avg_onpage_score, offpage_score)
            
            # 3. Generate PDF Report
            filename = f"output/{request.url.replace('https://', '').replace('http://', '').replace('/', '_')}_seo_report.pdf"
            ReportGenerator.generate_pdf(
                filename=filename,
                website=request.url,
                onpage_score=avg_onpage_score,
                offpage_score=offpage_score,
                onpage_issues=all_normalized_issues,
                backlink_snapshot=offpage_data
            )
            
            return {
                "status": "success",
                "url": request.url,
                "onpage_score": avg_onpage_score,
                "offpage_score": offpage_score,
                "offpage_data": offpage_data,
                "issues": all_normalized_issues,
                "pdf_report_path": filename,
                "metadata": {
                    "name": record.get("name", ""),
                    "pages_crawled": pages_count
                }
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to crawl or invalid URL")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/audit/pdf")
def get_pdf(url: str):
    filename = f"output/{url.replace('https://', '').replace('http://', '').replace('/', '_')}_seo_report.pdf"
    if os.path.exists(filename):
        return FileResponse(filename, media_type="application/pdf", filename=os.path.basename(filename))
    else:
        raise HTTPException(status_code=404, detail="PDF Report not found. Run the audit first.")
