"""
utils/checkpoint.py
Lightweight resume support on top of the SQLite queue: tracks which
top-level stages (seeds, websites) have already been fully processed,
so re-running main.py after an interruption skips completed work.
"""

import json
import os
import threading

import config
from utils.logger import get_logger

logger = get_logger("checkpoint")

_lock = threading.Lock()


class Checkpoint:
    def __init__(self, path: str = None):
        self.path = path or config.CHECKPOINT_FILE
        self.state = {"completed_seeds": [], "completed_websites": []}
        self._load()

    def _load(self):
        if os.path.exists(self.path):
            try:
                with open(self.path, "r", encoding="utf-8") as f:
                    self.state = json.load(f)
                logger.info(
                    f"Resuming from checkpoint: "
                    f"{len(self.state.get('completed_seeds', []))} seeds, "
                    f"{len(self.state.get('completed_websites', []))} websites already done"
                )
            except (json.JSONDecodeError, OSError) as e:
                logger.warning(f"Could not read checkpoint file ({e}); starting fresh")

    def _save(self):
        os.makedirs(os.path.dirname(self.path) or ".", exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(self.state, f, indent=2)

    def is_seed_done(self, seed_url: str) -> bool:
        with _lock:
            return seed_url in self.state["completed_seeds"]

    def mark_seed_done(self, seed_url: str):
        with _lock:
            if seed_url not in self.state["completed_seeds"]:
                self.state["completed_seeds"].append(seed_url)
                self._save()

    def is_website_done(self, website_url: str) -> bool:
        with _lock:
            return website_url in self.state["completed_websites"]

    def mark_website_done(self, website_url: str):
        with _lock:
            if website_url not in self.state["completed_websites"]:
                self.state["completed_websites"].append(website_url)
                self._save()
