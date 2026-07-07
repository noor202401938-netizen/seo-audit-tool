"""
utils/http_client.py
A shared, polite HTTP fetcher:
- per-domain rate limiting
- retries with backoff
- robots.txt compliance (optional but on by default)
"""

import threading
import time
import urllib.robotparser as robotparser
from urllib.parse import urlsplit

import requests
from requests.exceptions import InvalidSchema, InvalidURL, MissingSchema, SSLError, TooManyRedirects

try:
    from playwright.sync_api import sync_playwright
    from playwright_stealth import stealth_sync
    HAS_PLAYWRIGHT = True
except ImportError:
    HAS_PLAYWRIGHT = False

import config
from utils.logger import get_logger
from utils.normalizer import get_domain

logger = get_logger("http_client")

_domain_last_request = {}
_domain_locks = {}
_lock_guard = threading.Lock()

_robots_cache = {}
_robots_lock = threading.Lock()


def _get_domain_lock(domain: str) -> threading.Lock:
    with _lock_guard:
        if domain not in _domain_locks:
            _domain_locks[domain] = threading.Lock()
        return _domain_locks[domain]


def _wait_for_domain_slot(domain: str):
    lock = _get_domain_lock(domain)
    with lock:
        last = _domain_last_request.get(domain, 0)
        elapsed = time.time() - last
        if elapsed < config.MIN_DELAY_PER_DOMAIN:
            time.sleep(config.MIN_DELAY_PER_DOMAIN - elapsed)
        _domain_last_request[domain] = time.time()


def _get_robots_parser(base_url: str):
    domain = get_domain(base_url)
    with _robots_lock:
        if domain in _robots_cache:
            return _robots_cache[domain]

        rp = robotparser.RobotFileParser()
        scheme = urlsplit(base_url).scheme or "https"
        robots_url = f"{scheme}://{domain}/robots.txt"
        try:
            resp = requests.get(robots_url, timeout=config.REQUEST_TIMEOUT,
                                 headers={"User-Agent": config.USER_AGENT})
            if resp.status_code == 200:
                rp.parse(resp.text.splitlines())
            else:
                rp = None  # no robots.txt / inaccessible -> treat as "allow"
        except requests.RequestException:
            rp = None

        _robots_cache[domain] = rp
        return rp


def is_allowed_by_robots(url: str) -> bool:
    if not config.RESPECT_ROBOTS_TXT:
        return True
    try:
        rp = _get_robots_parser(url)
        if rp is None:
            return True
        return rp.can_fetch(config.USER_AGENT, url)
    except Exception:
        return True  # fail open on robots.txt parsing errors


def fetch(url: str, method: str = "GET", allow_redirects: bool = True):
    """
    Fetch a URL politely with retries. Returns a requests.Response or None.
    """
    domain = get_domain(url)

    if not is_allowed_by_robots(url):
        logger.info(f"Skipping (robots.txt disallow): {url}")
        return None

    headers = {"User-Agent": config.USER_AGENT}

    def _is_terminal_exception(exc: Exception) -> bool:
        if isinstance(exc, (InvalidURL, MissingSchema, InvalidSchema, TooManyRedirects, SSLError)):
            return True
        message = str(exc).lower()
        terminal_markers = (
            "invalid url",
            "no host supplied",
            "name or service not known",
            "getaddrinfo failed",
            "nameresolutionerror",
            "certificate verify failed",
            "hostname mismatch",
            "exceeded 30 redirects",
        )
        return any(marker in message for marker in terminal_markers)

    def _push_domain_cooldown(wait_seconds: float):
        lock = _get_domain_lock(domain)
        with lock:
            _domain_last_request[domain] = time.time() + wait_seconds

    for attempt in range(1, config.RETRY_ATTEMPTS + 1):
        _wait_for_domain_slot(domain)
        try:
            resp = requests.request(
                method, url, headers=headers,
                timeout=config.REQUEST_TIMEOUT,
                allow_redirects=allow_redirects,
            )
            if resp.status_code == 429:
                # rate limited -- back off harder
                wait = config.RETRY_BACKOFF_SECONDS * attempt * 2
                logger.warning(f"429 from {domain}, backing off {wait:.1f}s")
                _push_domain_cooldown(wait)
                time.sleep(wait)
                continue
            if resp.status_code in (403, 404, 410):
                return resp
            return resp
        except requests.RequestException as e:
            logger.warning(f"Attempt {attempt}/{config.RETRY_ATTEMPTS} failed for {url}: {e}")
            if _is_terminal_exception(e):
                break
            if attempt < config.RETRY_ATTEMPTS:
                time.sleep(config.RETRY_BACKOFF_SECONDS * attempt)

    logger.error(f"Giving up on {url} after {config.RETRY_ATTEMPTS} attempts")
    return None

_playwright_local = threading.local()

class MockResponse:
    def __init__(self, text, status_code, headers):
        self.text = text
        self.status_code = status_code
        self.headers = headers

def _get_playwright_page():
    if not hasattr(_playwright_local, "playwright"):
        _playwright_local.playwright = sync_playwright().start()
        _playwright_local.browser = _playwright_local.playwright.chromium.launch(headless=True)
        _playwright_local.context = _playwright_local.browser.new_context(
            user_agent=config.USER_AGENT,
            ignore_https_errors=True
        )
    page = _playwright_local.context.new_page()
    stealth_sync(page)
    return page

def fetch_with_js(url: str):
    if not HAS_PLAYWRIGHT:
        logger.error("Playwright not installed! Use 'pip install playwright' and 'playwright install'")
        return None
        
    domain = get_domain(url)
    if not is_allowed_by_robots(url):
        return None

    _wait_for_domain_slot(domain)
    
    page = None
    try:
        page = _get_playwright_page()
        # Timeout in milliseconds
        response = page.goto(url, wait_until="domcontentloaded", timeout=config.REQUEST_TIMEOUT * 1000)
        
        if not response:
            return None
            
        status = response.status
        if status == 429:
            # Same backoff logic...
            wait = config.RETRY_BACKOFF_SECONDS * 2
            lock = _get_domain_lock(domain)
            with lock:
                _domain_last_request[domain] = time.time() + wait
            time.sleep(wait)
            return None
            
        # Give it a tiny bit of time for SPA to render
        try:
            page.wait_for_load_state("networkidle", timeout=3000)
        except Exception:
            pass # ignore timeouts waiting for network idle
            
        html = page.content()
        headers = response.all_headers()
        
        return MockResponse(html, status, headers)
    except Exception as e:
        logger.warning(f"Playwright fetch failed for {url}: {e}")
        return None
    finally:
        if page:
            try:
                page.close()
            except Exception:
                pass


def fetch_smart(url: str, method: str = "GET", allow_redirects: bool = True):
    """
    Intelligently fetch a URL. Tries standard requests first.
    If it looks like an SPA or Anti-bot challenge, falls back to JS rendering.
    """
    resp = fetch(url, method, allow_redirects)
    
    if not config.USE_SMART_JS_FALLBACK or not HAS_PLAYWRIGHT:
        return resp
        
    if resp is None:
        return None
        
    text_lower = resp.text.lower()
    
    # Check for anti-bot
    if resp.status_code in (401, 403, 503):
        logger.info(f"Detected anti-bot/forbidden at {url}. Falling back to Playwright.")
        return fetch_with_js(url)
        
    # Check for SPA
    content_length = len(resp.text)
    if resp.status_code == 200 and content_length < 3000:
        # A very small body with a root div often indicates a React/Vue SPA
        if 'id="root"' in text_lower or 'id="app"' in text_lower or '<app-root>' in text_lower:
            logger.info(f"Detected SPA at {url}. Falling back to Playwright.")
            return fetch_with_js(url)
            
    return resp
