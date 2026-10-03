import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { currentAdminRequest, loginRequest, logoutRequest, signupRequest } from "../api/authApi";

const AuthContext = createContext(null);

// status: "loading" (checking cookie) | "authenticated" | "guest"
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState("loading");

  // Runs on every page load: the cookie is still there after a refresh, so we restore the session.
  useEffect(() => {
    let cancelled = false;
    currentAdminRequest()
      .then((data) => {
        if (cancelled) return;
        setAdmin(data.admin);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        setAdmin(null);
        setStatus("guest");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await loginRequest(identifier, password);
    setAdmin(data.admin);
    setStatus("authenticated");
  }, []);

  // Returns { pending } so the signup page can show an "awaiting approval" message
  const signup = useCallback(async (fields) => {
    const data = await signupRequest(fields);
    if (!data.pending) {
      setAdmin(data.admin);
      setStatus("authenticated");
    }
    return { pending: data.pending, message: data.message };
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAdmin(null);
      setStatus("guest");
    }
  }, []);

  return <AuthContext.Provider value={{ admin, status, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}