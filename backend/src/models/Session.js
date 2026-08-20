const mongoose = require("mongoose");
const { randomBytes } = require("crypto");

// Subdocument for the problem attached to a session
const problemSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  title:     { type: String },
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

    // Track who joined (student user refs + join time)
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
