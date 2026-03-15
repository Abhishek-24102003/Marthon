import { ProductModel } from "../models/product.model.js";
import { UserModel } from "../models/user.model.js";
import { cacheInstance } from "../services/Cache.service.js";
import { UploadToStorage } from "../services/Storage.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";

export const createProductController = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    company,
    productModel,
    description,
    productType,
    gender,
    size,
    amount,
    currency,
    heroProduct
  } = req.body;
  if (
    !company ||
    !productModel ||
    !description ||
    !productType ||
    !gender ||
    !size ||
    !amount
  ) {
    throw new CustomError(400, "All fields are required");
  }
  const existProduct = await ProductModel.findOne({ productModel });
  if (existProduct && existProduct.userId.toString() === user._id.toString()) {
    throw new CustomError(400, "Product Allready added!!");
  }
  const files = req.files;
  const imageArr = await Promise.all(
    await files.map(
      async (elem) => await UploadToStorage(elem.buffer, elem.originalname),
    ),
  );

  const newProduct = await ProductModel.create({
    userId: user._id,
    company,
    productModel,
    productType,
    description,
    size,
    gender,
    price: {
      amount,
      currency,
    },
    images: imageArr.map((elem) => elem.url),
    heroProduct
  });
  // inform user that product added and add the productid
user.products.push(newProduct._id);
await user.save();

  //clear cache products after creation-->
  await cacheInstance.del("products");

  return res.status(200).json({
    success: true,
    message: "Product created!",
    product: newProduct,
  });
});
export const getSingleProductController = asyncHandler(async (req, res) => {
  let productId = req.params.productId;
  if (!productId) {
    throw new CustomError(404, "productId not found!!");
  }

  //get from cacheProducts
  const cacheProduct = await cacheInstance.get("products");
  const pro = JSON.parse(cacheProduct);
  const isAtcache = pro.find((elem) => elem._id.toString() === productId);
  if (isAtcache)
    return res.status(200).json({
      message: "Product fetched",
      success: true,
      product,
    });

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new CustomError(404, "product not found!!");
  }

  return res.status(200).json({
    message: "Product fetched",
    success: true,
    product,
  });
});
export const getAllProductController = asyncHandler(async (req, res) => {
  //check at cache-->
  const cacheProducts = await cacheInstance.get("products");
  if (cacheProducts)
    return res.status(200).json({
      message: "Products fetched",
      success: true,
      products: JSON.parse(cacheProducts),
    });
  //check at db
  const allProducts = await ProductModel.find();
  if (!allProducts) {
    throw new CustomError(404, "Products not available sorry!!");
  }
  
  //set at cache
  await cacheInstance.set("products", JSON.stringify(allProducts));

  return res.status(200).json({
    message: "Products fetched",
    success: true,
    products: allProducts,
  });
});
export const updateProductController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new CustomError(404, "Unauthorized user!");
  }
  let productId = req.params.productId;
  if (!productId) {
    throw new CustomError(400, "productId not found!!");
  }
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new CustomError(400, "product not found!!");
  }

  const {
    company,
    productModel,
    description,
    productType,
    gender,
    size,
    amount,
    currency,
  } = req.body;
  if (
    !company ||
    !productModel ||
    !description ||
    !productType ||
    !gender ||
    !size ||
    !amount
  ) {
    throw new CustomError(400, "all field are required");
  }
  const files = req.files;
  const imageArr = await Promise.all(
    await files.map(
      async (elem) => await UploadToStorage(elem.buffer, elem.originalname),
    ),
  );
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    {
      company,
      productModel,
      description,
      productType,
      gender,
      price: { amount, currency },
      images: imageArr.map((elem) => elem.url),
    },
    { new: true, runValidators: true },
  );
  //clear cahceproduct
  await cacheInstance.del("products");

  return res.status(200).json({
    message: "Product updated!!",
    success: true,
    updatedProduct,
  });
});
export const updateSingleProductController = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new CustomError(404, "Unauthorized user!");
  }
  let productId = req.params.productId;
  if (!productId) {
    throw new CustomError(400, "productId not found!!");
  }
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new CustomError(400, "product not found!!");
  }

  const updateData = req.body;
  if (!updateData) {
    throw new CustomError(400, "Data is required");
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    {
      $set: updateData,
    },
    { new: true, runValidators: true },
  );
  //clear cacheProducts
  await cacheInstance.del("products");
  return res.status(200).json({
    message: "Product updated!!",
    success: true,
    updatedProduct,
  });
});

export const deleteProductController = asyncHandler(async (req, res) => {
  let productId = req.params.productId;
  if (!productId) {
    throw new CustomError(400, "productId not found!!");
  }
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new CustomError(400, "product not found!!");
  }

  const deletedProduct = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { products: productId },
    },
    { new: true, runValidators: true },
  );
  //clear cacheProducts
  await cacheInstance.del("products");

  return res.status(200).json({
    message: "Product deleted!!",
    success: true,
    deletedProduct,
  });
});
