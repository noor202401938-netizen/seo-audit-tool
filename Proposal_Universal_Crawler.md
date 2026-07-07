# Proposal: Universal Goal-Oriented AI Crawler

## Executive Summary
Currently, our web crawler is hardcoded to perform a Breadth-First Search (BFS) to find specific contact information (emails, phones, social links). We propose upgrading the crawler to a **Universal Goal-Oriented Architecture** powered by a Reinforcement Learning (RL) AI model. 

This upgrade will allow users to dynamically select their extraction goals (e.g., Contacts, Images, Articles, specific content) via configuration toggles. The AI will learn from experience, dynamically prioritizing website links that have the highest probability of yielding the requested data.

---

## 1. The Problem with the Current Architecture
1. **Inefficient Search:** The current Phase 4 crawler searches websites blindly (BFS). It wastes time and bandwidth crawling irrelevant pages like `/privacy` or `/terms` hoping to find emails.
2. **Hardcoded Goals:** The system is strictly bound to extracting contact data. Expanding it to scrape images, articles, or other specific content types requires significant refactoring of the core logic.

---

## 2. The Proposed Solution
We will introduce a **Multi-Armed Bandit (MAB)** reinforcement learning model into the crawler's decision-making process, shifting it from a static scraper to a goal-oriented intelligent agent.

### 2.1 Dynamic Extraction Targets
Users will define their extraction goals in the `.env` configuration file:
```env
EXTRACT_EMAILS=true
EXTRACT_PHONES=true
EXTRACT_IMAGES=false
EXTRACT_ARTICLES=true
```

### 2.2 The "Reward" Function
The AI operates on a reward system. The reward for visiting a page is calculated dynamically based on what the user wants to extract.
* If `EXTRACT_EMAILS=true`, finding an email yields a **+10 Reward**.
* If `EXTRACT_IMAGES=true`, finding an image gallery yields a **+5 Reward**.
* Visiting a page that yields none of the requested data yields a **Negative Reward**.

### 2.3 Intelligent Link Prioritization (Smart Crawling)
Instead of crawling links in the order they were found, the AI evaluates every link in the queue based on its URL keywords (e.g., `about`, `gallery`, `staff`, `blog`). 
* If the user wants **Images**, the AI learns that links containing `gallery` or `media` consistently yield positive rewards, and will prioritize them.
* If the user wants **Contacts**, the AI learns to prioritize `staff` and `contact` links.

---

## 3. Engineering & Implementation

### Phase A: Configuration & Extractor Expansion
* Add feature flags to `config.py`.
* Implement boilerplate extractor modules for new data types (e.g., `image_extractor.py`, `article_extractor.py`).

### Phase B: The AI "Brain" (`bandit.py`)
* Implement a thread-safe `URLBandit` class using Thompson Sampling.
* This class will track the success/failure rates of URL keywords relative to specific extraction goals.
* The model's state will be saved to disk (`output/bandit_model.json`) so it retains its learning across different crawl runs.

### Phase C: Crawler Integration
* Modify `website_crawler.py` to use the `URLBandit` for queue prioritization.
* Ensure the integration is thread-safe to maintain the crawler's high concurrency.

---

## 4. Business Value & ROI
1. **Faster Crawls:** By prioritizing high-value links, the crawler reaches its target data faster, reducing the total number of pages crawled per domain.
2. **Reduced Server Costs & Bans:** Crawling fewer, highly-relevant pages reduces bandwidth costs and significantly lowers the risk of IP bans from target websites.
3. **Versatility:** The crawler transforms into a universal data extraction platform capable of adapting to future business needs without core architectural rewrites.

---

## 5. Architectural Reusability
Moving to this goal-oriented RL architecture provides significant long-term reusability:
* **Modular Extractors:** The extraction logic is completely decoupled from the crawling logic. In the future, if we need to scrape a new data type (e.g., pricing data or PDFs), we can simply drop a new `price_extractor.py` into the `extractors/` folder without touching the core crawler.
* **The "Portable Brain":** The AI model (`bandit.py`) is framework-agnostic. It can be moved to entirely different Python projects. Furthermore, the model saves its memory to disk (`bandit_model.json`). We can maintain different "brains" for different industries (e.g., a `real_estate_brain.json` vs. a `tech_startup_brain.json`) and hot-swap them depending on the crawl job.
* **Tech-Stack Agnostic:** The AI prioritization sits above the HTTP client. Whether we eventually migrate from `requests` to `Playwright`, `Selenium`, or something else, the AI prioritization engine remains 100% compatible.

---

## 6. Implementation Effort Estimate
Because the current crawler architecture is already highly modular (separated into clear "Phases"), injecting this new logic is very straightforward.

* **Low Effort (Configuration & Extractors):** Adding feature flags and basic BeautifulSoup extractors for images/articles. *(~30 minutes)*
* **Medium Effort (AI Brain & DB):** Implementing the Thompson Sampling math (`bandit.py`) and updating the SQLite schema to accept dynamic data types. *(~2 Hours)*
* **High Focus (Website Crawler Refactor):** Updating Phase 4 (`website_crawler.py`) to pass the URL queue to the AI for scoring, applying thread-locking to ensure the AI's memory isn't corrupted by concurrent workers, and routing the rewards back to the AI. *(~2 Hours)*

**Total Estimate:** ~5-7 files modified (approx. 150-300 lines of code). This represents about **1/2 to 1 full day of development time** for a single engineer.
