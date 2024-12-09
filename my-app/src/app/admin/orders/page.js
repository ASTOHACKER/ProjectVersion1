'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";

export default function AdminOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      toast.success('อัพเดทสถานะสำเร็จ');
      fetchOrders(); // รีเฟรชข้อมูลหลังอัพเดท
    } catch (error) {
      toast.error('ไม่สามารถอัพเดทสถานะได้');
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'เสร็จสมบูรณ์';
      case 'processing':
        return 'กำลังดำเนินการ';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return 'รอดำเนินการ';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">จัดการคำสั่งซื้อ</h1>
      
      <Table aria-label="Orders table">
        <TableHeader>
          <TableColumn>หมายเลขคำสั่งซื้อ</TableColumn>
          <TableColumn>วันที่</TableColumn>
          <TableColumn>ลูกค้า</TableColumn>
          <TableColumn>ยอดรวม</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn>การดำเนินการ</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString('th-TH')}
              </TableCell>
              <TableCell>{order.shippingDetails?.name}</TableCell>
              <TableCell>฿{order.totalAmount.toLocaleString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusText(order.status)}
                </span>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button 
                      variant="bordered" 
                      color={getStatusColor(order.status)}
                    >
                      เปลี่ยนสถานะ
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Order status actions"
                    onAction={(key) => updateOrderStatus(order._id, key)}
                  >
                    <DropdownItem key="pending">รอดำเนินการ</DropdownItem>
                    <DropdownItem key="processing">กำลังดำเนินการ</DropdownItem>
                    <DropdownItem key="completed">เสร็จสมบูรณ์</DropdownItem>
                    <DropdownItem key="cancelled" className="text-danger">ยกเลิก</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
