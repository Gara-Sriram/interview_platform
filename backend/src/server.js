import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { serve } from "inngest/express";

import { ALLOWED_ORIGINS, ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();
const httpServer = createServer(app); // wrap express in an HTTP server for socket.io

const __dirname = path.resolve();

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      // Allow whitelisted origins from CLIENT_URL env var
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

      // Always allow localhost in any environment (for dev/testing)
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

      // Log blocked origins in production to help diagnose misconfigs
      if (ENV.NODE_ENV === "production") {
        console.warn(`[CORS] Blocked origin: ${origin} | Allowed: ${ALLOWED_ORIGINS.join(", ")}`);
      }

      // Return null (no header) instead of throwing — throwing strips all CORS headers
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
  // Force WebSocket only — Render free tier has no sticky sessions
  // so HTTP long-polling would fail on multi-instance setups
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  // Join a session room — each session gets its own isolated room
  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    // Notify others in the room that someone connected
    socket.to(sessionId).emit("peer-connected");
  });

  // Broadcast code changes to everyone else in the room (not back to sender)
  socket.on("code-change", ({ sessionId, code }) => {
    socket.to(sessionId).emit("code-change", { code });
  });

  // Broadcast language change + the new starter code to reset both editors
  socket.on("language-change", ({ sessionId, language, code }) => {
    socket.to(sessionId).emit("language-change", { language, code });
  });

  // Typing indicator — let the peer know someone is typing
  socket.on("typing-start", ({ sessionId }) => {
    socket.to(sessionId).emit("peer-typing", true);
  });

  socket.on("typing-stop", ({ sessionId }) => {
    socket.to(sessionId).emit("peer-typing", false);
  });

  socket.on("disconnecting", () => {
    // Notify all rooms this socket was in
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("peer-disconnected");
      }
    }
  });
});
// ──────────────────────────────────────────────────────────────────────────────

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    // Listen on httpServer (not app.listen) so socket.io shares the same port
    httpServer.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
