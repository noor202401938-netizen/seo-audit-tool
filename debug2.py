import subprocess
import sys

url = "https://noor202401938.github.io"
cmd = ["seomator.cmd", "audit", url, "--format", "json"]

print(f"Testing URL: {url}")
print(f"Command: {cmd}")
print(f"shell=True with list (current code)...")

r = subprocess.run(cmd, capture_output=True, text=True, shell=True)
print(f"Return code: {r.returncode}")
print(f"Stdout length: {len(r.stdout)}")
print(f"Stderr repr: {r.stderr[:500]!r}")
if r.stdout:
    import json
    try:
        d = json.loads(r.stdout)
        print(f"JSON parsed OK - overallScore: {d.get('overallScore')}")
    except Exception as e:
        print(f"JSON parse error: {e}")
        print(f"Stdout[:300]: {r.stdout[:300]}")
