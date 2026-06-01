'use client';

import { useUser, useFirestore } from "@/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
  FileText, Clock, Sparkles, AlertCircle, BrainCircuit,
  Loader, Lock, ShieldAlert,
  TrendingUp, ShieldCheck, Zap, ChevronRight, History as HistoryIcon,
  Wand2, ArrowRight, Copy, Check
} from "lucide-react";
import Link from "next/link";
import Resources from "./resources";
import { type AnalysisResult, performAnalysis } from "@/app/actions";
import { cn } from "@/lib/utils";
import { formatAnalysisDate } from "@/lib/analysis";
import AnalysisReport, { buildReportSummary } from "./analysis-report";
import { Reveal } from "./reveal";
import { Button } from "./ui/button";
import { saveAnalysis } from "@/firebase/firestore/analyses";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisRecord } from "@/types";
import type { Timestamp } from "firebase/firestore";
import { useState, useTransition, useMemo } from "react";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { incrementUsage } from "@/firebase/firestore/usage";
import { isHighRisk, sendRiskAlert } from "@/lib/alerts";
import { PLAN_LIMITS, PLAN_NAMES, planCaps, currentMonthKey, type PlanId } from "@/lib/plans";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";

const DETECTION_CATEGORIES = [
  { label: 'Amenazas', dot: 'bg-red-500' },
  { label: 'Insultos graves', dot: 'bg-rose-500' },
  { label: 'Gaslighting', dot: 'bg-orange-500' },
  { label: 'Control', dot: 'bg-amber-500' },
  { label: 'Insultos', dot: 'bg-yellow-500' },
];

interface DashboardPageProps {
  pendingAnalysis: AnalysisResult | null;
  setPendingAnalysis: (analysis: AnalysisResult | null) => void;
}

export default function DashboardPage({ pendingAnalysis, setPendingAnalysis }: DashboardPageProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [copied, setCopied] = useState(false);

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: analyses, loading: loadingAnalyses } = useCollection<AnalysisRecord>(analysesQuery);

  // ── Plan y cuota de uso (reactivo) ──
  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: account } = useDoc<{
    plan?: PlanId;
    planEnds?: string;
    usageMonth?: string;
    usageCount?: number;
    trustedContact?: { name?: string; email?: string } | null;
    trustedContacts?: { name?: string; email?: string }[];
    autoAlertEnabled?: boolean;
  }>(userDocRef);

  // Plan efectivo: si la suscripción de pago venció, vuelve a 'gratis'
  const storedPlan: PlanId = account?.plan ?? 'gratis';
  const subActive = storedPlan === 'gratis'
    || (!!account?.planEnds && new Date(account.planEnds).getTime() > Date.now());
  const plan: PlanId = subActive ? storedPlan : 'gratis';
  const planEndsLabel = plan !== 'gratis' && account?.planEnds
    ? new Date(account.planEnds).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const planLimit = PLAN_LIMITS[plan];
  const usageCount = account?.usageMonth === currentMonthKey() ? account?.usageCount ?? 0 : 0;
  const isUnlimited = planLimit === Infinity;
  const remaining = isUnlimited ? Infinity : Math.max(0, planLimit - usageCount);
  const limitReached = !isUnlimited && remaining <= 0;
  const caps = planCaps(plan);

  // ── Stats reales calculadas desde Firestore ──
  const toDate = (r: AnalysisRecord): Date | null => {
    const ts = r.createdAt as Timestamp | undefined;
    return ts && typeof ts.toDate === 'function' ? ts.toDate() : null;
  };

  const stats = useMemo(() => {
    const list = analyses ?? [];
    const now = new Date();
    const thisMonth = list.filter((r) => {
      const d = toDate(r);
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const highRisk = list.filter((r) =>
      ['alto', 'muy alto'].includes((r.score?.risk_level || '').toLowerCase())
    ).length;
    const lastDate = list[0] ? toDate(list[0]) : null;
    const lastLabel = lastDate
      ? lastDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      : '—';
    return { total: list.length, thisMonth, highRisk, lastLabel };
  }, [analyses]);

  const EXAMPLE_TEXT =
    'Siempre exageras todo, nadie más se queja de mí. Estás loca, eso nunca pasó. No puedes salir sin mi permiso y si me dejas te vas a arrepentir.';

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  const handleAnalysis = async () => {
    // Bloqueo por cuota agotada
    if (limitReached) {
      toast({
        variant: "destructive",
        title: "Límite mensual alcanzado",
        description: `Tu plan ${PLAN_NAMES[plan]} permite ${planLimit} análisis al mes. Mejora tu plan para seguir analizando.`,
      });
      return;
    }
    setError(null);
    setPendingAnalysis(null);
    startTransition(async () => {
      setLastAnalyzedText(text);
      const { data, error } = await performAnalysis(text);
      if (error) {
        setError(error);
        toast({ variant: "destructive", title: "Error de Análisis", description: error });
      } else if (data) {
        setPendingAnalysis(data);
        setText('');
        // Cuenta el análisis hacia la cuota mensual
        if (user && firestore && !isUnlimited) {
          incrementUsage(firestore, user.uid).catch(() => {});
        }
        // Alerta automática al contacto de confianza si el riesgo es alto/muy alto
        maybeSendRiskAlert(data);
      }
    });
  };

  const maybeSendRiskAlert = async (data: AnalysisResult) => {
    if (account?.autoAlertEnabled === false) return;
    if (!isHighRisk(data.score.risk_level)) return;

    // Lista de contactos (nuevo array) con compatibilidad al campo antiguo
    const list = (account?.trustedContacts?.length
      ? account.trustedContacts
      : account?.trustedContact ? [account.trustedContact] : []
    ).filter((c) => c?.email?.trim());

    if (list.length === 0) return;

    const userName = user?.displayName?.trim() || user?.email || '';
    const outcomes = await Promise.all(
      list.map((c) =>
        sendRiskAlert({
          to: c.email!.trim(),
          contactName: c.name?.trim() || '',
          userName,
          result: data,
        })
      )
    );

    const sent = outcomes.filter((o) => o === 'sent').length;
    if (sent > 0) {
      toast({
        title: 'Alerta enviada',
        description: `Avisamos a ${sent} ${sent === 1 ? 'contacto de confianza' : 'contactos de confianza'} por el nivel de riesgo detectado.`,
      });
    } else if (outcomes.includes('not_configured')) {
      toast({
        variant: 'destructive',
        title: 'Alertas no disponibles',
        description: 'El envío de correos aún no está configurado. Revisa las variables de Resend en el servidor.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'No se pudo enviar la alerta',
        description: 'Detectamos riesgo alto, pero el correo a los contactos falló.',
      });
    }
  };

  const handleSaveAnalysis = async () => {
    if (!pendingAnalysis || !user || !firestore) return;
    try {
      await saveAnalysis(firestore, user.uid, {
        ...pendingAnalysis,
        title: `Análisis del ${new Date().toLocaleDateString('es-ES')}`,
        originalText: lastAnalyzedText,
      });
      toast({ title: "Análisis guardado", description: "Tu análisis ha sido guardado en tu historial." });
      setPendingAnalysis(null);
      setLastAnalyzedText('');
    } catch {
      toast({ variant: "destructive", title: "Error al guardar", description: "No se pudo guardar el análisis." });
    }
  };

  const handleDiscardAnalysis = () => {
    setPendingAnalysis(null);
    setLastAnalyzedText('');
    toast({ title: "Análisis descartado", description: "El análisis no ha sido guardado." });
  };

  const handleCopySummary = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Resumen copiado', description: 'El informe se copió al portapapeles.' });
    });
  };

  const renderPendingAnalysis = () => {
    if (!pendingAnalysis) return null;

    return (
      <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Informe de Análisis</h2>
              <p className="text-xs text-gray-400">Resultados completos de la conversación</p>
            </div>
          </div>
          <button
            onClick={() => handleCopySummary(buildReportSummary(pendingAnalysis))}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary border border-gray-200 hover:border-purple-200 rounded-full px-3 py-1.5 transition-colors"
          >
            {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
          </button>
        </div>

        {/* Informe (componente compartido) */}
        <AnalysisReport result={pendingAnalysis} originalText={lastAnalyzedText} detailed={caps.detailedResults} />

        {/* Actions */}
        {caps.history ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button
              onClick={handleSaveAnalysis}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-md"
            >
              <Check className="w-4 h-4 mr-2" />
              Guardar en Historial
            </Button>
            <Button
              onClick={handleDiscardAnalysis}
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 font-semibold"
            >
              Descartar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 pt-1 items-center">
            <div className="flex-1 flex items-center gap-2 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              Guardar en el historial está disponible en los planes Pro y Premium.
            </div>
            <Button
              onClick={handleDiscardAnalysis}
              variant="outline"
              className="h-12 px-6 rounded-2xl border-gray-200 hover:bg-gray-50 font-semibold"
            >
              Cerrar
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderAnalysisForm = () => (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <Card className="rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-lg font-black">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            Analizador de Abuso Emocional
          </CardTitle>
          <CardDescription className="text-sm">
            Pega la conversación que quieres analizar. Mínimo 20 caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              placeholder="Pega aquí el texto de WhatsApp, SMS, email u otra conversación..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isPending}
              className="text-sm min-h-[150px] rounded-2xl border-purple-100 focus:border-primary bg-purple-50/30 resize-none leading-relaxed pb-8"
            />
            {/* Contador de caracteres */}
            <span className={cn(
              'absolute bottom-3 right-4 text-xs font-medium tabular-nums',
              text.trim().length < 20 ? 'text-gray-300' : 'text-primary'
            )}>
              {text.trim().length} / 20 mín.
            </span>
          </div>

          {/* Atajos */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => setText(EXAMPLE_TEXT)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-purple-50 hover:bg-purple-100 border border-purple-200/60 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              <Wand2 className="w-3 h-3" />
              Probar con un ejemplo
            </button>
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                disabled={isPending}
                className="text-xs font-medium text-gray-400 hover:text-gray-600 px-2 py-1.5 transition-colors disabled:opacity-50"
              >
                Limpiar
              </button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4 rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-bold">Error</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-3 pt-2">
          {limitReached ? (
            <div className="w-full rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
              <p className="text-sm font-bold text-amber-800">Has usado tus {planLimit} análisis de este mes</p>
              <p className="text-xs text-amber-700 mt-0.5 mb-3">Mejora tu plan para seguir analizando sin esperar.</p>
              <Button asChild size="sm" className="rounded-xl bg-gradient-to-r from-primary to-violet-500 font-bold">
                <Link href="/dashboard/billing">Ver planes</Link>
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAnalysis}
              disabled={isPending || text.trim().length < 20}
              size="lg"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-md glow-purple-sm text-sm"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Analizando patrones…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Analizar conversación
                </span>
              )}
            </Button>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            Procesamiento privado · el texto no se almacena
          </div>
        </CardFooter>
      </Card>

      {/* Qué detecta el analizador */}
      <Card className="rounded-3xl border border-purple-100/60 bg-gradient-to-br from-purple-50/60 to-white shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Qué detecta el motor</p>
          <div className="flex flex-wrap gap-2">
            {DETECTION_CATEGORIES.map(({ label, dot }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                <span className={cn("w-2 h-2 rounded-full", dot)} />
                {label}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mt-4">
            Incluye conversaciones completas con contexto para una detección más precisa. Los resultados son orientativos y complementan el criterio profesional.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* ── Hero band ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg animate-in fade-in-0 slide-in-from-top-4 duration-500"
        style={{ background: 'linear-gradient(135deg, hsl(262 60% 22%) 0%, hsl(270 55% 28%) 50%, hsl(262 65% 20%) 100%)' }}
      >
        {/* Orbs decorativos */}
        <div className="absolute top-[-40%] right-[-5%] w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none animate-breathe" />
        <div className="absolute bottom-[-50%] left-[20%] w-64 h-64 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <Badge className="bg-white/15 text-purple-100 border border-white/20 px-3 py-1 text-[11px] font-bold rounded-full mb-3 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Panel Profesional
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {greeting}, {user?.displayName?.split(' ')[0] || 'profesional'} 👋
            </h1>
            <p className="text-sm text-purple-200/80 mt-1.5 max-w-md">
              Tu espacio seguro para el análisis de conversaciones. Pega un texto y descubre los patrones en segundos.
            </p>
          </div>

          <Button asChild variant="secondary"
            className="bg-white text-primary hover:bg-purple-50 rounded-xl font-bold shadow-md h-10 px-4"
          >
            <Link href="/dashboard/history">
              <HistoryIcon className="w-4 h-4 mr-1.5" />
              Ver historial
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Quick stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
        {[
          { label: 'Análisis totales', value: stats.total.toString(), icon: FileText, color: 'from-primary to-violet-500', hint: 'guardados en tu historial' },
          { label: 'Este mes', value: stats.thisMonth.toString(), icon: TrendingUp, color: 'from-violet-500 to-purple-600', hint: 'realizados este mes' },
          { label: 'Riesgo alto', value: stats.highRisk.toString(), icon: ShieldAlert, color: 'from-rose-500 to-red-500', hint: 'casos que requieren atención' },
          { label: 'Último análisis', value: stats.lastLabel, icon: Clock, color: 'from-fuchsia-500 to-pink-500', hint: 'fecha más reciente' },
        ].map(({ label, value, icon: Icon, color, hint }) => (
          <Card key={label} className="group rounded-2xl border border-purple-100/60 shadow-sm card-lift">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm transition-transform group-hover:scale-110', color)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Main grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Analysis form / results */}
        <div className="lg:col-span-2">
          {pendingAnalysis ? renderPendingAnalysis() : renderAnalysisForm()}
        </div>

        {/* Sidebar: Recent history */}
        <div className="space-y-5">

          {/* Plan y uso */}
          <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
            <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Tu plan</p>
                  <p className="text-base font-black text-gray-900">{PLAN_NAMES[plan]}</p>
                </div>
                <Badge className="bg-purple-100 text-primary border-purple-200 font-bold text-[11px]">
                  {isUnlimited ? 'Ilimitado' : `${planLimit}/mes`}
                </Badge>
              </div>

              {isUnlimited ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-purple-50/60 rounded-xl p-3">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  Análisis ilimitados este mes
                </div>
              ) : (
                <>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm font-bold text-gray-700">
                      {usageCount} <span className="text-gray-400 font-medium">de {planLimit}</span>
                    </span>
                    <span className={cn('text-xs font-semibold', remaining <= 2 ? 'text-amber-600' : 'text-gray-400')}>
                      {remaining} restantes
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', limitReached ? 'bg-red-500' : 'bg-gradient-to-r from-primary to-violet-500')}
                      style={{ width: `${Math.min(100, (usageCount / planLimit) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">Se reinicia cada mes.</p>
                </>
              )}

              {/* Vencimiento de la suscripción */}
              {planEndsLabel && (
                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  Tu plan se renueva el <span className="font-semibold text-gray-600">{planEndsLabel}</span>
                </div>
              )}

              {plan === 'gratis' && (
                <Button asChild size="sm" className="w-full mt-4 rounded-xl bg-gradient-to-r from-primary to-violet-500 font-bold text-xs h-9">
                  <Link href="/dashboard/billing">Mejorar plan</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-purple-100/60 shadow-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
            <div className="h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-300 rounded-t-3xl" />
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-black">Historial Reciente</CardTitle>
              <CardDescription className="text-xs">Tus últimos 5 análisis guardados</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAnalyses ? (
                <div className="flex items-center justify-center p-8">
                  <Loader className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {analyses && analyses.length > 0 ? (
                    <ul className="space-y-1">
                      {analyses.slice(0, 5).map((analysis) => {
                        const risk = (analysis.score?.risk_level || '').toLowerCase();
                        const dot = risk === 'muy alto' || risk === 'alto'
                          ? 'bg-red-500'
                          : risk === 'medio' ? 'bg-amber-500' : 'bg-green-500';
                        return (
                          <li key={analysis.id}>
                            <Link href="/dashboard/history" className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-purple-50/70 transition-colors group">
                              <div className="relative w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className={cn('absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white', dot)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{analysis.title}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  {formatAnalysisDate(analysis.createdAt)}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-purple-200" />
                      </div>
                      <p className="text-sm font-semibold text-gray-400">Sin análisis guardados</p>
                      <p className="text-xs text-gray-300 mt-1">Tus análisis aparecerán aquí</p>
                    </div>
                  )}

                  {analyses && analyses.length > 5 && (
                    <Link
                      href="/dashboard/history"
                      className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:gap-2.5 transition-all py-2"
                    >
                      Ver todo el historial
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Tarjeta de privacidad */}
          <Card className="rounded-3xl border border-purple-100/60 bg-gradient-to-br from-purple-50/70 to-white shadow-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Tu privacidad, protegida</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Los textos se procesan de forma segura y no se comparten. Tú decides qué guardar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Resources ───────────────────────────────────────────── */}
      <Reveal delay={80}>
        <Resources />
      </Reveal>
    </div>
  );
}
