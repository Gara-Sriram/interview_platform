const mongoose = require("mongoose");
const { randomBytes } = require("crypto");

// Subdocument for the problem attached to a session
const problemSchema = new mongoose.Schema({
  problemId:   { type: Number },
  title:       { type: String },
  difficulty:  { type: String, enum: ["easy", "medium", "hard"] },
  description: { type: String },
}, { _id: false });

// Subdocument for AI review result
const reviewSchema = new mongoose.Schema({
  score:          { type: Number },           // out of 10
  correctness:    { type: String },
  timeComplexity: { type: String },
  spaceComplexity:{ type: String },
  codeQuality:    { type: String },
  approach:       { type: String },
  strengths:      [{ type: String }],
  improvements:   [{ type: String }],
  summary:        { type: String },
  generatedAt:    { type: Date, default: Date.now },
}, { _id: false });

const sessionSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      default: () => randomBytes(4).toString("hex"),
    },

    title: {
      type: String,
      default: "Interview Session",
      trim: true,
    },

    // Interviewer who created the session
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional problem attached by interviewer
    problem: {
      type: problemSchema,
      default: null,
    },

    language: {
      type: String,
      default: "javascript",
      enum: ["javascript", "python", "java", "cpp", "typescript"],
    },

    code: {
      type: String,
      default: "// Start coding here...",
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    // AI-generated review (stored after generation so it's not re-run every time)
    aiReview: {
      type: reviewSchema,
      default: null,
    },

    // Track who joined
    participants: [
      {
        user:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
