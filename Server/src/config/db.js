import mongoose from 'mongoose';

/**
 * Global cache to persist Mongoose connection across Vercel serverless function warm containers.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // If already connected and ready, return existing connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[MongoDB Error] MONGODB_URI environment variable is missing.');
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5s timeout to avoid Vercel serverless function freezing
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    };

    console.log('[MongoDB] Initiating connection...');

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB] Connected successfully: ${mongooseInstance.connection.host}`);
        cached.conn = mongooseInstance.connection;
        return cached.conn;
      })
      .catch((error) => {
        cached.promise = null; // Clear promise so subsequent requests can retry
        console.error('[MongoDB] Connection error:', error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};
