import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  forgotPassword,
  getCurrentUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/admin/users", verifyJWT, isAdmin, getAllUsers);

router.route("/register").post(registerUser)
// Verify email
router.post("/verify-otp", verifyEmail);
router.post("/resend-otp", resendVerificationEmail);


router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.route("/me").get(verifyJWT, getCurrentUser).patch(verifyJWT, updateProfile);

export default router;