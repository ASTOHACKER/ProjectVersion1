'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Avatar, Button, Divider } from "@nextui-org/react";
import Header from '../components/Header';
import { FaUser, FaEnvelope, FaCalendar, FaShoppingBag } from 'react-icons/fa';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState({});

  useEffect(() => {
    fetch('/api/auth/session')
      .then(response => response.json())
      .then(data => {
        setSession(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching session:', error);
        router.push('/login');
      });
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen p-8">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            {/* Profile Header */}
            <CardHeader className="flex flex-col md:flex-row gap-5 p-6 bg-gradient-to-r from-blue-500 to-blue-600">
              <Avatar
                radius="full"
                size="lg"
                src={session?.user?.image || 'https://ui-avatars.com/api/?name=' + session?.user?.name}
                className="w-24 h-24 text-large border-4 border-white"
              />
              <div className="flex flex-col gap-1 text-white">
                <h1 className="text-2xl font-bold">{session?.user?.name || 'ผู้ใช้งาน'}</h1>
                <p className="text-white/90">{session?.user?.email}</p>
              </div>
            </CardHeader>

            <CardBody className="p-6">
              {/* User Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    ข้อมูลส่วนตัว
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span className="font-medium">ชื่อ:</span>
                      <span>{session?.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="font-medium">อีเมล:</span>
                      <span>{session?.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-gray-400" />
                      <span className="font-medium">สมัครสมาชิกเมื่อ:</span>
                      <span>
                        {session?.user?.createdAt 
                          ? new Date(session.user.createdAt).toLocaleDateString('th-TH')
                          : 'ไม่ระบุ'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orders Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaShoppingBag className="text-blue-500" />
                    ประวัติการสั่งซื้อ
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-center">ยังไม่มีประวัติการสั่งซื้อ</p>
                  </div>
                </div>
              </div>

              <Divider className="my-6" />

              {/* Actions Section */}
              <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  color="secondary"
                  className="flex items-center gap-2"
                  onClick={() => router.push('/profile/edit')}
                >
                  <FaUser />
                  แก้ไขข้อมูลส่วนตัว
                </Button>
                <Button 
                  color="secondary"
                  variant="bordered"
                  className="flex items-center gap-2"
                  onClick={() => router.push('/orders')}
                >
                  <FaShoppingBag />
                  ดูประวัติการสั่งซื้อ
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
