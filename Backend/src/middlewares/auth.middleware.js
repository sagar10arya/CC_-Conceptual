import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/* Middleware to verify JSON Web Tokens (JWT) to authenticate users making requests to your server */

// export const verifyJWT = asyncHandler( async (req, res, next) => {
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized: No access token provided.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: Invalid access token.");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Email not verified. Please verify your email.");
    }

    req.user = user;
    next(); // next() function is called to pass control to the next middleware
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Unauthorized: Invalid or expired access token."
    );
  }
});
