import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { orderplaced } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/order-placed",authMiddleware,orderplaced)
export default router;