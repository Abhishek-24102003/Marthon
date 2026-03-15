import { cacheInstance } from "../services/Cache.service.js";

export const connectCache = () => {
    cacheInstance.on("connect", () => {
        console.log("Redis-Cache is connected");
        
    })
    cacheInstance.on("error", () => {
        console.log("Error in Redis-Cache");
        
    })
}