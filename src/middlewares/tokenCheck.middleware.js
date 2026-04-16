
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const accessTokenCheck = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Login required");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = decoded; // 🔥 THIS IS THE KEY LINE
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please login again");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token. Please login again");
    } else {
      throw new ApiError(401, "Authentication failed");
    }
  }
});        