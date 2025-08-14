import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: 'Not signed in' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { useCoupon = false } = body || {};

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      // IMPORTANT: use your real Price ID here
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
      customer_email: email,
      allow_promotion_codes: true,
      discounts: useCoupon && process.env.STRIPE_COUPON_ID_FREE
        ? [{ coupon: process.env.STRIPE_COUPON_ID_FREE }]
        : undefined,
      success_url: `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
      metadata: {
        clerkUserId: userId, // so webhook/success page knows who to upgrade
      },
    });

    return Response.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return Response.json({ error: 'Checkout error, try again.' }, { status: 500 });
  }
}
