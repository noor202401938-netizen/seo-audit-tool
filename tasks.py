import json
import subprocess
import traceback
from utils.ai_recommender import AIRecommendationGenerator

def perform_audit_task(url: str, crawl: bool = False, max_pages: int = 10):
    try:
        cmd = ["seomator", "audit", url, "--format", "json"]
        if crawl:
            cmd.extend(["--crawl", "-m", str(max_pages)])
            
        print(f"Running SEOmator: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        # seomator returns 0 for pass, 1 for fail, 2 for error
        if result.returncode == 2:
            raise Exception(f"SEOmator failed (code {result.returncode}): {result.stderr}")
            
        # Parse JSON
        try:
            audit_data = json.loads(result.stdout)
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse SEOmator JSON output: {e}\nOutput was: {result.stdout[:500]}")
            
        # Extract issues for the AI recommendation
        issues_for_ai = []
        for cat in audit_data.get("categoryResults", []):
            for res in cat.get("results", []):
                if res.get("status") in ["fail", "warn"]:
                    details = res.get("details", {})
                    issues_for_ai.append({
                        "category": cat.get("categoryId", "Unknown"),
                        "severity": "Error" if res.get("status") == "fail" else "Warning",
                        "issue": res.get("ruleId", "Issue"),
                        "fixes": res.get("message", ""),
                        "page_url": details.get("pageUrl", url) if details else url
                    })
        
        overallScore = audit_data.get("overallScore", 0)
        
        try:
            ai_recommendation, ai_tone = AIRecommendationGenerator.generate(
                website=url,
                issues=issues_for_ai,
                onpage_score=overallScore,
                offpage_score=0,
                offpage_data={}
            )
            audit_data["ai_recommendation"] = ai_recommendation
            audit_data["ai_tone"] = ai_tone
        except Exception as e:
            print(f"Failed to generate AI recommendation: {e}")
            audit_data["ai_recommendation"] = "Failed to generate AI recommendations."
            audit_data["ai_tone"] = "Error"
            
        # Add success status for the frontend
        audit_data["status"] = "success"
        
        return audit_data
    except Exception as e:
        traceback.print_exc()
        raise e
