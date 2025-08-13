// app/api/stripe/checkout/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  return new Response(
    JSON.stringify({ ok: true, where: '/api/stripe/checkout' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}
