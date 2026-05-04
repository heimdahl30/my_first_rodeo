import { connect, disconnect } from 'mongoose';

export const connectToDB = async () => {
  await connect(process.env.MONGODB_URL as string);
  console.log('Database connected');
};

export const disconnectFromDB = async () => {
  await disconnect();
  console.log('Disconnected from database');
};
