"""
extractors/article_extractor.py
Extracts basic article text from raw HTML.
"""

from bs4 import BeautifulSoup
from utils.html_parser import make_soup

def extract_articles(html: str, soup: BeautifulSoup = None) -> list:
    """Returns a list of article texts found in the page."""
    found = set()

    if soup is None:
        soup = make_soup(html)

    # Strategy 1: Look for <article> tags
    for article in soup.find_all("article"):
        text = article.get_text(separator=" ", strip=True)
        if len(text) > 200:  # arbitrary threshold for a valid article
            found.add(text)

    # Strategy 2: If no <article> tags, look for large <p> blocks that might be articles
    if not found:
        paragraphs = soup.find_all("p")
        long_paragraphs = [p.get_text(separator=" ", strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 200]
        if long_paragraphs:
            found.add("\n".join(long_paragraphs))

    return sorted(found)
