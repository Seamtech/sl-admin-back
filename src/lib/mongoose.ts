import mongoose from 'mongoose';
import { Db } from 'mongodb';

const mongoURI = process.env.MONGODB_URI || '';

export async function initMongoConnection(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI);
  }
  return mongoose;
}

// Forcefully cast `db` to native Mongo `Db`
export const getMongoDb = (): Db => {
  const db = (mongoose.connection as any).db;
  if (!db) {
    throw new Error('MongoDB connection has not been established.');
  }
  return db as Db;
};
