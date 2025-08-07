import express from "express";
import { isSuperAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllAdmins,
  searchUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Secure all routes with JWT and superadmin check
router.use(verifyJWT, isSuperAdmin);

router.get("/admins", getAllAdmins);
router.get("/search-users", searchUsers);
router.patch("/update-role/:userId", updateUserRole);

export default router;