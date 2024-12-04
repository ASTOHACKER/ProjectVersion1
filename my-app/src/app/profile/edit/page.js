'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button } from "@nextui-org/react";
export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      });
      setIsLoading(false);
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 h-screen">
      <Card className="w-full">
        <CardBody className="px-6 py-4">
          <h4 className="text-xl font-bold mb-4">แก้ไขข้อมูลส่วนตัว</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                label="ชื่อ"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                label="อีเมล"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled
              />
              <p className="text-small text-gray-500">ไม่สามารถแก้ไขอีเมลได้</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                color="primary"
                isLoading={isSaving}
                disabled={isSaving}
                auto
              >
                บันทึกการเปลี่ยนแปลง
              </Button>
              <Button
                variant="flat"
                color="default"
                onClick={() => router.push('/profile')}
                disabled={isSaving}
                auto
              >
                ยกเลิก
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
