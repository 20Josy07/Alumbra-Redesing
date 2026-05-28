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

export function getRiskColorClass(riskLevel: AnalysisScore['risk_level']) {
  return {
    bajo: 'text-green-600',
    medio: 'text-yellow-600',
    alto: 'text-orange-600',
    'muy alto': 'text-red-600',
  }[riskLevel] || 'text-gray-600';
}
