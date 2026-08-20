const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Cookie options — centralised so all routes use the same config
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ------------------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ------------------------------------------------------------------
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10), // hash before saving
      role,
    });
    const token = generateToken(user._id);

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ------------------------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare entered password against stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, COOKIE_OPTIONS);

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------------
// @desc    Logout user (clear cookie)
// @route   POST /api/auth/logout
// @access  Public
// ------------------------------------------------------------------
const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out successfully" });
};

// ------------------------------------------------------------------
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Protected
// ------------------------------------------------------------------
const getMe = (req, res) => {
  // req.user is attached by the protect middleware
  res.json({
    success: true,
    user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
  });
};

module.exports = { register, login, logout, getMe };
