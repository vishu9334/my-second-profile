import { Hero } from "../models/hero.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";


export const heroSection = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Login required");
  }


  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") {
    throw new ApiError(403, "Access denied");
  }
  const {
    initialText,
    name,
    role,
    backendStack,
    frontendStack,
    toolsStack,
  } = req.body;

  const heroAvatarLocalPath = req.file?.path;
  let avatarUrl = "";

  if (heroAvatarLocalPath) {
    const heroPic = await uploadOnCloudinary(heroAvatarLocalPath);
    if (!heroPic?.secure_url) {
      throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
    }
    avatarUrl = heroPic.secure_url;
  } else {
    const existingHero = await Hero.findOne({ createdBy: req.user._id });
    if (existingHero?.heroAvatar) {
      avatarUrl = existingHero.heroAvatar;
    } else {
      throw new ApiError(400, "Avatar file is required for a new hero section.");
    }
  }

  const heroData = await Hero.findOneAndUpdate(
    { createdBy: req.user._id },
    {
     heroAvatar: avatarUrl,
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

export const deleteHeroSection = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Login required");
  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") throw new ApiError(403, "Access denied");

  await Hero.deleteOne({ createdBy: req.user._id });
  res.status(200).json(new ApiResponse(200, {}, "Hero section deleted"));
});