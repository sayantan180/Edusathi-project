import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edusathi';
    if (!mongoURI) {
      console.error('MONGODB_URI is not defined in the environment variables');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB connection failed:', error instanceof Error ? error.message : String(error));
    console.log('Server will continue without MongoDB connection');
  }
};

export default connectDB;
