// src/config/db.ts
import mongoose from "mongoose";
const PROJECT_NAME = process.env.PROJECT_NAME || "test";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: PROJECT_NAME,
    });
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
    
  }
};

export default connectDB;
