'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Header from '../components/Header'
import { useCart } from '../providers/CartProvider'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import CheckoutForm from '@/components/CheckoutForm'

// Make sure to add your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Shipping() {
  const router = useRouter()
  const { cartItems: cart = [], clearCart } = useCart() || { cartItems: [], clearCart: () => {} }
  const [clientSecret, setClientSecret] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    postalCode: '', 
    phone: '',
    paymentMethod: 'cod',
  })

  // คำนวณราคารวมของสินค้าในตะกร้า
  const calculateSubtotal = () => {
    if (!Array.isArray(cart)) return 0
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
  }

  const shippingCost = 30  // ค่าจัดส่งคงที่
  const codFee = 15 // ค่าธรรมเนียม COD

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const codCharge = formData.paymentMethod === 'cod' ? codFee : 0
    return subtotal + shippingCost + codCharge
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // If switching to credit card payment, create payment intent
    if (name === 'paymentMethod' && value === 'credit') {
      createPaymentIntent()
    }
  }

  const createPaymentIntent = async () => {
    if (cart && cart.length > 0) {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: calculateTotal() }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        toast.error('ไม่สามารถเชื่อมต่อกับระบบชำระเงินได้');
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
    if (!Array.isArray(cart) || cart.length === 0) {
      toast.error('กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ')
      router.push('/menu')
      return
    }

    // สร้างข้อมูลออเดอร์
    const orderData = {
      items: cart,
      totalAmount: calculateTotal(),
      status: formData.paymentMethod === 'cod' ? 'pending' : 'processing',
      shippingDetails: {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        postalCode: formData.postalCode,
        note: formData.note || ''
      },
      paymentMethod: formData.paymentMethod === 'cod' ? 'COD' : 'Stripe'
    };

    // For COD payments
    if (formData.paymentMethod === 'cod') {
      try {
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
        
        toast.success('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
        router.push('/order-success');
      } catch (error) {
        toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        console.error('Order error:', error);
      }
    }
  }

  const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
          payment_method_data: {
            billing_details: {
              name: formData.name,
              email: session?.user?.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                postal_code: formData.postalCode,
                country: 'TH'
              }
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        toast.error(error.message || 'เกิดข้อผิดพลาดในการชำระเงิน');
        return;
      }

      // บันทึกออเดอร์หลังจากชำระเงินสำเร็จ
      const orderData = {
        items: cart,
        totalAmount: calculateTotal(),
        status: 'processing',
        shippingDetails: {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          postalCode: formData.postalCode,
          note: formData.note || ''
        },
        paymentMethod: 'Stripe',
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to save order');
      }

      if (typeof clearCart === 'function') {
        clearCart();
      }

      toast.success('ชำระเงินสำเร็จ! กำลังดำเนินการสั่งซื้อ');
      router.push(`/order-success?payment_intent=${paymentIntent.id}`);
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB'
    })
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
    },
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">ข้อมูลการจัดส่ง</h1>

          {/* Order Summary Section */}
          <div className="mb-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">สรุปรายการสั่งซื้อ</h2>
            {Array.isArray(cart) && cart.length > 0 ? (
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>{item.name} x {item.quantity || 1}</span>
                    <span>{formatPrice(item.price * (item.quantity || 1))}</span>
                  </div>
                ))}
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>ราคาสินค้ารวม</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>ค่าจัดส่ง</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                {formData.paymentMethod === 'cod' && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>ค่าธรรมเนียม COD</span>
                    <span>{formatPrice(codFee)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>ยอดรวมทั้งหมด</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                <p>ไม่มีสินค้าในตะกร้า</p>
                <button
                  onClick={() => router.push('/menu')}
                  className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  กลับไปเลือกสินค้า
                </button>
              </div>
            )}
          </div>
        
          {/* Form/Div Container based on payment method */}
          {formData.paymentMethod === 'credit' ? (
            <div className="space-y-6">
              {/* Shipping Information Fields */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  ชื่อผู้รับ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition duration-150 ease-in-out"
                required
                  placeholder="กรุณากรอกชื่อผู้รับ"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  ที่อยู่จัดส่ง
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-150 ease-in-out"
                  rows="3"
                  required
                  placeholder="กรุณากรอกที่อยู่จัดส่ง"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-150 ease-in-out"
                  required
                  maxLength="5"
                  pattern="[0-9]{5}"
                  placeholder="กรุณากรอกรหัสไปรษณีย์ 5 หลัก"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-150 ease-in-out"
                  required
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  วิธีการชำระเงิน
                </label>
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">เก็บเงินปลายทาง (COD)</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">จ่ายเงินเมื่อได้รับสินค้า + ค่าธรรมเนียม {formatPrice(codFee)}</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">บัตรเครดิต/เดบิต (Stripe)</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ชำระผ่านบัตรเครดิตหรือเดบิตด้วย Stripe (ไม่มีค่าธรรมเนียม)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Stripe Elements */}
              {clientSecret && (
                <div className="mt-8">
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm amount={calculateTotal()} formData={formData} handleStripePayment={handleStripePayment} />
                  </Elements>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Same form fields as above for COD */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  ชื่อผู้รับ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-150 ease-in-out"
                  required
                  placeholder="กรุณากรอกชื่อผู้รับ"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  ที่อยู่จัดส่ง
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-150 ease-in-out"
                  rows="3"
                  required
                  placeholder="กรุณากรอกที่อยู่จัดส่ง"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-150 ease-in-out"
                  required
                  maxLength="5"
                  pattern="[0-9]{5}"
                  placeholder="กรุณากรอกรหัสไปรษณีย์ 5 หลัก"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-150 ease-in-out"
                  required
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  วิธีการชำระเงิน
                </label>
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">เก็บเงินปลายทาง (COD)</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">จ่ายเงินเมื่อได้รับสินค้า + ค่าธรรมเนียม {formatPrice(codFee)}</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">บัตรเครดิต/เดบิต (Stripe)</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ชำระผ่านบัตรเครดิตหรือเดบิตด้วย Stripe (ไม่มีค่าธรรมเนียม)</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg
                         transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500
                         mt-6"
                disabled={!Array.isArray(cart) || cart.length === 0}
              >
                {Array.isArray(cart) && cart.length > 0 
                  ? `ยืนยันการสั่งซื้อ (${formatPrice(calculateTotal())})`
                  : 'กรุณาเลือกสินค้าก่อนสั่งซื้อ'
                }
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
