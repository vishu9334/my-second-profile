import mongoose, { Schema } from "mongoose";

const aboutSchema = new Schema(
  {
    img: {
      type: [String],
      default: [], // empty array by default
    },

    aboutTitle: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    paragraph: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    paragraphTwo: {
      type: String,
      trim: true,
    },

    hobbies: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    quote: {
      type: String,
      uppercase: true, // correct mongoose key
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ye important hai
    },
  },
  {
    timestamps: true,
  }
);

export const About = mongoose.model("About", aboutSchema);