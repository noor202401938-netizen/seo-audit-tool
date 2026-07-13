import os
from pathlib import Path

def _load_env_file(path: Path):
    if not path.exists():
        return

    with path.open("r", encoding="utf-8") as file_handle:
        for raw_line in file_handle:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            if key and key not in os.environ:
                os.environ[key] = value

_load_env_file(Path(__file__).resolve().with_name(".env"))

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

LOG_DIR = "logs"
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG_FILE = os.path.join(LOG_DIR, "app.log")
