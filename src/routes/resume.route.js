import { Router } from "express";
import { accessTokenCheck } from "../middlewares/tokenCheck.middleware.js";
import { requireOwner } from "../middlewares/owner.middleware.js";
import { resumeUpload } from "../middlewares/resumeUpload.middleware.js";
import {
  getPublicResume,
  redirectResumeDownload,
  upsertResume,
  deleteResume,
} from "../controllers/resume.controller.js";

const router = Router();

router.get("/resume", getPublicResume);
router.get("/resume/download", redirectResumeDownload);

router.post(
  "/resume",
  accessTokenCheck,
  requireOwner,
  resumeUpload.single("resume"),
  upsertResume
);

router.delete("/resume", accessTokenCheck, requireOwner, deleteResume);

export default router;
