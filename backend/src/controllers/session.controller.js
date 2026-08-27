const Session = require("../models/Session");

// ------------------------------------------------------------------
// @desc    Create a new interview session
// @route   POST /api/sessions
// @access  Protected (Interviewer only)
// ------------------------------------------------------------------
const createSession = async (req, res) => {
  try {
    const { title, language, problem } = req.body;

    const session = await Session.create({
      title:       title    || "Interview Session",
      language:    language || "javascript",
      interviewer: req.user._id,
      problem:     problem  || null,
    });

    res.status(201).json({ success: true, session });
  } catch (err) {
    console.error("Create session error:", err.message);
    res.status(500).json({ success: false, message: "Failed to create session" });
  }
};

// ------------------------------------------------------------------
// @desc    Get all sessions (interviewer: their own, student: joined)
// @route   GET /api/sessions
// @access  Protected
// ------------------------------------------------------------------
const getSessions = async (req, res) => {
  try {
    let sessions;

    if (req.user.role === "interviewer") {
      sessions = await Session.find({ interviewer: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("interviewer", "name email");
    } else {
      sessions = await Session.find({ "participants.user": req.user._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("interviewer", "name email");
    }

    res.json({ success: true, sessions });
  } catch (err) {
    console.error("Get sessions error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// @desc    Get a single session by roomId
// @route   GET /api/sessions/:roomId
// @access  Protected
// ------------------------------------------------------------------
const getSessionByRoomId = async (req, res) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId }).populate(
      "interviewer", "name email"
    );

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // ── Block entry to ended sessions ──────────────────────────────
    if (session.status === "ended") {
      return res.status(410).json({
        success: false,
        message: "This session has ended",
        status: "ended",
      });
    }

    // ── Track student as a participant (only once) ──────────────────
    if (req.user.role === "student") {
      const alreadyIn = session.participants.some(
        (p) => p.user.toString() === req.user._id.toString()
      );
      if (!alreadyIn) {
        session.participants.push({ user: req.user._id });
        await session.save();
      }
    }

    res.json({ success: true, session });
  } catch (err) {
    console.error("Get session error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// @desc    End a session — marks as ended (kept in DB for history)
// @route   PATCH /api/sessions/:roomId/end
// @access  Protected (Interviewer only)
// ------------------------------------------------------------------
const endSession = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { roomId: req.params.roomId, interviewer: req.user._id },
      { status: "ended" },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found or not authorized" });
    }

    res.json({ success: true, session });
  } catch (err) {
    console.error("End session error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createSession, getSessions, getSessionByRoomId, endSession };
