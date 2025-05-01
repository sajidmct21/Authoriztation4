import mongoose from "mongoose";
import { seedBooksData } from "../seed.js";

export const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    if (process.argv.includes("--seed")) {
      await seedBooksData();
    }
    console.log(`DATABASE IS CONNECTED`);
  } catch (error) {
    console.log(`MongoDB connection failed\n`, error);
    process.exit(1);
  }
  ``;
};
