import { Hero } from "../models/hero.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";


export const heroSection = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Login required");
  }

  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") {
    throw new ApiError(403, "Access denied");
  }

  // req.body already validated
  const {
    initialText,
    name,
    role,
    backendStack,
    frontendStack,
    toolsStack,
  } = req.body;

  const heroData = await Hero.findOneAndUpdate(
    { createdBy: req.user._id },
    {
      initialText,
      name,
      role,
      backendStack,
      frontendStack,
      toolsStack,
      createdBy: req.user._id,
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, heroData, "Hero section updated or created")
  );
});