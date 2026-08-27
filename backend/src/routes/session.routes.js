const express = require("express");
const router  = express.Router();
const {
  createSession,
  getSessions,
  getSessionByRoomId,
  getSessionForReview,
  endSession,
} = require("../controllers/session.controller");
const { generateReview } = require("../controllers/review.controller");
const { protect, interviewerOnly } = require("../middleware/auth.middleware");

// ── Session CRUD ────────────────────────────────────────────────────
router.post("/",                   protect, interviewerOnly, createSession);
router.get("/",                    protect, getSessions);
router.get("/:roomId",             protect, getSessionByRoomId);
router.get("/:roomId/review-info", protect, getSessionForReview);  // bypasses status check
router.patch("/:roomId/end",       protect, interviewerOnly, endSession);

// ── AI Review ────────────────────────────────────────────────────────
router.post("/:roomId/review",     protect, generateReview);

module.exports = router;
