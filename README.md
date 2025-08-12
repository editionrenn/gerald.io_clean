# GERALD.io

AI-powered sales coaching (Next.js App Router + Clerk + OpenAI + Stripe).

## What this repo includes
- Auth (Clerk)
- Gated chat (requires plan: `pro` or `team`)
- Stripe Checkout (subscribe) + Billing Portal (manage)
- Webhook that sets the Clerk plan on payment

---

## Prereqs
- Node 18+
- Git + GitHub + Vercel
- Clerk account (Production keys)
- Stripe account (Test mode OK)
- OpenAI API key

## Env Vars (development + Vercel)
Create `.env.local` (and mirror these in Vercel → Settings → Environment Variables):

