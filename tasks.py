import json
import os
import subprocess
import sys
import time
import traceback

from utils.ai_recommender import AIRecommendationGenerator
from utils.report_generator import ReportGenerator

def _resolve_seomator() -> str:
    """
    Resolve the seomator executable path robustly across platforms.
    On Windows, npm global binaries are .cmd files that subprocess can't
    find without shell=True or the explicit .cmd suffix.
    """
    if sys.platform == "win32":
        # Check the npm global prefix first
        npm_prefix = os.path.join(os.environ.get("APPDATA", ""), "npm")
        candidate = os.path.join(npm_prefix, "seomator.cmd")
        if os.path.exists(candidate):
            return candidate
        # Fall back to PATH search with explicit extension
        for p in os.environ.get("PATH", "").split(os.pathsep):
            candidate = os.path.join(p, "seomator.cmd")
            if os.path.exists(candidate):
                return candidate
    return "seomator"  # Unix / Docker: relies on PATH


_SEOMATOR = _resolve_seomator()


def perform_audit_task(url: str, crawl: bool = False, max_pages: int = 10, user_id: str = None):
    try:
        cmd = [_SEOMATOR, "audit", url, "--format", "json"]
        if crawl:
            cmd.extend(["--crawl", "-m", str(max_pages), "--concurrency", "10"])

        print(f"Running SEOmator: {' '.join(cmd)}")

        # shell=True is required on Windows when calling .cmd wrappers
        def _run_seomator():
            return subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                encoding="utf-8",
                shell=(sys.platform == "win32"),
            )

        result = _run_seomator()

        # seomator returns:
        #   0  => pass (score >= 70)
        #   1  => warn/fail findings (score < 70)
        #   2  => fatal error
        # IMPORTANT: In --format json mode, seomator writes the error as JSON
        # to STDOUT (not stderr), so stderr is always empty on code 2.
        if result.returncode == 2:
            # Try to extract the real error message from stdout JSON
            error_detail = result.stderr.strip()
            if not error_detail and result.stdout.strip():
                try:
                    err_json = json.loads(result.stdout)
                    error_detail = err_json.get("message", result.stdout[:300])
                except json.JSONDecodeError:
                    error_detail = result.stdout[:300]

            # Retry once for transient network/fetch errors
            transient_keywords = ("fetch", "network", "timeout", "econnreset",
                                  "enotfound", "socket", "connect")
            if any(k in error_detail.lower() for k in transient_keywords):
                print(f"[INFO] Transient error detected, retrying once: {error_detail}")
                time.sleep(3)
                result = _run_seomator()
                if result.returncode == 2:
                    try:
                        err_json2 = json.loads(result.stdout)
                        error_detail = err_json2.get("message", error_detail)
                    except json.JSONDecodeError:
                        pass

            if result.returncode == 2:
                raise Exception(f"SEOmator failed: {error_detail or 'Unknown error (no output)'}")

        # Parse JSON output
        try:
            audit_data = json.loads(result.stdout)
        except json.JSONDecodeError as e:
            raise Exception(
                f"Failed to parse SEOmator JSON output: {e}\n"
                f"stdout: {result.stdout[:500]}\n"
                f"stderr: {result.stderr[:500]}"
            )

        # Build a compact issues list for the AI recommender
        issues_for_ai = []
        for cat in audit_data.get("categoryResults", []):
            for res in cat.get("results", []):
                if res.get("status") in ("fail", "warn"):
                    details = res.get("details", {})
                    issues_for_ai.append({
                        "category": cat.get("categoryId", "Unknown"),
                        "severity": "Error" if res.get("status") == "fail" else "Warning",
                        "issue": res.get("ruleId", "Issue"),
                        "fixes": res.get("message", ""),
                        "page_url": (details.get("pageUrl", url) if details else url),
                    })

        overall_score = audit_data.get("overallScore", 0)

        try:
            ai_recommendation, ai_tone = AIRecommendationGenerator.generate(
                website=url,
                issues=issues_for_ai,
                onpage_score=overall_score,
                offpage_score=0,
                offpage_data={},
            )
            audit_data["ai_recommendation"] = ai_recommendation
            audit_data["ai_tone"] = ai_tone
        except Exception as e:
            print(f"AI recommendation generation failed: {e}")
            audit_data["ai_recommendation"] = "AI recommendations unavailable."
            audit_data["ai_tone"] = "neutral"

        audit_data["status"] = "success"

        # Generate the PDF report
        try:
            safe_name = os.path.basename(url.replace('https://', '').replace('http://', '').replace('/', '_'))
            pdf_filename = f"output/{safe_name}_seo_report.pdf"
            ReportGenerator.generate_pdf(
                filename=pdf_filename,
                website=url,
                onpage_score=overall_score,
                offpage_score=0,
                onpage_issues=issues_for_ai,
                backlink_snapshot={}
            )
        except Exception as e:
            print(f"Failed to generate PDF for {url}: {e}")

        if user_id:
            try:
                import sqlite3
                db_url = os.getenv("DATABASE_URL", "file:data/seo_auditor.db")
                if db_url.startswith("file:"):
                    db_path = db_url.split("file:")[1]
                else:
                    db_path = "data/seo_auditor.db"
                
                # Make sure path is relative to the cwd if not absolute
                if not os.path.isabs(db_path) and not os.path.exists(db_path):
                    db_path = "seo_auditor.db"
                    
                conn = sqlite3.connect(db_path)
                conn.execute("UPDATE Subscription SET auditsRemaining = auditsRemaining - 1 WHERE userId = ? AND auditsRemaining > 0", (user_id,))
                conn.commit()
                conn.close()
            except Exception as e:
                print(f"Failed to deduct audit for user {user_id}: {e}")

        return audit_data

    except Exception as e:
        traceback.print_exc()
        raise
