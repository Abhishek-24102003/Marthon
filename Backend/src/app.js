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

// 1. CORS MUST BE FIRST
app.use(cors({
  origin: "https://marthon.vercel.app", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//for cache..
connectCache()

// Reconstruct __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ejs-->
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// googleAuthStrategy
GoogleStrategyConfig()
//authPassport
//apis->>
app.get("/", (req,res) => {
    res.send("chal gaya")
})
app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
app.use("/api/cart",authMiddleware,cartRouter);
app.use("/api/product", productRouter);

//error middleware after apis
app.use(errorMiddleware)