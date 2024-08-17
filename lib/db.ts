import mongoose from "mongoose";

let cachedClient: mongoose.Mongoose | null = null;

export const connectToDatabase = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    process.env.NODE_ENV === "development"
      ? (cachedClient = await mongoose.connect(process.env.DB_DEV!))
      : process.env.NODE_ENV === "test"
        ? (cachedClient = await mongoose.connect(process.env.DB_TEST!))
        : await mongoose.connect(process.env.DB_PROD!);

    return cachedClient;
  } catch (error) {
    throw error;
  }
};
