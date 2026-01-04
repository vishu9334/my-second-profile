import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { zodCreateUserSchema } from "../validators/user.validator.js";

export const registerUser = asyncHandler(async ( req, res) => {
  const result  = zodCreateUserSchema.safeParse(req.body);
  if(!result.success){
      throw new ApiError(400,"zod validation error", result.error.issues)
  }
  // let { username, email, password, role } = req.body;
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
