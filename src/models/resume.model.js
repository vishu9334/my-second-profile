import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    fileUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
