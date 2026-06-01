import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';

/**
 * Webhook de Eventos de Wompi (server-to-server).
 *
 * Wompi envía aquí el estado real de la transacción. Aquí se DEBE:
 *   1. Verificar la firma del evento con WOMPI_EVENTS_SECRET.
 *   2. Si data.transaction.status === 'APPROVED', activar el plan del usuario
 *      (la `reference` contiene el plan; el uid se puede mapear) con el Admin SDK.
 *
 * Firma de Wompi: SHA256(concatenación de los valores indicados en
 * signature.properties + el timestamp + el events secret).
 *
 * Por ahora valida la firma y responde 200; la activación del plan se hace en
 * el redirect del usuario. Para producción, añade el Admin SDK aquí.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const secret = process.env.WOMPI_EVENTS_SECRET;
    if (!body || !secret) return NextResponse.json({ ok: true });

    const props: string[] = body?.signature?.properties ?? [];
    const timestamp = body?.timestamp ?? '';
    const checksum = body?.signature?.checksum ?? '';

    // Reconstruye la cadena a partir de las propiedades indicadas
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

    // body.data.transaction.status === 'APPROVED' → activar plan (ver nota arriba)
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
