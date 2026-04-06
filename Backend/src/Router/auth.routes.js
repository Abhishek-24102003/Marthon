import express from "express";
import {
  currentUserController,
  forgotPasswordController,
  googleOauthController,
  loginController,
  logoutController,
  newPasswordController,
  registerController,
  resendOtpController,
  resetPasswordController,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import passport from "passport";


const router = express.Router();
router.post("/register", registerController);
router.post("/login",authMiddleware, loginController);
router.post("/logout", authMiddleware, logoutController);
router.get("/currentUser", authMiddleware, currentUserController);
router.post("/verify-otp", authMiddleware, verifyOtp)
router.post("/resend-otp",authMiddleware,resendOtpController)
//forgot
router.post("/forgot-password", forgotPasswordController);
//ejs link for new password
router.get("/newPassword/:token", newPasswordController);
//reset password in user
router.post("/reset-password-success/:userId", resetPasswordController);


//google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);
router.get(
  "/callback/google",
  passport.authenticate("google", { session: false }),
  googleOauthController,
);
export default router;
