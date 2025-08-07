import { Gallery } from "../models/gallery.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Upload image or video to Cloudinary
export const uploadGalleryMedia = async (req, res) => {
  try {
    const { title } = req.body;
    // console.log("Received file:", req.file);
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadOnCloudinary(file.path);
    if (!result || result instanceof Error)
      return res.status(500).json({ message: "Cloudinary upload failed" });

    const newMedia = await Gallery.create({
      title,
      mediaUrl: result.secure_url,
      publicId: result.public_id,
      mediaType: result.resource_type, // 'image' or 'video'
    });

    res.status(201).json({ message: "Media uploaded", media: newMedia });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all gallery media
export const getAllGalleryMedia = async (req, res) => {
  const media = await Gallery.find().sort({ createdAt: -1 });
  res.status(200).json({ media, total:media.length });
};

// Delete image/video from Cloudinary and DB
export const deleteGalleryMedia = async (req, res) => {
  try {
    const media = await Gallery.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    const deletion = await deleteFromCloudinary(
      media.publicId,
      media.mediaType
    );
    if (deletion instanceof Error) throw deletion;

    await media.deleteOne();
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting media", error: err.message });
  }
};
