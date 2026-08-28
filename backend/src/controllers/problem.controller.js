const Problem = require("../models/Problem");

// ------------------------------------------------------------------
// @desc    Create a new problem
// @route   POST /api/problems
// @access  Admin only
// ------------------------------------------------------------------
const createProblem = async (req, res) => {
  try {
    const { title, difficulty, tags, description, examples, constraints, testCases, starterCode } = req.body;

    if (!title || !difficulty || !description) {
      return res.status(400).json({ success: false, message: "Title, difficulty and description are required" });
    }

    const problem = await Problem.create({
      title,
      difficulty,
      tags:        tags        || [],
      description,
      examples:    examples    || [],
      constraints: constraints || [],
      testCases:   testCases   || [],
      starterCode: starterCode || {},
      createdBy:   req.user._id,
    });

    res.status(201).json({ success: true, problem });
  } catch (err) {
    console.error("Create problem error:", err.message);
    res.status(500).json({ success: false, message: "Failed to create problem" });
  }
};

// ------------------------------------------------------------------
// @desc    Get all problems (for practice sheet)
// @route   GET /api/problems
// @access  Protected (any logged-in user)
// ------------------------------------------------------------------
const getProblems = async (req, res) => {
  try {
    const { difficulty, tag } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (tag)        filter.tags = tag;

    const problems = await Problem.find(filter)
      .select("title difficulty tags createdAt")
      .sort({ createdAt: 1 });

    res.json({ success: true, problems });
  } catch (err) {
    console.error("Get problems error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// @desc    Get a single problem by ID
// @route   GET /api/problems/:id
// @access  Protected
// ------------------------------------------------------------------
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.json({ success: true, problem });
  } catch (err) {
    console.error("Get problem error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// @desc    Update a problem
// @route   PUT /api/problems/:id
// @access  Admin only
// ------------------------------------------------------------------
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.json({ success: true, problem });
  } catch (err) {
    console.error("Update problem error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update problem" });
  }
};

// ------------------------------------------------------------------
// @desc    Delete a problem
// @route   DELETE /api/problems/:id
// @access  Admin only
// ------------------------------------------------------------------
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.json({ success: true, message: "Problem deleted" });
  } catch (err) {
    console.error("Delete problem error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete problem" });
  }
};

module.exports = { createProblem, getProblems, getProblemById, updateProblem, deleteProblem };
