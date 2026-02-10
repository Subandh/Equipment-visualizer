const API_BASE = "http://127.0.0.1:8000/api";

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");

  // ✅ store token for later API calls
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("authUser", JSON.stringify(data.user || {}));
  return data;
}

export function logoutLocal() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}

export function getToken() {
  return localStorage.getItem("authToken") || "";
}
