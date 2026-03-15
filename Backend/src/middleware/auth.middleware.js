import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { cacheInstance } from "../services/Cache.service.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token){throw new CustomError(400,"token not found")}
    
    //check for blacklisted 
    let isBlacklisted = await cacheInstance.get(token);
    if (isBlacklisted) {throw new CustomError(403,"Unauthorized user! bhgjaaa")}
    
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decode) { throw new CustomError(404, "Unauthorized token") }

    //check at cahce first
   const cacheUserkey = `user:${decode.id}`;

const cacheUser = await cacheInstance.get(cacheUserkey);

if (cacheUser) {
  // convert plain object → mongoose document
  req.user = UserModel.hydrate(JSON.parse(cacheUser));
  return next();
}

    //check at db
    const user = await UserModel.findById(decode.id);
    req.user = user;
    //set cacheuser
      await cacheInstance.set(cacheUserkey, JSON.stringify(user), "EX", 60 * 60);
    next();
  
});
