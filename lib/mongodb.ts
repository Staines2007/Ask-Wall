import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

let isInMemory = false;

export async function connectDB() {
  if (isInMemory) return;
  
  // Only skip if fully connected (readyState === 1)
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If we are connecting to a remote Atlas DB from a sandbox local host,
  // we can expect it to fail. We fail-fast to avoid query buffering timeouts.
  if (MONGODB_URI.includes("mongodb.net") && process.env.NODE_ENV !== "production") {
    console.warn("Local sandbox dev detected with remote Atlas URI. Falling back to in-memory store immediately.");
    isInMemory = true;
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.warn("MongoDB connection failed, falling back to in-memory store:", error);
    isInMemory = true;
  }
}

export function shouldUseInMemory() {
  return isInMemory;
}