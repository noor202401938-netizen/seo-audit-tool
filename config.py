"""
config.py
Central configuration for the crawling framework.
Nothing site-specific lives here — only behavior knobs.
"""

import os
from pathlib import Path


def _load_env_file(path: Path):
    if not path.exists():
        return

    with path.open("r", encoding="utf-8") as file_handle:
        for raw_line in file_handle:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            if key and key not in os.environ:
                os.environ[key] = value


_load_env_file(Path(__file__).resolve().with_name(".env"))

# ---------------------------------------------------------------------------
# Input / Output
# ---------------------------------------------------------------------------
SEED_FILE = os.environ.get("SEED_FILE", "D:\\links.txt")

OUTPUT_DIR = "output"
LOG_DIR = "logs"
DB_PATH = os.path.join(OUTPUT_DIR, "master_database.sqlite3")

CSV_DISCOVERED_URLS = os.path.join(OUTPUT_DIR, "discovered_urls.csv")
CSV_WEBSITES = os.path.join(OUTPUT_DIR, "websites.csv")
CSV_CONTACTS = os.path.join(OUTPUT_DIR, "contacts.csv")
XLSX_MASTER = os.path.join(OUTPUT_DIR, "master_database.xlsx")

# ---------------------------------------------------------------------------
# Extraction Goals
# ---------------------------------------------------------------------------
EXTRACT_EMAILS = os.environ.get("EXTRACT_EMAILS", "true").lower() == "true"
EXTRACT_PHONES = os.environ.get("EXTRACT_PHONES", "true").lower() == "true"
EXTRACT_IMAGES = os.environ.get("EXTRACT_IMAGES", "false").lower() == "true"
EXTRACT_ARTICLES = os.environ.get("EXTRACT_ARTICLES", "true").lower() == "true"
EXTRACT_PRODUCTS = os.environ.get("EXTRACT_PRODUCTS", "true").lower() == "true"

CUSTOM_PROMPT = os.environ.get("CUSTOM_PROMPT", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# ---------------------------------------------------------------------------
# Crawl behavior
# ---------------------------------------------------------------------------
MAX_CRAWL_DEPTH = int(os.environ.get("MAX_CRAWL_DEPTH", 3))          # how deep into a discovered site
MAX_PAGES_PER_DOMAIN = int(os.environ.get("MAX_PAGES_PER_DOMAIN", 40))  # hard ceiling per site
MAX_PAGINATION_PAGES = int(os.environ.get("MAX_PAGINATION_PAGES", 50))  # per listing/category page

CONCURRENCY = int(os.environ.get("CONCURRENCY", 5))       # parallel workers
INTERNAL_CONCURRENCY = int(os.environ.get("INTERNAL_CONCURRENCY", 20))  # parallel threads per website
USE_SMART_JS_FALLBACK = os.environ.get("USE_SMART_JS_FALLBACK", "true").lower() == "true"
REQUEST_TIMEOUT = int(os.environ.get("REQUEST_TIMEOUT", 15))
RETRY_ATTEMPTS = int(os.environ.get("RETRY_ATTEMPTS", 3))
RETRY_BACKOFF_SECONDS = float(os.environ.get("RETRY_BACKOFF_SECONDS", 2.0))

# Politeness: minimum delay between requests to the SAME domain, in seconds.
# This is a floor, not a ceiling -- respect robots.txt crawl-delay if it's higher.
MIN_DELAY_PER_DOMAIN = float(os.environ.get("MIN_DELAY_PER_DOMAIN", 1.5))

RESPECT_ROBOTS_TXT = os.environ.get("RESPECT_ROBOTS_TXT", "true").lower() == "true"

USER_AGENT = os.environ.get(
    "CRAWLER_USER_AGENT",
    "Mozilla/5.0 (compatible; ContactDiscoveryBot/1.0; +mailto:you@example.com)"
)

# Priority path segments to check first on any discovered website (Phase 4)
PRIORITY_PATHS = [
    "/", "/contact", "/contact-us", "/contactus", "/about", "/about-us",
    "/team", "/staff", "/leadership", "/support", "/connect",
    "/privacy", "/sitemap.xml",
]

# ---------------------------------------------------------------------------
# Checkpointing / resume
# ---------------------------------------------------------------------------
CHECKPOINT_FILE = os.path.join(OUTPUT_DIR, "checkpoint.json")
CHECKPOINT_EVERY_N_ITEMS = int(os.environ.get("CHECKPOINT_EVERY_N_ITEMS", 10))

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG_FILE = os.path.join(LOG_DIR, "crawler.log")

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
EMAIL_REGEX = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
PHONE_REGEX = r"(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?){2,4}\d{2,4}"

# Domains/extensions to never treat as "contact emails" (common false positives)
EMAIL_EXCLUDE_DOMAINS = {
    "example.com", "sentry.io", "wixpress.com", "godaddy.com",
    "schema.org", "w3.org",
}
EMAIL_EXCLUDE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js",
}
