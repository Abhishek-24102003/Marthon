import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    heroProduct: {
      type: Boolean,
      default:false
    },
    company: {
      type: String,
      required: true,
    },
    productModel: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    productType: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["sports", "casual", "running"],
    },
    gender: {
        type: String,
        lowercase:true,
      enum: ["men", "women", "unisex"],
      required: true,
    },
    size: [{ type: String, required: true }],
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["₨", "$", "€", "฿"],
        default: "₨",
      },
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);
export const ProductModel = mongoose.model("Product", productSchema);
