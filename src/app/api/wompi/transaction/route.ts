import { NextResponse } from 'next/server';
import { fetchWompiTransaction, buildWompiPaymentLabel } from '@/lib/wompi-api';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const fetched = await fetchWompiTransaction(id);
  if (!fetched.ok || !fetched.tx) {
    return NextResponse.json({ error: fetched.error || 'wompi_error' }, { status: 502 });
  }

  const tx = fetched.tx;
  const method = buildWompiPaymentLabel(tx);
  return NextResponse.json({
    status: tx.status ?? 'UNKNOWN',
    reference: tx.reference ?? null,
    paymentMethod: method,
  });
}
