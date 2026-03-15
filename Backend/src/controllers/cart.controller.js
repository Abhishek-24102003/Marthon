import { CartModel } from "../models/cart.model.js";
import { cacheInstance } from "../services/Cache.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const addToCartController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { productId,size } = req.params;
  if (!user) {
    throw new CustomError(404, "Unauthorized user");
  }
  const cartId = user.cart;
  if (!cartId) {
    throw new CustomError(400, "Cart not found");
  }
  const cartcheck = await CartModel.findById(cartId);
  const productAllreadyExist = cartcheck.items.some((elem) => elem.productId.toString() === productId.toString());
  if(productAllreadyExist)return res.status(200).json({
    success: true,
    message: "Product allready existed!!",
  });
  const cart = await CartModel.findByIdAndUpdate(
    cartId,
    {
      $push: {
        items: {
          productId,
          size
        },
      },
    },
    { new: true, runValidators: true },
  );

  if (!cart) {
    throw new CustomError(400, "failed to add in cart!");
  }

  return res.status(200).json({
    success: true,
    message: "Product added successfully!!",
    cart,
  });
});

export const getCartController = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new CustomError(404, "Unauthorized user");
  }
  const cartId = user.cart;
  if (!cartId) {
    throw new CustomError(400, "Cart not found");
  }

  //check in cahce first
  
  const cart = await CartModel.findById(cartId);
  if (!cart) {
    throw new CustomError(400, "failed to load cart!");
  }
console.log(cart);

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully!!",
    cart,
  });
});

export const updateCartController = asyncHandler(async (req, res) => {
  const { productId,quantity,size } = req.params;
  const user = req.user;
  if (!user) {
    throw new CustomError(404, "Unauthorized user");
  }
  const cartId = user.cart;
  if (!cartId) {
    throw new CustomError(400, "Cart not found");
  }
 const cart = await CartModel.findOneAndUpdate(
  {
    _id: cartId,
    "items.productId": productId,
  },
  {
    $set: {
      "items.$.quantity": quantity,
      "items.$.size":size
    }, // Set the matched item's 
  },
  { new: true }
);

  if (!cart) {
    throw new CustomError(400, "failed to increment!");
  }
  // clear the cahce
  await cacheInstance.del("cart");

  return res.status(200).json({
    success: true,
    message: "quantity increased successfully!!",
    cart,
  });
});

export const decrementproductCartController = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = req.user;
  if (!user) {
    throw new CustomError(404, "Unauthorized user");
  }
  const cartId = user.cart;
  if (!cartId) {
    throw new CustomError(400, "Cart not found");
  }
  const cart = await CartModel.findOneAndUpdate(
    {
      _id: cartId,
      "items.productId": productId, 
    },
    {
      $inc: { "items.$.quantity": -1 },
    },
    { new: true },
  );

  if (!cart) {
    throw new CustomError(400, "failed to decrement!");
  }

  // check if quantity 0 remove from cart and update
  const checkquan = await CartModel.findOneAndUpdate(
    {
      _id: cartId,
      "items.productId": productId,
    },
    {
      $pull: { items: { quantity: { $lte: 0 } } },
    },
  );

  // clear the cahce
  await cacheInstance.del("cart");

  return res.status(200).json({
    success: true,
    message: "quantity decreased successfully!!",
    cart,
  });
});

export const deleteProductFromCartController = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = req.user;
   if (!user) {
    throw new CustomError(404, "Unauthorized user");
  }
  const cartId = user.cart;
  if (!cartId) {
    throw new CustomError(400, "CartId not found");
  }
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        $pull: { items: { productId } },
      },
      { new: true },
    );
    if (!cart){
    throw new CustomError(400, "Cart not found");
  }

    // clear the cahce
    await cacheInstance.del("cart");

    return res.status(200).json({
      success: true,
      message: "product deleted from cart successfully!!",
      cart,
    });
  
});
