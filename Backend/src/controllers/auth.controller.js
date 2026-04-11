import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CartModel } from "../models/cart.model.js";
import { cacheInstance } from "../services/Cache.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";
import { sendmail } from "../services/mail.service.js";
import { registerotpTemplate } from "../templates/RegisterOtp.template.js";
import { GenerateNewOtp } from "../utils/OtpGenerate.js";
import { generateTokens } from "../utils/generateTokens.js";

/* ================= REGISTER ================= */
export const registerController = asyncHandler(async (req, res) => {
  const { userName, email, password, mobile } = req.body;

  if (!userName || !email || !password || !mobile) {
    throw new CustomError(400, "All fields are required!");
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    if (existingUser.otp && existingUser.otp.isExpired < Date.now()) {
      await UserModel.findOneAndDelete({ email });
    } else {
      throw new CustomError(409, "User already exists!");
    }
  }

  const hashPass = await bcrypt.hash(password, 10);

  const otp = await GenerateNewOtp();
  const plainOtp = otp.otpNumber;

  const hashOtp = await bcrypt.hash(plainOtp.toString(), 10);
  otp.otpNumber = hashOtp;

  const newUser = await UserModel.create({
    userName,
    email,
    password: hashPass,
    mobile,
    otp,
    isVerified: false,
  });

  const cart = await CartModel.create({ userId: newUser._id });
  newUser.cart = cart;
  await newUser.save();
 const { accessToken, refreshToken } = generateTokens(newUser._id);

  newUser.refreshToken = refreshToken;
  newUser.isVerified = true;
  await newUser.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  await sendmail(
    newUser.email,
    "Account validation",
    registerotpTemplate(plainOtp)
  );

  res.status(201).json({
    success: true,
    message: "OTP sent. Please verify your email.",
  });
});

/* ================= VERIFY OTP ================= */
export const verifyOtp = asyncHandler(async (req, res) => {
  const user = req.user;
  const { otp } = req.body;

  if (!user.otp) throw new CustomError(400, "OTP not found");

  const { otpNumber, isExpired } = user.otp;

  if (isExpired < Date.now()) {
    await UserModel.findOneAndDelete({ email: user.email });
    throw new CustomError(400, "Session expired!");
  }

  const isMatch = await bcrypt.compare(otp, otpNumber);

  if (!isMatch) {
    throw new CustomError(400, "Invalid OTP");
  }

  user.isVerified = true;
  user.otp = undefined;

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    success: true,
    message: "User verified & logged in",
    user,
  });
});

/* ================= RESEND OTP ================= */
export const resendOtpController = asyncHandler(async (req, res) => {
  const user = req.user;

  const newOtp = await GenerateNewOtp();
  const plainOtp = newOtp.otpNumber;

  const hashOtp = await bcrypt.hash(plainOtp.toString(), 10);
  newOtp.otpNumber = hashOtp;

  user.otp = newOtp;
  await user.save();

  await cacheInstance.del(`user:${user._id}`);

  await sendmail(user.email, "New OTP", registerotpTemplate(plainOtp));

  res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});

/* ================= LOGIN ================= */
export const loginController = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    throw new CustomError(400, "All fields are required!");
  }

  const user = await UserModel.findOne({ userName });
  if (!user) throw new CustomError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomError(401, "Invalid credentials");

  if (!user.isVerified) {
    throw new CustomError(403, "Please verify your email");
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});

/* ================= REFRESH TOKEN ================= */
export const refreshTokenController = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) throw new CustomError(401, "No refresh token");

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await UserModel.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    throw new CustomError(403, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    success: true,
    message: "Token refreshed",
  });
});

/* ================= LOGOUT ================= */
export const logoutController = asyncHandler(async (req, res) => {
  const user = req.user;

  user.refreshToken = null;
  await user.save();

  await cacheInstance.del(`user:${user._id}`);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/* ================= CURRENT USER ================= */
export const currentUserController = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) throw new CustomError(404, "User not found");

  res.status(200).json({
    success: true,
    user,
  });
});

/* ================= GOOGLE AUTH ================= */
export const googleOauthController = asyncHandler(async (req, res) => {
  const user = req.user;

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  user.isVerified = true;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.redirect("http://localhost:5173/homelayout");
});

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new CustomError(404, "User not found");

  const token = jwt.sign(
    { id: user._id },
    process.env.FORGOT_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  const link = `https://marthon.vercel.app/api/auth/newPassword/${token}`;

  await sendmail(email, "Reset Password", link);

  res.status(200).json({
    success: true,
    message: "Reset link sent",
  });
});
/* ================= New PASSWORD ================= */
export const newPasswordController = asyncHandler(async (req, res) => {
  let token = req.params.token;

  const decode = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);

  if (!decode) throw new CustomError(404, "Unauthorized user");

  const userId = decode.id;

  return res.render("index", { userId }); // EJS
});

/* ================= RESET PASSWORD ================= */
export const resetPasswordController = asyncHandler(async (req, res) => {
  const { confirmPassword } = req.body;
  const userId = req.params.userId;

  const user = await UserModel.findById(userId);

  user.password = await bcrypt.hash(confirmPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated",
  });
});