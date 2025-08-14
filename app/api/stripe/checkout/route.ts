import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  // We accept JSON but don't require any fields
  try { await req.json(); } catch {}

  const priceId = process.env.STRIPE_PRICE_ID_PRO!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const user = await currentUser().catch(() => null);
  const email =
    (user?.primaryEmailAddress as any)?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    undefined;

const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
  allow_promotion_codes: true, // <-- shows the promo field
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
  customer_email: email, // optional
});

}
