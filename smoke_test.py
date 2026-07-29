"""Feature smoke test: boots the real FastAPI app in-process and exercises every
endpoint. Classifies each as:
  OK    - 2xx, endpoint wired and ran (a tool returning {"error":...} from a live
          network/API-key issue still counts as wired)
  BUG   - 404 (missing route), 422 (request-model mismatch), or 5xx (code crash)
Run: python smoke_test.py
"""
import socket
import uuid

socket.setdefaulttimeout(12)  # keep live tool calls from hanging the run

from fastapi.testclient import TestClient
import api

TARGET = "https://example.com"
results = []


def check(name, method, path, *, json=None, data=None, headers=None, expect=(200,)):
    r = client.request(method, path, json=json, data=data, headers=headers)
    ok = r.status_code in expect
    tag = "OK " if ok else "BUG"
    detail = "" if ok else f"-> {r.status_code} {r.text[:120]}"
    results.append((ok, name, r.status_code))
    print(f"[{tag}] {name:38} {r.status_code} {detail}")
    return r


with TestClient(api.app, raise_server_exceptions=False) as client:
    email = f"smoke_{uuid.uuid4().hex[:8]}@example.com"

    # ---- Auth ----
    check("auth/register", "POST", "/api/auth/register",
          json={"email": email, "password": "pw12345", "name": "Smoke"})
    login = check("auth/login", "POST", "/api/auth/login",
                  data={"username": email, "password": "pw12345"},
                  headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = login.json().get("access_token")
    H = {"Authorization": f"Bearer {token}"}

    check("users/me", "GET", "/api/users/me", headers=H)

    # ---- Audit flow ----
    aud = check("audit (enqueue)", "POST", "/api/audit",
                json={"url": TARGET, "crawl": False}, headers=H)
    check("audit/recent", "GET", "/api/audit/recent", headers=H)
    check("feedback (auth required)", "POST", "/api/feedback",
          json={"tone": "Professional & Direct", "reward": 1}, headers=H)
    # unauth feedback must now be rejected
    check("feedback (no auth -> 401)", "POST", "/api/feedback",
          json={"tone": "x", "reward": 1}, expect=(401,))
    # unauth pdf must be rejected
    check("pdf (no auth -> 401)", "GET", "/api/audit/pdf/fake-id", expect=(401,))

    # ---- Tool tracking ----
    check("tools/track", "POST", "/api/tools/track",
          json={"tool_id": "meta-tags-checker"}, headers=H)
    check("tools/recent", "GET", "/api/tools/recent", headers=H)

    # ---- Every tool endpoint ----
    url_tools = [
        "robots-txt-tester", "sitemap-checker", "https-header-checker",
        "meta-tags-checker", "website-technology-checker", "url-redirect-checker",
        "llms-txt-generator", "keyword-density-checker", "internal-link-analysis-tool",
        "crawlability-test-tool", "mobile-friendly-test-tool", "image-optimizer-tool",
        "schema-markup-validator", "canonical-tag-checker", "broken-link-checker",
        "core-web-vitals-checker", "serp-rank-checker-tool", "backlink-checker-tool",
        "ssl-certificate-checker", "malware-security-scanner", "seo-competitor-analysis",
        "domain-authority-checker", "social-media-tags-checker",
        "wayback-machine-archive-checker", "company-logo-api",
    ]
    for t in url_tools:
        check(f"tools/{t}", "POST", f"/api/tools/{t}", json={"url": TARGET}, headers=H)

    check("tools/email-verification", "POST", "/api/tools/email-verification",
          json={"email": "test@example.com"}, headers=H)
    check("tools/keyword-research-tool", "POST", "/api/tools/keyword-research-tool",
          json={"keyword": "seo audit"}, headers=H)
    check("tools/ai-seo-assistant", "POST", "/api/tools/ai-seo-assistant",
          json={"query": "improve my blog seo"}, headers=H)
    for t in ["google-serp-rank-checker", "bing-serp-checker-tool", "youtube-serp-rank-checker"]:
        check(f"tools/{t}", "POST", f"/api/tools/{t}",
              json={"keyword": "seo", "target": "example.com"}, headers=H)

bugs = [r for r in results if not r[0]]
print("\n" + "=" * 60)
print(f"TOTAL {len(results)}  OK {len(results)-len(bugs)}  BUG {len(bugs)}")
for ok, name, code in bugs:
    print(f"  BUG: {name} ({code})")
