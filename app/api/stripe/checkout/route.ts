// app/api/stripe/checkout/route.ts
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      console.error('Missing env STRIPE_PRICE_ID_PRO');
      return new Response('Missing price configuration', { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl()}/account?checkout=success`,
      cancel_url: `${siteUrl()}/pricing?checkout=cancel`,
      // helpful metadata for later
      metadata: { userId, plan: 'pro' },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return new Response('Checkout error', { status: 500 });
  }
}
