import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // logged-in user object
  const [loading, setLoading] = useState(true); // true while checking cookie on app load

  // On first load, call /api/auth/me to check if the cookie is still valid.
  // If it is, user is auto-logged-in. If not, user is null → redirect to login.
  useEffect(() => {
    api.get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    setUser(res.data.user);
    return res.data.user; // return so the component can redirect based on role
  };

  const register = async (name, email, password, role) => {
    const res = await api.post("/api/auth/register", { name, email, password, role });
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — components call useAuth() instead of useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);
