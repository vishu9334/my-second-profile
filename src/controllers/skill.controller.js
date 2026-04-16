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

  const skillFilesUrl =
    skillFiles.length > 0 ? await imageHandler(skillFiles) : [];
  const appUrls = appFiles.length > 0 ? await imageHandler(appFiles) : [];

  const {
    professionalSkill,
    toolsHeadLine,
    applications,
    skillTeachLogo: bodySkillLogos,
    applicationLogo: bodyAppLogos,
  } = req.body;

  const existing = await SkillTeach.findOne({ createdBy: req.user._id });

  let skillTeachLogo = bodySkillLogos;
  if (Array.isArray(skillTeachLogo) && skillFilesUrl.length) {
    skillTeachLogo = [...skillTeachLogo, ...skillFilesUrl];
  } else if (!skillTeachLogo && skillFilesUrl.length) {
    skillTeachLogo = [...(existing?.skillTeachLogo || []), ...skillFilesUrl];
  } else if (!skillTeachLogo) {
    skillTeachLogo = existing?.skillTeachLogo ?? [];
  }

  let applicationLogo = bodyAppLogos;
  if (Array.isArray(applicationLogo) && appUrls.length) {
    applicationLogo = [...applicationLogo, ...appUrls];
  } else if (!applicationLogo && appUrls.length) {
    applicationLogo = [...(existing?.applicationLogo || []), ...appUrls];
  } else if (!applicationLogo) {
    applicationLogo = existing?.applicationLogo ?? [];
  }

  const mergedProfessional =
    professionalSkill ?? existing?.professionalSkill;
  const mergedTools = toolsHeadLine ?? existing?.toolsHeadLine;
  const mergedApps = applications ?? existing?.applications;

  if (
    ![mergedProfessional?.length, mergedTools, mergedApps?.length].some(
      Boolean,
    ) &&
    !existing
  ) {
    throw new ApiError(400, "Provide at least one field to create skills");
  }

  if (!mergedProfessional?.length && !existing?.professionalSkill?.length) {
    throw new ApiError(400, "At least one professional skill is required");
  }

  const payload = {
    skillTeachLogo,
    professionalSkill: mergedProfessional ?? existing?.professionalSkill ?? [],
    toolsHeadLine: mergedTools ?? "",
    applications: mergedApps ?? existing?.applications ?? [],
    applicationLogo,
    createdBy: req.user._id,
  };

  const skillDatas = await SkillTeach.findOneAndUpdate(
    { createdBy: req.user._id },
    payload,
    { new: true, upsert: true, runValidators: true },
  );

  res
    .status(200)
    .json(new ApiResponse(200, skillDatas, "Skill section updated or created"));
});

export const deleteSkillSection = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Login required");
  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") throw new ApiError(403, "Access denied");

  await SkillTeach.deleteOne({ createdBy: req.user._id });
  res.status(200).json(new ApiResponse(200, {}, "Skill section deleted"));
});
