import express from "express";
import { executeCode, getCodeRuntimes } from "../controllers/codeController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/runtimes", protectRoute, getCodeRuntimes);
router.post("/execute", protectRoute, executeCode);

export default router;
