import Stripe from 'stripe';
import { clerkClient } from '@clerk/nextjs/server';

export const runtime = 'nodejs'; // must be Node, not Edge

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  // Get the raw body as text for signature verification
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!sig || !endpointSecret) {
    return new Response('Missing webhook signature or secret', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email =
          session.customer_details?.email || session.customer_email || undefined;

        if (email) {
          // Look up Clerk user by email
          const { data: users } = await clerkClient.users.getUserList({
            emailAddress: [email],
            limit: 1,
          });
          const user = users?.[0];
          if (user) {
            await clerkClient.users.updateUser(user.id, {
              publicMetadata: { ...(user.publicMetadata || {}), plan: 'pro' },
            });
          }
        }
        break;
      }

      // (Optional) You can handle subscription events too:
      // case 'customer.subscription.created':
      // case 'customer.subscription.updated':
      // case 'customer.subscription.deleted':
      //   // Keep plan status in sync if you like.
      //   break;

      default:
        // Ignore other event types
        break;
    }

    return new Response('ok', { status: 200 });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return new Response('Webhook Handler Error', { status: 500 });
  }
}
