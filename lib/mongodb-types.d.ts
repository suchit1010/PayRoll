import { MongoClient, Db } from 'mongodb';

declare global {
  var mongo: {
    client: MongoClient | null;
    db: Db | null;
  } | undefined;
} 