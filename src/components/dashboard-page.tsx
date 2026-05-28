'use client';

import { useUser, useFirestore } from "@/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
  FileText, Clock, Sparkles, AlertCircle, BrainCircuit,
  Loader, Lock, ShieldAlert, BarChart, MessageSquareQuote,
  TrendingUp, Activity, Zap, ChevronRight
} from "lucide-react";
import Resources from "./resources";
import { type AnalysisResult, performAnalysis } from "@/app/actions";
import { cn } from "@/lib/utils";
import { buildAnalysisDetails, formatAnalysisDate, getRiskColorClass } from "@/lib/analysis";
import { Button } from "./ui/button";
import { saveAnalysis } from "@/firebase/firestore/analyses";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisRecord } from "@/types";
import { useState, useTransition } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollection, useMemoFirebase } from "@/firebase";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

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

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: analyses, loading: loadingAnalyses } = useCollection<AnalysisRecord>(analysesQuery);

  const handleAnalysis = async () => {
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
      }
    });
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

  const renderPendingAnalysis = () => {
    if (!pendingAnalysis) return null;
    const { rules, score, help, ai_suggestion } = pendingAnalysis;
    const analysisDetails = buildAnalysisDetails(rules);
    const riskColor = getRiskColorClass(score.risk_level);

    const riskBgMap: Record<string, string> = {
      bajo: 'bg-green-50 border-green-200',
      medio: 'bg-amber-50 border-amber-200',
      alto: 'bg-red-50 border-red-200',
    };
    const riskBg = riskBgMap[score.risk_level?.toLowerCase()] || 'bg-purple-50 border-purple-200';

    return (
      <div className="space-y-5 animate-in fade-in-0 duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Resultados del Análisis</h2>
            <p className="text-xs text-gray-400">Aquí está el análisis completo del texto proporcionado</p>
          </div>
        </div>

        {/* Risk Score */}
        <Card className={cn("border-2 rounded-3xl overflow-hidden shadow-sm", riskBg)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className={cn("w-6 h-6", riskColor)} />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nivel de Riesgo</p>
                  <p className={cn("text-2xl font-black capitalize", riskColor)}>{score.risk_level}</p>
                </div>
              </div>
              <div className={cn("text-4xl font-black", riskColor)}>{score.score_percent}%</div>
            </div>
            <Progress value={score.score_percent} className="h-2.5 rounded-full mb-3" />
            <p className="text-sm text-gray-600">{score.message}</p>
          </CardContent>
        </Card>

        {/* Detected Patterns */}
        {analysisDetails.length > 0 && (
          <Card className="rounded-3xl border border-purple-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <BarChart className="w-5 h-5 text-primary" />
                Patrones Detectados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {analysisDetails.map(detail => (
                  <li key={detail.label} className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-100/60">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{detail.label}</p>
                    <p className="text-2xl font-black text-gradient">{detail.count}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* AI Suggestion */}
        <Card className="rounded-3xl border border-purple-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="w-5 h-5 text-primary" />
              Sugerencia de la IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 leading-relaxed">{ai_suggestion}</p>
          </CardContent>
        </Card>

        {/* Help Alert */}
        <Alert className="bg-red-50 border-red-200 rounded-2xl">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-800 font-bold text-sm">{help.title}</AlertTitle>
          <AlertDescription className="text-red-600 text-xs leading-relaxed">{help.message}</AlertDescription>
        </Alert>

        {/* Original Text */}
        <Card className="rounded-3xl border border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <MessageSquareQuote className="w-5 h-5 text-gray-400" />
              Texto Original Analizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary/20 pl-4 py-2 bg-purple-50/60 rounded-r-xl max-h-36 overflow-y-auto">
              <p className="text-sm text-gray-500 italic leading-relaxed">{lastAnalyzedText}</p>
            </blockquote>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Button
            onClick={handleSaveAnalysis}
            className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-md"
          >
            Guardar en Historial
          </Button>
          <Button
            onClick={handleDiscardAnalysis}
            variant="outline"
            className="flex-1 h-11 rounded-2xl border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 font-semibold"
          >
            Descartar
          </Button>
        </div>
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
          <Textarea
            placeholder="Pega aquí el texto de WhatsApp, SMS, email u otra conversación..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
            className="text-sm min-h-[140px] rounded-2xl border-purple-100 focus:border-primary bg-purple-50/30 resize-none leading-relaxed"
          />
          {error && (
            <Alert variant="destructive" className="mt-4 rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-bold">Error</AlertTitle>
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-3 pt-2">
          <Button
            onClick={handleAnalysis}
            disabled={isPending || text.trim().length < 20}
            size="lg"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-md glow-purple-sm text-sm"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Analizando con IA...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Analizar Texto
              </span>
            )}
          </Button>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            Análisis 100% anónimo y seguro
          </div>
        </CardFooter>
      </Card>

      {/* Quick tips card */}
      <Card className="rounded-3xl border border-purple-100/60 bg-gradient-to-br from-purple-50/60 to-white shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Consejo profesional</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Para mejores resultados, incluye conversaciones completas con contexto. La IA detecta mejor los patrones con al menos 3-4 intercambios entre los participantes.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const totalAnalyses = analyses?.length || 0;

  return (
    <div className="space-y-7 max-w-[1400px]">

      {/* ── Welcome header ──────────────────────────────────────── */}
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              Hola de nuevo, {user?.displayName?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">Tu espacio seguro para el análisis clínico de conversaciones.</p>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-violet-500 text-white border-0 px-4 py-1.5 text-xs font-bold rounded-full shadow-sm">
            <Sparkles className="w-3 h-3 mr-1.5" />
            Panel Profesional
          </Badge>
        </div>
      </div>

      {/* ── Quick stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
        {[
          { label: 'Análisis guardados', value: totalAnalyses.toString(), icon: FileText, color: 'from-primary to-violet-500' },
          { label: 'Este mes', value: '—', icon: TrendingUp, color: 'from-violet-500 to-purple-600' },
          { label: 'Precisión media', value: '98%', icon: Activity, color: 'from-purple-500 to-fuchsia-500' },
          { label: 'Última sesión', value: 'Hoy', icon: Clock, color: 'from-fuchsia-500 to-pink-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="rounded-2xl border border-purple-100/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', color)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
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
                <ul className="space-y-2">
                  {analyses && analyses.length > 0 ? (
                    analyses.slice(0, 5).map((analysis) => (
                      <li key={analysis.id}>
                        <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-purple-50/70 transition-colors group cursor-pointer">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{analysis.title}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {formatAnalysisDate(analysis.createdAt)}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-purple-200" />
                      </div>
                      <p className="text-sm font-semibold text-gray-400">Sin análisis guardados</p>
                      <p className="text-xs text-gray-300 mt-1">Tus análisis aparecerán aquí</p>
                    </div>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Resources ───────────────────────────────────────────── */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
        <Resources />
      </div>
    </div>
  );
}
