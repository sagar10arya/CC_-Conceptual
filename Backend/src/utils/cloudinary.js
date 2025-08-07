import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // supports image/video
    });
    // File has been uploaded successfully
    // console.log("File has been Uploaded Successfully", response.url);
    // console.log("Response: ", response);
    fs.unlinkSync(localFilePath); // cleanup temp file
    return response; // includes .secure_url, .resource_type, .public_id
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Extract public ID from the video URL

const deleteFromCloudinary = async (publicId, resourceType = "image" || "video") => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (response.result !== "ok" && response.result !== "not found") {
      throw new Error(`Cloudinary deletion failed: ${response.result}`);
    }

    return { success: true, response };
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return new ApiError(400, error, "Error deleting file from Cloudinary");
  }
};


export { uploadOnCloudinary, deleteFromCloudinary };
