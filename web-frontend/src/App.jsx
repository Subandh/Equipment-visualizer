import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Navbar from "./components/Navbar";

// Keeps token reactive (so login/logout updates routes without refresh)
function useAuthToken() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("authToken"));

    // Triggered when token changes in another tab
    window.addEventListener("storage", syncToken);

    // Triggered when we change token in this tab (we'll dispatch manually from Login/Logout)
    window.addEventListener("authTokenChanged", syncToken);

    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("authTokenChanged", syncToken);
    };
  }, []);

  return token;
}

// Wrapper to protect routes
function RequireAuth({ token, children }) {
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default function App() {
  const token = useAuthToken();

  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ padding: 16 }}>
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={
              token ? <Navigate to="/upload" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* Login route */}
          <Route
            path="/login"
            element={token ? <Navigate to="/upload" replace /> : <Login />}
          />

          {/* Protected routes */}
          <Route
            path="/upload"
            element={
              <RequireAuth token={token}>
                <Upload />
              </RequireAuth>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RequireAuth token={token}>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/history"
            element={
              <RequireAuth token={token}>
                <History />
              </RequireAuth>
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={<Navigate to={token ? "/upload" : "/login"} replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
