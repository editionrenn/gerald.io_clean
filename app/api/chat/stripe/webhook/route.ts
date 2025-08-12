// app/api/chat/stripe/webhook/route.ts
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Match the version supported by your installed `stripe`
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const sig = req.headers.get('stripe-signature');
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !whsec) {
      return new Response('Missing webhook signature/secret', { status: 400 });
    }

    // Raw text body is required for signature verification
    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, whsec);
    } catch (err: any) {
      return new Response(`Webhook Error: ${err.message ?? String(err)}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Optional: read data to upgrade user plan via Clerk
      // const clerkUserId = session.metadata?.clerkUserId;

      // do your upgrade work here (call Clerk API, etc.)
    }

    return new Response('ok', { status: 200 });
  } catch (err: any) {
    return new Response(`Webhook handler error: ${err?.message ?? String(err)}`, { status: 500 });
  }
}

// (No GET—Stripe only POSTs webhooks)
