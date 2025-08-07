import express from "express";
import {
  uploadGalleryMedia,
  getAllGalleryMedia,
  deleteGalleryMedia,
} from "../controllers/gallery.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllGalleryMedia);

router.post(
  "/upload",
  verifyJWT,
  isAdmin,
  upload.single("media"), // accept any file (image or video)
  uploadGalleryMedia
);

router.delete("/:id", verifyJWT, isAdmin, deleteGalleryMedia);

export default router;
