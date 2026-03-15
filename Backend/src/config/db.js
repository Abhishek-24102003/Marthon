import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        let res = mongoose.connect(`${process.env.MONGODB_URI}/marthon`);
        if(res)return console.log("MongoDB Connected!!");
        
    } catch (error) {
        console.log("Failed to connect MongoDB!!");
        
    }
}