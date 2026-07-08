"""
database/sqlite_manager.py
All persistence lives here. SQLite is used both as the working store
during the crawl (enables resume) and as one of the export formats.
"""

import sqlite3
import threading
from datetime import datetime, timezone

import config


class SQLiteManager:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or config.DB_PATH
        self._lock = threading.Lock()
        self._init_schema()

    def _connect(self):
        conn = sqlite3.connect(self.db_path, timeout=30)
        conn.execute("PRAGMA journal_mode=WAL;")
        return conn

    def _init_schema(self):
        with self._lock, self._connect() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS discovered_urls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    profile_url TEXT UNIQUE,
                    source_url TEXT,
                    crawl_status TEXT,
                    crawl_timestamp TEXT
                );

                CREATE TABLE IF NOT EXISTS websites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    canonical_url TEXT UNIQUE,
                    source_profile_url TEXT,
                    discovered_timestamp TEXT
                );

                CREATE TABLE IF NOT EXISTS contacts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    website TEXT,
                    detail_page_url TEXT,
                    source_url TEXT,
                    name TEXT,
                    organization TEXT,
                    category TEXT,
                    address TEXT,
                    emails TEXT,
                    phones TEXT,
                    social_links TEXT,
                    images TEXT,
                    articles TEXT,
                    products TEXT,
                    custom_data TEXT,
                    seo_reports TEXT,
                    contact_page_url TEXT,
                    crawl_status TEXT,
                    extraction_timestamp TEXT,
                    UNIQUE(website, detail_page_url)
                );

                CREATE TABLE IF NOT EXISTS crawl_queue (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT UNIQUE,
                    url_type TEXT,       -- 'seed' | 'listing' | 'profile' | 'website'
                    source_url TEXT,
                    depth INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'pending',  -- pending | done | failed
                    attempts INTEGER DEFAULT 0,
                    last_attempt TEXT
                );

                CREATE INDEX IF NOT EXISTS idx_queue_status ON crawl_queue(status);
                
                CREATE TABLE IF NOT EXISTS audits (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    website TEXT UNIQUE,
                    onpage_score INTEGER,
                    offpage_score INTEGER,
                    audit_timestamp TEXT
                );
                
                CREATE TABLE IF NOT EXISTS backlink_snapshots (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    website TEXT UNIQUE,
                    domain_authority INTEGER,
                    page_authority INTEGER,
                    total_backlinks INTEGER,
                    referring_domains INTEGER,
                    spam_score INTEGER,
                    fetched_at TEXT
                );
                
                CREATE TABLE IF NOT EXISTS onpage_issues (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    website TEXT,
                    page_url TEXT,
                    category TEXT,
                    issue TEXT,
                    severity TEXT,
                    fixes TEXT,
                    automatable BOOLEAN,
                    detected_at TEXT
                );
                """
            )

    @staticmethod
    def _now():
        return datetime.now(timezone.utc).isoformat()

    # ---------------- crawl_queue (drives resume/checkpointing) -------------

    def enqueue(self, url: str, url_type: str, source_url: str = "", depth: int = 0):
        with self._lock, self._connect() as conn:
            try:
                conn.execute(
                    "INSERT INTO crawl_queue (url, url_type, source_url, depth) VALUES (?,?,?,?)",
                    (url, url_type, source_url, depth),
                )
            except sqlite3.IntegrityError:
                pass  # already queued

    def get_pending(self, url_type: str = None, limit: int = 500):
        with self._lock, self._connect() as conn:
            conn.row_factory = sqlite3.Row
            if url_type:
                rows = conn.execute(
                    "SELECT * FROM crawl_queue WHERE status='pending' AND url_type=? LIMIT ?",
                    (url_type, limit),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM crawl_queue WHERE status='pending' LIMIT ?", (limit,)
                ).fetchall()
            return [dict(r) for r in rows]

    def mark_status(self, url: str, status: str):
        with self._lock, self._connect() as conn:
            conn.execute(
                "UPDATE crawl_queue SET status=?, attempts=attempts+1, last_attempt=? WHERE url=?",
                (status, self._now(), url),
            )

    # ---------------- discovered_urls (Phase 1 output) -----------------------

    def save_discovered_url(self, profile_url: str, source_url: str, crawl_status: str = "discovered"):
        with self._lock, self._connect() as conn:
            conn.execute(
                """INSERT INTO discovered_urls (profile_url, source_url, crawl_status, crawl_timestamp)
                   VALUES (?,?,?,?)
                   ON CONFLICT(profile_url) DO UPDATE SET crawl_status=excluded.crawl_status""",
                (profile_url, source_url, crawl_status, self._now()),
            )

    # ---------------- websites (Phase 3 output) -------------------------------

    def save_website(self, canonical_url: str, source_profile_url: str):
        with self._lock, self._connect() as conn:
            try:
                conn.execute(
                    "INSERT INTO websites (canonical_url, source_profile_url, discovered_timestamp) VALUES (?,?,?)",
                    (canonical_url, source_profile_url, self._now()),
                )
            except sqlite3.IntegrityError:
                pass

    def get_all_websites(self):
        with self._lock, self._connect() as conn:
            conn.row_factory = sqlite3.Row
            return [dict(r) for r in conn.execute("SELECT * FROM websites").fetchall()]

    # ---------------- contacts (Phase 5 output) -------------------------------

    def save_contact(self, record: dict):
        with self._lock, self._connect() as conn:
            conn.execute(
                """INSERT INTO contacts
                   (website, detail_page_url, source_url, name, organization, category,
                    address, emails, phones, social_links, images, articles, products, custom_data, seo_reports, contact_page_url,
                    crawl_status, extraction_timestamp)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                   ON CONFLICT(website, detail_page_url) DO UPDATE SET
                        emails=excluded.emails,
                        phones=excluded.phones,
                        social_links=excluded.social_links,
                        images=excluded.images,
                        articles=excluded.articles,
                        products=excluded.products,
                        custom_data=excluded.custom_data,
                        seo_reports=excluded.seo_reports,
                        crawl_status=excluded.crawl_status,
                        extraction_timestamp=excluded.extraction_timestamp
                """,
                (
                    record.get("website", ""),
                    record.get("detail_page_url", ""),
                    record.get("source_url", ""),
                    record.get("name", ""),
                    record.get("organization", ""),
                    record.get("category", ""),
                    record.get("address", ""),
                    record.get("emails", ""),
                    record.get("phones", ""),
                    record.get("social_links", ""),
                    record.get("images", ""),
                    record.get("articles", ""),
                    record.get("products", ""),
                    record.get("custom_data", ""),
                    record.get("seo_reports", ""),
                    record.get("contact_page_url", ""),
                    record.get("crawl_status", "complete"),
                    self._now(),
                ),
            )

    def get_all_contacts(self):
        with self._lock, self._connect() as conn:
            conn.row_factory = sqlite3.Row
            return [dict(r) for r in conn.execute("SELECT * FROM contacts").fetchall()]

    def get_all_discovered_urls(self):
        with self._lock, self._connect() as conn:
            conn.row_factory = sqlite3.Row
            return [dict(r) for r in conn.execute("SELECT * FROM discovered_urls").fetchall()]

    # ---------------- audits & backlink_snapshots & onpage_issues -------------

    def save_audit(self, website: str, onpage_score: int, offpage_score: int):
        with self._lock, self._connect() as conn:
            conn.execute(
                """INSERT INTO audits (website, onpage_score, offpage_score, audit_timestamp)
                   VALUES (?,?,?,?)
                   ON CONFLICT(website) DO UPDATE SET
                        onpage_score=excluded.onpage_score,
                        offpage_score=excluded.offpage_score,
                        audit_timestamp=excluded.audit_timestamp
                """,
                (website, onpage_score, offpage_score, self._now()),
            )

    def get_audit(self, website: str):
        with self._lock, self._connect() as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute("SELECT * FROM audits WHERE website=?", (website,)).fetchone()
            return dict(row) if row else None

    def save_backlink_snapshot(self, snapshot: dict):
        with self._lock, self._connect() as conn:
            conn.execute(
                """INSERT INTO backlink_snapshots 
                   (website, domain_authority, page_authority, total_backlinks, referring_domains, spam_score, fetched_at)
                   VALUES (?,?,?,?,?,?,?)
                   ON CONFLICT(website) DO UPDATE SET
                        domain_authority=excluded.domain_authority,
                        page_authority=excluded.page_authority,
                        total_backlinks=excluded.total_backlinks,
                        referring_domains=excluded.referring_domains,
                        spam_score=excluded.spam_score,
                        fetched_at=excluded.fetched_at
                """,
                (
                    snapshot.get("website", ""),
                    snapshot.get("domain_authority", 0),
                    snapshot.get("page_authority", 0),
                    snapshot.get("total_backlinks", 0),
                    snapshot.get("referring_domains", 0),
                    snapshot.get("spam_score", 0),
                    self._now(),
                ),
            )

    def get_backlink_snapshot(self, website: str):
        with self._lock, self._connect() as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute("SELECT * FROM backlink_snapshots WHERE website=?", (website,)).fetchone()
            return dict(row) if row else None

    def save_onpage_issue(self, issue: dict):
        with self._lock, self._connect() as conn:
            conn.execute(
                """INSERT INTO onpage_issues 
                   (website, page_url, category, issue, severity, fixes, automatable, detected_at)
                   VALUES (?,?,?,?,?,?,?,?)
                """,
                (
                    issue.get("website", ""),
                    issue.get("page_url", ""),
                    issue.get("category", ""),
                    issue.get("issue", ""),
                    issue.get("severity", ""),
                    issue.get("fixes", ""),
                    issue.get("automatable", False),
                    self._now(),
                ),
            )

    def clear_onpage_issues(self, website: str):
        with self._lock, self._connect() as conn:
            conn.execute("DELETE FROM onpage_issues WHERE website=?", (website,))

    def get_onpage_issues(self, website: str):
        with self._lock, self._connect() as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT * FROM onpage_issues WHERE website=?", (website,)).fetchall()
            return [dict(r) for r in rows]

