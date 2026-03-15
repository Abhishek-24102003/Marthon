import express from "express"
import { addToCartController, decrementproductCartController, deleteProductFromCartController, getCartController, updateCartController,  } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/addToCart/:productId/:size",addToCartController)
router.get("/",authMiddleware,getCartController)
router.post("/update/:productId/:quantity/:size",updateCartController)
router.post("/decrementProduct/:productId",decrementproductCartController)
router.post("/deleteProduct/:productId",deleteProductFromCartController)
export default router;
