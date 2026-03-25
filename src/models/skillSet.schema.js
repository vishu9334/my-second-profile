import mongoose, { Schema } from "mongoose";
import {toCamelCase} from "../utils/cammelCase.js"

const skillSet = new Schema(
  {
    skillTeachLogo: {
      type: [String],
      required:true,
    },
    professionalSkill: {
      type: [String],
      set: (values)=> values.map(v => toCamelCase(v)),
      required: true,
    },
    toolsHeadLine: {
      type: String,
      trim: true,
    },
    applications: {
      type: [String],
    },
    applicationLogo: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const SkillTeach = mongoose.model("SkillTeach", skillSet);
