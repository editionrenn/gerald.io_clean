export default function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Guided Education for Reps using AI-Led Dialogue
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          GERALD.io is the AI-powered sales coach that helps reps overcome objections,
          roleplay real-world scenarios, and close with confidence — anytime, anywhere.
        </p>
        <a
          href="/sign-in"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: "var(--accent-color)", color: "#000" }}
        >
          Request Early Access
        </a>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-16">
        <h3 className="text-2xl font-bold mb-6 text-center">Why Train with GERALD?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 border border-gray-800 rounded-xl shadow-sm bg-black">
            <h4 className="font-semibold text-lg mb-2" style={{ color: "var(--accent-color)" }}>Realistic Roleplay</h4>
            <p>Practice objections in real time, tailored to your industry.</p>
          </div>
          <div className="p-6 border border-gray-800 rounded-xl shadow-sm bg-black">
            <h4 className="font-semibold text-lg mb-2" style={{ color: "var(--accent-color)" }}>Instant Feedback</h4>
            <p>Smart coaching and scoring on each conversation.</p>
          </div>
          <div className="p-6 border border-gray-800 rounded-xl shadow-sm bg-black">
            <h4 className="font-semibold text-lg mb-2" style={{ color: "var(--accent-color)" }}>Track Your Growth</h4>
            <p>Progress tracking, skill maps, and personal benchmarks.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-8 py-16">
        <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
        <ol className="space-y-4 max-w-3xl mx-auto text-lg">
          <li><strong>1.</strong> Pick your industry and role.</li>
          <li><strong>2.</strong> Choose a training scenario or objection type.</li>
          <li><strong>3.</strong> Roleplay with Gerald.</li>
          <li><strong>4.</strong> Get personalized feedback and tips.</li>
        </ol>
      </section>

      {/* Pricing (PRO only) */}
      <section id="pricing" className="px-8 py-16 text-center">
        <h3 className="text-2xl font-bold mb-6">Pricing</h3>
        <p className="text-gray-400 mb-10">Early Adopter Launch — $17/mo (PRO).</p>

        <div className="max-w-md mx-auto">
          <div className="p-8 border rounded-2xl shadow-sm bg-black" style={{ borderColor: "#2b352b" }}>
            <div
              className="inline-block text-[10px] px-2 py-1 rounded-full mb-3"
              style={{ background: "#0e1d0e", border: "1px solid #203320", color: "#C0FF00" }}
            >
              Most Popular
            </div>
            <h4 className="font-semibold text-xl mb-2" style={{ color: "var(--accent-color)" }}>PRO</h4>
            <div className="text-4xl font-bold mb-2">
              $17<span className="text-lg font-normal">/mo</span>
            </div>
            <ul className="text-sm mb-6 space-y-2">
              <li>✔ Unlimited chats with Gerald</li>
              <li>✔ Conversation history</li>
              <li>✔ Early access to new features</li>
            </ul>
            <a
              href="/pricing"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "var(--accent-color)", color: "black" }}
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Stay in the Loop</h3>
        <p className="mb-6">Be the first to know when GERALD.io launches.</p>
        <div className="inline-flex">
          <input
            type="email"
            placeholder="Your email"
            className="px-4 py-2 rounded-l-xl border border-gray-700 bg-black text-white"
          />
          <button
            className="px-4 py-2 rounded-r-xl"
            style={{ backgroundColor: "var(--accent-color)", color: "black" }}
          >
            Notify Me
          </button>
        </div>
      </section>
    </main>
  );
}
