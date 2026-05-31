import { FieldValue, Timestamp } from 'firebase/firestore';
import type { AnalysisRules, AnalysisScore } from '@/types';

export function formatAnalysisDate(timestamp: Timestamp | FieldValue | Date | undefined | null) {
  if (!timestamp) return 'Fecha desconocida';
  const date = (timestamp as Timestamp)?.toDate ? (timestamp as Timestamp).toDate() : (timestamp as Date);
  if (date instanceof Date) {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return 'Fecha inválida';
}

export function buildAnalysisDetails(rules: AnalysisRules) {
  return [
    { label: 'Insultos Graves', count: rules.severe_insult_count },
    { label: 'Insultos', count: rules.insult_count },
    { label: 'Control', count: rules.control_count },
    { label: 'Gaslighting', count: rules.gaslighting_count },
    { label: 'Amenazas', count: rules.threat_count },
  ].filter((detail) => detail.count > 0);
}

/* ─── Metadata de categorías (para UI profesional) ─── */
export type CategoryKey = 'threats' | 'severe_insults' | 'gaslighting' | 'control' | 'insults';

interface CategoryMeta {
  label: string;
  description: string;
  detectedKey: keyof AnalysisRules;
  countKey: keyof AnalysisRules;
  severity: 'Crítico' | 'Alto' | 'Moderado';
  mark: string;   // clases para el resaltado <mark>
  dot: string;    // color del indicador
  text: string;   // color de texto
  bar: string;    // color de la barra
}

// Orden por gravedad (de mayor a menor).
export const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  threats: {
    label: 'Amenazas', description: 'Intimidación o coerción',
    detectedKey: 'threats_detected', countKey: 'threat_count', severity: 'Crítico',
    mark: 'bg-red-100 text-red-800 border-b-2 border-red-400',
    dot: 'bg-red-500', text: 'text-red-600', bar: 'from-red-500 to-rose-500',
  },
  severe_insults: {
    label: 'Insultos graves', description: 'Desvalorización severa',
    detectedKey: 'severe_insults_detected', countKey: 'severe_insult_count', severity: 'Crítico',
    mark: 'bg-rose-100 text-rose-800 border-b-2 border-rose-400',
    dot: 'bg-rose-500', text: 'text-rose-600', bar: 'from-rose-500 to-pink-500',
  },
  gaslighting: {
    label: 'Gaslighting', description: 'Distorsión de la realidad',
    detectedKey: 'gaslighting_detected', countKey: 'gaslighting_count', severity: 'Alto',
    mark: 'bg-orange-100 text-orange-800 border-b-2 border-orange-400',
    dot: 'bg-orange-500', text: 'text-orange-600', bar: 'from-orange-500 to-amber-500',
  },
  control: {
    label: 'Control', description: 'Conductas coercitivas',
    detectedKey: 'control_detected', countKey: 'control_count', severity: 'Alto',
    mark: 'bg-amber-100 text-amber-800 border-b-2 border-amber-400',
    dot: 'bg-amber-500', text: 'text-amber-600', bar: 'from-amber-500 to-yellow-500',
  },
  insults: {
    label: 'Insultos', description: 'Descalificaciones',
    detectedKey: 'insults_detected', countKey: 'insult_count', severity: 'Moderado',
    mark: 'bg-yellow-100 text-yellow-800 border-b-2 border-yellow-400',
    dot: 'bg-yellow-500', text: 'text-yellow-600', bar: 'from-yellow-500 to-amber-400',
  },
};

const CATEGORY_ORDER: CategoryKey[] = ['threats', 'severe_insults', 'gaslighting', 'control', 'insults'];

export interface CategoryBreakdown {
  key: CategoryKey;
  meta: CategoryMeta;
  count: number;
  phrases: string[];
}

export function buildCategoryBreakdown(rules: AnalysisRules): CategoryBreakdown[] {
  return CATEGORY_ORDER.map((key) => {
    const meta = CATEGORY_META[key];
    const count = (rules[meta.countKey] as number) || 0;
    const phrases = (rules[meta.detectedKey] as string[]) || [];
    return { key, meta, count, phrases };
  }).filter((c) => c.count > 0);
}

/* ─── Resaltado de frases en el texto original ─── */

// Permite coincidir aunque el texto tenga acentos (á≈a, ñ≈n, etc.)
function toFlexibleSource(phrase: string): string {
  const map: Record<string, string> = {
    a: '[aáàâä]', e: '[eéèêë]', i: '[iíìîï]', o: '[oóòôö]', u: '[uúùûü]', n: '[nñ]', c: '[cç]',
  };
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped
    .split('')
    .map((ch) => map[ch.toLowerCase()] || ch)
    .join('');
}

export interface TextSegment {
  text: string;
  category: CategoryKey | null;
}

/**
 * Divide el texto original en segmentos, marcando los fragmentos
 * que coinciden con frases detectadas (la categoría más grave gana).
 */
export function buildHighlightSegments(text: string, rules: AnalysisRules): TextSegment[] {
  type Range = { start: number; end: number; category: CategoryKey };
  const ranges: Range[] = [];

  for (const key of CATEGORY_ORDER) {
    const meta = CATEGORY_META[key];
    const phrases = (rules[meta.detectedKey] as string[]) || [];
    for (const phrase of phrases) {
      if (!phrase) continue;
      const re = new RegExp(toFlexibleSource(phrase), 'gi');
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        ranges.push({ start: m.index, end: m.index + m[0].length, category: key });
        if (m.index === re.lastIndex) re.lastIndex++; // evita loops con coincidencias vacías
      }
    }
  }

  if (ranges.length === 0) return [{ text, category: null }];

  // Ordena por inicio y prioridad (CATEGORY_ORDER ya es por gravedad).
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start < cursor) continue; // ignora solapamientos
    if (r.start > cursor) segments.push({ text: text.slice(cursor, r.start), category: null });
    segments.push({ text: text.slice(r.start, r.end), category: r.category });
    cursor = r.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), category: null });

  return segments;
}

export function getRiskColorClass(riskLevel: AnalysisScore['risk_level']) {
  return {
    bajo: 'text-green-600',
    medio: 'text-yellow-600',
    alto: 'text-orange-600',
    'muy alto': 'text-red-600',
  }[riskLevel] || 'text-gray-600';
}
