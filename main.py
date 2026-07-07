"""
main.py
Universal Website Discovery & Public Contact Extraction Framework.

Usage:
    python main.py
    SEED_FILE="D:\\links.txt" CONCURRENCY=8 python main.py

Pipeline:
    Phase 1: crawl each seed (listing/directory site) -> discover profile URLs
    Phase 2: visit each profile page -> extract generic metadata
    Phase 3: whenever a profile page links to an official website, store it (deduped)
    Phase 4+5: crawl every discovered website -> extract public contact info
    Phase 6: dedup/clean (also happens inline via DB UNIQUE constraints + validators)
    Phase 7: export to CSV / Excel / SQLite
"""

import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import config
from utils.logger import get_logger
from utils.checkpoint import Checkpoint
from utils.exporter import export_all
from database.sqlite_manager import SQLiteManager
from crawler.seed_loader import load_seed_urls
from crawler.directory_crawler import crawl_listing_site, process_profile_page
from crawler.website_crawler import crawl_website

logger = get_logger("main")


def run_phase_1_and_2_and_3(seeds, db, checkpoint):
    """Crawl listing sites, discover profile pages, extract metadata + websites."""
    for seed in seeds:
        if checkpoint.is_seed_done(seed):
            logger.info(f"Skipping already-completed seed: {seed}")
            continue

        logger.info(f"=== Phase 1: crawling seed {seed} ===")
        try:
            profile_links = crawl_listing_site(seed, db)
        except Exception as e:
            logger.error(f"Seed crawl failed for {seed}: {e}")
            continue

        if not profile_links:
            logger.warning(f"No profile links discovered for seed: {seed}")
            checkpoint.mark_seed_done(seed)
            continue

        logger.info(f"=== Phase 2+3: processing {len(profile_links)} profile pages for {seed} ===")
        with ThreadPoolExecutor(max_workers=config.CONCURRENCY) as pool:
            futures = {
                pool.submit(process_profile_page, url, seed, db): url
                for url in profile_links
            }
            done_count = 0
            for future in as_completed(futures):
                url = futures[future]
                try:
                    future.result()
                except Exception as e:
                    logger.error(f"Profile page failed ({url}): {e}")
                done_count += 1
                if done_count % config.CHECKPOINT_EVERY_N_ITEMS == 0:
                    logger.info(f"  ...{done_count}/{len(profile_links)} profile pages processed")

        checkpoint.mark_seed_done(seed)


def run_phase_4_and_5(db, checkpoint):
    """Crawl every discovered official website and extract public contact info."""
    websites = db.get_all_websites()
    pending = [w for w in websites if not checkpoint.is_website_done(w["canonical_url"])]

    logger.info(f"=== Phase 4+5: crawling {len(pending)} discovered websites "
                f"({len(websites) - len(pending)} already done) ===")

    with ThreadPoolExecutor(max_workers=config.CONCURRENCY) as pool:
        futures = {
            pool.submit(crawl_website, w["canonical_url"], db): w["canonical_url"]
            for w in pending
        }
        done_count = 0
        for future in as_completed(futures):
            website_url = futures[future]
            try:
                record = future.result()
                if record:
                    db.save_contact(record)
            except Exception as e:
                logger.error(f"Website crawl failed ({website_url}): {e}")
            finally:
                checkpoint.mark_website_done(website_url)
                done_count += 1
                if done_count % config.CHECKPOINT_EVERY_N_ITEMS == 0:
                    logger.info(f"  ...{done_count}/{len(pending)} websites processed")


def main():
    os.makedirs(config.OUTPUT_DIR, exist_ok=True)
    os.makedirs(config.LOG_DIR, exist_ok=True)

    print("\n" + "="*60)
    print("Welcome to the Universal Goal-Oriented AI Crawler")
    print("="*60)
    print("What would you like to extract?")
    print("Available targets: emails, phones, images, articles, products")
    print("You can also type a completely custom request (e.g., 'extract pricing tables' or 'find job openings').")
    
    user_input = input("\nEnter your extraction goals (comma separated) or a custom prompt: ").strip().lower()
    
    if user_input:
        # Reset all standard flags to False
        config.EXTRACT_EMAILS = False
        config.EXTRACT_PHONES = False
        config.EXTRACT_IMAGES = False
        config.EXTRACT_ARTICLES = False
        config.EXTRACT_PRODUCTS = False
        config.CUSTOM_PROMPT = ""

        targets = [t.strip() for t in user_input.split(",")]
        is_custom = True
        
        for t in targets:
            if "email" in t: config.EXTRACT_EMAILS = True; is_custom = False
            elif "phone" in t: config.EXTRACT_PHONES = True; is_custom = False
            elif "image" in t: config.EXTRACT_IMAGES = True; is_custom = False
            elif "article" in t: config.EXTRACT_ARTICLES = True; is_custom = False
            elif "product" in t: config.EXTRACT_PRODUCTS = True; is_custom = False
            
        # If it didn't match any standard targets, treat the whole input as a custom prompt
        if is_custom:
            config.CUSTOM_PROMPT = user_input
            if not config.GEMINI_API_KEY:
                print("\n[WARNING] You requested a custom extraction but GEMINI_API_KEY is not set in your environment!")
                print("The crawler will still run, but custom extraction will fail unless the key is provided.")

    print("\nStarting crawl with the following goals:")
    print(f"- Emails: {config.EXTRACT_EMAILS}")
    print(f"- Phones: {config.EXTRACT_PHONES}")
    print(f"- Images: {config.EXTRACT_IMAGES}")
    print(f"- Articles: {config.EXTRACT_ARTICLES}")
    print(f"- Products: {config.EXTRACT_PRODUCTS}")
    if config.CUSTOM_PROMPT:
        print(f"- Custom Prompt: '{config.CUSTOM_PROMPT}'")
    print("="*60 + "\n")

    start = time.time()
    logger.info("=== Universal Website Discovery & Contact Extraction Framework ===")
    logger.info(f"Seed file: {config.SEED_FILE}")
    logger.info(f"Concurrency: {config.CONCURRENCY} | Max depth: {config.MAX_CRAWL_DEPTH} | "
                f"Respect robots.txt: {config.RESPECT_ROBOTS_TXT}")

    db = SQLiteManager()
    checkpoint = Checkpoint()

    seeds = load_seed_urls()
    if not seeds:
        logger.error("No seed URLs loaded -- check config.SEED_FILE. Exiting.")
        return

    run_phase_1_and_2_and_3(seeds, db, checkpoint)
    run_phase_4_and_5(db, checkpoint)

    logger.info("=== Phase 6+7: cleaning & exporting ===")
    export_all(db)

    elapsed = time.time() - start
    logger.info(f"Done in {elapsed:.1f}s. Outputs written to '{config.OUTPUT_DIR}/'.")


if __name__ == "__main__":
    main()
