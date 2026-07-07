"""
extractors/phone_extractor.py
Pulls phone numbers from raw HTML text and tel: links.
"""

import re

from bs4 import BeautifulSoup

import config
from utils.html_parser import make_soup
from utils.normalizer import normalize_phone
from utils.validator import is_valid_phone

_PHONE_RE = re.compile(config.PHONE_REGEX)


def extract_phones(html: str, soup: BeautifulSoup = None) -> list:
    found = set()

    if soup is None:
        soup = make_soup(html)

    # 1. tel: links (highest confidence)
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.lower().startswith("tel:"):
            raw = href.split("tel:", 1)[1]
            norm = normalize_phone(raw)
            if is_valid_phone(norm):
                found.add(norm)

    # 2. plain text matches
    text = soup.get_text(" ")
    for match in _PHONE_RE.finditer(text):
        raw = match.group(0)
        norm = normalize_phone(raw)
        if is_valid_phone(norm):
            found.add(norm)

    return sorted(found)
