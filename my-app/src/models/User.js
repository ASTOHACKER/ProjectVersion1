// นำเข้า mongoose สำหรับการสร้าง Schema และ Model
import mongoose from 'mongoose';
// นำเข้า bcrypt สำหรับการเข้ารหัสรหัสผ่าน
import bcrypt from 'bcrypt';

// สร้าง Schema สำหรับผู้ใช้งาน
const UserSchema = new mongoose.Schema({
  // ชื่อผู้ใช้งาน - จำเป็นต้องกรอก
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อ']
  },
  // อีเมล - จำเป็นต้องกรอก, ไม่ซ้ำกัน, ตัวพิมพ์เล็ก, ตัดช่องว่าง
  email: {
    type: String,
    required: [true, 'กรุณากรอกอีเมล'],
    unique: true,
    lowercase: true,
    trim: true
  },
  // รหัสผ่าน - จำเป็นต้องกรอก, ความยาวขั้นต่ำ 6 ตัวอักษร
  password: {
    type: String,
    required: [true, 'กรุณากรอกรหัสผ่าน'],
    minlength: [6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร']
  }
}, {
  // เพิ่มการประทับเวลา (createdAt, updatedAt)
  timestamps: true
});

// Middleware ก่อนการบันทึก - เข้ารหัสรหัสผ่าน
UserSchema.pre('save', async function(next) {
  // ตรวจสอบว่ามีการแก้ไขรหัสผ่านหรือไม่
  if (!this.isModified('password')) return next();
  
  try {
    // สร้าง salt และเข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// สร้าง Model - ตรวจสอบว่ามี Model อยู่แล้วหรือไม่เพื่อป้องกันการสร้างซ้ำ
const User = mongoose.models?.User || mongoose.model('User', UserSchema);

// ส่งออก Model
export default User; 