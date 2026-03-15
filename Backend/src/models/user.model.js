import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    googleId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default:false
    },
   otp: {
  otpNumber: String,
  isExpired: Number
}
  },
  { timestamps: true },
);
export const UserModel = mongoose.model("User", userSchema);
