import unittest
import tool_runners

class TestToolRunners(unittest.TestCase):

    def test_email_verification_format(self):
        result = tool_runners.run_email_verification_tool("user@gmail.com")
        self.assertIn("is_valid", result)
        self.assertIn("email", result)

    def test_email_verification_invalid(self):
        result = tool_runners.run_email_verification_tool("not-an-email")
        self.assertFalse(result["is_valid"])
        self.assertIn("invalid", result["message"].lower())

    def test_llms_txt_generator(self):
        result = tool_runners.run_llms_txt_generator("https://example.com")
        self.assertIn("generated_llms_txt", result)
        self.assertIn("message", result)

    def test_schema_markup_validator(self):
        result = tool_runners.run_schema_markup_validator("https://example.com")
        self.assertIn("schema_count", result)
        self.assertIn("valid_schemas", result)
        self.assertIn("extracted_schemas", result)

    def test_domain_authority_simulated(self):
        result = tool_runners.run_domain_authority_checker("example.com")
        self.assertIn("open_pagerank", result)
        self.assertIn("rank", result)

if __name__ == "__main__":
    unittest.main()
