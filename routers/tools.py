from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth_utils import get_current_user

import tool_runners

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

@router.post("/robots-txt-tester")
async def run_robots_txt_tester(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_robots_txt_tester(req.url)

@router.post("/sitemap-checker")
async def run_sitemap_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_sitemap_checker(req.url)

@router.post("/https-header-checker")
async def run_https_header_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_https_header_checker(req.url)

@router.post("/meta-tags-checker")
async def run_meta_tags_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_meta_tags_checker(req.url)

@router.post("/website-technology-checker")
async def run_website_technology_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_website_technology_checker(req.url)

@router.post("/url-redirect-checker")
async def run_url_redirect_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_url_redirect_checker(req.url)

@router.post("/llms-txt-generator")
async def run_llms_txt_generator(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_llms_txt_generator(req.url)

@router.post("/email-verification")
async def run_email_verification(req: EmailToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_email_verification_tool(req.email)

# ==========================================
# PHASE 2: Content & On-Page Tools
# ==========================================

@router.post("/keyword-density-checker")
async def run_keyword_density_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_keyword_density_checker(req.url)

@router.post("/internal-link-analysis-tool")
async def run_internal_link_analysis_tool(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_internal_link_analysis_tool(req.url)

@router.post("/crawlability-test-tool")
async def run_crawlability_test_tool(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_crawlability_test_tool(req.url)

@router.post("/mobile-friendly-test-tool")
async def run_mobile_friendly_test_tool(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_mobile_friendly_test_tool(req.url)

@router.post("/ai-seo-assistant")
async def run_ai_seo_assistant(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_ai_seo_assistant(req.url)

# ==========================================
# PHASE 3: Performance & Technical Tools
# ==========================================

@router.post("/image-optimizer-tool")
async def run_image_optimizer_tool(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_image_optimizer_tool(req.url)

@router.post("/schema-markup-validator")
async def run_schema_markup_validator(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_schema_markup_validator(req.url)

@router.post("/canonical-tag-checker")
async def run_canonical_tag_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_canonical_tag_checker(req.url)

@router.post("/broken-link-checker")
async def run_broken_link_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_broken_link_checker(req.url)

@router.post("/core-web-vitals-checker")
async def run_core_web_vitals_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_core_web_vitals_checker(req.url)

# ==========================================
# PHASE 4: Off-Page & Security Tools
# ==========================================

@router.post("/serp-rank-checker-tool")
async def run_serp_rank_checker_tool(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_serp_rank_checker_tool(req.url)

@router.post("/backlink-checker-tool")
async def run_backlink_checker_tool(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_backlink_checker_tool(req.url)

@router.post("/ssl-certificate-checker")
async def run_ssl_certificate_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_ssl_certificate_checker(req.url)

@router.post("/malware-security-scanner")
async def run_malware_security_scanner(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_malware_security_scanner(req.url)

@router.post("/seo-competitor-analysis")
async def run_seo_competitor_analysis(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_seo_competitor_analysis(req.url)

@router.post("/domain-authority-checker")
async def run_domain_authority_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_domain_authority_checker(req.url)

@router.post("/social-media-tags-checker")
async def run_social_media_tags_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_social_media_tags_checker(req.url)

@router.post("/keyword-research-tool")
async def run_keyword_research_tool(req: KeywordToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_keyword_research_tool(req.keyword)

@router.post("/company-logo-api")
async def run_company_logo_api(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_company_logo_api(req.url)

@router.post("/wayback-machine-archive-checker")
async def run_wayback_archive_checker(req: ToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_wayback_archive_checker(req.url)

@router.post("/youtube-serp-rank-checker")
async def run_youtube_serp_checker(req: YouTubeSerpRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_youtube_serp_checker(req.keyword, req.target)

@router.post("/google-serp-rank-checker")
async def run_google_serp_checker(req: SerpToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_google_serp_checker(req.keyword, req.target)

@router.post("/bing-serp-checker-tool")
async def run_bing_serp_checker(req: SerpToolRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_bing_serp_checker(req.keyword, req.target)

@router.post("/ai-seo-assistant")
async def run_ai_seo_assistant(req: AIQueryRequest, current_user = Depends(get_current_user)):
    return tool_runners.run_ai_seo_assistant(req.query)
