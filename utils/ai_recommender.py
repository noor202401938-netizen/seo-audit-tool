import json
import google.generativeai as genai
import config
from utils.logger import get_logger

logger = get_logger("ai_recommender")

class AIRecommendationGenerator:
    @staticmethod
    def generate(website: str, issues: list, onpage_score: int, offpage_score: int, offpage_data: dict) -> str:
        """
        Uses Google Gemini to generate a tailored, detailed, step-by-step SEO strategy
        based on the audit's concrete findings.
        """
        if not config.GEMINI_API_KEY:
            return (
                "### 🤖 AI Strategy Offline\n\n"
                "To activate custom step-by-step AI recommendations, please add your `GEMINI_API_KEY` in the backend `.env` file.\n\n"
                "Once configured, our AI will automatically analyze your site's specific audit telemetry to output a customized optimization roadmap."
            )

        try:
            # Configure API key
            genai.configure(api_key=config.GEMINI_API_KEY)
            
            # Format issues for the prompt to save token space
            formatted_issues = []
            for issue in issues[:30]:  # limit to top 30 issues to stay concise
                formatted_issues.append(
                    f"- [{issue.get('category')}] {issue.get('issue')} (Severity: {issue.get('severity')}) on page {issue.get('page_url')}"
                )
            
            issues_str = "\n".join(formatted_issues)
            
            system_instruction = (
                "You are an elite AI Technical SEO Consultant. Your goal is to analyze the provided SEO audit results for a website "
                "and generate a highly customized, step-by-step executive action plan. "
                "The instructions must be clear, actionable, and tailored specifically to the problems discovered on their site. "
                "Structure your response beautifully in clean Markdown using headings, bold bullet points, and numbered steps."
            )

            model = genai.GenerativeModel('gemini-2.5-flash', system_instruction=system_instruction)
            
            prompt = (
                f"Please review the SEO Audit profile for the website: {website}\n\n"
                f"Scores:\n"
                f"- On-Page SEO score: {onpage_score}/100\n"
                f"- Off-Page SEO score: {offpage_score}/100\n"
                f"Off-Page backlink metrics:\n"
                f"- Domain Authority: {offpage_data.get('domain_authority')}\n"
                f"- Page Authority: {offpage_data.get('page_authority')}\n"
                f"- Backlinks count: {offpage_data.get('total_backlinks')}\n"
                f"- Spam score: {offpage_data.get('spam_score')}%\n\n"
                f"Issues Detected:\n"
                f"{issues_str}\n\n"
                f"Generate a customized, step-by-step optimization roadmap. Group the fixes by priority: Critical (Fix first), "
                f"Important (Fix next), and Recommended. For each issue, provide detailed instructions (where to go in their code/CMS, "
                f"exactly what to edit, and how to verify it works)."
            )
            
            response = model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"AI recommendation generation failed: {e}")
            return f"### ⚠️ AI Recommendation Engine Error\n\nFailed to compile AI strategy: {str(e)}"
