import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

router.get("/:id", protectRoute, validateObjectId("id"), getSessionById);
router.post("/:id/join", protectRoute, validateObjectId("id"), joinSession);
router.post("/:id/end", protectRoute, validateObjectId("id"), endSession);

export default router;
