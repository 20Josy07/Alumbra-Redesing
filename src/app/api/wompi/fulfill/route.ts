import { NextResponse } from 'next/server';
import { fetchWompiTransaction, buildWompiPaymentLabel } from '@/lib/wompi-api';
import { fulfillWompiPayment } from '@/lib/wompi-fulfillment';
import { PLAN_NAMES } from '@/lib/plans';

/**
 * Confirma un pago con Wompi y activa el plan (idempotente).
 * Lo usa el redirect del usuario; el webhook hace lo mismo en servidor.
 */
export async function POST(req: Request) {
  let body: { transactionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const transactionId = (body.transactionId || '').trim();
  if (!transactionId) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  }

  const fetched = await fetchWompiTransaction(transactionId);
  if (!fetched.ok || !fetched.tx) {
    return NextResponse.json({ error: fetched.error || 'wompi_error' }, { status: 502 });
  }

  const tx = fetched.tx;
  const reference = tx.reference?.trim();
  if (!reference) {
    return NextResponse.json({ error: 'missing_reference' }, { status: 502 });
  }

  const result = await fulfillWompiPayment({
    reference,
    transactionId,
    status: tx.status || 'UNKNOWN',
    amountInCents: tx.amount_in_cents,
    paymentMethod: buildWompiPaymentLabel(tx),
  });

  if (!result.ok) {
    if (result.outcome === 'ignored') {
      return NextResponse.json({
        ok: false,
        status: tx.status,
        message: 'Pago no aprobado',
      });
    }
    if (result.outcome === 'not_configured') {
      return NextResponse.json({ error: 'not_configured' }, { status: 503 });
    }
    return NextResponse.json({ error: result.outcome, reason: result.reason }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    outcome: result.outcome,
    plan: result.plan,
    planName: PLAN_NAMES[result.plan],
  });
}
