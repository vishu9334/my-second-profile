import { Hero2 } from "../models/hero2.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

export const intro = asyncHandler(async (req, res)=>{
      if (!req.user) {
    throw new ApiError(401, "Login required");
  }

  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") {
    throw new ApiError(403, "Access denied");
  }
  const {heading, content, highlights} = req.body;
    const hero2Data = await Hero2.findOneAndUpdate(
        { createdBy: req.user._id },
        {
          heading,
          content,
          highlights,
          createdBy: req.user._id,
        },
        { new: true, upsert: true, runValidators: true }
      );
      res.status(200).json(
    new ApiResponse(200, hero2Data, "Hero2 section updated or created")
  );
})