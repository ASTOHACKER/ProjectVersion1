'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const payment_intent = searchParams.get('payment_intent');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!payment_intent) return;
      
      try {
        const response = await fetch(`/api/orders?payment_intent=${payment_intent}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [payment_intent]);

  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ขอบคุณสำหรับการสั่งซื้อ!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            คำสั่งซื้อของคุณได้รับการยืนยันเรียบร้อยแล้ว
          </p>
        </div>

        {orderDetails && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">รายละเอียดการสั่งซื้อ</h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">หมายเลขคำสั่งซื้อ</dt>
                <dd className="mt-1 text-sm text-gray-900">{orderDetails._id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ยอดรวมทั้งสิ้น</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ฿{orderDetails.totalAmount?.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ที่อยู่จัดส่ง</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {orderDetails.shippingDetails?.name}<br />
                  {orderDetails.shippingDetails?.address}<br />
                  {orderDetails.shippingDetails?.postalCode}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <Link
            href="/orders"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ดูประวัติการสั่งซื้อ
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
