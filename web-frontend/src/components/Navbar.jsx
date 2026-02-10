import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("authToken");
  const isLoggedIn = !!token;

  const linkStyle = (path) => ({
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: pathname === path ? "white" : "#222",
    background: pathname === path ? "#222" : "transparent",
    border: "1px solid #ddd",
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    // notify App.jsx to re-check auth state
    window.dispatchEvent(new Event("authTokenChanged"));

    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: 14,
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ fontWeight: 800 }}>Chemical Visualizer</div>

      {/* Navigation links (only if logged in & not on login page) */}
      {isLoggedIn && pathname !== "/login" && (
        <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
          <Link to="/upload" style={linkStyle("/upload")}>Upload</Link>
          <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
          <Link to="/history" style={linkStyle("/history")}>History</Link>
        </div>
      )}

      {/* Right-side actions */}
      <div style={{ display: "flex", gap: 10, marginLeft: isLoggedIn ? 10 : "auto" }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--btn-bg)",
            color: "var(--btn-text)",
            cursor: "pointer",
          }}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Logout button */}
        {isLoggedIn && pathname !== "/login" && (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
