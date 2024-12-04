// นำเข้าโมดูลที่จำเป็น
import mongoose from "mongoose";  // ใช้สำหรับสร้าง Schema และ Model
import bcrypt from 'bcrypt';     // ใช้สำหรับเข้ารหัสรหัสผ่าน

// สร้าง Schema สำหรับผู้ใช้งาน
const UserSchema = new mongoose.Schema({
    // ชื่อผู้ใช้ (ไม่จำเป็นต้องกรอก เพราะอาจใช้ login ผ่าน Google)
    name: {
        type: String
    },
    // อีเมล (จำเป็นต้องกรอกและไม่ซ้ำกัน)
    email: {
        type: String,
        required: true,
        unique: true
    },
    // รหัสผ่าน (จำเป็นต้องกรอกและต้องมีความยาวอย่างน้อย 6 ตัวอักษร)
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(pass) {
                // ข้ามการตรวจสอบถ้าไม่มีการแก้ไขรหัสผ่าน
                if (!this.isModified('password')) return true;
                // ตรวจสอบความยาวรหัสผ่าน
                if (!pass?.length || pass.length < 6) {
                    throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
                }
                return true;
            }
        }
    },
    // รูปโปรไฟล์ (อาจได้จาก Google)
    image: String,
    // ที่อยู่ (เริ่มต้นเป็นค่าว่าง)
    address: {
        type: String,
        default: ''
    },
    // เบอร์โทรศัพท์ (เริ่มต้นเป็นค่าว่าง)
    tel: {
        type: String,
        default: ''
    }
}, {
    // เพิ่มฟิลด์ createdAt และ updatedAt อัตโนมัติ
    timestamps: true
});

// Middleware ก่อนบันทึกข้อมูล
UserSchema.pre('save', async function(next) {
    // ตรวจสอบว่ามีการแก้ไขรหัสผ่านหรือไม่
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // สร้าง salt และเข้ารหัสรหัสผ่าน
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// เมธอดสำหรับตรวจสอบรหัสผ่าน
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // เปรียบเทียบรหัสผ่านที่เข้ารหัสแล้ว
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// สร้างโมเดล (ถ้ายังไม่มี)
const User = mongoose.models?.User || mongoose.model('User', UserSchema);

// ส่งออกโมเดล
export default User;