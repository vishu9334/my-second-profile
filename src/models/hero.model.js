import mongoose, { Schema } from "mongoose";
const heroSchema = new Schema(
  {
    heroAvatar:{
      type: String,
      // required:true,

    },
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
      enum: [
        "Junior Developer",
        "Senior Developer",
        "Frontend Developer",
        "Backend Developer",
        "Fullstack Developer",
      ],
      required: true,
    },

    backendStack: {
      type: [String],
      enum: ["MongoDB", "Express.js", "Node.js","Socket.io","SQL","Mongoose","JWT","Bcrypt","Redis","crypto","Zod",],
      required: true,
    },

    frontendStack: {
      type: [String],
      enum: ["React.js", "Tailwind CSS", "CSS", "HTML"],
      required: true,
    },

    toolsStack: {
      type: [String],
      enum: ["GitHub", "Git", "Postman", "Notion"],
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