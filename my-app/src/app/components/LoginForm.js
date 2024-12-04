'use client';  // ระบุว่าเป็น client component

// นำเข้าโมดูลที่จำเป็น
import { useState } from "react";  // สำหรับจัดการ state
import { signIn } from 'next-auth/react';  // สำหรับ login
import { Input, Button } from "@nextui-org/react";  // UI components
import { useRouter } from 'next/navigation';  // สำหรับ navigation

// คอมโพเนนต์ฟอร์ม login
export default function LoginForm() {
  // สร้าง state สำหรับเก็บค่าต่างๆ
  const [email, setEmail] = useState('');  // อีเมล
  const [password, setPassword] = useState('');  // รหัสผ่าน
  const [error, setError] = useState('');  // ข้อความแสดงข้อผิดพลาด
  const [loading, setLoading] = useState(false);  // สถานะกำลังทำงาน
  const router = useRouter();  // สำหรับ navigation

  // ฟังก์ชันจัดการการ submit form
  async function handleSubmit(ev) {
    ev.preventDefault();  // ป้องกันการ reload หน้า
    setLoading(true);  // แสดงสถานะกำลังทำงาน
    setError('');  // ล้างข้อความแสดงข้อผิดพลาด

    try {
      // เรียกใช้ฟังก์ชัน login ของ NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,  // ไม่ให้ redirect อัตโนมัติ
      });

      // ตรวจสอบผลลัพธ์
      if (result?.error) {
        setError(result.error);  // แสดงข้อความผิดพลาด
      } else {
        router.push('/');  // redirect ไปหน้าแรก
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');  // แสดงข้อความผิดพลาดกรณีมี error
    } finally {
      setLoading(false);  // ปิดสถานะกำลังทำงาน
    }
  }

  // ส่วนแสดงผล UI
  return (
    <form onSubmit={handleSubmit} className="block max-w-xs mx-auto">
      {/* แสดงข้อความแสดงข้อผิดพลาด */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 my-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* ช่องกรอกอีเมล */}
      <Input
        type="email"
        label="อีเมล"
        value={email}
        onChange={ev => setEmail(ev.target.value)}
        required
        disabled={loading}
        className="mb-4"
      />

      {/* ช่องกรอกรหัสผ่าน */}
      <Input
        type="password"
        label="รหัสผ่าน"
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        required
        disabled={loading}
        className="mb-4"
      />

      {/* ปุ่ม submit */}
      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={loading}
        disabled={loading}
      >
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </Button>
    </form>
  );
}
