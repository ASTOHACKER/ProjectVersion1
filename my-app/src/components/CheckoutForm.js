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
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { clearCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
          payment_method_data: {
            billing_details: {
              name: formData.name,
              phone: formData.phone,
              address: {
                line1: formData.address,
                postal_code: formData.postalCode,
                country: 'TH'
              }
            }
          }
        }
      });

      if (error) {
        toast.error(error.message || 'เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
      } else {
        try {
          // Save order information
          const orderData = {
            items: JSON.parse(localStorage.getItem('cart') || '[]'),
            totalAmount: amount,
            status: 'processing',
            shippingDetails: formData,
            paymentIntentId: elements._elements.payment.intentId
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
            clearCart();
          }
          toast.success('ชำระเงินสำเร็จ! ขอบคุณที่ใช้บริการ');
          router.push('/order-success');
        } catch (err) {
          console.error('Error saving order:', err);
          toast.error('การชำระเงินสำเร็จแต่ไม่สามารถบันทึกคำสั่งซื้อได้');
        }
      }
    } catch (err) {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Payment error:', err);
    }

    setIsProcessing(false);
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
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
