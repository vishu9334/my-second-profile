import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * After accessTokenCheck. Ensures the authenticated user has role "owner"
 * (same rule as hero/about mutations).
 */
export const requireOwner = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("role");
  if (!user || user.role !== "owner") {
    throw new ApiError(403, "Access denied");
  }
  next();
});
