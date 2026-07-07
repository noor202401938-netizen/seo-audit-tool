# Universal Website Discovery & Contact Extraction Framework
**Final Handoff & Developer Report**

This document serves as a comprehensive guide to the current architecture, recent enhancements, and configuration knobs of the crawler project. It is written for future developers or operators to understand exactly how the system works and how to tune it.

---

## 1. System Architecture & The "Funnel"
The crawler operates in a 7-phase funnel, progressively filtering out junk data to yield a highly accurate database of verified contacts.

* **Phase 1 (Directory Crawl):** Reads a list of seed URLs (e.g., church directory sites) from `SEED_FILE` (default: `links.txt`). It crawls pagination and listing pages to discover individual profile/detail URLs.
* **Phase 2 (Profile Extraction):** Visits the discovered profile pages to extract generic metadata (Name, Address, Category).
* **Phase 3 (Website Discovery):** Scans the profile page for the "Official External Website" (excluding social media and maps).
* **Phase 4 (Website Crawl):** Navigates to the official website. It prioritizes high-value paths (`/contact`, `/about`, `/team`) and then performs a breadth-first search up to `MAX_PAGES_PER_DOMAIN`.
* **Phase 5 (Contact Extraction):** Uses regex and heuristics to extract Emails, Phone Numbers, and Social Media links from every visited page.
* **Phase 6 (Cleaning & Deduplication):** Uses `SeenSet` and Pandas to aggressively deduplicate records across the entire dataset.
* **Phase 7 (Export):** Writes the final output to SQLite, CSV, and Excel formats.

---

## 2. Recent Major Enhancements

### 2.1 The "Smart Fetch" Anti-Bot System (Playwright)
The biggest bottleneck for web scrapers is being blocked by Cloudflare, DDoS-Guard, or strict 403 Forbidden rules. 
To solve this, we implemented `fetch_smart()` in `utils/http_client.py`.
- **How it works:** It initially attempts a standard, lightweight HTTP request. 
- **Trigger:** If it receives an HTTP `401`, `403`, or `503`, or detects a JavaScript Single Page Application (SPA), it immediately aborts the standard request.
- **Bypass:** It dynamically spins up a headless Chromium browser using **Playwright**, waits for the network to idle (allowing JS challenges to resolve), and extracts the fully rendered DOM.
- **Scope:** This smart-fallback is now fully active across both the Directory crawling phase and the final Website crawling phase.

### 2.2 Relational Data Export (Email Explosion)
Originally, multiple emails found on a single website were crammed into a single comma-separated cell. 
- We updated `utils/exporter.py` to use Pandas' `.explode()` function. 
- Now, if a website yields 3 unique emails, the final Excel/CSV export will generate **3 distinct rows** (one for each email), duplicating the metadata for those rows. This is the industry standard for lead-generation databases and CRMs.

---

## 3. Configuration & Tuning (`.env`)

The system is highly tunable without modifying any Python code. The `.env` file controls the crawler's speed, politeness, and stealth.

### Speed & Concurrency
- `CONCURRENCY=15`
  * Controls how many *different websites* or *profiles* are processed simultaneously. Increase for faster runs, decrease if you hit network/CPU limits.
- `INTERNAL_CONCURRENCY=20`
  * Controls how many threads are used to scan internal pages *within a single website* (Phase 4).

### Stealth & Anti-Blocking
- `RESPECT_ROBOTS_TXT=false`
  * Disables the default behavior of checking `robots.txt`. Necessary for crawling strict directories or forms that blanket-ban bots.
- `CRAWLER_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"`
  * Spoofs the bot's identity to look like a standard Google Chrome browser, preventing instant bans when `RESPECT_ROBOTS_TXT` is disabled.

### Crawl Budgets & Timeouts
- `MAX_PAGES_PER_DOMAIN=40`
  * The hard ceiling on how many pages to explore on a single website. Lowering this to `15` or `20` drastically speeds up the crawler (since emails are usually found early).
- `REQUEST_TIMEOUT=7` 
  * How long to wait for a dead site before giving up.
- `RETRY_ATTEMPTS=1`
  * How many times to retry a failed fetch.
- `MIN_DELAY_PER_DOMAIN=1.5`
  * A politeness delay (in seconds) between requests to the *same domain* to prevent crashing small servers.

---

## 4. Setup & Execution for New Developers

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Install Playwright Browsers (Required for Anti-Bot):**
   ```bash
   playwright install chromium
   ```
3. **Run the Crawler:**
   ```bash
   python main.py
   ```
4. **Resume Capability:**
   The crawler heavily utilizes a `checkpoint.json` and a `master_database.sqlite3`. If the crawler crashes or is stopped manually, running `python main.py` again will instantly resume exactly where it left off. To start a completely fresh run, delete the `output/` directory.
