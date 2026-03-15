import express from "express";
export const app = express();
import cors from "cors"
import authRouter from "./Router/auth.routes.js"
import userRouter from "./Router/user.routes.js"
import cartRouter from "./Router/cart.routes.js"
import productRouter from "./Router/product.routes.js"
import cookieParser from "cookie-parser";
import { connectCache } from "./config/connectCache.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { GoogleStrategyConfig } from "./config/Auth.Google.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import path from "path";
import { fileURLToPath } from 'url';
// Reconstruct __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(cookieParser())
//for cache..
connectCache()
//for form-data
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "https://marthon-abhisheks-projects-ae455745.vercel.app/",
    credentials:true
}))

// ejs-->
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// googleAuthStrategy
GoogleStrategyConfig()
//authPassport
//apis->>
app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
app.use("/api/cart",authMiddleware,cartRouter);
app.use("/api/product", productRouter);

//error middleware after apis
app.use(errorMiddleware)