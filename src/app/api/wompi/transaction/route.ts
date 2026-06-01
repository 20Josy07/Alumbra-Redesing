import { NextResponse } from 'next/server';

/**
 * Consulta una transacción de Wompi por su ID (usando la llave privada) y
 * devuelve un resumen: estado, plan y método de pago legible.
 *
 * Se usa al volver del checkout (?id=...) para verificar el pago de forma más
 * fiable que confiar solo en el redirect, y para guardar el método de pago.
 */

interface WompiTx {
  status?: string;
  reference?: string;
  payment_method_type?: string;
  payment_method?: {
    type?: string;
    extra?: { last_four?: string; brand?: string; name?: string };
    phone_number?: string;
  };
}

function buildLabel(tx: WompiTx): { type: string; brand?: string; lastFour?: string; label: string } {
  const type = tx.payment_method_type || tx.payment_method?.type || 'CARD';
  const extra = tx.payment_method?.extra;
  switch (type) {
    case 'CARD': {
      const brand = extra?.brand || 'Tarjeta';
      const lastFour = extra?.last_four;
      return { type, brand, lastFour, label: lastFour ? `${brand} terminada en ${lastFour}` : brand };
    }
    case 'NEQUI':
      return { type, label: 'Nequi' };
    case 'PSE':
      return { type, label: 'PSE · débito bancario' };
    case 'BANCOLOMBIA_TRANSFER':
      return { type, label: 'Transferencia Bancolombia' };
    default:
      return { type, label: type };
  }
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || '';
  if (!privateKey) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  // Base de API según el entorno de la llave
  const base = publicKey.startsWith('pub_test')
    ? 'https://sandbox.wompi.co/v1'
    : 'https://production.wompi.co/v1';

  try {
    const res = await fetch(`${base}/transactions/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${privateKey}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: json?.error?.reason || 'wompi_error' }, { status: 502 });
    }
    const tx: WompiTx = json?.data ?? {};
    const method = buildLabel(tx);
    return NextResponse.json({
      status: tx.status ?? 'UNKNOWN',
      reference: tx.reference ?? null,
      paymentMethod: method,
    });
  } catch {
    return NextResponse.json({ error: 'network_error' }, { status: 502 });
  }
}
