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
const allowedOrigins = [
    "https://marthon.vercel.app",
    "https://marthon-abhisheks-projects-ae455745.vercel.app" // No slash at the end!
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Apply the same config to options
app.options("*", cors());

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