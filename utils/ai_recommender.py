import json
import random
import asyncio
import google.generativeai as genai
import config
from utils.logger import get_logger
from prisma import Prisma

logger = get_logger("ai_recommender")

TONES = [
    "Professional & Direct",
    "Educational & Encouraging",
    "Strict & Urgent Checklist"
]

class AIRecommendationGenerator:
    @staticmethod
    async def _get_best_tone():
        try:
            prisma = Prisma()
            await prisma.connect()
            records = await prisma.aifeedback.find_many()
            await prisma.disconnect()
            
            # Epsilon-Greedy: 20% exploration or no data
            if not records or random.random() < 0.2:
                return random.choice(TONES)
                
            # Exploit: Choose tone with highest win rate
            best_tone = TONES[0]
            best_rate = -1.0
            for r in records:
                if r.trials > 0:
                    rate = r.wins / r.trials
                    if rate > best_rate:
                        best_rate = rate
                        best_tone = r.tone
                        
            # In case the best tone from DB is no longer in our TONES list, fallback
            return best_tone if best_tone in TONES else random.choice(TONES)
        except Exception as e:
            logger.error(f"Error fetching RL bandit scores: {e}")
            return random.choice(TONES)

    @staticmethod
    def generate(website: str, issues: list, onpage_score: int, offpage_score: int, offpage_data: dict) -> tuple[str, str]:
        """
        Uses Google Gemini to generate a tailored, detailed, step-by-step SEO strategy
        based on the audit's concrete findings, styled using a Contextual Bandit chosen Tone.
        """
        if not config.GEMINI_API_KEY:
            return (
                "### 🤖 AI Strategy Offline\n\n"
                "To activate custom step-by-step AI recommendations, please add your `GEMINI_API_KEY` in the backend `.env` file.\n\n"
                "Once configured, our AI will automatically analyze your site's specific audit telemetry to output a customized optimization roadmap.",
                "Offline"
            )

        try:
            chosen_tone = asyncio.run(AIRecommendationGenerator._get_best_tone())
            
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
                "Structure your response beautifully in clean Markdown using headings, bold bullet points, and numbered steps. "
                f"Crucially, you MUST adopt the following tone and style for your response: {chosen_tone}."
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
            return response.text.strip(), chosen_tone
            
        except Exception as e:
            logger.error(f"AI recommendation generation failed: {e}")
            return f"### ⚠️ AI Recommendation Engine Error\n\nFailed to compile AI strategy: {str(e)}", "Error"
