import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    console.log("Starting Cloudinary upload for:", localFilePath);
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
    });
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    console.log("file is uploaded on cloudinary", response.secure_url);
    return response;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath))
      fs.unlinkSync(localFilePath);

    console.error("Cloudinary upload error:", error);

    return null;
  }
};

/** PDF / Word (and similar) uploads stored as raw assets for reliable download links. */
const uploadRawDocument = async (localFilePath, options = {}) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "portfolio-resumes",
      resource_type: "raw",
      use_filename: true,
      unique_filename: true,
      ...options,
    });

    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath))
      fs.unlinkSync(localFilePath);
    console.log(error);
    return null;
  }
};

const removeFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.log("Cloudinary delete failed", error);
    return null;
  }
};

export { uploadOnCloudinary, uploadRawDocument, removeFromCloudinary };
