import Stripe from 'stripe';

// ❌ remove the apiVersion option
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { email, useCoupon } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
    discounts: useCoupon && process.env.STRIPE_COUPON_ID_FREE
      ? [{ coupon: process.env.STRIPE_COUPON_ID_FREE }]
      : undefined,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?status=cancelled`,
  });

  return Response.json({ url: session.url });
}
