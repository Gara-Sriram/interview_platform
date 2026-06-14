import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export function validateObjectId(paramName = "id") {
  return (req, _res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return next(new ApiError(400, `Invalid ${paramName}`));
    }

    next();
  };
}
