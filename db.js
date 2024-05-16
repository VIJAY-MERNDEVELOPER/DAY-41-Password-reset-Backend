import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGO_URL;
async function mongoConnection() {
  try {
    const client = new MongoClient(mongoUrl);
    console.log("Database connected");
    await client.connect();
    return client;
  } catch (error) {
    console.log("Error conncecting Database", error);
  }
}

export const client = await mongoConnection();
