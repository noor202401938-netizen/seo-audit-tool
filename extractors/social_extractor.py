"""
extractors/social_extractor.py
Finds social media profile links on a page.
"""

from bs4 import BeautifulSoup

from utils.html_parser import make_soup

SOCIAL_DOMAINS = [
    "facebook.com", "twitter.com", "x.com", "instagram.com",
    "linkedin.com", "youtube.com", "tiktok.com", "pinterest.com",
    "threads.net",
]


def extract_social_links(html: str, soup: BeautifulSoup = None) -> dict:
    """Returns {platform: url} for the first match of each platform found."""
    if soup is None:
        soup = make_soup(html)

    results = {}
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        lower = href.lower()
        for domain in SOCIAL_DOMAINS:
            if domain in lower:
                platform = domain.split(".")[0]
                if platform not in results:
                    results[platform] = href
    return results
