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
        : (cachedClient = await mongoose.connect(process.env.DB_PROD!));

    console.log("Connected to MongoDB!");
    return cachedClient;
  } catch (error) {
    throw error;
  }
};

export const disconnectFromDatabase = async () => {
  if (cachedClient) {
    try {
      await mongoose.disconnect();
      cachedClient = null;
      console.log("Disconnected from MongoDB!");
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("No MongoDB connection to disconnect!");
  }
};
