import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createProductController, deleteProductController, getAllProductController, getSingleProductController, updateProductController, updateSingleProductController } from "../controllers/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();
router.post("/createProduct", authMiddleware, upload.array("images",5), createProductController);
router.get("/", getAllProductController);
router.get("/:productId", getSingleProductController);
router.put("/update/:productId",authMiddleware,upload.array("images",5) ,updateProductController);
router.patch("/updateSingle/:productId",authMiddleware,updateSingleProductController);
router.delete("/delete/:productId",authMiddleware,deleteProductController)
export default router;