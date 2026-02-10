import requests
from typing import Any
from .auth_store import load_token

API_BASE = "http://127.0.0.1:8000/api"

class ApiError(Exception):
    pass

def _headers() -> dict:
    token = load_token()
    return {"Authorization": f"Token {token}"} if token else {}

def login(username: str, password: str) -> str:
    url = f"{API_BASE}/auth/token/"
    res = requests.post(url, json={"username": username, "password": password}, timeout=20)
    if res.status_code != 200:
        raise ApiError(res.text)
    return res.json()["token"]

def upload_csv(filepath: str) -> dict[str, Any]:
    url = f"{API_BASE}/upload/"
    with open(filepath, "rb") as f:
        files = {"file": (filepath.split("\\")[-1], f, "text/csv")}
        res = requests.post(url, headers=_headers(), files=files, timeout=60)
    if not res.ok:
        raise ApiError(res.text)
    return res.json()

def get_history() -> list[dict[str, Any]]:
    url = f"{API_BASE}/history/"
    res = requests.get(url, headers=_headers(), timeout=20)
    if not res.ok:
        raise ApiError(res.text)
    return res.json()

def get_dataset_by_name(name: str) -> dict[str, Any]:
    url = f"{API_BASE}/datasets/by-name/"
    res = requests.get(url, headers=_headers(), params={"name": name}, timeout=30)
    if not res.ok:
        raise ApiError(res.text)
    return res.json()
