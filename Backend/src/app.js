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
app.use((req, res, next) => {
  console.log("INCOMING ORIGIN:", JSON.stringify(req.headers.origin));
  next();
});

app.use(cors({ ... }));

app.use(cors({
  origin: (origin, callback) => {
    console.log("CORS CHECK ORIGIN:", JSON.stringify(origin)); // 👈 debug log

    const allowedOrigins = [
      "https://marthon.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    // Allow requests with no origin (Postman, server-to-server, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS BLOCKED:", origin); // 👈 see what's being blocked
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// NO app.options() line needed at all ✅
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