/* ─── Configuración central de planes y cuotas ─── */

export type PlanId = 'gratis' | 'basico' | 'pro' | 'premium';

export interface PlanMeta {
  id: PlanId;
  name: string;
  price: string;
  /** Monto numérico en COP para la pasarela (0 = gratis) */
  priceAmount: number;
  /** Límite de análisis al mes. Infinity = ilimitado */
  limit: number;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  popular: boolean;
}

export const PLANS: PlanMeta[] = [
  {
    id: 'gratis',
    name: 'Gratis',
    price: '$0',
    priceAmount: 0,
    limit: 10,
    description: 'Ideal para explorar la herramienta.',
    features: [
      { text: '10 análisis al mes', included: true },
      { text: 'Analizador de conversaciones', included: true },
      { text: '1 contacto de confianza', included: true },
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
    priceAmount: 12000,
    limit: 30,
    description: 'Empieza a analizar sin complicaciones.',
    features: [
      { text: '30 análisis al mes', included: true },
      { text: 'Resultados detallados', included: true },
      { text: '2 contactos de confianza', included: true },
      { text: 'Dashboard de gestión', included: false },
    ],
    cta: 'Elegir Básico',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$25.000',
    priceAmount: 25000,
    limit: Infinity,
    description: 'Más control, más análisis.',
    features: [
      { text: 'Análisis ilimitados', included: true },
      { text: 'Historial de análisis', included: true },
      { text: '3 contactos de confianza', included: true },
      { text: 'Dashboard de gestión', included: true },
      { text: 'Herramientas avanzadas', included: false },
    ],
    cta: 'Elegir Pro',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$45.000',
    priceAmount: 45000,
    limit: Infinity,
    description: 'Sin límites y control total.',
    features: [
      { text: 'Análisis ilimitados', included: true },
      { text: 'Historial completo', included: true },
      { text: '5 contactos de confianza', included: true },
      { text: 'Herramientas avanzadas', included: true },
      { text: 'Acceso prioritario', included: true },
    ],
    cta: 'Elegir Premium',
    popular: false,
  },
];

export const PLAN_LIMITS: Record<PlanId, number> = {
  gratis: 10,
  basico: 30,
  pro: Infinity,
  premium: Infinity,
};

/* ─── Capacidades por plan (qué desbloquea cada uno) ─── */
export interface PlanCapabilities {
  /** Informe detallado: desglose de patrones, conversación resaltada y sugerencia de IA */
  detailedResults: boolean;
  /** Guardar y consultar el historial de análisis */
  history: boolean;
  /** Herramientas avanzadas (exportar/copiar informe, etc.) */
  advancedTools: boolean;
  /** Número máximo de contactos de confianza para alertas de riesgo */
  trustedContacts: number;
}

export const PLAN_CAPS: Record<PlanId, PlanCapabilities> = {
  gratis:  { detailedResults: false, history: false, advancedTools: false, trustedContacts: 1 },
  basico:  { detailedResults: true,  history: false, advancedTools: false, trustedContacts: 2 },
  pro:     { detailedResults: true,  history: true,  advancedTools: false, trustedContacts: 3 },
  premium: { detailedResults: true,  history: true,  advancedTools: true,  trustedContacts: 5 },
};

export function planCaps(plan: PlanId): PlanCapabilities {
  return PLAN_CAPS[plan] ?? PLAN_CAPS.gratis;
}

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
