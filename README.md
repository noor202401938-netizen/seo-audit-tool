# Universal Website Discovery & Public Contact Extraction Framework

A modular, config-driven Python crawler. Point it at a list of seed URLs
(directory/listing sites) and it will:

1. **Crawl each seed** (following pagination) to discover profile/detail pages.
2. **Visit each profile page** and pull generic metadata (name, category, address)
   using JSON-LD/schema.org + layout-agnostic heuristics — no site-specific selectors.
3. **Find the official external website** linked from each profile, normalize it
   (`http://abc.com`, `https://www.abc.com` → one canonical URL) and queue it.
4. **Crawl every discovered website**, prioritizing `/contact`, `/about`, `/team`,
   `/sitemap.xml`, etc., then breadth-first exploring further internal pages.
5. **Extract public contact info** — emails (incl. `mailto:`), phones (incl. `tel:`),
   contact page URL, contact form presence, social media links.
6. **Clean & dedupe** everything (URLs, emails, phones) and validate formats.
7. **Export** to CSV, Excel (`.xlsx`), and a SQLite database.

The only thing that changes between projects is the contents of your seed
file — no code changes needed.

## Quick start

```bash
pip install -r requirements.txt
playwright install chromium

# Copy `.env.example` to `.env` if you want to customize the input file path.
# The default `.env` in this repo points at `links.sample.txt`.

# Windows: put your seed URLs in D:\links.txt (one per line), then:
python main.py

# macOS/Linux, or a different path:
SEED_FILE=/path/to/links.txt python main.py
```

See `links.sample.txt` for the expected format.

If you want the crawler to read configuration from a file instead of shell
variables, put key/value pairs in `.env`. The app loads `.env` automatically
at startup, and values already present in the shell still take precedence.

## Configuration

Everything tunable lives in `config.py`, and every setting can also be
overridden via environment variable at run time or via `.env`:

| Setting | Env var | Default | Purpose |
|---|---|---|---|
| Seed file path | `SEED_FILE` | `links.sample.txt` | Input list of seed URLs |
| Max crawl depth per website | `MAX_CRAWL_DEPTH` | 3 | How deep to follow internal links on a discovered site |
| Max pages per domain | `MAX_PAGES_PER_DOMAIN` | 40 | Hard ceiling to avoid runaway crawls |
| Max pagination pages | `MAX_PAGINATION_PAGES` | 50 | Per listing/directory site |
| Concurrency | `CONCURRENCY` | 5 | Parallel worker threads for different sites |
| Internal Concurrency | `INTERNAL_CONCURRENCY` | 3 | Parallel worker threads for pages within the same site |
| Smart JS Fallback | `USE_SMART_JS_FALLBACK` | true | Intelligently use Playwright to render SPAs and Anti-bot pages |
| Min delay per domain | `MIN_DELAY_PER_DOMAIN` | 1.5s | Politeness floor between requests to the same host |
| Respect robots.txt | `RESPECT_ROBOTS_TXT` | true | Skips disallowed paths |
| Retry attempts | `RETRY_ATTEMPTS` | 3 | Per-request retry count |

## Resume after interruption

Progress is checkpointed to `output/checkpoint.json` (completed seeds/websites)
and mirrored in the SQLite `crawl_queue` table. Re-running `python main.py`
after a crash or Ctrl-C skips everything already finished.

## Environment file

- `.env` is loaded automatically by `config.py` before settings are read.
- `SEED_FILE` is now stored in `.env` by default.
- Use `.env.example` as the template if you want to change the input path or
  add more overrides locally.

## Architecture

```
main.py                      orchestrates all phases, manages concurrency
config.py                    all tunables — nothing site-specific

crawler/
    seed_loader.py           Phase 0/1: load + normalize seed URLs
    directory_crawler.py     Phase 1-3: listing crawl, profile pages, website discovery
    website_crawler.py       Phase 4-5: crawl discovered sites, extract contacts

extractors/
    metadata_extractor.py    name/org/category/address via JSON-LD + heuristics
    email_extractor.py       mailto: + regex, validated
    phone_extractor.py       tel: + regex, validated
    social_extractor.py      facebook/twitter/instagram/linkedin/etc links

database/
    sqlite_manager.py        schema, queue, upserts, resume support

utils/
    http_client.py           retries, per-domain rate limiting, robots.txt
    normalizer.py             URL/email/phone canonicalization
    validator.py              format validation + false-positive filtering
    deduplicator.py           thread-safe seen-sets + record-level dedup
    checkpoint.py             JSON-based resume tracking
    exporter.py               CSV / Excel / SQLite export
    logger.py                 shared logging setup

output/                      discovered_urls.csv, websites.csv, contacts.csv,
                              master_database.xlsx, master_database.sqlite3,
                              checkpoint.json
logs/                        crawler.log
```

## A note on responsible use

This only collects information website owners have published publicly
(emails/phones on their own contact/about pages). A few things worth building
into whatever you do with the output:

- **Respect robots.txt** — on by default (`RESPECT_ROBOTS_TXT`), don't turn it off casually.
- **Rate limit** — the per-domain delay is a floor to avoid hammering small sites.
- If the collected emails/phones will be used for **outreach**, check the
  applicable rules for your situation (CAN-SPAM in the US, CASL in Canada,
  GDPR/PECR in the UK/EU, etc.) — these generally require an easy opt-out and
  accurate sender identification, and vary by whether contacts are individuals
  or organizations. This tool doesn't send anything itself; that compliance
  layer lives wherever you use the exported list next.

## Extending

- Add a new extractor by dropping a module in `extractors/` and calling it
  from `website_crawler.py` (Phase 5) or `directory_crawler.py` (Phase 2).
- Swap the fetcher for `Scrapy` if you need much higher throughput — `utils/http_client.py` is the single seam to replace. JS rendering is already handled intelligently via Playwright!
- All heuristics (profile-link detection, pagination detection, "official
  website" link scoring) live in `directory_crawler.py` and are pure functions
  you can unit test independently of network calls.
