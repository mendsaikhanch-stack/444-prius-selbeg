import mongoose from 'mongoose';

export default async function connectDB(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        const delay = Math.min(2000 * Math.pow(2, i), 16000);
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('MongoDB connection failed after all retries. Server will continue without DB.');
}
