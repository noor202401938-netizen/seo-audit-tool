# The Crawler Funnel: How It Works

It is helpful to think of this crawler as a **funnel**. At the top of the funnel, we cast a very wide net (seed URLs). As data moves down through the different phases, the crawler actively filters out junk, broken links, and irrelevant data, resulting in a much smaller, but highly accurate, list of contacts at the bottom.

Here is a breakdown of how data flows through the crawler and why the numbers drop off at each step, using your recent test run as an example:

## Phase 1: Seed Crawling
* **What it does:** The crawler visits your seed URLs (like `usachurches.org`) and looks for listing pages or search result pages.
* **Your Run:** It loaded **3 seed URLs**.

## Phase 2: Profile Discovery
* **What it does:** It scans the listing pages to find individual profile links for specific organizations (e.g., a specific church's profile on `usachurches.org`).
* **Your Run:** It found **12 Profile Pages** across the seeds (8 from usachurches, 4 from achurchnearyou, and 0 from churchfinder).

## Phase 3: Official Website Extraction (The First Drop-off)
* **What it does:** The crawler visits those 12 profile pages and tries to find the organization's *actual* official website. 
* **Why numbers drop:** 
  1. Some profiles simply do not list a website.
  2. Some profiles link to a Facebook page, a Vimeo video, or Google Maps instead of a real website. The crawler's blocklist actively throws these away because they are not useful for scraping local contact data.
* **Your Run:** 12 profiles were reduced to **8 Valid URLs**.

## Phase 4: Deep Website Crawling (The Second Drop-off)
* **What it does:** The crawler attempts to connect to those 8 valid URLs. If successful, it crawls up to 40 internal pages per site (prioritizing `/contact`, `/about`, etc.).
* **Why numbers drop:** The real internet is messy. Websites go offline, domains expire, or servers have broken security certificates. The crawler retries up to 3 times, and if a site is dead, it gives up and drops it from the list.
* **Your Run:** 3 of the 8 websites were broken or timed out (`cypresschurch.tv`, `willowcreek.com`, `thecityofpraise.org`). This left exactly **5 Successfully Crawled Websites**.

## Phase 5: Contact Extraction
* **What it does:** While crawling the successful websites, it scans the text (using normal requests or Playwright for Javascript-heavy sites) to find emails and phone numbers. 
* **Your Run:** It successfully extracted data from the 5 surviving websites and exported them to your `contacts.csv` file!

> [!TIP]
> **Summary:** A drop-off in numbers between profiles found and websites crawled is entirely normal and expected. It is proof that your blocklists and error-handling are working correctly to filter out useless or broken data!
