import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rakshith_portfolio';

  if (isConnected) {
    console.log('MongoDB already connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(` MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(`
----------------------------------------------------------------------
[NOTICE] MongoDB is not currently reachable at: ${uri}
To connect to MongoDB Atlas:
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Copy your connection string into backend/.env:
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio
----------------------------------------------------------------------
    `);
    // Do not terminate process so backend can still serve health check and file uploads
  }
};

export const getDBStatus = () => isConnected || mongoose.connection.readyState === 1;
