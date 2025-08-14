import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

function getOrigin(req: Request) {
  // Prefer explicit base URL; otherwise derive from headers.
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  if (envBase) return envBase.replace(/\/$/, "");
  const h = (name: string) => req.headers.get(name) || "";
  const proto = h("x-forwarded-proto") || "https";
  const host = h("x-forwarded-host") || h("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  // Read JSON safely (tolerate empty/non-JSON)
  let body: any = {};
  try {
    const text = await req.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {};
  }

  const { useCoupon = false, email } = body;

  // Validate required env vars
  const priceId = process.env.STRIPE_PRICE_ID_PRO;
  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!priceId) missing.push("STRIPE_PRICE_ID_PRO");
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");

  if (missing.length) {
    const msg = `Missing required env vars: ${missing.join(", ")}`;
    console.error("[checkout] ", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const origin = getOrigin(req);

  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      allow_promotion_codes: true,
      // If you want to prefill email when you pass it from client
      customer_email: email || undefined,
      // Restrict to card by default; remove if you added more payment methods in Stripe
      payment_method_types: ["card"],
    };

    // Optional: apply a specific coupon or promotion if you set one
    if (useCoupon) {
      // Use exactly one of these paths:
      const couponId = process.env.STRIPE_COUPON_ID; // e.g. "Z3h3k7d9"
      const promotionCodeId = process.env.STRIPE_PROMOTION_CODE_ID; // e.g. "promo_123"
      if (promotionCodeId) {
        params.discounts = [{ promotion_code: promotionCodeId }];
      } else if (couponId) {
        params.discounts = [{ coupon: couponId }];
      }
    }

    const session = await stripe.checkout.sessions.create(params);

    if (!session.url) {
      console.error("[checkout] Session created but no URL:", session);
      return new Response(JSON.stringify({ error: "No checkout URL returned" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    console.error("[checkout] Stripe error:", err);
    return new Response(
      JSON.stringify({
        error: err?.message || "Stripe error creating checkout session",
        code: err?.code,
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
