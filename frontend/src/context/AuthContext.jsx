import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore session on mount by calling /auth/me
  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoaded(true));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    setUser(res.data);
    return res.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await axiosInstance.post("/auth/register", { name, email, password });
    setUser(res.data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Main auth hook — exposes user, isLoaded, login, register, logout */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Drop-in replacement for Clerk's useUser() */
export function useUser() {
  const { user, isLoaded } = useAuth();
  return { user, isLoaded, isSignedIn: !!user };
}
