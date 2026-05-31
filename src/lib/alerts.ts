import type { AnalysisResult } from '@/types';
import { CATEGORY_META, type CategoryKey } from '@/lib/analysis';

const HIGH_RISK_LEVELS = ['alto', 'muy alto'];

export function isHighRisk(riskLevel: string | undefined | null): boolean {
  return HIGH_RISK_LEVELS.includes((riskLevel || '').toLowerCase());
}

const CATEGORY_ORDER: CategoryKey[] = ['threats', 'severe_insults', 'gaslighting', 'control', 'insults'];

/** Etiquetas legibles de las categorías con coincidencias, de mayor a menor gravedad. */
export function detectedCategoryLabels(result: AnalysisResult): string[] {
  return CATEGORY_ORDER.filter((key) => {
    const meta = CATEGORY_META[key];
    return ((result.rules[meta.countKey] as number) || 0) > 0;
  }).map((key) => CATEGORY_META[key].label);
}

export interface SendRiskAlertParams {
  to: string;
  contactName: string;
  userName: string;
  result: AnalysisResult;
}

export type AlertOutcome = 'sent' | 'not_configured' | 'error';

/**
 * Llama a /api/alert para enviar el correo al contacto de confianza.
 * Distingue "no configurado" (falta Resend) de un error real, para que la UI
 * pueda mostrar el mensaje adecuado.
 */
export async function sendRiskAlert({ to, contactName, userName, result }: SendRiskAlertParams): Promise<AlertOutcome> {
  try {
    const res = await fetch('/api/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        contactName,
        userName,
        riskLevel: result.score.risk_level,
        scorePercent: result.score.score_percent,
        categories: detectedCategoryLabels(result),
      }),
    });
    if (res.ok) return 'sent';
    if (res.status === 503) return 'not_configured';
    return 'error';
  } catch {
    return 'error';
  }
}
