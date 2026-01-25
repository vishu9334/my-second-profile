import mongoose, { Schema } from "mongoose";

const hero2Section = new Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    highlights: {
      type: [String], 
      default: [],
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

export const Hero2 = mongoose.model("Hero2", hero2Section);