import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/libs/mongoConnect';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // เชื่อมต่อกับ MongoDB
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
    });

    return NextResponse.json(
      { message: 'ลงทะเบียนสำเร็จ', userId: result.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
}