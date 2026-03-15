import { app } from "./src/app.js";
import { connectDb } from "./src/config/db.js";
import { cacheInstance } from "./src/services/Cache.service.js";
const port = process.env.PORT || 4000
connectDb()
app.listen(port, () => {
    console.log("Server started at port:",port);
    
})
