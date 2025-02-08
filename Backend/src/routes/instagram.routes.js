import { Router } from "express";
import getInstagramPhotos from "../controllers/instagram.controller.js";

const router = Router();

router.get("/", getInstagramPhotos);

export default router;