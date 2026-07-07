"""
utils/recommendation_engine.py
Normalizes issues and recommendations for unified display in UI and PDF report.
"""

class RecommendationEngine:
    @staticmethod
    def normalize_issue(
        website: str,
        page_url: str,
        category: str,
        issue: str,
        severity: str,
        fixes: str = "",
        automatable: bool = False
    ) -> dict:
        """
        Normalizes any SEO issue or suggestion into a structured dict.
        """
        # Ensure severity is standardized
        severity_map = {
            "error": "Error",
            "warning": "Warning",
            "notice": "Notice",
            "critical": "Error",
            "high": "Error",
            "medium": "Warning",
            "low": "Notice"
        }
        std_severity = severity_map.get(severity.lower(), severity.capitalize())
        
        return {
            "website": website,
            "page_url": page_url,
            "category": category, # e.g. "On-Page", "Off-Page"
            "issue": issue,
            "severity": std_severity,
            "fixes": fixes,
            "automatable": bool(automatable)
        }
