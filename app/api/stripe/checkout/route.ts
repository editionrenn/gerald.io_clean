import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const { email, useCoupon } = await req.json();

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      { price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
  };

  // If a coupon is being applied
  if (useCoupon) {
    params.discounts = [{ coupon: process.env.STRIPE_COUPON_ID_FREE! }];
  }

  const session = await stripe.checkout.sessions.create(params);
  return new Response(JSON.stringify({ url: session.url }), { status: 200 });
}
