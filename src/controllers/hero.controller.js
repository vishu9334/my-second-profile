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
//multer to req.file use
const heroAvatarLocalPath = req.file?.path;
console.log("FILE PATH 👉", heroAvatarLocalPath);
if(!heroAvatarLocalPath) throw new ApiError(400, "Avatar file is required.");
 const heroPic =  await uploadOnCloudinary(heroAvatarLocalPath)
 console.log("cloudinary response 👉", heroPic);
if(!heroPic?.secure_url)  throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
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
     heroAvatar: heroPic.secure_url,
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