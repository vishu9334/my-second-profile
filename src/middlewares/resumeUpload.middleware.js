import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = path.join(process.cwd(), "public", "assets", "resume-temp");
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename(req, file, cb) {
    const safe =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname || "");
    cb(null, safe);
  },
});

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (ALLOWED.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          400,
          "Only PDF or Word documents (.pdf, .doc, .docx) are allowed"
        )
      );
    }
  },
});
