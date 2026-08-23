import json
import random
import concurrent.futures
from google import genai
from google.genai import types
import config
from utils.logger import get_logger

logger = get_logger("ai_recommender")

TONES = [
    "Professional & Direct",
    "Educational & Encouraging",
    "Strict & Urgent Checklist"
]

def _build_fallback_recommendations(website: str, issues: list, onpage_score: int) -> str:
    critical = [i for i in issues if i.get("severity") == "Error"]
    warnings = [i for i in issues if i.get("severity") == "Warning"]

    rec = f"### 🚀 Automated SEO Optimization Roadmap for `{website}`\n\n"
    rec += f"**Overall Audit Score:** `{onpage_score}/100`\n\n"

    if critical:
        rec += "#### 🔴 Priority 1: Critical Fixes (Fix First)\n"
        for idx, item in enumerate(critical[:6], 1):
            rec += f"{idx}. **{item.get('issue')}** ({item.get('category')})\n"
            if item.get('fixes'):
                rec += f"   - *Action:* {item.get('fixes')}\n"
        rec += "\n"

    if warnings:
        rec += "#### 🟡 Priority 2: Recommended Enhancements\n"
        for idx, item in enumerate(warnings[:6], 1):
            rec += f"{idx}. **{item.get('issue')}** ({item.get('category')})\n"
            if item.get('fixes'):
                rec += f"   - *Action:* {item.get('fixes')}\n"
        rec += "\n"

    rec += "#### 💡 Next Steps\n"
    rec += "- Address all critical tags, canonical paths, and broken internal links to ensure maximum crawl budget.\n"
    rec += "- Optimize image compression and CSS delivery to boost Core Web Vitals performance.\n"
    return rec


class AIRecommendationGenerator:
    @staticmethod
    def _get_best_tone():
        try:
            import sqlite3
            import os
            
            db_url = os.getenv("DATABASE_URL", "file:data/seo_auditor.db")
            if db_url.startswith("file:"):
                db_path = db_url.split("file:")[1]
            else:
                db_path = "data/seo_auditor.db"
                
            if not os.path.isabs(db_path) and not os.path.exists(db_path):
                db_path = "seo_auditor.db"
                
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            records = conn.execute("SELECT * FROM AIFeedback").fetchall()
            conn.close()
            
            if not records or random.random() < 0.2:
                return random.choice(TONES)
                
            best_tone = TONES[0]
            best_rate = -1.0
            for r in records:
                if r['trials'] > 0:
                    rate = r['wins'] / r['trials']
                    if rate > best_rate:
                        best_rate = rate
                        best_tone = r['tone']
                        
            return best_tone if best_tone in TONES else random.choice(TONES)
        except Exception as e:
            return random.choice(TONES)

    @staticmethod
    def generate(website: str, issues: list, onpage_score: int, offpage_score: int, offpage_data: dict) -> tuple[str, str]:
        """
        Generates high-impact actionable SEO recommendations instantly based on audit findings.
        If Gemini is configured, it can enhance asynchronously in background.
        """
        # Always build instant structured roadmap in 0ms
        instant_roadmap = _build_fallback_recommendations(website, issues, onpage_score)
        
        if not config.GEMINI_API_KEY:
            return instant_roadmap, "Rule-Based"

        def _call_gemini_fast():
            try:
                chosen_tone = AIRecommendationGenerator._get_best_tone()
                client = genai.Client(api_key=config.GEMINI_API_KEY)
                
                formatted_issues = []
                for issue in issues[:10]:
                    formatted_issues.append(
                        f"- [{issue.get('category')}] {issue.get('issue')} (Severity: {issue.get('severity')})"
                    )
                
                prompt = (
                    f"Website: {website}\n"
                    f"Score: {onpage_score}/100\n"
                    f"Issues:\n" + "\n".join(formatted_issues) + "\n\n"
                    f"Give concise, high-priority fixes in markdown with bold action items."
                )

                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        max_output_tokens=600,
                    )
                )
                if response and response.text:
                    return response.text.strip(), chosen_tone
            except Exception:
                pass
            return instant_roadmap, "Standard"

        # Try fast 2.0s Gemini call; if delayed, return instant roadmap immediately
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(_call_gemini_fast)
                return future.result(timeout=2.0)
        except Exception:
            return instant_roadmap, "Standard"
