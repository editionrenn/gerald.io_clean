import Stripe from "stripe";
// ...your existing imports/env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export async function POST(req: Request) {
  let payload: any = {};
  try {
    const text = await req.text(); // read raw
    payload = text ? JSON.parse(text) : {}; // tolerate empty body
  } catch {
    payload = {};
  }

  const { useCoupon = false, email } = payload;

  // ...the rest of your existing logic:
  // - pick priceId = process.env.STRIPE_PRICE_ID_PRO
  // - optionally apply a coupon/promotion_code if useCoupon === true
  // - create checkout session and return { url }
}
