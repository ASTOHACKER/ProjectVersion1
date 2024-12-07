"use client";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Shipping() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const shippingData = Object.fromEntries(formData.entries());

    try {
      // Create PaymentIntent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // Replace with actual amount
          shippingData,
        }),
      });

      const { clientSecret } = await response.json();

      // Load Stripe
      const stripe = await stripePromise;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        clientSecret,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/shipping`,
      });

      if (error) {
        console.error('Payment error:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">ข้อมูลการจัดส่ง</h1>
          <form onSubmit={handleSubmit} className="bg-white/30 p-8 rounded-lg backdrop-blur-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 rounded border bg-white/70"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full p-2 rounded border bg-white/70"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="address">
                ที่อยู่
              </label>
              <textarea
                id="address"
                rows="3"
                className="w-full p-2 rounded border bg-white/70"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="province">
                จังหวัด
              </label>
              <input
                type="text"
                id="province"
                className="w-full p-2 rounded border bg-white/70"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="district">
                เขต/อำเภอ
              </label>
              <input
                type="text"
                id="district"
                className="w-full p-2 rounded border bg-white/70"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="subdistrict">
                แขวง/ตำบล
              </label>
              <input
                type="text"
                id="subdistrict"
                className="w-full p-2 rounded border bg-white/70"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" htmlFor="zipcode">
                รหัสไปรษณีย์
              </label>
              <input
                type="text"
                id="zipcode"
                className="w-full p-2 rounded border bg-white/70"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              ดำเนินการต่อ
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
