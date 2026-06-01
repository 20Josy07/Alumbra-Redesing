import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { PLANS } from '@/lib/plans';

/**
 * Genera la URL de Wompi Web Checkout (Colombia).
 *
 * Define en `.env.local`:
 *   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_...     (llave pública, se puede exponer)
 *   WOMPI_INTEGRITY_SECRET=prod_integrity_...      (secreto de integridad, NUNCA se expone)
 *
 * La llave pública por defecto ya está puesta; solo falta el secreto de
 * integridad (lo encuentras en tu panel de Wompi → Desarrolladores → Llaves).
 * Sin el secreto de integridad responde 503 ("pagos próximamente").
 *
 * Wompi exige firmar: SHA256(reference + amountInCents + currency + integritySecret).
 */

const DEFAULT_PUBLIC_KEY = 'pub_prod_0nL4uunXMMC3xMpGtjV0uLpZmbehYUKi';

export async function POST(req: Request) {
  let body: { plan?: string; uid?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const meta = PLANS.find((p) => p.id === body.plan);
  if (!meta || meta.priceAmount <= 0) {
    return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });
  }

  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  if (!publicKey || !integritySecret) {
    // Falta el secreto de integridad → la UI lo trata como "pagos próximamente".
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const origin = req.headers.get('origin') || new URL(req.url).origin;
  const currency = 'COP';
  const amountInCents = Math.round(meta.priceAmount * 100); // COP → centavos
  const reference = `alumbra-${meta.id}-${(body.uid || 'anon').slice(0, 10)}-${Date.now()}`;

  // Firma de integridad: SHA256("<reference><amountInCents><currency><secret>")
  const signature = createHash('sha256')
    .update(`${reference}${amountInCents}${currency}${integritySecret}`)
    .digest('hex');

  const redirectUrl = `${origin}/dashboard?checkout=success&plan=${meta.id}`;

  const params = new URLSearchParams({
    'public-key': publicKey,
    currency,
    'amount-in-cents': String(amountInCents),
    reference,
    'signature:integrity': signature,
    'redirect-url': redirectUrl,
  });
  if (body.email) params.set('customer-data:email', body.email);

  const url = `https://checkout.wompi.co/p/?${params.toString()}`;
  return NextResponse.json({ url });
}
