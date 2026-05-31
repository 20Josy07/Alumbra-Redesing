import { NextResponse } from 'next/server';

/**
 * Envía un correo de alerta a un contacto de confianza cuando el análisis
 * detecta un nivel de riesgo alto o muy alto.
 *
 * Usa la API de Resend (capa gratuita). Para activarlo define en `.env.local`:
 *   RESEND_API_KEY=re_...
 *   ALERT_EMAIL_FROM="Alumbra <alertas@tudominio.com>"   (el dominio debe estar
 *                                                          verificado en Resend
 *                                                          con SPF/DKIM/DMARC)
 *   ALERT_REPLY_TO=soporte@tudominio.com                 (opcional)
 *
 * Sin esas variables responde 503 y la UI lo trata como "no configurado".
 */

interface AlertBody {
  to?: string;
  contactName?: string;
  userName?: string;
  riskLevel?: string;
  scorePercent?: number;
  categories?: string[];
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  let body: AlertBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const to = (body.to || '').trim();
  if (!EMAIL_RE.test(to)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_EMAIL_FROM;
  const replyTo = process.env.ALERT_REPLY_TO;

  if (!apiKey || !from) {
    // Aún no configurado: la UI lo interpreta como "no disponible".
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const contactName = (body.contactName || '').trim() || 'Hola';
  const userName = (body.userName || '').trim() || 'una persona cercana a ti';
  const riskLevel = (body.riskLevel || 'alto').trim();
  const scorePercent = typeof body.scorePercent === 'number' ? Math.round(body.scorePercent) : null;
  const categories = Array.isArray(body.categories)
    ? body.categories.filter((c) => typeof c === 'string' && c.trim()).slice(0, 8)
    : [];

  const subject = `Alumbra · Aviso de seguridad sobre ${userName}`;

  const categoriesText = categories.length
    ? `\nSeñales detectadas: ${categories.join(', ')}.`
    : '';
  const scoreText = scorePercent !== null ? ` (nivel estimado: ${scorePercent}%)` : '';

  const text = [
    `${contactName},`,
    '',
    `${userName} utiliza Alumbra, una herramienta que analiza conversaciones para detectar posibles señales de abuso emocional, y te ha registrado como contacto de confianza.`,
    '',
    `Un análisis reciente arrojó un nivel de riesgo ${riskLevel}${scoreText}.${categoriesText}`,
    '',
    'Esto NO es un diagnóstico, sino una señal orientativa. Te pedimos que, con tacto y sin alarmar, te pongas en contacto con esta persona para saber cómo se encuentra y ofrecerle tu apoyo.',
    '',
    'Si crees que existe peligro inmediato, contacta a los servicios de emergencia de tu país.',
    '',
    'Recibes este mensaje porque fuiste designado/a como contacto de confianza en Alumbra.',
    '— Equipo Alumbra',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f5f3fb;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(76,29,149,0.08);">
      <div style="background:linear-gradient(135deg,#6d28d9,#8b5cf6);padding:24px 28px;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;">Alumbra</p>
        <p style="margin:4px 0 0;color:#ede9fe;font-size:13px;">Aviso de seguridad</p>
      </div>
      <div style="padding:28px;">
        <p style="margin:0 0 16px;font-size:15px;">${escapeHtml(contactName)},</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
          <strong>${escapeHtml(userName)}</strong> utiliza Alumbra, una herramienta que analiza
          conversaciones para detectar posibles señales de abuso emocional, y te ha registrado
          como <strong>contacto de confianza</strong>.
        </p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:14px;padding:16px 18px;margin:0 0 16px;">
          <p style="margin:0;font-size:14px;color:#b91c1c;font-weight:700;">
            Un análisis reciente arrojó un nivel de riesgo ${escapeHtml(riskLevel)}${scorePercent !== null ? ` (${scorePercent}%)` : ''}.
          </p>
          ${categories.length ? `<p style="margin:8px 0 0;font-size:13px;color:#7f1d1d;">Señales detectadas: ${escapeHtml(categories.join(', '))}.</p>` : ''}
        </div>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#374151;">
          Esto <strong>no es un diagnóstico</strong>, sino una señal orientativa. Te pedimos que,
          con tacto y sin alarmar, te pongas en contacto con esta persona para saber cómo se
          encuentra y ofrecerle tu apoyo.
        </p>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#374151;">
          Si crees que existe <strong>peligro inmediato</strong>, contacta a los servicios de
          emergencia de tu país.
        </p>
      </div>
      <div style="padding:16px 28px;border-top:1px solid #f1eafe;background:#faf8ff;">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
          Recibes este mensaje porque fuiste designado/a como contacto de confianza en Alumbra.
          Si crees que es un error, ignóralo.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject,
    html,
    text,
  };
  if (replyTo) payload.reply_to = replyTo;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || data?.name || 'resend_error' },
        { status: 502 }
      );
    }
    return NextResponse.json({ id: data?.id ?? null, ok: true });
  } catch {
    return NextResponse.json({ error: 'network_error' }, { status: 502 });
  }
}
