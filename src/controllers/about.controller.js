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

  const test = await About.findOne({ createdBy: req.user._id });
console.log(test);
  const user = await User.findById(req.user._id);
  if (!user || user.role !== "owner") {
    throw new ApiError(403, "Access denied");
  }


  const arrayFields = ["img", "aboutTitle", "paragraph", "hobbies"];
  const updateQuery = {};

  let eventArrImage = [];
  // const eventImages = req.file?.path; 
  if (req.files && req.files.img && req.files.img.length > 0) {  //Files exist karti hain? Aur kam se kam 1 file hai?
    const eventImages = req.files.img.map((file) => file.path);
    console.log(eventImages);
    for (let aboutImg of eventImages) {
      const result = await uploadOnCloudinary(aboutImg); 
      if (result?.secure_url) {
        eventArrImage.push(result.secure_url);
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
  arrayFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      const value = Array.isArray(req.body[field])
        ? req.body[field]
        : [req.body[field]];

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

  const updatedAbout = await About.findOneAndUpdate(
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
