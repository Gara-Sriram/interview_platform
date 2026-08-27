import { io } from "socket.io-client";

// Use VITE_SOCKET_URL if set, otherwise fall back to VITE_API_URL, then localhost.
// This way if you forget to set VITE_SOCKET_URL in Vercel, it still works
// as long as VITE_API_URL is set.
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL    ||
  "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  // Allow both WebSocket AND polling — polling is fallback if WS fails.
  // Forcing websocket-only causes silent failures on some Render setups.
  transports: ["websocket", "polling"],
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
