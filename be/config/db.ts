import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    console.log(process.env.MONGODB_URI );
    const connection = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB connected to host: ${connection.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
};

export default connectDB;
