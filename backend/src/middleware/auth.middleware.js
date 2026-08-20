const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ------------------------------------------------------------------
// protect middleware
// Reads JWT from the httpOnly cookie (set at login/register).
// If valid, attaches user to req.user.
// ------------------------------------------------------------------
const protect = async (req, res, next) => {
  try {
    // Read token from cookie (browser sends it automatically with every request)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user to request (minus password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

// ------------------------------------------------------------------
// interviewerOnly — use AFTER protect
// ------------------------------------------------------------------
const interviewerOnly = (req, res, next) => {
  if (req.user.role !== "interviewer") {
    return res.status(403).json({ success: false, message: "Access denied. Interviewers only." });
  }
  next();
};

// ------------------------------------------------------------------
// studentOnly — use AFTER protect
// ------------------------------------------------------------------
const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ success: false, message: "Access denied. Students only." });
  }
  next();
};

module.exports = { protect, interviewerOnly, studentOnly };
