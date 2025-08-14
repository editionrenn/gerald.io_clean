"use client";

export const dynamic = "force-dynamic";

export default function PricingPage() {
  async function startCheckout() {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // no flags needed
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout API response:", data);
        alert(data?.error || "Checkout error, try again.");
      }
    } catch (err) {
      console.error("Checkout fetch failed:", err);
      alert("Network error starting checkout. Please try again.");
    }
  }

  return (
    <main className="px-8 py-16">
      <h2 className="text-3xl font-bold mb-3 text-center">Pricing</h2>
      <p className="text-center text-gray-400 mb-10">
        Early Adopter Launch — lock in{" "}
        <span className="font-semibold" style={{ color: "var(--accent-color)" }}>
          $17/mo
        </span>.
      </p>

      <div className="max-w-md mx-auto">
        <div className="p-8 border rounded-2xl shadow-sm bg-black" style={{ borderColor: "#2b352b" }}>
          <div
            className="inline-block text-[10px] px-2 py-1 rounded-full mb-3"
            style={{ background: "#0e1d0e", border: "1px solid #203320", color: "#C0FF00" }}
          >
            PRO
          </div>

          <h3 className="font-semibold text-xl mb-2" style={{ color: "var(--accent-color)" }}>
            Everything you need
          </h3>

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
            className="w-full px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: "var(--accent-color)", color: "black" }}
          >
            Get Started
          </button>

          <div className="text-xs text-gray-400 mt-3">You’ll be redirected to secure checkout.</div>
        </div>
      </div>
    </main>
  );
}
