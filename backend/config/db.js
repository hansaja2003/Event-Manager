import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Prefer project .env convention to avoid conflicts with machine-level MONGO_URI values.
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MongoDB URI. Set MONGO_URI or MONGODB_URI in .env");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;



