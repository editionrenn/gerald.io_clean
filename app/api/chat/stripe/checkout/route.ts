import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // <- was '2024-06-20'
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const user = await currentUser();
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user?.emailAddresses?.[0]?.emailAddress,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=cancel`,
    metadata: { clerkUserId: userId },
  });

  return Response.json({ url: session.url });
}
