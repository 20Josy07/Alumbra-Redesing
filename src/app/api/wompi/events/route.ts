import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { fulfillWompiPayment } from '@/lib/wompi-fulfillment';
import { buildWompiPaymentLabel, type WompiTx } from '@/lib/wompi-api';

/**
 * Webhook de Eventos de Wompi (server-to-server).
 * Activa el plan aunque el usuario cierre el navegador o pierda internet.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const secret = process.env.WOMPI_EVENTS_SECRET;

    if (!body) return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
    if (!secret) {
      console.warn('[wompi/events] WOMPI_EVENTS_SECRET no configurado');
      return NextResponse.json({ ok: true, skipped: 'no_secret' });
    }

    const props: string[] = body?.signature?.properties ?? [];
    const timestamp = body?.timestamp ?? '';
    const checksum = body?.signature?.checksum ?? '';

    let concatenated = '';
    for (const path of props) {
      const value = path.split('.').reduce((acc: unknown, key: string) => {
        return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined;
      }, body.data);
      concatenated += value ?? '';
    }
    concatenated += timestamp + secret;

    const expected = createHash('sha256').update(concatenated).digest('hex');
    if (checksum && expected.toLowerCase() !== String(checksum).toLowerCase()) {
      return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
    }

    const tx = (body?.data?.transaction ?? body?.data) as WompiTx | undefined;
    if (!tx?.reference || !tx?.id) {
      return NextResponse.json({ ok: true, skipped: 'no_transaction' });
    }

    const result = await fulfillWompiPayment({
      reference: tx.reference,
      transactionId: tx.id,
      status: tx.status || 'UNKNOWN',
      amountInCents: tx.amount_in_cents,
      paymentMethod: buildWompiPaymentLabel(tx),
    });

    if (!result.ok && result.outcome === 'not_configured') {
      console.error('[wompi/events] FIREBASE_SERVICE_ACCOUNT_JSON no configurado');
    }

    return NextResponse.json({ ok: true, fulfillment: result });
  } catch (err) {
    console.error('[wompi/events]', err);
    return NextResponse.json({ ok: true });
  }
}
