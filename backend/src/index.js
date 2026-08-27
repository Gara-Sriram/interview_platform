// Load environment variables from .env file FIRST before anything else
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser"); // needed for req.cookies to work

const app = express();

// -------------------------------------------------------------------
// MIDDLEWARES
// -------------------------------------------------------------------

// credentials: true → browser sends httpOnly cookie on every request
const CLIENT_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies — required for req.cookies.token in auth middleware
app.use(cookieParser());

// -------------------------------------------------------------------
// HTTP SERVER
// We wrap Express in a raw HTTP server because Socket.IO needs to
// attach to the same server instance — not just the Express app.
// -------------------------------------------------------------------
const server = http.createServer(app);

// -------------------------------------------------------------------
// SOCKET.IO
// Attach Socket.IO to the HTTP server.
// We set the same CORS config so browser WebSocket connections work.
// -------------------------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// -------------------------------------------------------------------
// ROUTES
// We will import and attach route files here as we build them.
// -------------------------------------------------------------------
const sessionRoutes = require("./routes/session.routes");
const authRoutes    = require("./routes/auth.routes");
const executeRoutes = require("./routes/execute.routes");
const reviewRoutes  = require("./routes/review.routes");

app.use("/api/sessions", sessionRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/execute",  executeRoutes);
app.use("/api/sessions", reviewRoutes);  // POST /api/sessions/:roomId/review

// -------------------------------------------------------------------
// SOCKET EVENTS
// We import all socket logic from a separate file to keep index.js clean.
// -------------------------------------------------------------------
require("./socket/index")(io);

// -------------------------------------------------------------------
// HEALTH CHECK
// Simple GET /health to verify the server is alive.
// -------------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// -------------------------------------------------------------------
// MONGODB CONNECTION + SERVER START
// We connect to MongoDB first, and only THEN start listening.
// This prevents the server from accepting requests before DB is ready.
// -------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop the app — no point running without a database
  });
