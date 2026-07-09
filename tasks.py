import subprocess
import json

def perform_audit_task(url: str, crawl: bool = False, max_pages: int = 10):
    try:
        # Build seomator command
        cmd = ["seomator", "audit", url, "--format", "json", "--no-cwv"]
        
        if crawl:
            cmd.extend(["--crawl", "-m", str(max_pages)])
            
        print(f"Running seomator command: {' '.join(cmd)}")
            
        # Execute seomator CLI
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        # If exit code indicates failure, raise exception with stderr
        if result.returncode != 0:
            raise Exception(f"Seomator error: {result.stderr.strip() or result.stdout.strip()}")
            
        # Parse output JSON
        audit_data = json.loads(result.stdout)
        
        # Collect non-pass rules as issues for AI recommender
        issues = []
        for cat in audit_data.get("categoryResults", []):
            cat_id = cat.get("categoryId", "Unknown")
            for rule in cat.get("results", []):
                if rule.get("status") != "pass":
                    issues.append({
                        "category": cat_id,
                        "severity": rule.get("status", "warn"),
                        "issue": rule.get("ruleId", "unknown-rule"),
                        "fixes": rule.get("message", ""),
                        "page_url": rule.get("details", {}).get("pageUrl", url)
                    })
                    
        from utils.ai_recommender import AIRecommendationGenerator
        audit_data["ai_recommendation"] = AIRecommendationGenerator.generate(
            website=url,
            issues=issues,
            onpage_score=audit_data.get("overallScore", 0),
            offpage_score=0,
            offpage_data={}
        )
        
        # Add success status expected by our frontend
        audit_data["status"] = "success"
        
        return audit_data
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e
