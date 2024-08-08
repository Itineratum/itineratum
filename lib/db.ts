import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export const connectToDatabase = async () => {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.DB_URI!);
  await client.connect();

  let dbName: string = "";
  switch (process.env.NODE_ENV) {
    case "development":
      dbName = process.env.DB_DEV!;
      break;
    case "test":
      dbName = process.env.DB_TEST!;
      break;
    case "production":
      dbName = process.env.DB_PROD!;
      break;
    default:
      dbName = process.env.DB_DEV!;
  }

  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
};
