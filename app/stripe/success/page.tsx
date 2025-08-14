import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  // If no session id, just go home
  if (!searchParams?.session_id) {
    redirect('/'); 
  }

  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  try {
    // 1) Get session
    const session = await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ['subscription', 'customer'],
    });

    // 2) Confirm subscription is actually created/active (or trialing if free)
    const sub = session.subscription as Stripe.Subscription | null;

    const subActive =
      sub &&
      (sub.status === 'active' ||
        sub.status === 'trialing' ||
        sub.status === 'past_due' ||
        sub.status === 'unpaid'); // Stripe still considers these “has a subscription”

    if (!subActive) {
      // If we can’t confirm, send them to pricing gracefully
      redirect('/pricing?status=not_active');
    }

    // 3) Upgrade the user in Clerk so the /chat gate allows them in
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { plan: 'pro' },
    });

    // 4) Redirect to chat
    redirect('/chat?upgraded=1');
  } catch (err) {
    console.error('activate-on-success error:', err);
    redirect('/pricing?status=activate_failed');
  }
}
