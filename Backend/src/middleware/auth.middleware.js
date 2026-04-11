import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { cacheInstance } from "../services/Cache.service.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.cookies.accessToken ;
  if (!token) throw new CustomError(400, "Token not found");

  // Check blacklist
  const isBlacklisted = await cacheInstance.get(token);
  if (isBlacklisted) throw new CustomError(403, "Unauthorized user");

  // Verify token safely
  let decode;
  try {
    decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new CustomError(401, "Invalid or expired token");
  }

  // Check cache first
  const cacheUserKey = `user:${decode.id}`;
  const cacheUser = await cacheInstance.get(cacheUserKey);
  if (cacheUser) {
    req.user = UserModel.hydrate(JSON.parse(cacheUser));
    return next();
  }

  // Fallback to DB
  const user = await UserModel.findById(decode.id);
  if (!user) throw new CustomError(404, "User not found");

  req.user = user;
  await cacheInstance.set(cacheUserKey, JSON.stringify(user), "EX", 60 * 60);
  next();
});
