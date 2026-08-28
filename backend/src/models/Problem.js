const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
  input:       { type: String, required: true },
  output:      { type: String, required: true },
  explanation: { type: String, default: "" },
}, { _id: false });

const testCaseSchema = new mongoose.Schema({
  input:    { type: String, required: true },
  expected: { type: String, required: true },
}, { _id: false });

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    tags: [{ type: String, trim: true }],

    description: {
      type: String,
      required: true,
    },

    examples:    [exampleSchema],
    constraints: [{ type: String }],
    testCases:   [testCaseSchema],

    starterCode: {
      javascript: { type: String, default: "// Write your solution here\n" },
      python:     { type: String, default: "# Write your solution here\n" },
      java:       { type: String, default: "// Write your solution here\n" },
      cpp:        { type: String, default: "// Write your solution here\n" },
      typescript: { type: String, default: "// Write your solution here\n" },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
