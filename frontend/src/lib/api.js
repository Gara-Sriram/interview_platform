import axios from "axios";

// Single axios instance used across the whole app.
// withCredentials: true → browser automatically sends the httpOnly cookie
// with every request (required for cookie-based auth to work cross-origin)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

export default api;
