import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateRefreshToken, generateAccessToken , User } from "../models/user.model.js";
import { zodCreateUserSchema } from "../validators/user.validator.js";
import { zodLoginSchema } from "../validators/auth.validator.js";
import bcrypt from "bcrypt"



export const registerUser = asyncHandler(async ( req, res) => {
  const result  = zodCreateUserSchema.safeParse(req.body);
  if(!result.success){
      throw new ApiError(400,"zod validation error", result.error.issues)
  }
  let {username, email, password, role} = result.data

  if (role === "owner" && email !== process.env.PRIVATE) {
    throw new ApiError(403, "you are not authorized to register as owner");
  }
  if (!role) {
    role = "viewer";
  }

  const userCreate = await User.create({
    username,
    email,
    password,
    role,
  });

  res
    .status(201)
    .json(new ApiResponse(201, userCreate, "User registered successfully"));
   
});

export const login = asyncHandler(async(req, res)=>{

  const result  = zodLoginSchema.safeParse(req.body);
  if(!result.success){
      throw new ApiError(400,"zod validation error", result.error.issues)
  }

    const {username, email, password} = result.data;
    if(!username && !email) throw new ApiError(400, "username or email is empty.")
      if(!password) throw new ApiError(400, "password is required.")

        const user = await User.findOne({
          $or: [{email}, {username}]
        })
        if(!user) throw new ApiError(400,"invalid username & email")
        const isPasswordMatch = await bcrypt.compare(
          password,
          user.password
        )
        if(!isPasswordMatch) throw new ApiError(401, "invalid or missing authentication credentials")
       
      
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false});

      res.cookie("accessToken", accessToken, {
         httpOnly:true,
        secure:true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
      }).json({
        success:true,
        accessToken,
        refreshToken,
        user:{
          _id : user._id,
          username:user.username,
          role:user.role,
        }
      })

})

export const logout = asyncHandler(async (req, res)=> {
    res.clearCookie("accessToken", {
      httpOnly:true,
      secure:true,
      sameSite:"strict"
    })

    res.status(200).json(new ApiResponse(200, {message:"Logged out successfully"}))
})

export const forgotPassword = asyncHandler(async(req, res)=>{
        
}) 