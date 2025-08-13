import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const plan: 'pro' | 'team' = body.plan === 'team' ? 'team' : 'pro';

  const PRICE_ID =
    plan === 'team'
      ? process.env.STRIPE_PRICE_ID_TEAM
      : process.env.STRIPE_PRICE_ID_PRO;

  if (!PRICE_ID) {
    return NextResponse.json({ error: 'Missing price id' }, { status: 500 });
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    undefined;

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL?.startsWith('http')
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${base}/account?status=success`,
    cancel_url: `${base}/pricing?status=cancelled`,
    metadata: { clerkUserId: userId, plan },
  });

  return NextResponse.json({ url: session.url });
}
