import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

// Send cookies with every request
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← loading while checking session

  // On app load — check if user has a valid cookie
  useEffect(() => {
    axios
      .get(`${API}/me`)
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/signin`, { email, password });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed.",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API}/signup`, {
        fullname: name,
        email,
        password,
      });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed.",
      };
    }
  };

  const loginWithGoogle = () => {
    window.open(`${API}/auth/google`, "_self");
  };

  const logout = async () => {
    await axios.post(`${API}/logout`);
    setUser(null);
  };

  // Show nothing while checking session — prevents flash of login page
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div className="spinner" />
      </div>
    );

  return (
    <AuthContext.Provider
      value={{ user, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
