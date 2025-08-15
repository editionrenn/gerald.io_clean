import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    // Optional body if you later want a toggle like { useCoupon: true }
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {
      /* no body is fine */
    }

    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!priceId || !baseUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing STRIPE_PRICE_ID_PRO or NEXT_PUBLIC_BASE_URL' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }

    const user = await currentUser().catch(() => null);
    const primaryEmail =
      user?.emailAddresses?.find(e => e.id === user.primaryEmailAddressId)?.emailAddress ??
      user?.emailAddresses?.[0]?.emailAddress ??
      undefined;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true, // Show “Add promotion code” on Stripe Checkout
      success_url: `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      customer_email: primaryEmail, // optional: Stripe will prefill the email
      client_reference_id: user?.id, // helpful to correlate in your webhook
      metadata: {
        clerkUserId: user?.id || '',
        clerkPrimaryEmail: primaryEmail || '',
        plan: 'pro',
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Checkout error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
