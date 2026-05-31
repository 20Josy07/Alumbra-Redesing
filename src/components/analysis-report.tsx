'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { ShieldAlert, ListChecks, Highlighter, Sparkles, AlertCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AnalysisResult } from "@/types";
import { buildCategoryBreakdown, buildHighlightSegments, CATEGORY_META } from "@/lib/analysis";

/* ─── Tema de riesgo ─── */
export const RISK_THEME: Record<string, { ring: string; text: string; soft: string; border: string; label: string }> = {
  bajo:        { ring: '#22c55e', text: 'text-green-600',  soft: 'bg-green-50',  border: 'border-green-200',  label: 'Bajo' },
  medio:       { ring: '#f59e0b', text: 'text-amber-600',  soft: 'bg-amber-50',  border: 'border-amber-200',  label: 'Medio' },
  alto:        { ring: '#f97316', text: 'text-orange-600', soft: 'bg-orange-50', border: 'border-orange-200', label: 'Alto' },
  'muy alto':  { ring: '#ef4444', text: 'text-red-600',    soft: 'bg-red-50',    border: 'border-red-200',    label: 'Muy alto' },
};

export function RiskGauge({ percent, color, size = 140 }: { percent: number; color: string; size?: number }) {
  const r = size * 0.385;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  const sw = size * 0.093;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f0f5" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
}

/* Construye un resumen en texto plano (para copiar/exportar) */
export function buildReportSummary(result: AnalysisResult): string {
  const { score, ai_suggestion, rules } = result;
  const breakdown = buildCategoryBreakdown(rules);
  const label = RISK_THEME[score.risk_level?.toLowerCase()]?.label ?? score.risk_level;
  return [
    'INFORME DE ANÁLISIS — Alumbra',
    `Nivel de riesgo: ${label} (${score.score_percent}%)`,
    score.message,
    breakdown.length ? '\nPatrones detectados:' : '',
    ...breakdown.map((c) => `· ${c.meta.label}: ${c.count}`),
    `\nSugerencia: ${ai_suggestion}`,
  ].filter(Boolean).join('\n');
}

interface AnalysisReportProps {
  result: AnalysisResult;
  originalText: string;
  /** compacto = para tarjetas del historial (gauge más pequeño) */
  compact?: boolean;
}

export default function AnalysisReport({ result, originalText, compact = false }: AnalysisReportProps) {
  const { rules, score, help, ai_suggestion } = result;
  const breakdown = buildCategoryBreakdown(rules);
  const segments = buildHighlightSegments(originalText, rules);
  const theme = RISK_THEME[score.risk_level?.toLowerCase()] ?? RISK_THEME.bajo;
  const maxCount = Math.max(1, ...breakdown.map((c) => c.count));

  return (
    <div className="space-y-4">
      {/* Risk Score — gauge circular */}
      <Card className={cn("rounded-3xl overflow-hidden shadow-sm border-2", theme.border, theme.soft)}>
        <CardContent className={cn(compact ? "p-5" : "p-6")}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <RiskGauge percent={score.score_percent} color={theme.ring} size={compact ? 110 : 140} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("font-black leading-none", theme.text, compact ? "text-2xl" : "text-3xl")}>
                  {score.score_percent}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">riesgo</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 mb-2">
                <ShieldAlert className={cn("w-5 h-5", theme.text)} />
                <span className={cn("font-black", theme.text, compact ? "text-xl" : "text-2xl")}>
                  Nivel {theme.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{score.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desglose por categoría */}
      {breakdown.length > 0 && (
        <Card className="rounded-3xl border border-purple-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-black">
              <ListChecks className="w-5 h-5 text-primary" />
              Patrones detectados
            </CardTitle>
            <CardDescription className="text-xs">Frecuencia y gravedad de cada tipo de señal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdown.map(({ key, meta, count }) => (
              <div key={key} className="flex items-center gap-3">
                <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", meta.dot)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-sm font-bold text-gray-800">{meta.label}</span>
                      <span className="text-xs text-gray-400 truncate hidden sm:inline">{meta.description}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className={cn("text-[10px] font-bold border-current/20", meta.text)}>
                        {meta.severity}
                      </Badge>
                      <span className={cn("text-sm font-black tabular-nums", meta.text)}>{count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", meta.bar)}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conversación resaltada */}
      <Card className="rounded-3xl border border-purple-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-black">
            <Highlighter className="w-5 h-5 text-primary" />
            Conversación analizada
          </CardTitle>
          <CardDescription className="text-xs">Los fragmentos resaltados corresponden a patrones detectados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-gray-50/80 border border-gray-100 p-4 max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {segments.map((seg, i) =>
                seg.category ? (
                  <mark
                    key={i}
                    title={CATEGORY_META[seg.category].label}
                    className={cn("rounded px-0.5 mx-px font-semibold", CATEGORY_META[seg.category].mark)}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </p>
          </div>
          {breakdown.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {breakdown.map(({ key, meta }) => (
                <span key={key} className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <span className={cn("w-2.5 h-2.5 rounded-sm", meta.dot)} />
                  {meta.label}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestion */}
      <Card className="rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-black">
            <Sparkles className="w-5 h-5 text-primary" />
            Interpretación asistida por IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 leading-relaxed">{ai_suggestion}</p>
        </CardContent>
      </Card>

      {/* Help */}
      <Alert className={cn("rounded-2xl", theme.soft, theme.border)}>
        <AlertCircle className={cn("h-4 w-4", theme.text)} />
        <AlertTitle className={cn("font-bold text-sm", theme.text)}>{help.title}</AlertTitle>
        <AlertDescription className="text-gray-600 text-xs leading-relaxed">{help.message}</AlertDescription>
      </Alert>

      {/* Disclaimer */}
      <p className="text-[11px] text-gray-400 leading-relaxed px-1">
        <Lock className="w-3 h-3 inline mr-1 -mt-0.5" />
        Informe orientativo. No constituye un diagnóstico clínico; debe interpretarse con criterio profesional.
      </p>
    </div>
  );
}
