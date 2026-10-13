import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      const memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      process.env.MONGODB_URI = mongoUri;
      console.log("Using in-memory MongoDB for local development");
    }

    const normalizedUri = mongoUri.replace(/\/$/, "");
    await mongoose.connect(`${normalizedUri}/appointy`);
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
