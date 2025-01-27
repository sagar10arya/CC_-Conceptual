import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  forgotPassword
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

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

export default router;