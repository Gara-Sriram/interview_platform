const Session = require("../models/Session");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // ------------------------------------------------------------------
    // EVENT: join-room
    // Fired when a user opens a session URL.
    // We add them to the Socket.IO room for that session.
    // Then we send them the current code + language from DB
    // so they're in sync even if code was typed before they joined.
    // ------------------------------------------------------------------
    socket.on("join-room", async ({ roomId, userName }) => {
      try {
        // Join this socket to the room identified by roomId
        socket.join(roomId);

        // Store roomId and userName on socket for use in disconnect
        socket.roomId = roomId;
        socket.userName = userName || "Anonymous";

        console.log(`👤 ${socket.userName} joined room ${roomId}`);

        // Fetch the current session from DB and send it to the new joiner
        const session = await Session.findOne({ roomId });
        if (session) {
          // Send current state ONLY to the user who just joined
          socket.emit("session-state", {
            code: session.code,
            language: session.language,
          });
        }

        // Notify OTHERS in the room that someone joined
        // (so frontend can show "Candidate joined" toast)
        socket.to(roomId).emit("user-joined", {
          userName: socket.userName,
          socketId: socket.id,
        });
      } catch (err) {
        console.error("join-room error:", err.message);
      }
    });

    // ------------------------------------------------------------------
    // EVENT: code-change
    // Fired every time the user types in the Monaco editor.
    // We broadcast the new code to everyone else in the room.
    // We also save to DB so new joiners get the latest code.
    // ------------------------------------------------------------------
    socket.on("code-change", async ({ roomId, code }) => {
      try {
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(roomId).emit("code-update", { code });

        // Save the latest code to DB (debounced on client side)
        await Session.findOneAndUpdate({ roomId }, { code });
      } catch (err) {
        console.error("code-change error:", err.message);
      }
    });

    // ------------------------------------------------------------------
    // EVENT: language-change
    // Fired when user changes the language dropdown in Monaco editor.
    // Broadcast the new language to everyone in the room.
    // ------------------------------------------------------------------
    socket.on("language-change", async ({ roomId, language }) => {
      try {
        // Broadcast to everyone in the room INCLUDING sender
        // (so all tabs/users see the same language)
        io.to(roomId).emit("language-update", { language });

        // Save language to DB
        await Session.findOneAndUpdate({ roomId }, { language });
      } catch (err) {
        console.error("language-change error:", err.message);
      }
    });

    // ------------------------------------------------------------------
    // EVENT: disconnect
    // Fired automatically when a user closes the tab or loses connection.
    // We notify others in the room.
    // ------------------------------------------------------------------
    socket.on("disconnect", () => {
      console.log(`❌ ${socket.userName || "User"} disconnected from room ${socket.roomId}`);

      if (socket.roomId) {
        // Notify remaining users in the room
        socket.to(socket.roomId).emit("user-left", {
          userName: socket.userName,
          socketId: socket.id,
        });
      }
    });
  });
};
