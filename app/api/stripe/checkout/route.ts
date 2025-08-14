import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs'; // ensure Node runtime (not Edge)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  // ignore the body, but don't crash if it's empty
  try { await req.json(); } catch {}

  const priceId = process.env.STRIPE_PRICE_ID_PRO!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const user = await currentUser().catch(() => null);

  // Pull the primary email safely with types
  const primaryEmail =
    user?.emailAddresses?.find(e => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    undefined;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true, // show "Add promotion code"
    success_url: `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    customer_email: primaryEmail, // optional
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
