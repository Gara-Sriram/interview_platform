const express = require("express");
const router  = express.Router();
const { createProblem, getProblems, getProblemById, updateProblem, deleteProblem } = require("../controllers/problem.controller");
const { protect }    = require("../middleware/auth.middleware");
const { adminOnly }  = require("../middleware/admin.middleware");

router.get("/",    protect, getProblems);           // any logged-in user
router.get("/:id", protect, getProblemById);         // any logged-in user

router.post("/",      protect, adminOnly, createProblem);   // admin only
router.put("/:id",    protect, adminOnly, updateProblem);   // admin only
router.delete("/:id", protect, adminOnly, deleteProblem);   // admin only

module.exports = router;
