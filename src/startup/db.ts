import mongoose from 'mongoose';
import { Logger } from '../common/logger';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  try {
    await mongoose.connect(uri);
    Logger.info({ message: 'Connected to MongoDB' });
  } catch (error: any) {
    Logger.error({
      message: 'MongoDB connection failed',
      error_message: error.message,
    });
    process.exit(1);
  }
}
