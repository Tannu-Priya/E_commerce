import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n⚠️  Could not connect to MongoDB!');
    console.error('📖 Please check your MONGODB_URI in the .env file\n');
    console.error('For MongoDB Atlas:');
    console.error('1. Create a free cluster at https://www.mongodb.com/cloud/atlas');
    console.error('2. Get your connection string from Atlas');
    console.error('3. Update MONGODB_URI in backend/.env file');
    console.error('4. Make sure to whitelist your IP address in Atlas\n');
    process.exit(1);
  }
};

export default connectDB;
