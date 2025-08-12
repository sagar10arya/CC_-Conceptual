import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/* Middleware to verify JSON Web Tokens (JWT) to authenticate users making requests to your server */

// export const verifyJWT = asyncHandler( async (req, res, next) => {
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Enhanced token extraction
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Authorization token missing");

    // Debug logging
    // console.log("Incoming token:", token);
    // console.log("JWT Secret exists:", !!process.env.ACCESS_TOKEN_SECRET);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: false,
    });

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );
    if (!user) throw new ApiError(401, "User not found");
    if (!user.isVerified) throw new ApiError(403, "Please verify your email");

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    const message =
      error.name === "TokenExpiredError"
        ? "Token expired"
        : "Invalid authorization token";
    throw new ApiError(401, message);
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