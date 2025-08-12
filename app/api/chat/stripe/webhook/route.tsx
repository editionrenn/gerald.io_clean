import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature');
    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
    }

    // Read raw body for signature verification
    const buf = Buffer.from(await req.arrayBuffer());

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('[WH] Invalid signature:', err?.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // We attached the Clerk userId when creating the Checkout Session
        const userId =
          (session.client_reference_id as string | undefined) ||
          (session.metadata?.userId as string | undefined);

        if (!userId) {
          console.warn('[WH] checkout.session.completed without userId');
          break;
        }

        // Persist Stripe IDs and unlock access
        await clerkClient.users.updateUser(userId, {
          publicMetadata: { plan: 'pro' },
          privateMetadata: {
            stripeCustomerId: (session.customer as string) || undefined,
            stripeSubId: (session.subscription as string) || undefined,
          },
        });

        console.log('[WH] Upgraded user', userId, 'to pro');
        break;
      }

      // Optional future handling:
      // On cancel or non-payment, you can downgrade back to free.
      // NOTE: To implement, you’ll need a way to map Stripe customer/sub IDs back to Clerk user.
      // A simple approach is to search your own DB by those IDs (once you add a DB).
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'invoice.payment_failed': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        console.log('[WH] Subscription ended/paused/failed for customer', customerId);

        // TODO (when DB is added): lookup user by stripeCustomerId, then:
        // await clerkClient.users.updateUser(userId, { publicMetadata: { plan: 'free' } });

        break;
      }

      default:
        // No-op for other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('[WH] Handler error:', e);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
