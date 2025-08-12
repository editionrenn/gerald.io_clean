'use client';

export default function PricingPage() {
  async function startCheckout() {
    try {
      const r = await fetch('/api/stripe/checkout', { method: 'POST' });
      if (!r.ok) {
        window.location.href = '/sign-in';
        return;
      }
      const { url } = await r.json();
      window.location.href = url;
    } catch {
      window.location.href = '/sign-in';
    }
  }

  return (
    <main className="px-8 py-16">
      <h2 className="text-3xl font-bold mb-3 text-center">Pricing</h2>
      <p className="text-center text-gray-400 mb-10">
        Early Adopter Launch Pricing — lock it in for life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Individual */}
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={{ borderColor: "#2b352b" }}>
          <div
            className="inline-block text-[10px] px-2 py-1 rounded-full mb-3"
            style={{ background: "#0e1d0e", border: "1px solid #203320", color: "#C0FF00" }}
          >
            Limited Time
          </div>
          <h3 className="font-semibold text-xl mb-2" style={{ color: "var(--accent-color)" }}>Individual</h3>
          <div className="text-4xl font-bold mb-2">
            $17<span className="text-lg font-normal">/mo</span>
          </div>
          <ul className="text-sm mb-6 space-y-2">
            <li>✔ Unlimited chats with Gerald</li>
            <li>✔ Save & review conversation history</li>
            <li>✔ Early access to new features</li>
          </ul>
          <button
            onClick={startCheckout}
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: "var(--accent-color)", color: "black" }}
          >
            Get Started
          </button>
        </div>

        {/* Team */}
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={{ borderColor: "#2b352b" }}>
          <h3 className="font-semibold text-xl mb-2" style={{ color: "var(--accent-color)" }}>Team</h3>
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
            onClick={startCheckout}
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: "var(--accent-color)", color: "black" }}
          >
            Start Team Trial
          </button>
        </div>
      </div>
    </main>
  );
}
