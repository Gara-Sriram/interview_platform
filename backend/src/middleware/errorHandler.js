import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";
  let details = error.details;

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(error.errors).map((err) => err.message);
  }

  if (error?.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource";
    details = Object.keys(error.keyPattern || {});
  }

  if (error?.name === "TimeoutError") {
    statusCode = 504;
    message = "Execution engine timed out";
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
