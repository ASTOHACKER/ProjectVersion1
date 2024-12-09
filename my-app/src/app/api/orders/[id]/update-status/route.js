import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;
    const { status } = await request.json();

    // ตรวจสอบว่า status ที่ส่งมาถูกต้องตาม enum ที่กำหนดไว้
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'สถานะไม่ถูกต้อง' }, { status: 400 });
    }

    // อัพเดทสถานะออเดอร์
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'ไม่พบออเดอร์ที่ต้องการอัพเดท' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'อัพเดทสถานะสำเร็จ',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ' }, { status: 500 });
  }
}
