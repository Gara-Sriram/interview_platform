import { io } from "socket.io-client";

// ONE socket instance reused across the app.
// transports: ["websocket"] — skip long-polling entirely.
// On Render free tier, long-polling causes sync issues across different networks.
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"],       // force WebSocket — no polling fallback
  withCredentials: true,           // send cookies with socket handshake
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
