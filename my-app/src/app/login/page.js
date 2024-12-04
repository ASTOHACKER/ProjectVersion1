'use client'; // ระบุว่าเป็น client component

// นำเข้าโมดูลที่จำเป็น
import Link from "next/link";  // สำหรับสร้างลิงก์ภายในแอพ
import { useState, useEffect } from "react";  // สำหรับจัดการ state
import { signIn } from 'next-auth/react';  // ฟังก์ชัน login จาก NextAuth
import { Input, Button, Card, CardBody } from "@nextui-org/react";  // UI components
import { useSearchParams } from 'next/navigation';  // สำหรับอ่านค่า query parameters
import Header from '../components/Header';  // Header component
import Footer from "../components/footer/page";

// คอมโพเนนต์หน้า Login
export default function LoginPage() {
  // สร้าง state สำหรับเก็บค่าต่างๆ
  const [email, setEmail] = useState('');  // อีเมล
  const [password, setPassword] = useState('');  // รหัสผ่าน
  const [error, setError] = useState('');  // ข้อความแสดงข้อผิดพลาด
  const [success, setSuccess] = useState('');  // ข้อความแสดงข้อความสำเร็จ
  const [loginProgress, setLoginProgress] = useState(false);  // สถานะกำลัง login
  
  // อ่านค่า query parameters สำหรับ redirect หลัง login
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/menu';

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('ลงทะเบียนเสร็จสิ้น กรุณาเข้าสู่ระบบ');
    }
  }, [searchParams]);

  // ฟังก์ชันจัดการการ submit form
  async function handleSubmit(ev) {
    ev.preventDefault();  // ป้องกันการ reload หน้า
    setError('');  // ล้างข้อความแสดงข้อผิดพลาด
    setSuccess('');  // ล้างข้อความแสดงข้อความสำเร็จ
    setLoginProgress(true);  // แสดงสถานะกำลัง login

    try {
      // เรียกใช้ฟังก์ชัน login ของ NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,  // ไม่ให้ redirect อัตโนมัติ
        callbackUrl,  // URL ที่จะ redirect ไปหลัง login สำเร็จ
      });

      // ตรวจสอบผลลัพธ์
      if (result?.error) {
        setError(result.error);  // แสดงข้อความผิดพลาด
      } else {
        window.location.href = callbackUrl;  // redirect ไปหน้าที่กำหนด
      }
    } catch (e) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');  // แสดงข้อความผิดพลาดกรณีมี error
    } finally {
      setLoginProgress(false);  // ปิดสถานะกำลัง login
    }
  }

  // ส่วนแสดงผล UI
  return (
    <div className="h-screen">
      <Header />
      <main className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-8">
        <section className="mt-8">
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <section className="mb-8">
              <h1 className="text-center text-indigo-600 text-4xl font-bold">เข้าสู่ระบบ</h1>
              <p className="text-center text-gray-500 mt-2">ยินดีต้อนรับกลับมา</p>
            </section>

            {/* form สำหรับ login ด้วยอีเมลและรหัสผ่าน */}
            <Card className="p-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* ช่องกรอกอีเมล */}
                  <Input
                    type="email"
                    placeholder="อีเมล"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    isDisabled={loginProgress}
                  />
                  {/* ช่องกรอกรหัสผ่าน */}
                  <Input
                    type="password"
                    placeholder="รหัสผ่าน"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    isDisabled={loginProgress}
                  />
                  {/* ปุ่ม submit */}
                  <Button
                    type="submit"
                    color="primary"
                    className="w-full"
                    isLoading={loginProgress}
                    disabled={loginProgress}
                  >
                    {loginProgress ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </Button>
                </form>
                {/* ลิงก์ไปหน้าลงทะเบียน */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    ยังไม่มีบัญชี?{' '}
                    <Link href="/register" className="text-primary underline">
                      ลงทะเบียน &raquo;
                    </Link>
                  </p>
                </div>
            </Card>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}