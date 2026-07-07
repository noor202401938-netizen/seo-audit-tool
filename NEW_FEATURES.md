# The Universal Goal-Oriented AI Crawler Update
**Release Overview for the Team**

The crawler framework has undergone a major architectural upgrade. We have transitioned from a static, hardcoded contact-scraper into a **Universal Goal-Oriented AI Agent** capable of adapting to any data extraction need.

Below is a breakdown of the major features and capabilities now available in the crawler.

---

## 1. Reinforcement Learning "Smart Crawl" (AI Brain)
Previously, the crawler used a "blind" Breadth-First Search (BFS) to traverse websites, wasting bandwidth on irrelevant pages like `/privacy` or `/terms`. 

**What's New:**
- The crawler is now powered by a **Multi-Armed Bandit algorithm (Thompson Sampling)** (`bandit.py`).
- The AI "learns" during the crawl. It analyzes the URL paths and assigns them a score based on what you are trying to extract. 
- For example, if you are extracting products, the AI learns that links containing `/shop/` or `/item/` yield high rewards. It will instantly prioritize those links in the queue and ignore useless pages, vastly increasing crawl speed and efficiency.
- **The "Portable Brain"**: The AI saves its memory to `output/bandit_model.json`, meaning it gets smarter across different crawl jobs.

## 2. Interactive Interactive CLI & Dynamic Goals
You are no longer limited to just extracting emails and phone numbers. The extraction targets are now completely dynamic.

**What's New:**
- Running `python main.py` now triggers an interactive terminal prompt.
- The crawler will ask you exactly what you want to extract: `"emails, phones, images, articles, products"`.
- If you specify `products` and `images`, the crawler will dynamically disable the email and phone extractors to save processing time and keep your data clean.

## 3. Universal Custom Extraction (LLM Integration)
This is the most powerful addition to the crawler. If you need data that we haven't built a specific extractor for, you can simply *ask for it*.

**What's New:**
- When prompted at startup, you can type natural language commands like: *"extract pricing tables"*, *"find job openings"*, or *"get the names of the founders"*.
- The crawler uses the **Google Gemini AI API** (`custom_extractor.py`) to read the webpage text and extract exactly what you asked for, outputting it as a clean JSON array directly into your Excel spreadsheet.
- *(Note: Ensure your `GEMINI_API_KEY` is set in the `.env` file for this feature to work).*

## 4. Built-in Anti-Bot Evasion
Scraping modern e-commerce or high-value targets (like Etsy) often results in `403 Forbidden` errors due to Cloudflare or advanced bot-protection.

**What's New:**
- The HTTP client now integrates **Playwright Stealth**. 
- If the crawler detects an anti-bot challenge or a heavily JavaScript-rendered Single Page Application (SPA), it will automatically launch a stealthy, headless browser to natively bypass the protections and safely render the HTML.

## 5. Expanded Modular Extractors & Database
We have decoupled the extraction logic from the crawling logic, making it incredibly easy to add new data targets in the future.

**What's New:**
- Added `image_extractor.py`, `article_extractor.py`, and `product_extractor.py`.
- The product extractor is intelligent enough to search for e-commerce `Schema.org JSON-LD` data first, before falling back to parsing HTML classes.
- The `sqlite_manager.py` schema automatically accommodates all these new data types, saving them seamlessly to `contacts.csv` and the Master Excel file.

---

### Getting Started
To test the new features, make sure your dependencies are up to date (`pip install -r requirements.txt`), ensure your `GEMINI_API_KEY` is set in your `.env`, and simply run:

```bash
python main.py
```
