// app/api/stripe/checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  const { useCoupon } = await req.json().catch(() => ({}));

  const priceId = process.env.STRIPE_PRICE_ID_PRO!;
  const couponId = process.env.STRIPE_COUPON_ID_FREE || undefined;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!; // e.g. https://geraldio.com

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    discounts: useCoupon && couponId ? [{ coupon: couponId }] : undefined,
    success_url: `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
