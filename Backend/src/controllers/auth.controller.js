import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CartModel } from "../models/cart.model.js";
import { cacheInstance } from "../services/Cache.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";
import { app } from "../app.js";
import { sendmail } from "../services/mail.service.js";
import { registerotpTemplate } from "../templates/RegisterOtp.template.js";
import { GenerateNewOtp } from "../utils/OtpGenerate.js";

export const registerController = asyncHandler(async (req, res) => {
  const { userName, email, password, mobile } = req.body;
  if (!userName || !email || !password || !mobile) {
    throw new CustomError(404, "All fields are required!");
  }
  const userExist = await UserModel.findOne({ email });


  if (userExist) {
   const { isExpired } = userExist?.otp;
  if (isExpired < Date.now()) {
    await UserModel.findOneAndDelete({email})
    throw new CustomError(400,"Session expired!")
  }
    throw new CustomError(300, "User allready exist with this account!!");
  }
const hashPass = await bcrypt.hash(password, 10);
  const otp = await GenerateNewOtp()
  const { otpNumber } = otp;
  const hashotp = await bcrypt.hash(otpNumber.toString(), 10)
  otp.otpNumber = hashotp;
  const newUser = await UserModel.create({
    userName,
    email,
    password: hashPass,
    mobile,
    otp
  });
  if (!newUser) {
    throw new CustomError(400, "Failed to register user, try again!!");
  }

  //create a cart of newUser
  const cart = await CartModel.create({
    userId: newUser._id,
  });
  if (!cart) {
    throw new CustomError(400, "Failed to create user Cart!!");
  }
  newUser.cart = cart;
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
 res.cookie("token", token);
   sendmail(newUser.email, "Account validation for Marthon", registerotpTemplate(otpNumber));
  return res.status(200).json({
    success: true,
    message: "Otp send successfully!!",
    user: newUser,
  });
});


export const verifyOtp = asyncHandler(async(req, res) => {
  let user = req.user;
 
  const {otp} = req.body;
  const userOtp = user.otp;
  
  const { otpNumber, isExpired } = userOtp;
  let email = user.email;
  if (isExpired < Date.now()) {
    await UserModel.findOneAndDelete({email})
    throw new CustomError(400,"Session expired!")
  }
  const decodedOtp = await bcrypt.compare(otp, otpNumber)
  
  if (!decodedOtp) {
    throw new CustomError(404, "Otp not matched");
  }
  
  let updateUser = await UserModel.findOneAndUpdate({ _id: user._id }, {
    $set: { isVerified: true },
    $unset:{otp:""}
  })
    const cacheUserkey = `user:${user._id}`
await cacheInstance.del(cacheUserkey)
  res.status(200).json({
    success: true,
    message: "user registerd!",
    user:updateUser
  })
})

export const resendOtpController = asyncHandler(async (req, res) => {
  const user = req.user;
  const newOtp = await GenerateNewOtp();
  const { otpNumber } = newOtp;
  const hashOtp = await bcrypt.hash(otpNumber.toString(), 10);
  newOtp.otpNumber = hashOtp;
  user.otp= newOtp;
  await user.save()
  const cacheUserkey = `user:${user._id}`
await cacheInstance.del(cacheUserkey)
  sendmail(user.email, "Account validation for Marthon", registerotpTemplate(otpNumber));
  res.status(200).json({
    success: true,
    message:"Otp Re-Sended!!"
  })
})

export const loginController = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    throw new CustomError(400, "All fields are required!");
  }
  const userExist = await UserModel.findOne({ userName });
  if (!userExist) {
    throw new CustomError(404, "User doesn't exist with this account!!");
  }
  const verify = await bcrypt.compare(password, userExist.password);
  if (!verify) {
    throw new CustomError(404, "Unauthorized user!!, check email or password.");
  }
  const token = jwt.sign(
    { id: userExist._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXP },
  );
 res.cookie("token", token);

  return res.status(200).json({
    success: true,
    message: "User logined successfully!!",
    user: userExist,
  });
});
export const logoutController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new CustomError(401, "Unauthorized user");
  }

  // clearing caches
  await cacheInstance.del(`user:${userId}`);
  await cacheInstance.del("products");

  // blacklist token
  const token = req.cookies.token;
  if (!token) {
    throw new CustomError(404, "Token not found");
  }

  await cacheInstance.set(token, "blacklisted");

  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "User Logged Out!!",
  });
});
export const currentUserController = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log(user);
  
  if (!user){throw new CustomError(404,"user not available")}
  return res.status(200).json({
    success: true,
    message: "current user fetched!",
    user,
  });
});
export const googleOauthController = asyncHandler(async (req, res) => {
  console.log(req.user);
  
  res.status(200).json({
    success:true,
    message: "User registered from google Auth",
    
  })
})


export const forgotPasswordController = asyncHandler(async (req, res) => {
  // recieve email
  const { email } = req.body; 
  if(!email) throw new CustomError(400,"Email is required")
  //verify email
  const existedUser = await UserModel.findOne({ email });
  if(!existedUser) throw new CustomError(400,"User not found!")
  //generate token
  let token = jwt.sign({ id: existedUser._id }, process.env.FORGOT_TOKEN_SECRET, { expiresIn: "5m" });
  if(!token) throw new CustomError(400,"failed to generate token")
  // generate link
  const link = `http://localhost:3000/api/auth/newPassword/${token}`
  await sendmail(email, "Reset new Password", link);
  res.send("ok mail send");
})

export const newPasswordController = asyncHandler(async (req, res) => {
  let token = req.params.token;
 const decode = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);
  if(!decode) throw new CustomError(404,"Unauthorized user")
  const userId = decode.id;
  return res.render("index",{userId});//ejs
})

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { confirmPassword } = req.body;
  if(!confirmPassword) throw new CustomError(401,"password is required")
  const userId = req.params.userId;
  const user = await UserModel.findById(userId);
  const newPassword = await bcrypt.hash(confirmPassword, 10);
  user.password = newPassword;
  await user.save();
  return res.render("success");
})
