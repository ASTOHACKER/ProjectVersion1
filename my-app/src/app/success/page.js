"use client";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // You can add any post-payment success logic here
  }, []);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center bg-white/30 p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-4">✅ การชำระเงินสำเร็จ</h1>
          <p className="mb-8">ขอบคุณสำหรับการสั่งซื้อ</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </main>
    </>
  );
}
