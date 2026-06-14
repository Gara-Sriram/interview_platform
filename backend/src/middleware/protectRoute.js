import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, _res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new ApiError(401, "Unauthorized - no token provided");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch {
      throw new ApiError(401, "Unauthorized - invalid or expired token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(401, "Unauthorized - user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
