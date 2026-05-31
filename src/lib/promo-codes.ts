import type { PlanId } from './plans';

/* ─── Códigos promocionales ───────────────────────────────────────────
   Cada código activa un plan con un % de descuento.
   percent: 100 = gratis total (no cobra nada, activa el plan directo).
   Son reutilizables (no se consumen).
──────────────────────────────────────────────────────────────────────── */

export interface Promo {
  code: string;
  plan: PlanId;
  percent: number;
}

export const PROMO_CODES: Promo[] = [
  { code: 'ALUMBRA-BASICO', plan: 'basico', percent: 100 },
  { code: 'ALUMBRA-PRO', plan: 'pro', percent: 100 },
  { code: 'ALUMBRA-PREMIUM', plan: 'premium', percent: 100 },
];

/** Busca un código (sin distinguir mayúsculas/espacios). */
export function lookupPromo(input: string): Promo | null {
  const norm = (input || '').trim().toUpperCase();
  if (!norm) return null;
  return PROMO_CODES.find((p) => p.code === norm) ?? null;
}
