import mongoose, { Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: Number,
          default:7
        }
      },
    ],
  },
  { timestamps: true },
);
export const CartModel = mongoose.model("Cart", cartSchema);