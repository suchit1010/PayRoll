import { MongoClient, Db } from 'mongodb';

// Connection URI - should be in your environment variables
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'payroll_app';

interface MongoConnection {
  client: MongoClient | null;
  db: Db | null;
}

// Cache the MongoDB connection in development
let cached: MongoConnection = global.mongo as MongoConnection;

if (!cached) {
  cached = global.mongo = { client: null, db: null };
}

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cached.client && cached.db) {
    return cached;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!process.env.MONGODB_DB_NAME) {
    throw new Error('Please define the MONGODB_DB_NAME environment variable');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cached.client = client;
  cached.db = db;

  return cached;
}

// Example of getting a collection
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db!.collection(collectionName);
} 