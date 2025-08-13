'use client';

export default function BuyProButton() {
  async function handleCheckout() {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      if (res.status === 401) {
        // Not signed in: send to sign-in and bounce back to pricing afterwards
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
    } catch {
      alert('Network error — please try again.');
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
      style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}
    >
      Get Started
    </button>
  );
}
