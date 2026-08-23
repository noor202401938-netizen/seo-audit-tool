from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

import tool_runners
from db_client import prisma

router = APIRouter(
    prefix="/api/tools",
    tags=["tools"]
)

class ToolRequest(BaseModel):
    url: str

class EmailToolRequest(BaseModel):
    email: str

class KeywordToolRequest(BaseModel):
    keyword: str

class YouTubeSerpRequest(BaseModel):
    keyword: str
    target: str

class SerpToolRequest(BaseModel):
    keyword: str
    target: str

class AIQueryRequest(BaseModel):
    query: str

class TrackToolRequest(BaseModel):
    tool_id: str

@router.post("/track")
async def track_tool_usage(req: TrackToolRequest):
    try:
        db = prisma
        user_id = "local-user"
        db_user = await db.user.find_first()
        if db_user:
            user_id = db_user.id

        existing = await db.toolusage.find_first(where={
            "userId": user_id,
            "toolId": req.tool_id
        })
        
        import datetime
        if existing:
            await db.toolusage.update(
                where={"id": existing.id},
                data={"lastUsed": datetime.datetime.utcnow()}
            )
        else:
            await db.toolusage.create(data={
                "userId": user_id,
                "toolId": req.tool_id,
                "lastUsed": datetime.datetime.utcnow()
            })
    except Exception:
        pass
    return {"status": "ok"}

@router.get("/recent")
async def get_recent_tools():
    try:
        db = prisma
        records = await db.toolusage.find_many(
            order={"lastUsed": "desc"},
            take=4
        )
        return [r.toolId for r in records]
    except Exception:
        return []

# ==========================================
# PHASE 1: Technical & Crawling Tools
# ==========================================

@router.post("/robots-txt-tester")
def run_robots_txt_tester(req: ToolRequest):
    return tool_runners.run_robots_txt_tester(req.url)

@router.post("/sitemap-checker")
def run_sitemap_checker(req: ToolRequest):
    return tool_runners.run_sitemap_checker(req.url)

@router.post("/https-header-checker")
def run_https_header_checker(req: ToolRequest):
    return tool_runners.run_https_header_checker(req.url)

@router.post("/meta-tags-checker")
def run_meta_tags_checker(req: ToolRequest):
    return tool_runners.run_meta_tags_checker(req.url)

@router.post("/website-technology-checker")
def run_website_technology_checker(req: ToolRequest):
    return tool_runners.run_website_technology_checker(req.url)

@router.post("/url-redirect-checker")
def run_url_redirect_checker(req: ToolRequest):
    return tool_runners.run_url_redirect_checker(req.url)

@router.post("/llms-txt-generator")
def run_llms_txt_generator(req: ToolRequest):
    return tool_runners.run_llms_txt_generator(req.url)

@router.post("/email-verification")
def run_email_verification(req: EmailToolRequest):
    return tool_runners.run_email_verification_tool(req.email)

# ==========================================
# PHASE 2: Content & On-Page Tools
# ==========================================

@router.post("/keyword-density-checker")
def run_keyword_density_checker(req: ToolRequest):
    return tool_runners.run_keyword_density_checker(req.url)

@router.post("/internal-link-analysis-tool")
def run_internal_link_analysis_tool(req: ToolRequest):
    return tool_runners.run_internal_link_analysis_tool(req.url)

@router.post("/crawlability-test-tool")
def run_crawlability_test_tool(req: ToolRequest):
    return tool_runners.run_crawlability_test_tool(req.url)

@router.post("/mobile-friendly-test-tool")
def run_mobile_friendly_test_tool(req: ToolRequest):
    return tool_runners.run_mobile_friendly_test_tool(req.url)

# ==========================================
# PHASE 3: Performance & Technical Tools
# ==========================================

@router.post("/image-optimizer-tool")
def run_image_optimizer_tool(req: ToolRequest):
    return tool_runners.run_image_optimizer_tool(req.url)

@router.post("/schema-markup-validator")
def run_schema_markup_validator(req: ToolRequest):
    return tool_runners.run_schema_markup_validator(req.url)

@router.post("/canonical-tag-checker")
def run_canonical_tag_checker(req: ToolRequest):
    return tool_runners.run_canonical_tag_checker(req.url)

@router.post("/broken-link-checker")
def run_broken_link_checker(req: ToolRequest):
    return tool_runners.run_broken_link_checker(req.url)

@router.post("/core-web-vitals-checker")
def run_core_web_vitals_checker(req: ToolRequest):
    return tool_runners.run_core_web_vitals_checker(req.url)

# ==========================================
# PHASE 4: Off-Page & Security Tools
# ==========================================

@router.post("/serp-rank-checker-tool")
def run_serp_rank_checker_tool(req: ToolRequest):
    return tool_runners.run_serp_rank_checker_tool(req.url)

@router.post("/backlink-checker-tool")
def run_backlink_checker_tool(req: ToolRequest):
    return tool_runners.run_backlink_checker_tool(req.url)

@router.post("/ssl-certificate-checker")
def run_ssl_certificate_checker(req: ToolRequest):
    return tool_runners.run_ssl_certificate_checker(req.url)

@router.post("/malware-security-scanner")
def run_malware_security_scanner(req: ToolRequest):
    return tool_runners.run_malware_security_scanner(req.url)

@router.post("/seo-competitor-analysis")
def run_seo_competitor_analysis(req: ToolRequest):
    return tool_runners.run_seo_competitor_analysis(req.url)

@router.post("/domain-authority-checker")
def run_domain_authority_checker(req: ToolRequest):
    return tool_runners.run_domain_authority_checker(req.url)

@router.post("/social-media-tags-checker")
def run_social_media_tags_checker(req: ToolRequest):
    return tool_runners.run_social_media_tags_checker(req.url)

@router.post("/keyword-research-tool")
def run_keyword_research_tool(req: KeywordToolRequest):
    return tool_runners.run_keyword_research_tool(req.keyword)

@router.post("/wayback-machine-archive-checker")
def run_wayback_archive_checker(req: ToolRequest):
    return tool_runners.run_wayback_archive_checker(req.url)

@router.post("/youtube-serp-rank-checker")
def run_youtube_serp_checker(req: YouTubeSerpRequest):
    return tool_runners.run_youtube_serp_checker(req.keyword, req.target)

@router.post("/google-serp-rank-checker")
def run_google_serp_checker(req: SerpToolRequest):
    return tool_runners.run_google_serp_checker(req.keyword, req.target)

@router.post("/bing-serp-checker-tool")
def run_bing_serp_checker(req: SerpToolRequest):
    return tool_runners.run_bing_serp_checker(req.keyword, req.target)

@router.post("/ai-seo-assistant")
def run_ai_seo_assistant(req: AIQueryRequest):
    return tool_runners.run_ai_seo_assistant(req.query)

@router.post("/company-logo-api")
def run_company_logo_api(req: ToolRequest):
    return tool_runners.run_company_logo_api(req.url)
