import { SkillTeach } from "../models/skillSet.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import imageHandler from "../utils/imageHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const skillSection = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Login required");
  }

  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") {
    throw new ApiError(403, "Access denied");
  }
  const skillFiles = req.files?.skillTeachLogo || [];
  const appFiles = req.files?.applicationLogo || [];

  // const imageUrls = files.length ? await imageHandler(files) : [];
  const skillFilesUrl = skillFiles.length ? await imageHandler(skillFiles) : [];
  console.log("skillFilesUrl:", skillFilesUrl);
  const appUrls = appFiles.length ? await imageHandler(appFiles) : [];
  console.log("appUrls:", appUrls);

  const { professionalSkill, toolsHeadLine, applications } = req.body;

  if (
    ![professionalSkill, toolsHeadLine, applications].some(Boolean) &&
    !req.files
  ) {
    throw new ApiError(400, "Provide at least one field to update");
  }

  const skillDatas = await SkillTeach.findOneAndUpdate(
    { createdBy: req.user._id },
    // {
    //       $set:{
    //           skillTeachLogo:skillFilesUrl,
    //         professionalSkill,
    //         toolsHeadLine,
    //         applications,
    //          applicationLogo:appUrls
    //       }
    // },
    {
      skillTeachLogo: skillFilesUrl,
      professionalSkill,
      toolsHeadLine,
      applications,
      applicationLogo: appUrls,
    },
    { new: true, upsert: true, runValidators: true },
  );
  console.log("Saved data:", skillDatas);
  res
    .status(200)
    .json(new ApiResponse(200, skillDatas, "Skill section updated or created"));
});
