import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/app/models/User';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/mongodb';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password } = body;

        // ตรวจสอบว่ามีอีเมลนี้ในระบบหรือไม่
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // ตรวจสอบรหัสผ่าน
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // ส่งข้อมูลผู้ใช้กลับไป (ไม่รวมรหัสผ่าน)
        const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        return NextResponse.json(userInfo);

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
            { status: 500 }
        );
    }
}
