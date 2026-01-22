import mongoose, { Schema } from "mongoose";

const heroSchema = new Schema(
  {
    initialText: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    techStack: {
      type: [String],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Hero = mongoose.model("Hero", heroSchema);