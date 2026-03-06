import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";

const uploadImg = async (img) => {

    if (!img || img.length === 0) {
        throw new ApiError(400, "Required Image...");
    }

    const arrUpcoming = img.map((i) => i.path);

    const urls = await Promise.all(
        arrUpcoming.map(async (filePath) => {

            const images = await uploadOnCloudinary(filePath);

            if (!images?.secure_url) {
                throw new ApiError(500, "Failed to upload to cloudinary");
            }

            return images.secure_url;
        })
    );

    return urls;
};

export default uploadImg;