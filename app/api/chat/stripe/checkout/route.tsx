import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
export const runtime = 'nodejs';

export async function POST() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

  // Find or create the Stripe customer by email (simple MVP approach)
  const existing = await stripe.customers.list({ email, limit: 1 });
  const customer = existing.data[0] || (await stripe.customers.create({ email }));

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customer.id,
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
    client_reference_id: userId,
    metadata: { userId },
    success_url: `${process.env.APP_URL}/chat?sub=success`,
    cancel_url: `${process.env.APP_URL}/pricing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
