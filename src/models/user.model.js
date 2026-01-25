import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["viewer", "owner"],
      default: "viewer",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const saltRound = 10;
  this.password = await bcrypt.hash(this.password, saltRound);
  // next();
});

export const User = mongoose.model("User", userSchema);

export const generateAccessToken = (User) => {
  return jwt.sign(
    {
      _id: User._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (User) => {
  return jwt.sign({ _id: User._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
