import Stripe from 'stripe';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // <- align here too
});

export async function POST(req: NextRequest) {
  // ... your existing webhook verification and handling ...
}
