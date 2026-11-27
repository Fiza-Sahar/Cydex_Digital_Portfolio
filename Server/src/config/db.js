
import mongoose from 'mongoose';

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI)
      .then((connection) => {
        console.log(
          `[MongoDB] Connected: ${connection.connection.host}`
        );
        return connection.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error('[MongoDB] Connection failed:', error.message);
        throw error;
      });
  }

  return connectionPromise;
};
