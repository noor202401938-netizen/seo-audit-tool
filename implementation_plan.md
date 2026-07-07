# Convert Crawler to SEO Audit Tool

This document outlines the implementation plan to adapt the existing crawler into a fully automated SEO Audit Tool. By leveraging the existing crawling infrastructure, we will add new extraction modules and a scoring engine to evaluate pages against SEO best practices.

## User Review Required

> [!IMPORTANT]
> The current crawler architecture focuses heavily on data extraction (metadata, products, emails, etc.). To turn this into an SEO Audit Tool, we will need to change how the final output is generated, moving from simple lists/CSVs to structured SEO reports with scores. Does this match your expectation, or would you prefer the SEO audit to be an *additional* output alongside the regular data extraction?

## Open Questions

> [!WARNING]
> 1. **Scoring Logic:** How detailed do you want the SEO scoring to be? (e.g., Simple Pass/Fail vs. Weighted scores out of 100).
> 2. **Sitemap Integration:** Should the crawler automatically look for and parse `sitemap.xml` files to identify orphan pages, or just crawl organically?

## Proposed Changes

We will introduce a new SEO extractor and an SEO rules engine to evaluate the extracted data.

---

### SEO Extraction Module

Create a dedicated extractor to pull out all relevant SEO tags and structural elements from the HTML.

#### [NEW] [seo_extractor.py](file:///d:/crawler/extractors/seo_extractor.py)
- A new extractor in the `extractors/` directory.
- Will use BeautifulSoup to extract:
  - Title tags (content and length)
  - Meta descriptions (content and length)
  - Header structure (`<h1>`, `<h2>`, etc., checking for single H1 and proper nesting)
  - Image `alt` attributes
  - Canonical tags
  - Robots meta tags (`noindex`, `nofollow`)

---

### SEO Rules Engine

Create a new module to evaluate the extracted SEO data against best practices and generate actionable issues and scores.

#### [NEW] [seo_rules.py](file:///d:/crawler/utils/seo_rules.py)
- A new utility module to hold the logic for evaluating SEO elements.
- Implement functions like `check_title_length()`, `check_h1_presence()`, `check_image_alts()`.
- Implement a scoring function that aggregates these checks into a page-level SEO score (e.g., 0-100).

---

### Output Generation

Modify the existing export logic to support generating a structured SEO report.

#### [MODIFY] [exporter.py](file:///d:/crawler/utils/exporter.py)
- Add a new method `export_seo_report()` or modify `export_results()` to format the SEO data and scores into a readable JSON or CSV format, categorizing issues by severity (Error, Warning, Notice).

---

### Crawler Integration

Update the main crawler logic to utilize the new SEO extractor and rules engine.

#### [MODIFY] [website_crawler.py](file:///d:/crawler/crawler/website_crawler.py)
- Import and run `SeoExtractor` on every page crawled.
- Pass the extracted SEO data to `seo_rules.py` to calculate the page score and identify issues.
- Store the SEO report data alongside the crawled page data.

## Verification Plan

### Automated Tests
- `pytest tests/test_seo_extractor.py` (To be created) - verifies that the extractor correctly identifies titles, descriptions, headers, etc.
- `pytest tests/test_seo_rules.py` (To be created) - verifies the scoring logic correctly penalizes missing/bad tags.

### Manual Verification
- Run the crawler against a known website (e.g., a test site or one with known SEO issues).
- Review the generated output report to ensure the scores and identified issues are accurate and actionable.
