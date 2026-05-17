import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Single source of truth — check session from server
  const checkSession = useCallback(async () => {
    try {
      const res = await axios.get(API + "/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  // Check on mount
  useEffect(() => {
    checkSession().finally(() => setLoading(false));
  }, [checkSession]);

  // ← Re-check session when tab becomes visible again
  // This fixes the desktop mode / mobile mode viewport switch issue:
  // When browser switches viewport, React re-mounts and /me is called
  // If cookie was cleared, user is null → redirect to /auth
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [checkSession]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(API + "/signin", { email, password });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Login failed." };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(API + "/signup", { fullname: name, email, password });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Registration failed." };
    }
  };

  const loginWithGoogle = () => {
    window.open(API + "/auth/google", "_self");
  };

  const logout = async () => {
    try {
      await axios.post(API + "/logout");
    } catch (_) {}
    // Always clear user state regardless of server response
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};