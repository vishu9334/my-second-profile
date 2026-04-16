import { Resume } from "../models/resume.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadRawDocument, removeFromCloudinary } from "../service/cloudinary.js";

async function getOwnerResumeDoc() {
  const owner = await User.findOne({ role: "owner" }).select("_id");
  if (!owner) return { owner: null, resume: null };
  const resume = await Resume.findOne({ owner: owner._id });
  return { owner, resume };
}

/** Public: metadata for visitors (single-owner portfolio). */
export const getPublicResume = asyncHandler(async (req, res) => {
  const { owner, resume } = await getOwnerResumeDoc();
  if (!owner || !resume) {
    throw new ApiError(404, "Resume not available");
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {
        downloadUrl: resume.fileUrl,
        originalName: resume.originalName,
        mimeType: resume.mimeType,
        updatedAt: resume.updatedAt,
      },
      "Resume metadata"
    )
  );
});

/** Public: redirect browser to hosted file (download / open). */
export const redirectResumeDownload = asyncHandler(async (req, res) => {
  const { resume } = await getOwnerResumeDoc();
  if (!resume) {
    throw new ApiError(404, "Resume not available");
  }
  res.redirect(302, resume.fileUrl);
});

/** Owner only: upload or replace resume. */
export const upsertResume = asyncHandler(async (req, res) => {
  const localPath = req.file?.path;
  if (!localPath) {
    throw new ApiError(400, "Resume file is required (field name: resume)");
  }

  const existing = await Resume.findOne({ owner: req.user._id });

  const uploaded = await uploadRawDocument(localPath);
  if (!uploaded?.secure_url || !uploaded.public_id) {
    throw new ApiError(500, "Failed to upload resume");
  }

  if (existing?.cloudinaryPublicId) {
    await removeFromCloudinary(existing.cloudinaryPublicId, "raw");
  }

  const doc = await Resume.findOneAndUpdate(
    { owner: req.user._id },
    {
      owner: req.user._id,
      fileUrl: uploaded.secure_url,
      cloudinaryPublicId: uploaded.public_id,
      originalName: req.file.originalname || "resume",
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, doc, "Resume saved successfully")
  );
});

/** Owner only: remove resume from storage and DB. */
export const deleteResume = asyncHandler(async (req, res) => {
  const existing = await Resume.findOne({ owner: req.user._id });
  if (!existing) {
    throw new ApiError(404, "No resume to delete");
  }

  await removeFromCloudinary(existing.cloudinaryPublicId, "raw");
  await Resume.deleteOne({ _id: existing._id });

  res.status(200).json(new ApiResponse(200, {}, "Resume deleted"));
});
