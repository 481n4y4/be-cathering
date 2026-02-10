import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB is connected')
    } catch (err) {
        console.error("MongoDB connection error:", err)
        throw
    }
}

export default connectDB;