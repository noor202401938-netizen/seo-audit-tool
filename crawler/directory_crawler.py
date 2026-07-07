"""
crawler/directory_crawler.py

Phase 1 - Seed URL processing: crawl a directory/listing site, find
          pagination, and discover profile/detail page URLs.
Phase 2 - Detail page extraction: visit each profile page and pull
          generic metadata (name, address, category, etc).
Phase 3 - Website discovery: whenever a profile page links to an
          official external site, normalize + store it as a website to crawl.

No site-specific selectors — everything is heuristic:
  - "listing" pages are identified by having many same-pattern outbound links
  - "profile" links are identified by link density / repeated container patterns
  - pagination is identified via rel=next, common query params, or link text
"""

import re
from urllib.parse import urljoin, urlsplit

from bs4 import BeautifulSoup

import config
from utils.http_client import fetch_smart as fetch
from utils.html_parser import make_soup
from utils.logger import get_logger
from utils.normalizer import normalize_url, get_domain
from utils.deduplicator import SeenSet
from extractors.metadata_extractor import extract_metadata

logger = get_logger("directory_crawler")

PAGINATION_HINTS = re.compile(r"next|page=|/page/|older|more results", re.I)


def _is_http_url(url: str) -> bool:
    if not url:
        return False
    scheme = urlsplit(url).scheme.lower()
    return scheme in ("http", "https")


def _looks_like_pagination_link(a_tag) -> bool:
    rel = a_tag.get("rel") or []
    if "next" in [r.lower() for r in rel]:
        return True
    text = a_tag.get_text(strip=True).lower()
    href = a_tag.get("href", "")
    return bool(PAGINATION_HINTS.search(text) or PAGINATION_HINTS.search(href))


def _find_pagination_links(soup: BeautifulSoup, base_url: str) -> list:
    links = []
    base_domain = get_domain(base_url)
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        if _looks_like_pagination_link(a):
            full = normalize_url(href, base=base_url)
            if _is_http_url(full) and get_domain(full) == base_domain:
                links.append(full)
    # de-dup, preserve order
    seen = set()
    result = []
    for l in links:
        if l not in seen:
            seen.add(l)
            result.append(l)
    return result


def _guess_profile_links(soup: BeautifulSoup, base_url: str, seed_domain: str) -> list:
    """
    Heuristic: profile/detail links are internal links that repeat with a
    similar URL pattern (e.g. /church/123, /listing/some-slug) more than once
    on the page. We bucket links by their first path segment and keep buckets
    that appear multiple times -- that's the "listing repeats N profile cards" signal.
    """
    buckets = {}
    all_internal_links = []

    for a in soup.find_all("a", href=True):
        href = normalize_url(a["href"], base=base_url)
        if not href:
            continue
        if get_domain(href) != seed_domain:
            continue  # external -> handled separately as "official website" candidate
        path = urlsplit(href).path
        segments = [s for s in path.split("/") if s]
        if not segments:
            continue
        bucket_key = segments[0]
        buckets.setdefault(bucket_key, set()).add(href)
        all_internal_links.append(href)

    profile_links = set()
    for key, links in buckets.items():
        if len(links) >= 3:  # repeated pattern -> likely listing of profiles
            profile_links.update(links)

    return sorted(profile_links)


def _find_external_website(soup: BeautifulSoup, base_url: str, seed_domain: str) -> str:
    """Find the most likely 'official external website' link on a profile page."""
    candidates = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith(("mailto:", "tel:", "#", "javascript:")):
            continue
        full = normalize_url(href, base=base_url)
        if not full:
            continue
        if not _is_http_url(full):
            continue
        domain = get_domain(full)
        if not domain or domain == seed_domain:
            continue
        # skip social platforms, maps, and share links -- those are handled by social_extractor or irrelevant
        if any(s in domain for s in
               ("facebook.", "twitter.", "x.com", "instagram.", "linkedin.",
                "youtube.", "tiktok.", "pinterest.", "threads.", "vimeo.",
                "whatsapp.", "google.", "apple.", "yelp.", "bing.", "yahoo.")):
            continue

        text = a.get_text(strip=True).lower()
        score = 0
        if "website" in text or "official site" in text or "visit site" in text or "home page" in text:
            score += 5
        
        # slight boost if it doesn't look like a generic 'share' or 'map' link
        if "share" in text or "map" in text or "direction" in text:
            score -= 5

        candidates.append((score, full))

    if not candidates:
        return ""
    candidates.sort(key=lambda c: c[0], reverse=True)
    
    # If the best candidate has a negative score, it's probably junk
    if candidates[0][0] < 0:
        return ""
        
    return candidates[0][1]


def crawl_listing_site(seed_url: str, db, max_pagination: int = None) -> list:
    """
    Phase 1: crawl a single seed/listing site, following pagination up to
    the configured limit, collecting profile/detail page URLs along the way.
    Returns list of profile URLs discovered.
    """
    max_pagination = max_pagination or config.MAX_PAGINATION_PAGES
    seed_domain = get_domain(seed_url)

    to_visit = [seed_url]
    visited_listing_pages = SeenSet()
    all_profile_links = set()

    pages_crawled = 0
    while to_visit and pages_crawled < max_pagination:
        url = to_visit.pop(0)
        if not visited_listing_pages.add_if_new(url):
            continue

        resp = fetch(url)
        pages_crawled += 1

        if resp is None or resp.status_code != 200:
            status = "failed" if resp is None else f"http_{resp.status_code}"
            logger.warning(f"Listing page fetch failed ({status}): {url}")
            continue

        soup = make_soup(resp.text)

        profile_links = _guess_profile_links(soup, url, seed_domain)
        for link in profile_links:
            if link not in all_profile_links:
                all_profile_links.add(link)
                db.save_discovered_url(link, source_url=seed_url, crawl_status="discovered")

        pagination_links = _find_pagination_links(soup, url)
        for p in pagination_links:
            if p not in visited_listing_pages:
                to_visit.append(p)

    logger.info(
        f"[{seed_url}] crawled {pages_crawled} listing pages, "
        f"found {len(all_profile_links)} profile links"
    )
    return sorted(all_profile_links)


def process_profile_page(profile_url: str, source_url: str, db) -> dict:
    """
    Phase 2 + 3: fetch a profile/detail page, extract generic metadata,
    and find + store the official external website if present.
    Returns a dict with the extracted info (also persisted to db).
    """
    seed_domain = get_domain(source_url)
    resp = fetch(profile_url)

    if resp is None or resp.status_code != 200:
        status = "failed" if resp is None else f"http_{resp.status_code}"
        db.save_discovered_url(profile_url, source_url, crawl_status=status)
        return {}

    soup = make_soup(resp.text)
    try:
        metadata = extract_metadata(resp.text, soup)
    except Exception as e:
        logger.warning(f"Metadata extraction failed ({profile_url}): {e}")
        metadata = {}
    website = _find_external_website(soup, profile_url, seed_domain)

    if website:
        canonical = normalize_url(website)
        db.save_website(canonical, source_profile_url=profile_url)
        metadata["website"] = canonical

    db.save_discovered_url(profile_url, source_url, crawl_status="processed")
    metadata["profile_url"] = profile_url
    metadata["source_url"] = source_url
    return metadata
