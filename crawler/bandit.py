"""
crawler/bandit.py
Reinforcement Learning Multi-Armed Bandit model (Thompson Sampling)
to prioritize URL queues based on dynamic extraction goals.
"""

import json
import threading
import os
from urllib.parse import urlsplit
import random

class URLBandit:
    def __init__(self, model_path="output/bandit_model.json"):
        self.model_path = model_path
        self._lock = threading.Lock()
        # memory: dict mapping keyword -> {"successes": int, "failures": int}
        # default alpha (success) = 1, beta (failure) = 1 (uniform prior)
        self.memory = {}
        self.load()

    def load(self):
        with self._lock:
            if os.path.exists(self.model_path):
                try:
                    with open(self.model_path, "r", encoding="utf-8") as f:
                        self.memory = json.load(f)
                except Exception:
                    self.memory = {}

    def save(self):
        with self._lock:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            with open(self.model_path, "w", encoding="utf-8") as f:
                json.dump(self.memory, f, indent=2)

    def _get_keywords(self, url: str) -> list:
        path = urlsplit(url).path.lower()
        parts = [p for p in path.replace("-", "/").replace("_", "/").split("/") if p and len(p) > 2]
        return parts

    def score_url(self, url: str) -> float:
        """
        Calculates the priority score for a URL using Thompson Sampling.
        Returns a sampled value from the Beta distribution of the URL's keywords.
        Higher score means higher priority.
        """
        keywords = self._get_keywords(url)
        if not keywords:
            # Baseline exploration for root/unknown paths
            return random.betavariate(1, 1)

        scores = []
        with self._lock:
            for kw in keywords:
                stats = self.memory.get(kw, {"successes": 1, "failures": 1})
                # Thompson sampling: random sample from Beta(successes, failures)
                sampled_score = random.betavariate(stats["successes"], stats["failures"])
                scores.append(sampled_score)
        
        # Max score among keywords gives a chance to highly performant keywords
        return max(scores) if scores else random.betavariate(1, 1)

    def update_reward(self, url: str, reward: float):
        """
        Updates the success/failure counts for the URL's keywords based on the reward.
        If reward > 0, it counts as a success (weighted by reward magnitude).
        If reward <= 0, it counts as a failure.
        """
        keywords = self._get_keywords(url)
        if not keywords:
            return

        with self._lock:
            for kw in keywords:
                if kw not in self.memory:
                    self.memory[kw] = {"successes": 1, "failures": 1}
                
                if reward > 0:
                    self.memory[kw]["successes"] += reward
                else:
                    self.memory[kw]["failures"] += 1

        self.save()
