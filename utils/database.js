import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export const connectToDB = async () => {
    mongoose.set("strictQuery", true); // Set strictQuery to true
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_prompt",
        });
        isConnected = true;
        console.log("MongoDB connected successfully");
    }catch (error) {
        console.log("MongoDB connection failed", error);
    }
}
