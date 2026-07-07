"""
crawler/seed_loader.py
Phase 0: Load seed URLs from the configured input file (config.SEED_FILE).
Generic — no site-specific logic. Blank lines and '#' comments are ignored.
"""

import os

import config
from utils.logger import get_logger
from utils.normalizer import normalize_url

logger = get_logger("seed_loader")


def load_seed_urls(path: str = None) -> list:
    path = path or config.SEED_FILE

    if not os.path.exists(path):
        logger.error(f"Seed file not found: {path}")
        return []

    urls = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            urls.append(normalize_url(line))

    # de-dup while preserving order
    seen = set()
    unique = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            unique.append(u)

    logger.info(f"Loaded {len(unique)} seed URLs from {path}")
    return unique
