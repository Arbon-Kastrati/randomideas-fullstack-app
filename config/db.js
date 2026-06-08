import mongoose from 'mongoose';

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`The MongoDB connection is set, host:${conn.connection.host}`);
};

export default connectDB;
