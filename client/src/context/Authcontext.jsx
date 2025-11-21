// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "../api/auth";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

const STORAGE_KEY = "subscription_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // hydrate from localStorage on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { token: t, user: u } = JSON.parse(raw);
        if (t) setToken(t);
        if (u) setUser(u);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  async function login({ email, password }) {
    try {
      const data = await loginApi({ email, password });
      const { token: t, user: u } = data;
      if (!t || !u) throw new Error("Invalid login response");

      setToken(t);
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }));

      return { success: true, user: u };
    } catch (err) {
      const message =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err.message ||
        "Login failed";
      return { success: false, message };
    }
  }

  async function register({ name, email, password }) {
    try {
      const data = await registerApi({ name, email, password });
      // If backend also returns token + user, you can auto-login:
      const { token: t, user: u } = data;

      if (t && u) {
        setToken(t);
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }));
      }

      return { success: true, ...data };
    } catch (err) {
      const message =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err.message ||
        "Registration failed";
      return { success: false, message };
    }
  }

  function logout(redirectTo = "/login") {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate(redirectTo);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
