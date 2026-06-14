import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ENV } from "../lib/env.js";

const isProduction = ENV.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,          // HTTPS only in production
  sameSite: isProduction ? "none" : "strict", // "none" required for cross-domain (Vercel ↔ Render)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

function signToken(userId) {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });

  // Sync new user to Stream
  await upsertStreamUser({
    id: user._id.toString(),
    name: user.name,
    image: user.profileImage,
  });

  const token = signToken(user._id);
  res.cookie("jwt", token, COOKIE_OPTIONS);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user._id);
  res.cookie("jwt", token, COOKIE_OPTIONS);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profileImage: req.user.profileImage,
  });
});
