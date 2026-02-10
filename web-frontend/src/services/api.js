// src/services/api.js
// Real backend integration (Django + DRF TokenAuth)
// ✅ Adds login() so you don't manually paste token every time.

const API_BASE = "http://127.0.0.1:8000/api";

// ---- Token helpers ----
function getToken() {
  return localStorage.getItem("authToken") || "";
}

function setToken(token) {
  localStorage.setItem("authToken", token);
}

function clearToken() {
  localStorage.removeItem("authToken");
}

function getHeaders(extra = {}) {
  const token = getToken();
  const auth = token ? { Authorization: `Token ${token}` } : {};
  return { ...auth, ...extra };
}

function requireToken() {
  const token = getToken();
  if (!token) {
    throw new Error("Not logged in. Please login to get a token.");
  }
  return token;
}

// ---- Error helper (shows DRF "detail") ----
async function handleError(res) {
  try {
    const data = await res.json();
    return data.detail || data.error || JSON.stringify(data);
  } catch {
    const text = await res.text().catch(() => "");
    return text || `HTTP ${res.status}`;
  }
}

export const api = {
  // ✅ POST /api/auth/token/
  // Body: {username, password}
  // Returns: token string and stores it in localStorage
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/token/`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error(await handleError(res));

    const data = await res.json();
    if (!data?.token) throw new Error("No token returned from server.");

    setToken(data.token);
    return data.token;
  },

  // optional convenience
  logout() {
    clearToken();
  },

  // Optional: quick debug to confirm token auth is working
  async authCheck() {
    requireToken();

    const res = await fetch(`${API_BASE}/history/`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error(await handleError(res));
    return res.json();
  },

  // POST /api/upload/
  async uploadCsv(file) {
    requireToken();

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_BASE}/upload/`, {
      method: "POST",
      headers: getHeaders(), // ✅ DO NOT set Content-Type manually with FormData
      body: form,
    });

    if (!res.ok) throw new Error(await handleError(res));

    const data = await res.json();

    // Save upload history locally (same as your current behavior)
    const prev = JSON.parse(localStorage.getItem("uploadHistory") || "[]");
    const updated = [
      {
        name: data.dataset_meta?.name ?? file?.name ?? "Uploaded Dataset",
        uploadedAt: data.dataset_meta?.uploadedAt ?? new Date().toLocaleString(),
      },
      ...prev,
    ].slice(0, 5);

    localStorage.setItem("uploadHistory", JSON.stringify(updated));

    return data; // {dataset_meta, summary, distribution, table}
  },

  // GET /api/history/
  async getHistory() {
    try {
      requireToken();

      const res = await fetch(`${API_BASE}/history/`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(await handleError(res));

      const data = await res.json();

      // Convert backend format → UI format
      const simplified = (data || []).map((x) => ({
        name: x.name,
        uploadedAt: x.uploadedAt,
      }));

      // Keep local storage synced (optional)
      localStorage.setItem("uploadHistory", JSON.stringify(simplified.slice(0, 5)));

      return simplified;
    } catch {
      // fallback to localStorage if backend fails
      return JSON.parse(localStorage.getItem("uploadHistory") || "[]");
    }
  },

  // GET /api/datasets/by-name/?name=...
  async getDatasetByName(name) {
    requireToken();

    const res = await fetch(
      `${API_BASE}/datasets/by-name/?name=${encodeURIComponent(name)}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!res.ok) throw new Error(await handleError(res));

    const data = await res.json();

    // Dashboard expects SAME SHAPE as uploadCsv()
    return {
      dataset_meta: {
        name,
        // best-effort display; real uploadedAt comes from History/Upload meta
        uploadedAt: new Date().toLocaleString(),
      },
      summary: data.summary,
      distribution: data.distribution,
      table: data.table,
    };
  },
};
