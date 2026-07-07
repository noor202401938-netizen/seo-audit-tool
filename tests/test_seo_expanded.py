import unittest
import os
from bs4 import BeautifulSoup
from extractors.seo_extractor import extract_onpage_seo
from utils.seo_rules import calculate_seo_score
from utils.recommendation_engine import RecommendationEngine
from utils.offpage_auditor import OffPageAuditor
from utils.report_generator import ReportGenerator
from database.sqlite_manager import SQLiteManager

class SEOExpandedTests(unittest.TestCase):
    def setUp(self):
        self.db_file = f"test_temp_{self._testMethodName}.db"
        if os.path.exists(self.db_file):
            try:
                os.remove(self.db_file)
            except Exception:
                pass
        self.db = SQLiteManager(self.db_file)
        self.html = """
        <html>
          <head>
            <title>Optimal Title of Page - Long Enough for Good SEO</title>
            <meta name="description" content="This is an optimal meta description tag. It has precisely the right length of about one hundred and fifty-five characters, making it perfect for search engines.">
            <link rel="canonical" href="https://example.com/page">
          </head>
          <body>
            <h1>This is the main H1 title</h1>
            <h2>Sub-heading level 2</h2>
            <h3>Sub-heading level 3</h3>
            <p>This is a paragraph containing some text content so that we can test the word count metric and readability index algorithms. We need to write at least three hundred words of text to make sure that the thin content warning is not triggered. So we will repeat this text multiple times. Testing SEO tools is fun and very productive.</p>
            <p>This is a paragraph containing some text content so that we can test the word count metric and readability index algorithms. We need to write at least three hundred words of text to make sure that the thin content warning is not triggered. So we will repeat this text multiple times. Testing SEO tools is fun and very productive.</p>
            <p>This is a paragraph containing some text content so that we can test the word count metric and readability index algorithms. We need to write at least three hundred words of text to make sure that the thin content warning is not triggered. So we will repeat this text multiple times. Testing SEO tools is fun and very productive.</p>
            <p>This is a paragraph containing some text content so that we can test the word count metric and readability index algorithms. We need to write at least three hundred words of text to make sure that the thin content warning is not triggered. So we will repeat this text multiple times. Testing SEO tools is fun and very productive.</p>
            <img src="img1.png" alt="Valid alt attribute text">
            <img src="img2.png">
          </body>
        </html>
        """
        self.soup = BeautifulSoup(self.html, "html.parser")
        
    def test_extract_onpage_seo(self):
        data = extract_onpage_seo(self.html, self.soup, "https://example.com/page")
        self.assertEqual(data["title"], "Optimal Title of Page - Long Enough for Good SEO")
        self.assertEqual(data["h1_count"], 1)
        self.assertEqual(data["h2_count"], 1)
        self.assertEqual(data["h3_count"], 1)
        self.assertFalse(data["heading_nesting_error"])
        self.assertTrue(data["word_count"] > 100)
        self.assertEqual(data["images_missing_alt"], 1)
        self.assertEqual(data["total_images"], 2)
        self.assertEqual(data["canonical"], "https://example.com/page")
        
    def test_calculate_seo_score(self):
        data = extract_onpage_seo(self.html, self.soup, "https://example.com/page")
        res = calculate_seo_score(data, ["seo", "tools"])
        self.assertTrue(res["score"] > 0)
        self.assertTrue(any("images missing alt" in issue["issue"].lower() for issue in res["issues"]))

    def test_recommendation_engine(self):
        norm = RecommendationEngine.normalize_issue(
            website="https://example.com",
            page_url="https://example.com/page",
            category="On-Page",
            issue="Missing Alt",
            severity="warning",
            fixes="Add alt text",
            automatable=False
        )
        self.assertEqual(norm["severity"], "Warning")
        self.assertEqual(norm["category"], "On-Page")
        
    def test_offpage_auditor_cache(self):
        res1 = OffPageAuditor.get_metrics("https://example.com", self.db)
        res2 = OffPageAuditor.get_metrics("https://example.com", self.db)
        # Check that caching works and returns identical metrics
        self.assertEqual(res1["domain_authority"], res2["domain_authority"])
        self.assertEqual(res1["total_backlinks"], res2["total_backlinks"])

    def test_pdf_generation(self):
        filename = "output/test_report.pdf"
        if os.path.exists(filename):
            os.remove(filename)
            
        ReportGenerator.generate_pdf(
            filename=filename,
            website="https://example.com",
            onpage_score=85,
            offpage_score=40,
            onpage_issues=[],
            backlink_snapshot={"domain_authority": 35, "page_authority": 40, "total_backlinks": 12000, "referring_domains": 300, "spam_score": 2}
        )
        self.assertTrue(os.path.exists(filename))
        if os.path.exists(filename):
            os.remove(filename)

    def tearDown(self):
        # Allow database file to be closed and clean up
        import time
        time.sleep(0.1)
        if hasattr(self, 'db_file') and os.path.exists(self.db_file):
            try:
                os.remove(self.db_file)
            except Exception:
                pass

if __name__ == "__main__":
    unittest.main()
