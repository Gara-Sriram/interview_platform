const express = require("express");
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionByRoomId,
  getSessionForReview,
  endSession,
} = require("../controllers/session.controller");
const { protect, interviewerOnly } = require("../middleware/auth.middleware");

router.post("/",                    protect, interviewerOnly, createSession);
router.get("/",                     protect, getSessions);
router.get("/:roomId",              protect, getSessionByRoomId);
router.get("/:roomId/review-info",  protect, getSessionForReview);  // no status check
router.patch("/:roomId/end",        protect, interviewerOnly, endSession);

module.exports = router;
