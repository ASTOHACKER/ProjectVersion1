import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/orders - Get all orders for the current user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const paymentIntent = searchParams.get('payment_intent');

    if (paymentIntent) {
      // If payment_intent is provided, return specific order
      const order = await Order.findOne({
        userId: session.user.id,
        paymentIntentId: paymentIntent
      });
      
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      return NextResponse.json(order);
    }

    // Otherwise return all orders for the user
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request) {
  try {
    console.log('เริ่มสร้างออเดอร์ใหม่...');
    
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('ไม่พบ session ผู้ใช้');
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ' }, { status: 401 });
    }
    console.log('ผู้ใช้:', session.user);

    const data = await request.json();
    console.log('ข้อมูลออเดอร์ที่ได้รับ:', data);

    await connectToDatabase();
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

    const order = new Order({
      userId: session.user.id,
      ...data,
    });
    console.log('สร้างออเดอร์:', order);

    await order.save();
    console.log('บันทึกออเดอร์สำเร็จ');
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างออเดอร์:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างออเดอร์ได้' },
      { status: 500 }
    );
  }
}
