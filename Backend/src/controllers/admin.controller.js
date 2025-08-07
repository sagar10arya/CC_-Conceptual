import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// Get all admins and superadmins
const getAllAdmins = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    select: "-password -refreshToken -otp -otpExpiresAt",
  };

  try {
    const result = await User.paginate(
      { role: { $in: ["admin", "superadmin"] } },
      options
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          admins: result.docs,
          totalAdmins: result.totalDocs,
          totalPages: result.totalPages,
          currentPage: result.page,
        },
        "Admins fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching admins: " + error.message);
  }
});

const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  // console.log("Search query received:", query); // Debug log
  
  if (!query || query.length < 3) {
    throw new ApiError(400, "Search query must be at least 3 characters long");
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } }
      ]
    })
    .select("-password -refreshToken -otp -otpExpiresAt")
    .limit(10);

    // console.log("Search results:", users); // Debug log
    
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    console.error("Search error:", error);
    throw new ApiError(500, "Error occurred during search");
  }
});

// Update user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["user", "admin", "superadmin"].includes(role)) {
    throw new ApiError(400, "Invalid role specified");
  }

  // Prevent modifying yourself
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot modify your own role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password -refreshToken -otp -otpExpiresAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

export { getAllAdmins, searchUsers, updateUserRole };