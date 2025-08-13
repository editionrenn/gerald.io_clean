import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function PricingPage() {
  // Require auth for checkout; if not logged in, show page but we'll
  // redirect on click when we get a 401 from the API.
  const { userId } = auth();

  return (
    <main className="px-8 py-16">
      <h2 className="text-3xl font-bold mb-3 text-center">Pricing</h2>
      <p className="text-center text-gray-400 mb-10">
        Early Adopter Launch Pricing — lock it in for life.
      </p>

      <div className="max-w-4xl mx-auto">
        {/* PRO plan only */}
        <div
          className="p-8 border rounded-2xl shadow-sm bg-black"
          style={{ borderColor: '#2b352b' }}
        >
          <div
            className="inline-block text-[10px] px-2 py-1 rounded-full mb-3"
            style={{ background: '#0e1d0e', border: '1px solid #203320', color: '#C0FF00' }}
          >
            Limited Time
          </div>

          <h3 className="font-semibold text-xl mb-2" style={{ color: 'var(--accent-color)' }}>
            PRO
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
            onClick={async () => {
              try {
                const res = await fetch('/api/stripe/checkout', { method: 'POST' });
                if (res.status === 401) {
                  // not signed in; send them to sign-in
                  window.location.href = '/sign-in?redirect_url=/pricing';
                  return;
                }
                if (!res.ok) {
                  alert('Checkout error — please try again.');
                  return;
                }
                const data = await res.json();
                if (data?.url) {
                  window.location.href = data.url;
                } else {
                  alert('Checkout error — please try again.');
                }
              } catch (e) {
                alert('Network error — please try again.');
              }
            }}
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}
          >
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
