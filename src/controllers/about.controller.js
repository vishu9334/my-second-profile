import mongoose from "mongoose";
import { About } from "../models/about.schema.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../service/cloudinary.js"

export const aboutSection = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Login required");
  }

  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") {
    throw new ApiError(403, "Access denied");
  }


  const arrayFields = ["img", "aboutTitle", "paragraph", "hobbies"]; //this is white field
  const updateQuery = {};

  let eventArrImage = [];
  // const eventImages = req.file?.path; 
  if (req.files && req.files.img && req.files.img.length > 0) {  //Files exist karti hain? Aur kam se kam 1 file hai?
    const eventImages = req.files.img.map((file) => file.path);
    for (let aboutImg of eventImages) {
      const result = await uploadOnCloudinary(aboutImg);
      console.log("Cloudinary upload result:", result);
      if (result?.secure_url) {
        console.log("Image uploaded successfully:", result.secure_url);
        eventArrImage.push(result.secure_url);
      } else {
        console.error("Cloudinary upload failed for file:", aboutImg, "Result:", result);
        throw new ApiError(500, `Failed to upload image: ${result?.error?.message || "Unknown error"}`);
      }
    }
    if (eventArrImage.length > 0) {
      updateQuery.$addToSet = {
        ...updateQuery.$addToSet, //ye check karta hai ki agar image already exist karta hai toh usko add nahi karna hai
        img: { $each: eventArrImage },//ye image ko add karta hai ek ek karke array mein
      };
    }
  }

  // ============================================
  // Support direct form-data array fields
  // ============================================
  const replaceArrays =
    req.body.replaceArrays === true || req.body.replaceArrays === "true";

  arrayFields.forEach((field) => {
    if (req.body[field] === undefined) return;
    const value = Array.isArray(req.body[field])
      ? req.body[field]
      : [req.body[field]];

    if (replaceArrays) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [field]: value,
      };
    } else {
      updateQuery.$addToSet = {
        ...updateQuery.$addToSet,
        [field]: { $each: value },
      };
    }
  });

  if (req.body.add) {  // add jo hai bo frontend se aayega aur ye dekhega ki data(object) ki keys kya hai aur ye check karta hai ki ye arrayFields mein hai ya nahi
    const validAddField = Object.entries(req.body.add).filter(([key]) =>
      arrayFields.includes(key) //yaha key ki key value hai jo hai bo arrayFields mein hai ya nahi
    );

    if (validAddField.length) {  //yaha validAddField ki length 0 se jyada hai toh ye check karta hai ki data(object) ki keys kya hai aur ye check karta hai ki ye arrayFields mein hai ya nahi
      updateQuery.$addToSet = {
        ...updateQuery.$addToSet,
        ...Object.fromEntries(
          validAddField.map(([key, value]) => [key, { $each: value }]),
        ),
      };
    }
  }

  if (req.body.remove) {
    const validRemoveFields = Object.entries(req.body.remove).filter(([key]) =>
      arrayFields.includes(key),
    );

    if (validRemoveFields.length) {
      updateQuery.$pull = Object.fromEntries(
        validRemoveFields.map(([key, value]) => [key, { $in: value }]),
      );
    }
  }

// ============================================
// ============ simple string data update ============
// ============================================

const stringFields = ["paragraphTwo", "quote"];

stringFields.forEach((field)=>{
  if( req.body[field] !== undefined){
    updateQuery.$set={
      ...updateQuery.$set,
      [field]: req.body[field]
    }
  }
})

  // =============================
  // 🧠 UPDATE ONLY OWNER DOCUMENT
  // =============================

  let updatedAbout = await About.findOneAndUpdate(
    { createdBy: new mongoose.Types.ObjectId(req.user._id) },
    {
      ...updateQuery,
      $setOnInsert: { createdBy: new mongoose.Types.ObjectId(req.user._id) }
    },
    { new: true, runValidators: true, upsert: true },
  );

  if (!updatedAbout) {
    throw new ApiError(404, "About section not found or not authorized");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedAbout, "About section updated successfully"),
    );
});

export const deleteAboutSection = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Login required");
  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") throw new ApiError(403, "Access denied");

  await About.deleteOne({ createdBy: req.user._id });
  res.status(200).json(new ApiResponse(200, {}, "About section deleted"));
});
