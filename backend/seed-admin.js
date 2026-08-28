/**
 * seed-admin.js — Run once to create the admin account
 * Usage: node seed-admin.js
 *
 * Make sure your MONGO_URI is set in .env before running.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./src/models/User");

const ADMIN_NAME     = "Admin";
const ADMIN_EMAIL    = "admin@interviewhub.com";    // ← change this
const ADMIN_PASSWORD = "Admin@123456";               // ← change this

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("✅ Existing user promoted to admin:", ADMIN_EMAIL);
    } else {
      console.log("ℹ️  Admin already exists:", ADMIN_EMAIL);
    }
    return mongoose.disconnect();
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name:     ADMIN_NAME,
    email:    ADMIN_EMAIL,
    password: hashed,
    role:     "admin",
  });

  console.log("✅ Admin created successfully!");
  console.log("   Email   :", ADMIN_EMAIL);
  console.log("   Password:", ADMIN_PASSWORD);
  console.log("   ⚠️  Change your password after first login!");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  mongoose.disconnect();
});
