'use client';

import { useState } from 'react';

type Plan = 'individual' | 'team';

const PRICE_IDS: Record<Plan, string> = {
  individual: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL!, // e.g. price_123
  team: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM!,             // e.g. price_456
};

export default function PricingPage() {
  const [loading, setLoading] = useState<Plan | null>(null);

  async function startCheckout(plan: Plan) {
    try {
      setLoading(plan);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: PRICE_IDS[plan],
          mode: 'subscription',
          // Stripe will bounce back here:
          successUrl: `${window.location.origin}/account?status=success`,
          cancelUrl: `${window.location.origin}/pricing?status=cancelled`,
        }),
      });

      if (!res.ok) throw new Error(`Checkout failed (${res.status})`);
      const { url } = await res.json();
      if (!url) throw new Error('Missing checkout URL');
      window.location.href = url; // redirect to Stripe
    } catch (err) {
      console.error(err);
      alert('Checkout error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  const btnCls =
    'inline-block px-6 py-3 rounded-xl font-semibold text-sm';
  const cardBorder = { borderColor: '#2b352b' as const };
  const badgeStyle = { background: '#0e1d0e', border: '1px solid #203320', color: '#C0FF00' };

  return (
    <main className="px-8 py-16">
      <h2 className="text-3xl font-bold mb-3 text-center">Pricing</h2>
      <p className="text-center text-gray-400 mb-10">
        Early Adopter Launch Pricing — lock it in for life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Individual */}
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={cardBorder}>
          <div className="inline-block text-[10px] px-2 py-1 rounded-full mb-3" style={badgeStyle}>
            Limited Time
          </div>
          <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--accent-color)' }}>Individual</h3>
          <div className="text-4xl font-bold mb-2">
            $17<span className="text-lg font-normal">/mo</span>
          </div>
          <ul className="text-sm mb-6 space-y-2">
            <li>✔ Unlimited chats with Gerald</li>
            <li>✔ Save & review conversation history</li>
            <li>✔ Early access to new features</li>
          </ul>
          <button
            className={btnCls}
            style={{ backgroundColor: 'var(--accent-color)', color: 'black', opacity: loading === 'individual' ? 0.7 : 1 }}
            onClick={() => startCheckout('individual')}
            disabled={loading !== null}
          >
            {loading === 'individual' ? 'Starting…' : 'Get Started'}
          </button>
        </div>

        {/* Team */}
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={cardBorder}>
          <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--accent-color)' }}>Team</h3>
          <div className="text-4xl font-bold mb-2">
            $79<span className="text-lg font-normal">/mo</span>
          </div>
          <div className="text-xs text-gray-400 mb-4">For up to 10 users</div>
          <ul className="text-sm mb-6 space-y-2">
            <li>✔ Everything in Individual</li>
            <li>✔ Manager analytics dashboard</li>
            <li>✔ Priority support</li>
          </ul>
          <button
            className={btnCls}
            style={{ backgroundColor: 'var(--accent-color)', color: 'black', opacity: loading === 'team' ? 0.7 : 1 }}
            onClick={() => startCheckout('team')}
            disabled={loading !== null}
          >
            {loading === 'team' ? 'Starting…' : 'Start Team Trial'}
          </button>
        </div>
      </div>
    </main>
  );
}
