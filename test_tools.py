import os
from dotenv import load_dotenv

# Load .env
load_dotenv('.env')

import sys
sys.path.append('.')

import tool_runners

tests = [
    # Basic URL tools
    ("robots_txt_tester", tool_runners.run_robots_txt_tester, ["https://example.com"]),
    ("sitemap_checker", tool_runners.run_sitemap_checker, ["https://example.com"]),
    ("https_header_checker", tool_runners.run_https_header_checker, ["https://example.com"]),
    ("url_redirect_checker", tool_runners.run_url_redirect_checker, ["https://example.com"]),
    ("website_technology_checker", tool_runners.run_website_technology_checker, ["https://example.com"]),
    ("social_media_tags_checker", tool_runners.run_social_media_tags_checker, ["https://example.com"]),
    ("company_logo_api", tool_runners.run_company_logo_api, ["https://apple.com"]),
    ("wayback_machine_archive_checker", tool_runners.run_wayback_archive_checker, ["https://example.com"]),
    ("domain_authority_checker", tool_runners.run_domain_authority_checker, ["https://example.com"]),
    
    # Specific input tools
    ("email_verification", tool_runners.run_email_verification_tool, ["test@example.com"]),
    ("keyword_research", tool_runners.run_keyword_research_tool, ["seo tips"]),
    
    # Two-input tools
    ("youtube_serp", tool_runners.run_youtube_serp_checker, ["seo tutorial", "ahrefs"]),
    ("google_serp", tool_runners.run_google_serp_checker, ["apple", "apple.com"]),
    ("bing_serp", tool_runners.run_bing_serp_checker, ["microsoft", "microsoft.com"]),
    
    # AI Tool
    ("ai_seo_assistant", tool_runners.run_ai_seo_assistant, ["How to rank on Google?"])
]

results = []

for name, func, args in tests:
    print(f"Running {name}...")
    try:
        if len(args) == 1:
            res = func(args[0])
        elif len(args) == 2:
            res = func(args[0], args[1])
            
        if isinstance(res, dict) and "error" in res:
            print(f"  ❌ FAILED: {res['error']} - {res.get('message')}")
            results.append((name, "FAIL", res['error']))
        else:
            print(f"  ✅ SUCCESS")
            results.append((name, "PASS", ""))
    except Exception as e:
        print(f"  ❌ EXCEPTION: {e}")
        results.append((name, "EXCEPTION", str(e)))

print("\n--- SUMMARY ---")
for name, status, msg in results:
    print(f"{name.ljust(35)} | {status.ljust(10)} | {msg}")
