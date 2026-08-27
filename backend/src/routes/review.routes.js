const express = require("express");
const router  = express.Router();
const { generateReview } = require("../controllers/review.controller");
const { protect }        = require("../middleware/auth.middleware");

// POST /api/sessions/:roomId/review
router.post("/:roomId/review", protect, generateReview);

module.exports = router;
