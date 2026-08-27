const Session = require("../models/Session");

// In-memory chat history per room (cleared on server restart)
// For a production app you'd persist to MongoDB
const chatHistory = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // ------------------------------------------------------------------
    // join-room
    // ------------------------------------------------------------------
    socket.on("join-room", async ({ roomId, userName }) => {
      try {
        socket.join(roomId);
        socket.roomId  = roomId;
        socket.userName = userName || "Anonymous";

        console.log(`👤 ${socket.userName} joined room ${roomId}`);

        // Send current editor state to the newly joined user
        const session = await Session.findOne({ roomId });
        if (session) {
          socket.emit("session-state", {
            code:     session.code,
            language: session.language,
          });
        }

        // Send existing chat history to the newly joined user
        if (chatHistory[roomId]) {
          socket.emit("chat-history", chatHistory[roomId]);
        }

        // Notify others in room
        socket.to(roomId).emit("user-joined", {
          userName: socket.userName,
          socketId: socket.id,
        });
      } catch (err) {
        console.error("join-room error:", err.message);
      }
    });

    // ------------------------------------------------------------------
    // code-change
    // ------------------------------------------------------------------
    socket.on("code-change", async ({ roomId, code }) => {
      try {
        socket.to(roomId).emit("code-update", { code });
        await Session.findOneAndUpdate({ roomId }, { code });
      } catch (err) {
        console.error("code-change error:", err.message);
      }
    });

    // ------------------------------------------------------------------
    // language-change
    // ------------------------------------------------------------------
    socket.on("language-change", async ({ roomId, language }) => {
      try {
        io.to(roomId).emit("language-update", { language });
        await Session.findOneAndUpdate({ roomId }, { language });
      } catch (err) {
        console.error("language-change error:", err.message);
      }
    });

    // ------------------------------------------------------------------
    // chat-message — store + broadcast to everyone in room
    // ------------------------------------------------------------------
    socket.on("chat-message", ({ roomId, message }) => {
      const msg = {
        id:       Date.now(),
        userName: socket.userName,
        message:  message.trim(),
        time:     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Store in memory
      if (!chatHistory[roomId]) chatHistory[roomId] = [];
      chatHistory[roomId].push(msg);

      // Broadcast to ALL in room (including sender for confirmation)
      io.to(roomId).emit("chat-message", msg);
    });

    // ------------------------------------------------------------------
    // WebRTC Signaling
    // ------------------------------------------------------------------
    socket.on("webrtc-offer",          ({ roomId, offer })     => socket.to(roomId).emit("webrtc-offer",          { offer, from: socket.id }));
    socket.on("webrtc-answer",         ({ roomId, answer })    => socket.to(roomId).emit("webrtc-answer",         { answer }));
    socket.on("webrtc-ice-candidate",  ({ roomId, candidate }) => socket.to(roomId).emit("webrtc-ice-candidate",  { candidate }));

    // ------------------------------------------------------------------
    // disconnect
    // ------------------------------------------------------------------
    socket.on("disconnect", () => {
      console.log(`❌ ${socket.userName || "User"} disconnected`);
      if (socket.roomId) {
        socket.to(socket.roomId).emit("user-left",      { userName: socket.userName, socketId: socket.id });
        socket.to(socket.roomId).emit("webrtc-peer-left");
      }
    });
  });
};
