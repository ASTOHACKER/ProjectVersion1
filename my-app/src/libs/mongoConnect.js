// วิธีการนี้อ้างอิงจาก https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
// นำเข้าโมดูลที่จำเป็น
import { MongoClient } from "mongodb";  // สำหรับเชื่อมต่อ MongoDB

// ตรวจสอบว่ามีการกำหนด MONGODB_URI ใน environment variables หรือไม่
if (!process.env.MONGODB_URI) {
  throw new Error('กรุณากำหนดค่า MONGODB_URI ใน environment variables');
}

// กำหนดค่าการเชื่อมต่อ
const uri = process.env.MONGODB_URI;  // URL สำหรับเชื่อมต่อ MongoDB
const options = {};  // ตัวเลือกเพิ่มเติมสำหรับการเชื่อมต่อ

// ตัวแปรสำหรับเก็บการเชื่อมต่อ
let client;
let clientPromise;

// จัดการการเชื่อมต่อตามโหมดการทำงาน
if (process.env.NODE_ENV === "development") {
  // ในโหมด development ใช้ตัวแปร global เพื่อเก็บการเชื่อมต่อ
  // เพื่อไม่ให้มีการสร้างการเชื่อมต่อใหม่ทุกครั้งที่มีการ reload โค้ด
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // ในโหมด production สร้างการเชื่อมต่อใหม่
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ส่งออก clientPromise สำหรับใช้ในโมดูลอื่น
export default clientPromise;
