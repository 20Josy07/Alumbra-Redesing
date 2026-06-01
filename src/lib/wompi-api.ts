/** Utilidades compartidas para consultar transacciones en la API de Wompi. */

export interface WompiTx {
  id?: string;
  status?: string;
  reference?: string;
  amount_in_cents?: number;
  payment_method_type?: string;
  payment_method?: {
    type?: string;
    extra?: { last_four?: string; brand?: string; name?: string };
    phone_number?: string;
  };
}

export function wompiApiBase(publicKey?: string): string {
  const key = publicKey || process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || '';
  return key.startsWith('pub_test')
    ? 'https://sandbox.wompi.co/v1'
    : 'https://production.wompi.co/v1';
}

export function buildWompiPaymentLabel(tx: WompiTx): {
  type: string;
  brand?: string;
  lastFour?: string;
  label: string;
} {
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

export async function fetchWompiTransaction(transactionId: string): Promise<{
  ok: boolean;
  tx?: WompiTx;
  error?: string;
}> {
  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  if (!privateKey) return { ok: false, error: 'not_configured' };

  const base = wompiApiBase();
  try {
    const res = await fetch(`${base}/transactions/${encodeURIComponent(transactionId)}`, {
      headers: { Authorization: `Bearer ${privateKey}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: json?.error?.reason || 'wompi_error' };
    }
    return { ok: true, tx: json?.data ?? {} };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}
