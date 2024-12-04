import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('กรุณากำหนดค่า MONGODB_URI ใน environment variables');
}

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('เชื่อมต่อ MongoDB สำเร็จ');
    return true;
  } catch (error) {
    console.error('เชื่อมต่อ MongoDB ล้มเหลว:', error);
    throw error;
  }
};

export default connectDB;