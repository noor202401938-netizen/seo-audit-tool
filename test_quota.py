"""Self-check: the conditional-decrement credit reservation never overspends.

Mirrors the atomic UPDATE that api.py runs via Prisma
(`auditsRemaining > 0` guard). If two threads could both win with 1 credit
left, this fails. Run: python test_quota.py
"""
import os
import sqlite3
import tempfile
import threading


def _reserve(conn_str, results, i):
    conn = sqlite3.connect(conn_str, timeout=5)
    try:
        cur = conn.execute(
            "UPDATE sub SET remaining = remaining - 1 WHERE remaining > 0"
        )
        conn.commit()
        results[i] = cur.rowcount  # 1 = got a credit, 0 = denied
    finally:
        conn.close()


def test_no_overspend():
    fd, db = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    keeper = sqlite3.connect(db)
    keeper.execute("PRAGMA journal_mode=WAL")  # allow concurrent writers
    keeper.execute("CREATE TABLE sub (remaining INT)")
    keeper.execute("INSERT INTO sub VALUES (3)")
    keeper.commit()

    n = 10
    results = [None] * n
    threads = [threading.Thread(target=_reserve, args=(db, results, i)) for i in range(n)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    granted = sum(results)
    remaining = keeper.execute("SELECT remaining FROM sub").fetchone()[0]
    keeper.close()
    os.remove(db)

    assert None not in results, "a thread failed to record its result"
    assert granted == 3, f"expected exactly 3 grants, got {granted}"
    assert remaining == 0, f"expected 0 remaining, got {remaining}"


if __name__ == "__main__":
    test_no_overspend()
    print("OK: 10 concurrent requests, 3 credits -> exactly 3 granted, none negative")
