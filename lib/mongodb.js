import { MongoClient } from "mongodb";

const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(url, {
  serverApi: { version: "1" },
});

let db = null;
let isConnected = false;

export async function mongoUrl() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  if (!db) {
    db = client.db(dbName);
  }
  return db;
}
