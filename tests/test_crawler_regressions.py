import unittest
from unittest.mock import patch

import requests

from crawler.directory_crawler import _find_pagination_links
from extractors.metadata_extractor import extract_metadata
from utils.html_parser import make_soup
from utils.http_client import fetch


class CrawlerRegressionTests(unittest.TestCase):
    def test_extract_metadata_handles_nested_json_ld_values(self):
        html = """
        <html>
          <head>
            <script type="application/ld+json">
            {
              "@type": "Organization",
              "name": "Example Church",
              "address": {
                "streetAddress": "123 Main St",
                "addressLocality": "Springfield",
                "addressRegion": "IL",
                "postalCode": "62701",
                "addressCountry": {"name": "United States"}
              },
              "telephone": "+1 555 123 4567",
              "url": "https://example.org"
            }
            </script>
          </head>
          <body><h1>Example Church</h1></body>
        </html>
        """

        result = extract_metadata(html, soup=make_soup(html))

        self.assertEqual(result["name"], "Example Church")
        self.assertEqual(
            result["address"],
            "123 Main St, Springfield, IL, 62701, United States",
        )
        self.assertEqual(result["website"], "https://example.org")

    def test_find_pagination_links_ignores_non_http_and_external_links(self):
        html = """
        <html><body>
          <a href="/page/2">Next</a>
          <a href="mailto:test@example.org">Next</a>
          <a href="javascript:void(0)">Next</a>
          <a href="https://facebook.com/sharer.php?u=https://example.org">Next</a>
        </body></html>
        """
        soup = make_soup(html)

        links = _find_pagination_links(soup, "https://example.org/page/1")

        self.assertEqual(links, ["https://example.org/page/2"])

    @patch("utils.http_client.is_allowed_by_robots", return_value=True)
    @patch("utils.http_client.requests.request")
    def test_fetch_does_not_retry_on_terminal_http_errors(self, mock_request, _mock_robots):
        response = requests.Response()
        response.status_code = 403
        response.url = "https://example.org/"
        mock_request.return_value = response

        result = fetch("https://example.org/")

        self.assertIs(result, response)
        self.assertEqual(mock_request.call_count, 1)

    @patch("utils.http_client.is_allowed_by_robots", return_value=True)
    @patch("utils.http_client.requests.request", side_effect=requests.exceptions.InvalidURL("Invalid URL"))
    def test_fetch_does_not_retry_on_invalid_url(self, mock_request, _mock_robots):
        result = fetch("https:///")

        self.assertIsNone(result)
        self.assertEqual(mock_request.call_count, 1)


if __name__ == "__main__":
    unittest.main()