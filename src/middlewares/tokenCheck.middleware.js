import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const accessTokenCheck = asyncHandler(async( req, res, next)=>{
    const token = req.cookies.accessToken;
    if(!token) throw new ApiError(401, "Login required")
        next()
})