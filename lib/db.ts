import mongoose from "mongoose";

let cachedClient: mongoose.Mongoose | null = null;

const getMongoDBurl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.DB_DEV!
    : process.env.NODE_ENV === "test"
      ? process.env.DB_TEST!
      : process.env.DB_PROD!;
};

export const connectToDatabase = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const mongoDBUrl = getMongoDBurl();
    console.log(
      `Connecting to MongoDB on ${process.env.NODE_ENV} at ${mongoDBUrl}`,
    );
    cachedClient = await mongoose.connect(getMongoDBurl());
    console.log(`Connected to MongoDB!`);
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
