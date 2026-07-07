"""
utils/deduplicator.py
Thread-safe in-memory dedup sets used during a crawl run, plus
helpers to dedup a final list of dict records by a key field.
"""

import threading


class SeenSet:
    """A thread-safe 'have I processed this already' set."""

    def __init__(self):
        self._lock = threading.Lock()
        self._seen = set()

    def add_if_new(self, key: str) -> bool:
        """Returns True if key was newly added (i.e. not seen before)."""
        if not key:
            return False
        with self._lock:
            if key in self._seen:
                return False
            self._seen.add(key)
            return True

    def __contains__(self, key):
        with self._lock:
            return key in self._seen

    def __len__(self):
        with self._lock:
            return len(self._seen)


def dedup_records(records: list, key_fields) -> list:
    """
    Deduplicate a list of dict records by one or more key fields.
    Keeps the first occurrence, merges non-empty values from later duplicates.
    """
    if isinstance(key_fields, str):
        key_fields = [key_fields]

    seen = {}
    order = []

    for rec in records:
        key = tuple(rec.get(f, "") for f in key_fields)
        if key in seen:
            # merge: fill in any blanks in the existing record
            existing = seen[key]
            for k, v in rec.items():
                if v and not existing.get(k):
                    existing[k] = v
        else:
            seen[key] = dict(rec)
            order.append(key)

    return [seen[k] for k in order]
