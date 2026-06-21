import mongoose from "mongoose";

import { ENV } from "./env.js";

// Drop legacy indexes left over from old Clerk authentication
// clerkId_1 unique index causes E11000 when multiple users have no clerkId (null)
async function dropLegacyIndexes() {
  try {
    const usersCollection = mongoose.connection.collection("users");
    const indexes = await usersCollection.indexes();
    const legacyIndexNames = ["clerkId_1"]; // indexes that no longer belong in schema

    for (const name of legacyIndexNames) {
      if (indexes.find((idx) => idx.name === name)) {
        await usersCollection.dropIndex(name);
        console.log(`✅ Dropped legacy index: ${name}`);
      }
    }
  } catch (err) {
    // Non-fatal — log and continue
    console.warn("Could not clean up legacy indexes:", err.message);
  }
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("Connected to MongoDB:", conn.connection.host);
    await dropLegacyIndexes();
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
