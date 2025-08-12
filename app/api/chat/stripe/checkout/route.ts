// app/api/chat/stripe/checkout/route.ts
import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Use an API version that matches the installed `stripe` package on Vercel
  // If you later upgrade `stripe`, you can bump this too.
  apiVersion: '2023-10-16',
});

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();

    const APP_URL = process.env.APP_URL;
    const PRICE_ID = process.env.STRIPE_PRICE_ID_PRO;

    if (!APP_URL || !PRICE_ID || !process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: 'Server misconfigured. Missing APP_URL or STRIPE_PRICE_ID_PRO or STRIPE_SECRET_KEY.' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${APP_URL}/chat?sub=success`,
      cancel_url: `${APP_URL}/pricing?canceled=1`,
      // Prefer passing a customer email if you’re not creating a Customer up-front
      customer_email: user?.emailAddresses?.[0]?.emailAddress,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      // Useful for your webhook to know which Clerk user to upgrade
      metadata: { clerkUserId: userId },
    });

    return Response.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return Response.json(
      { error: 'Stripe checkout error', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

// Optional: make POST-only explicit
export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
