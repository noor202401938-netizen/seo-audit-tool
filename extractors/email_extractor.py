"""
extractors/email_extractor.py
Pulls emails from raw HTML text and from mailto: links.
"""

import re

from bs4 import BeautifulSoup

import config
from utils.html_parser import make_soup
from utils.normalizer import normalize_email
from utils.validator import is_valid_email

_EMAIL_RE = re.compile(config.EMAIL_REGEX)


def extract_emails(html: str, soup: BeautifulSoup = None) -> list:
    """Returns a deduped, validated list of emails found in the page."""
    found = set()

    if soup is None:
        soup = make_soup(html)

    # 1. mailto: links (highest confidence)
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.lower().startswith("mailto:"):
            addr = href.split("mailto:", 1)[1].split("?")[0]
            addr = normalize_email(addr)
            if is_valid_email(addr):
                found.add(addr)

    # 2. plain text matches (catches obfuscated-but-plain "name@domain.com" in body text)
    text = soup.get_text(" ")
    for match in _EMAIL_RE.findall(text):
        addr = normalize_email(match)
        if is_valid_email(addr):
            found.add(addr)

    return sorted(found)
