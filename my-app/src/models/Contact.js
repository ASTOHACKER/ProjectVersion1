// นำเข้าโมดูล mongoose สำหรับการสร้าง Schema และ Model
import mongoose from 'mongoose';

// สร้าง Schema สำหรับการติดต่อ
const contactSchema = new mongoose.Schema({
  // ชื่อผู้ติดต่อ - จำเป็นต้องกรอก
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อ'],
  },
  // อีเมลผู้ติดต่อ - จำเป็นต้องกรอกและต้องเป็นรูปแบบอีเมลที่ถูกต้อง
  email: {
    type: String,
    required: [true, 'กรุณากรอกอีเมล'],
    match: [/^\S+@\S+\.\S+$/, 'กรุณากรอกอีเมลที่ถูกต้อง'],
  },
  // ข้อความ - จำเป็นต้องกรอก
  message: {
    type: String,
    required: [true, 'กรุณากรอกข้อความ'],
  },
  // วันที่สร้าง - กำหนดค่าเริ่มต้นเป็นเวลาปัจจุบัน
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// สร้าง Model - ตรวจสอบว่ามี Model อยู่แล้วหรือไม่เพื่อป้องกันการสร้างซ้ำ
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// ส่งออก Model
export default Contact;
