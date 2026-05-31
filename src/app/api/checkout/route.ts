import { NextResponse } from 'next/server';
import { PLANS } from '@/lib/plans';

/**
 * Crea una sesión de Stripe Checkout usando la API REST (sin SDK).
 *
 * Para activarlo, define en tu entorno (.env.local):
 *   STRIPE_SECRET_KEY=sk_live_o_test_...
 *   STRIPE_PRICE_BASICO=price_...
 *   STRIPE_PRICE_PRO=price_...
 *   STRIPE_PRICE_PREMIUM=price_...
 *
 * Sin esas variables, responde 503 y la UI muestra "próximamente".
 */
export async function POST(req: Request) {
  let body: { plan?: string; uid?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const meta = PLANS.find((p) => p.id === body.plan);
  if (!meta || !meta.stripeEnv) {
    return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[meta.stripeEnv];

  if (!secret || !priceId) {
    // Aún no configurado: la UI lo interpreta como "próximamente".
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const origin = req.headers.get('origin') || new URL(req.url).origin;

  const params = new URLSearchParams();
  params.set('mode', 'subscription');
  params.set('line_items[0][price]', priceId);
  params.set('line_items[0][quantity]', '1');
  params.set('success_url', `${origin}/dashboard?checkout=success&plan=${meta.id}`);
  params.set('cancel_url', `${origin}/#pricing`);
  params.set('allow_promotion_codes', 'true');
  if (body.email) params.set('customer_email', body.email);
  // Guardamos el destino del plan y el uid para el webhook
  params.set('metadata[plan]', meta.id);
  if (body.uid) params.set('metadata[uid]', body.uid);
  if (body.uid) params.set('client_reference_id', body.uid);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || 'stripe_error' }, { status: 502 });
    }
    return NextResponse.json({ url: data.url });
  } catch {
    return NextResponse.json({ error: 'network_error' }, { status: 502 });
  }
}
