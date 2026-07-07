"""
extractors/metadata_extractor.py
Generic, layout-agnostic extraction of name/organization/address/category
from a "detail" page. Uses heuristics (headings, schema.org microdata /
JSON-LD, common class names) rather than any site-specific selector.
"""

import json
import re

from bs4 import BeautifulSoup

from utils.html_parser import make_soup


def _flatten_text(value) -> list:
    parts = []

    def walk(item):
        if item is None:
            return
        if isinstance(item, str):
            text = item.strip()
            if text:
                parts.append(text)
            return
        if isinstance(item, (int, float, bool)):
            parts.append(str(item))
            return
        if isinstance(item, dict):
            preferred_keys = (
                "name",
                "streetAddress",
                "addressLocality",
                "addressRegion",
                "postalCode",
                "addressCountry",
                "telephone",
                "url",
            )
            handled = False
            for key in preferred_keys:
                if key in item:
                    handled = True
                    walk(item.get(key))
            if not handled:
                for nested in item.values():
                    walk(nested)
            return
        if isinstance(item, (list, tuple, set)):
            for nested in item:
                walk(nested)
            return

        text = str(item).strip()
        if text:
            parts.append(text)

    walk(value)
    return parts


def _first_text(value) -> str:
    parts = _flatten_text(value)
    return parts[0] if parts else ""


def _from_json_ld(soup: BeautifulSoup) -> dict:
    """Look for schema.org JSON-LD blocks (Organization, LocalBusiness, Person, etc.)"""
    data = {}
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            payload = json.loads(script.string or "{}")
        except (ValueError, TypeError):
            continue

        candidates = payload if isinstance(payload, list) else [payload]
        for item in candidates:
            if not isinstance(item, dict):
                continue
            item_type = str(item.get("@type", "")).lower()
            if item_type in ("organization", "localbusiness", "person", "church"):
                data.setdefault("name", _first_text(item.get("name")))
                address = item.get("address")
                if isinstance(address, dict):
                    parts = []
                    for key in (
                        "streetAddress",
                        "addressLocality",
                        "addressRegion",
                        "postalCode",
                        "addressCountry",
                    ):
                        parts.extend(_flatten_text(address.get(key)))
                    data.setdefault("address", ", ".join(parts))
                elif isinstance(address, str):
                    data.setdefault("address", address)
                data.setdefault("phone", _first_text(item.get("telephone")))
                data.setdefault("website", _first_text(item.get("url")))
    return {k: v for k, v in data.items() if v}


def _guess_name(soup: BeautifulSoup) -> str:
    for tag in ("h1", "h2"):
        el = soup.find(tag)
        if el and el.get_text(strip=True):
            return el.get_text(strip=True)
    if soup.title and soup.title.get_text(strip=True):
        return soup.title.get_text(strip=True)
    return ""


def _guess_address(soup: BeautifulSoup) -> str:
    # common patterns: <address> tag, or elements with class containing "address"
    addr_tag = soup.find("address")
    if addr_tag and addr_tag.get_text(strip=True):
        return addr_tag.get_text(" ", strip=True)

    candidate = soup.find(class_=re.compile(r"address", re.I))
    if candidate and candidate.get_text(strip=True):
        return candidate.get_text(" ", strip=True)

    return ""


def _guess_category(soup: BeautifulSoup) -> str:
    candidate = soup.find(class_=re.compile(r"categor(y|ies)|denomination|type", re.I))
    if candidate and candidate.get_text(strip=True):
        return candidate.get_text(" ", strip=True)
    return ""


def extract_metadata(html: str, soup: BeautifulSoup = None) -> dict:
    if soup is None:
        soup = make_soup(html)

    result = {
        "name": "",
        "organization": "",
        "category": "",
        "address": "",
        "website": "",
    }

    result.update(_from_json_ld(soup))

    if not result.get("name"):
        result["name"] = _guess_name(soup)
    if not result.get("address"):
        result["address"] = _guess_address(soup)
    if not result.get("category"):
        result["category"] = _guess_category(soup)

    # find first external link that looks like "the official website"
    if not result.get("website"):
        for a in soup.find_all("a", href=True):
            text = a.get_text(strip=True).lower()
            if "website" in text or "official site" in text or "visit site" in text:
                result["website"] = _first_text(a.get("href"))
                break

    return {k: v for k, v in result.items() if v}
