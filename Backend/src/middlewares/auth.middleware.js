import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/* Middleware to verify JSON Web Tokens (JWT) to authenticate users making requests to your server */

// export const verifyJWT = asyncHandler( async (req, res, next) => {
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized: No access token provided.");
    }

    // Verify token using secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by decoded token _id (stored in token during login)
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: Invalid access token.");
    }

    // Prevent unverified users from accessing routes
    if (!user.isVerified) {
      throw new ApiError(403, "Email not verified. Please verify your email.");
    }

    // Attach user to request object so next middleware/controller can use it
    req.user = user;
    next(); // next() function is called to pass control to the next middleware
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Unauthorized: Invalid or expired access token."
    );
  }
});

// middleware to restrict access to admin-only routes
export const isAdmin = asyncHandler(async (req, _, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "superadmin")
  ) {
    throw new ApiError(403, "Access denied. Admins only.");
  }
  next(); // allow access if user is admin
});

/**
 * Role-based authorization middleware
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role ${req.user.role} is not authorized`);
    }
    next();
  };
};

export const isSuperAdmin = asyncHandler(async (req, _, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    throw new ApiError(403, "Access denied. Superadmin only.");
  }
  next();
});