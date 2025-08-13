'use client';

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';

export default function PricingPage() {
  const { isLoaded } = useUser();

  async function startCheckout(plan: 'pro' | 'team') {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });

    if (!res.ok) {
      alert('Checkout error. Please try again.');
      return;
    }

    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  function signInRedirect(plan: 'pro' | 'team') {
    // After login, send them back to pricing and auto-open checkout
    const redirect = encodeURIComponent(`/pricing?start=${plan}`);
    window.location.href = `/sign-in?redirect_url=${redirect}`;
  }

  // Auto-start checkout if we came back from sign-in with ?start=pro|team
  if (typeof window !== 'undefined' && isLoaded) {
    const params = new URLSearchParams(window.location.search);
    const start = params.get('start');
    if (start === 'pro' || start === 'team') {
      // remove the param so it doesn’t loop if user cancels
      params.delete('start');
      const url = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', url.endsWith('?') ? url.slice(0, -1) : url);
      startCheckout(start);
    }
  }

  return (
    <main className="px-8 py-16">
      <h2 className="text-3xl font-bold mb-3 text-center">Pricing</h2>
      <p className="text-center text-gray-400 mb-10">
        Early Adopter Launch Pricing — lock it in for life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Individual / Pro */}
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={{ borderColor: "#2b352b" }}>
          <div className="inline-block text-[10px] px-2 py-1 rounded-full mb-3"
               style={{background:"#0e1d0e", border:"1px solid #203320", color:"#C0FF00"}}>
            Limited Time
          </div>
          <h3 className="font-semibold text-xl mb-2" style={{ color: "var(--accent-color)" }}>Individual</h3>
          <div className="text-4xl font-bold mb-2">$17<span className="text-lg font-normal">/mo</span></div>
          <ul className="text-sm mb-6 space-y-2">
            <li>✔ Unlimited chats with Gerald</li>
            <li>✔ Save & review conversation history</li>
            <li>✔ Early access to new features</li>
          </ul>

          <SignedIn>
            <button
              onClick={() => startCheckout('pro')}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "var(--accent-color)", color: "black" }}
            >
              Get Started
            </button>
          </SignedIn>
          <SignedOut>
            <button
              onClick={() => signInRedirect('pro')}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "var(--accent-color)", color: "black" }}
            >
              Get Started
            </button>
          </SignedOut>
        </div>

        {/* Team */}
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={{ borderColor: "#2b352b" }}>
          <h3 className="font-semibold text-xl mb-2" style={{ color: "var(--accent-color)" }}>Team</h3>
          <div className="text-4xl font-bold mb-2">$79<span className="text-lg font-normal">/mo</span></div>
          <div className="text-xs text-gray-400 mb-4">For up to 10 users</div>
          <ul className="text-sm mb-6 space-y-2">
            <li>✔ Everything in Individual</li>
            <li>✔ Manager analytics dashboard</li>
            <li>✔ Priority support</li>
          </ul>

          <SignedIn>
            <button
              onClick={() => startCheckout('team')}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "var(--accent-color)", color: "black" }}
            >
              Start Team Trial
            </button>
          </SignedIn>
          <SignedOut>
            <button
              onClick={() => signInRedirect('team')}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "var(--accent-color)", color: "black" }}
            >
              Start Team Trial
            </button>
          </SignedOut>
        </div>
      </div>
    </main>
  );
}
