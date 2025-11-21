// src/api/axios.js
import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: base,
  timeout: 15000,
});

// Attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("subscription_auth");
      if (raw) {
        const { token } = JSON.parse(raw);
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
