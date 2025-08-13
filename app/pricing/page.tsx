'use client';

import { useState } from 'react';

const PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!; // STRIPE_PRICE_ID_PRO

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: PRICE_ID,
          mode: 'subscription',
          successUrl: `${window.location.origin}/account?status=success`,
          cancelUrl: `${window.location.origin}/pricing?status=cancelled`,
        }),
      });

      if (!res.ok) throw new Error(`Checkout failed (${res.status})`);
      const { url } = await res.json();
      if (!url) throw new Error('Missing checkout URL');
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert('Checkout error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const btnCls = 'inline-block px-6 py-3 rounded-xl font-semibold text-sm';
  const cardBorder = { borderColor: '#2b352b' as const };
  const badgeStyle = { background: '#0e1d0e', border: '1px solid #203320', color: '#C0FF00' };

  return (
    <main className="px-8 py-16">
      <h2 className="text-3xl font-bold mb-3 text-center">Pricing</h2>
      <p className="text-center text-gray-400 mb-10">
        Early Adopter Launch Pricing — lock it in for life.
      </p>

      <div className="max-w-md mx-auto">
        {/* PRO */}
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={cardBorder}>
          <div className="inline-block text-[10px] px-2 py-1 rounded-full mb-3" style={badgeStyle}>
            Limited Time
          </div>
          <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--accent-color)' }}>PRO</h3>
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
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'black',
              opacity: loading ? 0.7 : 1,
            }}
            onClick={startCheckout}
            disabled={loading}
          >
            {loading ? 'Starting…' : 'Get Started'}
          </button>
        </div>
      </div>
    </main>
  );
}
