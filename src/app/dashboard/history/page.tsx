'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { type AnalysisRecord } from "@/types";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Loader, FileText, Clock, Sparkles, AlertCircle,
  Inbox, ShieldAlert, BarChart, MessageSquareQuote, History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildAnalysisDetails, formatAnalysisDate, getRiskColorClass } from "@/lib/analysis";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: analyses, loading: loadingAnalyses } = useCollection<AnalysisRecord>(analysesQuery);

  const riskBadgeStyle = (level: string) => {
    const map: Record<string, string> = {
      bajo: 'bg-green-100 text-green-700 border-green-200',
      medio: 'bg-amber-100 text-amber-700 border-amber-200',
      alto: 'bg-red-100 text-red-700 border-red-200',
    };
    return map[level?.toLowerCase()] || 'bg-purple-100 text-primary border-purple-200';
  };

  const renderAnalysisContent = (analysis: AnalysisRecord) => {
    const { rules, score, help, ai_suggestion } = analysis;
    const analysisDetails = buildAnalysisDetails(rules);
    const riskColor = getRiskColorClass(score.risk_level);

    return (
      <div className="space-y-4 pt-4">

        {/* Risk */}
        <Card className={cn("rounded-2xl border-2 shadow-sm", {
          'bg-green-50 border-green-200': score.risk_level?.toLowerCase() === 'bajo',
          'bg-amber-50 border-amber-200': score.risk_level?.toLowerCase() === 'medio',
          'bg-red-50 border-red-200': score.risk_level?.toLowerCase() === 'alto',
          'bg-purple-50 border-purple-200': !['bajo','medio','alto'].includes(score.risk_level?.toLowerCase()),
        })}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className={cn("w-5 h-5", riskColor)} />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nivel de Riesgo</p>
                  <p className={cn("text-xl font-black capitalize", riskColor)}>{score.risk_level}</p>
                </div>
              </div>
              <span className={cn("text-3xl font-black", riskColor)}>{score.score_percent}%</span>
            </div>
            <Progress value={score.score_percent} className="h-2 rounded-full mb-3" />
            <p className="text-sm text-gray-600">{score.message}</p>
          </CardContent>
        </Card>

        {/* Patterns */}
        {analysisDetails.length > 0 && (
          <Card className="rounded-2xl border border-purple-100 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <BarChart className="w-4 h-4 text-primary" />
                Patrones Detectados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {analysisDetails.map(detail => (
                  <li key={detail.label} className="p-3 bg-purple-50/70 rounded-xl border border-purple-100/60">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{detail.label}</p>
                    <p className="text-xl font-black text-gradient">{detail.count}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* AI Suggestion */}
        <Card className="rounded-2xl border border-purple-100 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <Sparkles className="w-4 h-4 text-primary" />
              Sugerencia de la IA
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <p className="text-sm text-gray-600 leading-relaxed">{ai_suggestion}</p>
          </CardContent>
        </Card>

        {/* Help */}
        <Alert className="bg-red-50 border-red-200 rounded-2xl">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-800 font-bold text-sm">{help.title}</AlertTitle>
          <AlertDescription className="text-red-600 text-xs leading-relaxed">{help.message}</AlertDescription>
        </Alert>

        {/* Original text */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <MessageSquareQuote className="w-4 h-4 text-gray-400" />
              Texto Original
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <blockquote className="border-l-4 border-primary/20 pl-4 py-2 bg-purple-50/50 rounded-r-xl max-h-36 overflow-y-auto">
              <p className="text-sm text-gray-500 italic leading-relaxed">{analysis.originalText}</p>
            </blockquote>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-7 max-w-[1000px]">

      {/* Header */}
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
                <History className="w-4 h-4 text-white" />
              </div>
              Historial de Análisis
            </h1>
            <p className="text-sm text-gray-400 mt-1 ml-11">Revisa todos tus análisis clínicos guardados.</p>
          </div>
          {analyses && analyses.length > 0 && (
            <Badge className="bg-purple-100 text-primary border-purple-200 font-bold px-3 py-1">
              {analyses.length} {analyses.length === 1 ? 'análisis' : 'análisis guardados'}
            </Badge>
          )}
        </div>
      </div>

      {/* Main card */}
      <Card className="rounded-3xl border border-purple-100/60 shadow-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
        <CardHeader>
          <CardTitle className="text-base font-black">Mis Análisis Guardados</CardTitle>
          <CardDescription className="text-sm">
            Aquí encontrarás todos los análisis que has decidido guardar para referencia futura.
          </CardDescription>
        </CardHeader>
        <CardContent>

          {/* Loading */}
          {loadingAnalyses && (
            <div className="flex flex-col items-center justify-center text-center p-14">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-4 animate-pulse shadow-lg">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Cargando tu historial...</p>
            </div>
          )}

          {/* List */}
          {!loadingAnalyses && analyses && analyses.length > 0 && (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {analyses.map((analysis) => (
                <AccordionItem
                  key={analysis.id}
                  value={analysis.id!}
                  className="border border-purple-100/70 rounded-2xl overflow-hidden px-0 bg-white hover:border-purple-200 transition-colors"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-purple-50/50 [&[data-state=open]]:bg-purple-50/50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4 text-left flex-1">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm">{analysis.title}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatAnalysisDate(analysis.createdAt)}
                        </p>
                      </div>
                      {analysis.score && (
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs font-bold capitalize hidden sm:flex mr-4',
                            riskBadgeStyle(analysis.score.risk_level)
                          )}
                        >
                          {analysis.score.risk_level}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    {analysis.score
                      ? renderAnalysisContent(analysis)
                      : <p className="text-sm text-gray-400 py-2">Datos de análisis no disponibles.</p>
                    }
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* Empty */}
          {!loadingAnalyses && (!analyses || analyses.length === 0) && (
            <div className="flex flex-col items-center justify-center text-center p-16">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Inbox className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-black text-gray-700 mb-2">Tu historial está vacío</h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Cuando guardes un análisis desde el panel principal, aparecerá aquí para que puedas consultarlo en cualquier momento.
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
