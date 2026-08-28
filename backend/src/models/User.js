const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Stored as a bcrypt hash — plain text password is never saved
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // interviewer → create sessions, pick problems
    // student     → join sessions, practice problems
    // admin       → manage problems, full access
    role: {
      type: String,
      enum: ["interviewer", "student", "admin"],
      required: [true, "Role is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
