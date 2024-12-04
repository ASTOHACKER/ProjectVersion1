// ระบุว่าเป็น client component
'use client';

// นำเข้าโมดูลที่จำเป็น
import Link from "next/link";  // สำหรับสร้างลิงก์ภายในแอพ
import { signOut, useSession } from "next-auth/react";  // สำหรับจัดการ session และ logout
import { Button } from "@nextui-org/react";  // UI components

// คอมโพเนนต์ส่วนหัว
export default function SectionHeader({subHeader, mainHeader}) {
  // ดึงข้อมูล session ปัจจุบัน
  const { data: session } = useSession();

  // ส่วนแสดงผล UI
  return (
    // ส่วนหัวของแอพ
    <header className="flex items-center justify-between p-4">
      <div>
        {/* หัวข้อย่อย */}
        <h3 className="uppercase text-gray-500 font-semibold leading-4 ">
          {subHeader}
        </h3>
        {/* หัวข้อหลัก */}
        <h2 className="text-primary font-bold text-4xl italic">
          {mainHeader}
        </h2>
      </div>
      <div>
      </div>
    </header>
  );
}