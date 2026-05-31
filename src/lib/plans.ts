/* ─── Configuración central de planes y cuotas ─── */

export type PlanId = 'gratis' | 'basico' | 'pro' | 'premium';

export interface PlanMeta {
  id: PlanId;
  name: string;
  price: string;
  /** Límite de análisis al mes. Infinity = ilimitado */
  limit: number;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  popular: boolean;
  /** Variable de entorno con el price ID de Stripe (solo planes pagos) */
  stripeEnv?: string;
}

export const PLANS: PlanMeta[] = [
  {
    id: 'gratis',
    name: 'Gratis',
    price: '$0',
    limit: 10,
    description: 'Ideal para explorar la herramienta.',
    features: [
      { text: '10 análisis al mes', included: true },
      { text: 'Analizador de conversaciones', included: true },
      { text: 'Resultados básicos', included: true },
      { text: 'Resultados detallados', included: false },
      { text: 'Dashboard de gestión', included: false },
    ],
    cta: 'Empezar gratis',
    popular: false,
  },
  {
    id: 'basico',
    name: 'Básico',
    price: '$12.000',
    limit: 30,
    description: 'Empieza a analizar sin complicaciones.',
    features: [
      { text: '30 análisis al mes', included: true },
      { text: 'Analizador de conversaciones', included: true },
      { text: 'Resultados claros y directos', included: true },
      { text: 'Dashboard de gestión', included: false },
    ],
    cta: 'Elegir Básico',
    popular: false,
    stripeEnv: 'STRIPE_PRICE_BASICO',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$25.000',
    limit: Infinity,
    description: 'Más control, más análisis.',
    features: [
      { text: 'Análisis ilimitados', included: true },
      { text: 'Dashboard de gestión básico', included: true },
      { text: 'Historial de análisis', included: true },
      { text: 'Visualización de resultados', included: true },
      { text: 'Funciones avanzadas', included: false },
    ],
    cta: 'Elegir Pro',
    popular: true,
    stripeEnv: 'STRIPE_PRICE_PRO',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$45.000',
    limit: Infinity,
    description: 'Sin límites y control total.',
    features: [
      { text: 'Análisis ilimitados', included: true },
      { text: 'Dashboard completo', included: true },
      { text: 'Historial completo', included: true },
      { text: 'Herramientas avanzadas', included: true },
      { text: 'Acceso prioritario', included: true },
    ],
    cta: 'Elegir Premium',
    popular: false,
    stripeEnv: 'STRIPE_PRICE_PREMIUM',
  },
];

export const PLAN_LIMITS: Record<PlanId, number> = {
  gratis: 10,
  basico: 30,
  pro: Infinity,
  premium: Infinity,
};

export const PLAN_NAMES: Record<PlanId, string> = {
  gratis: 'Gratis',
  basico: 'Básico',
  pro: 'Pro',
  premium: 'Premium',
};

export function getPlan(id: string | undefined | null): PlanMeta {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

/** Clave de mes actual, p.ej. "2026-05" */
export function currentMonthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
