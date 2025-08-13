import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Default to PRO price ID if none passed
    const priceId =
      body.priceId ||
      process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO; // Must match frontend env var

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing Stripe price ID' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: body.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/account?status=success`,
      cancel_url: body.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
