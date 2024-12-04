'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import Header from '../components/Header';
import Footer from "../components/footer/page";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // ตรวจสอบความถูกต้องของข้อมูล
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login?registered=true');
      } else {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen">
        <Header />
        <main className="max-w-6xl mx-auto p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-8">
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-center text-indigo-600 text-4xl font-bold mb-8">สมัครสมาชิก</h1>
            <p className="text-center text-gray-500 mt-2">ยินดีต้อนรับกลับมา</p>ก
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center">
                  {error}
                </div>
              )}
              
              <Input
                name="name"
                placeholder="ชื่อผู้ใช้"
                value={formData.name}
                onChange={handleChange}
                isDisabled={isLoading}
              />
              
              <Input
                name="email"
                type="email"
                placeholder="อีเมล"
                value={formData.email}
                onChange={handleChange}
                isDisabled={isLoading}
              />
              
              <Input
                name="password"
                type="password"
                placeholder="รหัสผ่าน"
                value={formData.password}
                onChange={handleChange}
                isDisabled={isLoading}
              />
              
              <Input
                name="confirmPassword"
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                value={formData.confirmPassword}
                onChange={handleChange}
                isDisabled={isLoading}
              />
              
              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/login" className="text-indigo-600 hover:underline">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </div>
          <Footer/>
        </main>
       
      </div>
    </>
  );
}
