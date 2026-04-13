const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI tidak ditemukan di environment variables");
    }

    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, 
      serverSelectionTimeoutMS: 5000, 
    })
    .then((mongooseInstance) => {
      console.log("🔥 MongoDB Connected:", mongooseInstance.connection.host);
      return mongooseInstance;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;