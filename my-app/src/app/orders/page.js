'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">กรุณาเข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อ</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div>
    <Header/>
      <main className='h-screen'>
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ประวัติการสั่งซื้อ</h1>
      
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">ยังไม่มีประวัติการสั่งซื้อ</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium">หมายเลขคำสั่งซื้อ: {order._id}</p>
                  <p className="text-sm text-gray-600">
                    วันที่: {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'completed' ? 'เสร็จสมบูรณ์' :
                   order.status === 'processing' ? 'กำลังดำเนินการ' :
                   order.status === 'cancelled' ? 'ยกเลิก' : 'รอดำเนินการ'}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-600">
                          จำนวน: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="font-medium">ยอดรวมทั้งสิ้น:</p>
                  <p className="font-bold text-lg">
                    ฿{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      </main>
    </div>
  );
}
