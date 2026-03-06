import prisma from './prisma.js';

export default async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Prisma connected to MongoDB');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
}
