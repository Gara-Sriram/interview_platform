const express = require("express");
const router = express.Router();
const { executeCode } = require("../controllers/execute.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, executeCode);

module.exports = router;
