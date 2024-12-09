import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount } = await request.json();

    // สร้าง PaymentIntent ด้ วยจำนวนเงินและสกุลเงิน
    // Stripe ต องการจำนวนเงินเป นหน วยเงินเล กท สุด (satang) ด งน นต องแปลงจำนวนเงินจากบาทเป น satang
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'thb',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return new Response(JSON.stringify({ error: 'Error creating payment intent' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
