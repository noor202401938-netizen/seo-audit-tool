import subprocess
import sys
import os

# Test 1: shell=True with list (the current buggy way)
print("=== TEST 1: shell=True with list (current code) ===")
cmd = ["seomator.cmd", "audit", "https://example.com", "--format", "json"]
r = subprocess.run(cmd, capture_output=True, text=True, shell=True)
print(f"Return code: {r.returncode}")
print(f"Stdout length: {len(r.stdout)}")
print(f"Stderr: {r.stderr[:300]!r}")
print(f"Stdout[:100]: {r.stdout[:100]!r}")

print()

# Test 2: shell=True with a string (correct for Windows .cmd)
print("=== TEST 2: shell=True with string ===")
cmd_str = "seomator.cmd audit https://example.com --format json"
r2 = subprocess.run(cmd_str, capture_output=True, text=True, shell=True)
print(f"Return code: {r2.returncode}")
print(f"Stdout length: {len(r2.stdout)}")
print(f"Stderr: {r2.stderr[:300]!r}")
print(f"Stdout[:100]: {r2.stdout[:100]!r}")

print()

# Test 3: shell=False with .cmd (Windows needs shell=True for .cmd)
print("=== TEST 3: shell=False with .cmd path ===")
npm_prefix = os.path.join(os.environ.get("APPDATA", ""), "npm")
cmd_path = os.path.join(npm_prefix, "seomator.cmd")
print(f"seomator path: {cmd_path}, exists: {os.path.exists(cmd_path)}")
try:
    r3 = subprocess.run(
        [cmd_path, "audit", "https://example.com", "--format", "json"],
        capture_output=True, text=True, shell=False
    )
    print(f"Return code: {r3.returncode}")
    print(f"Stdout length: {len(r3.stdout)}")
    print(f"Stderr: {r3.stderr[:300]!r}")
except Exception as e:
    print(f"Exception: {e}")

print()

# Test 4: Use node directly to bypass .cmd issues
print("=== TEST 4: call node directly ===")
try:
    node_script = os.path.join(npm_prefix, "node_modules", "seomator", "dist", "cli.js")
    if not os.path.exists(node_script):
        # Try alternate path
        node_script = os.path.join(npm_prefix, "node_modules", ".bin", "seomator")
    print(f"Node script: {node_script}, exists: {os.path.exists(node_script)}")
    r4 = subprocess.run(
        ["node", node_script, "audit", "https://example.com", "--format", "json"],
        capture_output=True, text=True, shell=False
    )
    print(f"Return code: {r4.returncode}")
    print(f"Stdout length: {len(r4.stdout)}")
    print(f"Stderr: {r4.stderr[:300]!r}")
except Exception as e:
    print(f"Exception: {e}")
