import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCart } from '@/app/providers/CartProvider';

/**
 * Component สำหรับแสดง form ชำระเงิน
 * จะใช้ค่า amount และ formData ที่ส่งมาจาก props
 * amount คือ จำนวนเงินที่ต้องการชำระ
 * formData คือ ข้อมูลผู้ใช้ (name, address, phone, postalCode)
 */
export default function CheckoutForm({ amount, formData }) {
  const stripe = useStripe(); // ใช้ Stripe API
  const elements = useElements(); // ใช้ Stripe Elements
  const [isProcessing, setIsProcessing] = useState(false); // สถานะของการประมวลผล
  const router = useRouter(); // ใช้สำหรับ navigation
  const { clearCart } = useCart(); // ใช้สำหรับล้างตะกร้าสินค้า

  // ฟังก์ชันสำหรับประมวลผลชำระเงิน
  const handleSubmit = async (e) => {
    e.preventDefault(); // ห้าม refresh หน้า

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true); // กำหนดสถานะประมวลผล

    try {
      // ยืนยันการชำระเงินกับ Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`, // ส่ง redirect ไปยังหน้าสำเร็จ
          payment_method_data: {
            billing_details: {
              name: formData.name, // ส่งชื่อ
              phone: formData.phone, // ส่งเบอร์โทร
              address: {
                line1: formData.address, // ส่งที่อยู่
                postal_code: formData.postalCode, // ส่งรหัสไปรษณีย์
                country: 'TH' // ส่งประเทศ
              }
            }
          }
        }
      });

      if (error) {
        toast.error(error.message || 'เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
      } else {
        try {
          // บันทึกคำสั่งซื้อ
          const orderData = {
            items: JSON.parse(localStorage.getItem('cart') || '[]'), // ส่งสินค้าที่อยู่ในตะกร้า
            totalAmount: amount, // ส่งจำนวนเงินที่ต้องการชำระ
            status: 'processing', // ส่งสถานะคำสั่งซื้อ
            shippingDetails: formData, // ส่งข้อมูลผู้ใช้
            paymentIntentId: elements._elements.payment.intentId // ส่ง id ของ payment intent
          };

          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });

          if (!response.ok) {
            throw new Error('Failed to save order');
          }

          if (typeof clearCart === 'function') {
            clearCart(); // ล้างตะกร้าสินค้า
          }
          toast.success('ชำระเงินสำเร็จ! ขอบคุณที่ใช้บริการ');
          router.push('/order-success'); // ส่ง redirect ไปยังหน้าสำเร็จ
        } catch (err) {
          console.error('Error saving order:', err);
          toast.error('การชำระเงินสำเร็จแต่ไม่สามารถบันทึกคำสั่งซื้อได้');
        }
      }
    } catch (err) {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Payment error:', err);
    }

    setIsProcessing(false); // กำหนดสถานะประมวลผล
  };

  return (
    <div className="space-y-4">
      <PaymentElement /> {/* ส่วนแสดง form ชำระเงิน */}
      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg
                 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleSubmit}
      >
        {isProcessing ? 'กำลังประมวลผล...' : `ชำระเงิน ${amount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}`}
      </button>
    </div>
  );
}
