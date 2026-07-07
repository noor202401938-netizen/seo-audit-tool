"""
crawler/website_crawler.py

Phase 4 - Website crawl: visit a discovered official website, prioritizing
          common contact/about paths, then discover further internal pages
          up to config.MAX_CRAWL_DEPTH / config.MAX_PAGES_PER_DOMAIN.
Phase 5 - Public contact extraction: pull emails, phones, contact page URL,
          contact form URL, and social links from every page visited.
"""

import json
from urllib.parse import urljoin, urlsplit
from concurrent.futures import ThreadPoolExecutor, as_completed

from bs4 import BeautifulSoup

import config
from utils.http_client import fetch_smart
from utils.html_parser import make_soup
from utils.logger import get_logger
from utils.normalizer import normalize_url, get_domain
from utils.deduplicator import SeenSet
from extractors.email_extractor import extract_emails
from extractors.phone_extractor import extract_phones
from extractors.social_extractor import extract_social_links
from extractors.metadata_extractor import extract_metadata
from extractors.image_extractor import extract_images
from extractors.article_extractor import extract_articles
from extractors.product_extractor import extract_products
from extractors.custom_extractor import extract_custom_data
from extractors.seo_extractor import extract_onpage_seo
from utils.seo_rules import calculate_seo_score
from crawler.bandit import URLBandit

logger = get_logger("website_crawler")

CONTACT_PATH_HINTS = ("contact", "connect", "support")
FORM_TAG_HINTS = ("form",)


def _is_contact_like_page(url: str) -> bool:
    path = urlsplit(url).path.lower()
    return any(hint in path for hint in CONTACT_PATH_HINTS)


def _find_contact_form_url(soup: BeautifulSoup, page_url: str) -> str:
    form = soup.find("form")
    if form:
        return page_url  # the page itself hosts a contact form
    return ""


def _discover_internal_links(soup: BeautifulSoup, base_url: str, domain: str) -> list:
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith(("mailto:", "tel:", "#", "javascript:")):
            continue
        full = normalize_url(href, base=base_url)
        if full and get_domain(full) == domain:
            links.append(full)
    return links


def crawl_website(website_url: str, db, target_keywords: list = None) -> dict:
    """
    Crawl one discovered official website, prioritizing contact/about/team
    pages, then breadth-first exploring internal links up to configured
    depth/page limits. Aggregates emails/phones/social links/contact page
    across all pages visited on this domain, then persists one contact
    record for the whole site.
    """
    domain = get_domain(website_url)
    if not domain:
        return {}

    visited = SeenSet()
    queue = [(website_url, 0)]

    # load the bandit
    bandit = URLBandit()

    scheme = urlsplit(website_url).scheme or "https"

    # Force parse sitemap first
    sitemap_url = normalize_url(urljoin(f"{scheme}://{domain}/", "sitemap.xml"))
    try:
        sitemap_resp = fetch_smart(sitemap_url)
        if sitemap_resp and sitemap_resp.status_code == 200 and "xml" in (sitemap_resp.headers.get("Content-Type", "") + sitemap_url):
            sitemap_soup = make_soup(sitemap_resp.text)
            locs = [loc.get_text(strip=True) for loc in sitemap_soup.find_all("loc")]
            for loc in locs[:100]:
                norm = normalize_url(loc)
                if get_domain(norm) == domain:
                    if norm not in visited:
                        queue.append((norm, 1))
    except Exception:
        pass

    # seed the queue with priority paths up front
    for path in config.PRIORITY_PATHS:
        priority_url = normalize_url(urljoin(f"{scheme}://{domain}/", path.lstrip("/")))
        queue.append((priority_url, 0))

    all_emails = set()
    all_phones = set()
    social_links = {}
    all_images = set()
    all_articles = set()
    all_products = []
    all_custom_data = []
    all_seo_reports = {}
    contact_page_url = ""
    contact_form_url = ""
    metadata = {}
    pages_crawled = 0

    while queue and pages_crawled < config.MAX_PAGES_PER_DOMAIN:
        # Prioritize queue using URLBandit
        queue.sort(key=lambda item: bandit.score_url(item[0]), reverse=True)
        
        batch_size = min(config.INTERNAL_CONCURRENCY, len(queue), config.MAX_PAGES_PER_DOMAIN - pages_crawled)
        batch = []
        for _ in range(batch_size):
            url, depth = queue.pop(0)
            if depth > config.MAX_CRAWL_DEPTH:
                continue
            if not visited.add_if_new(url):
                continue
            batch.append((url, depth))
            
        if not batch:
            continue
            
        with ThreadPoolExecutor(max_workers=config.INTERNAL_CONCURRENCY) as pool:
            future_to_url = {pool.submit(fetch_smart, u): (u, d) for u, d in batch}
            
            for future in as_completed(future_to_url):
                url, depth = future_to_url[future]
                pages_crawled += 1
                
                try:
                    resp = future.result()
                except Exception:
                    continue
                    
                if resp is None or resp.status_code != 200:
                    continue

                content_type = ""
                if hasattr(resp, "headers") and callable(getattr(resp.headers, "get", None)):
                    content_type = resp.headers.get("Content-Type", "")
                    
                if "text/html" not in content_type and not url.endswith(".xml"):
                    continue

                soup = make_soup(resp.text)

                seo_data = extract_onpage_seo(resp.text, soup, url)
                seo_report = calculate_seo_score(seo_data, target_keywords)
                all_seo_reports[url] = {
                    "data": seo_data,
                    "report": seo_report
                }


                reward = 0
                
                if config.EXTRACT_EMAILS:
                    emails = extract_emails(resp.text, soup)
                    all_emails.update(emails)
                    if emails: reward += 10

                if config.EXTRACT_PHONES:
                    phones = extract_phones(resp.text, soup)
                    all_phones.update(phones)
                    if phones: reward += 10

                if config.EXTRACT_EMAILS or config.EXTRACT_PHONES:
                    socials = extract_social_links(resp.text, soup)
                    for k, v in socials.items():
                        social_links.setdefault(k, v)
                
                if config.EXTRACT_IMAGES:
                    images = extract_images(resp.text, soup, url)
                    all_images.update(images)
                    if images: reward += 5

                if config.EXTRACT_ARTICLES:
                    articles = extract_articles(resp.text, soup)
                    all_articles.update(articles)
                    if articles: reward += 5

                if getattr(config, "EXTRACT_PRODUCTS", False):
                    products = extract_products(resp.text, soup, url)
                    if products:
                        all_products.extend(products)
                        reward += 20  # Massive reward for finding products!

                if getattr(config, "CUSTOM_PROMPT", ""):
                    custom_data = extract_custom_data(resp.text, config.CUSTOM_PROMPT, soup)
                    if custom_data:
                        all_custom_data.extend(custom_data)
                        reward += 15  # Good reward for finding custom data
                
                if reward == 0:
                    reward = -1
                
                bandit.update_reward(url, reward)

                if not metadata:
                    page_meta = extract_metadata(resp.text, soup)
                    if page_meta:
                        metadata.update(page_meta)

                if _is_contact_like_page(url) and not contact_page_url:
                    contact_page_url = url

                if (emails or _is_contact_like_page(url)) and not contact_form_url:
                    form_url = _find_contact_form_url(soup, url)
                    if form_url:
                        contact_form_url = form_url

                # sitemap.xml -> pull <loc> entries as extra links to explore
                if url.endswith("sitemap.xml"):
                    locs = [loc.get_text(strip=True) for loc in soup.find_all("loc")]
                    for loc in locs[:50]:  # cap sitemap fan-out
                        norm = normalize_url(loc)
                        if get_domain(norm) == domain:
                            if norm not in visited:
                                queue.append((norm, depth + 1))
                    continue

                if depth < config.MAX_CRAWL_DEPTH:
                    for link in _discover_internal_links(soup, url, domain):
                        if link not in visited:
                            queue.append((link, depth + 1))

    record = {
        "website": website_url,
        "detail_page_url": website_url,
        "name": metadata.get("name", ""),
        "organization": metadata.get("organization", ""),
        "category": metadata.get("category", ""),
        "address": metadata.get("address", ""),
        "emails": ", ".join(sorted(all_emails)),
        "phones": ", ".join(sorted(all_phones)),
        "social_links": json.dumps(social_links, ensure_ascii=False),
        "images": json.dumps(list(all_images), ensure_ascii=False),
        "articles": json.dumps(list(all_articles), ensure_ascii=False),
        "products": json.dumps(all_products, ensure_ascii=False),
        "custom_data": json.dumps(all_custom_data, ensure_ascii=False),
        "seo_reports": json.dumps(all_seo_reports, ensure_ascii=False),
        "contact_page_url": contact_page_url,
        "crawl_status": "complete" if pages_crawled > 0 else "failed",
    }

    logger.info(
        f"[{website_url}] crawled {pages_crawled} pages -> "
        f"{len(all_emails)} emails, {len(all_phones)} phones"
    )
    return record
