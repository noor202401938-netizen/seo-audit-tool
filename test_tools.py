import os
from dotenv import load_dotenv

# Load .env
load_dotenv('.env')

import sys
sys.path.append('.')

import tool_runners

# List of tools to test: (tool_name, function_pointer, list_of_args)
TOOLS_TO_TEST = [
    # Basic technical checks
    ("robots_txt_tester", tool_runners.run_robots_txt_tester, ["https://seointelligence.com"]),
    ("sitemap_checker", tool_runners.run_sitemap_checker, ["https://seointelligence.com"]),
    ("https_header_checker", tool_runners.run_https_header_checker, ["https://seointelligence.com"]),
    ("url_redirect_checker", tool_runners.run_url_redirect_checker, ["https://seointelligence.com"]),
    ("website_technology_checker", tool_runners.run_website_technology_checker, ["https://seointelligence.com"]),
    ("social_media_tags_checker", tool_runners.run_social_media_tags_checker, ["https://seointelligence.com"]),

    ("wayback_machine_archive_checker", tool_runners.run_wayback_archive_checker, ["https://seointelligence.com"]),
    ("domain_authority_checker", tool_runners.run_domain_authority_checker, ["seointelligence.com"]),

    # Utilities
    ("email_verification", tool_runners.run_email_verification_tool, ["contact@seointelligence.com"]),
    ("keyword_density", tool_runners.run_keyword_density_checker, ["https://google.com"]),

    # SERP / Rank tools
    ("youtube_serp", tool_runners.run_youtube_serp_checker, ["AI automation", "seointelligence"]),
    ("google_serp", tool_runners.run_google_serp_checker, ["seointelligence", "seointelligence.com"]),
    ("bing_serp", tool_runners.run_bing_serp_checker, ["seointelligence", "seointelligence.com"]),
    
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
