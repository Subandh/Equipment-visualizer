import json
from pathlib import Path

APP_DIR = Path.home() / ".chemical_visualizer"
TOKEN_FILE = APP_DIR / "auth.json"

def save_token(token: str) -> None:
    APP_DIR.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(json.dumps({"token": token}), encoding="utf-8")

def load_token() -> str | None:
    if not TOKEN_FILE.exists():
        return None
    try:
        data = json.loads(TOKEN_FILE.read_text(encoding="utf-8"))
        return data.get("token")
    except Exception:
        return None

def clear_token() -> None:
    if TOKEN_FILE.exists():
        TOKEN_FILE.unlink()
