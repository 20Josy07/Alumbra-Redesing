'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { type AnalysisRecord } from "@/types";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader, FileText, Clock, Inbox, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAnalysisDate } from "@/lib/analysis";
import { Badge } from "@/components/ui/badge";
import AnalysisReport from "@/components/analysis-report";
import { Reveal } from "@/components/reveal";

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
      alto: 'bg-orange-100 text-orange-700 border-orange-200',
      'muy alto': 'bg-red-100 text-red-700 border-red-200',
    };
    return map[level?.toLowerCase()] || 'bg-purple-100 text-primary border-purple-200';
  };

  const riskDot = (level: string) => {
    const l = level?.toLowerCase();
    return l === 'muy alto' || l === 'alto' ? 'bg-red-500'
      : l === 'medio' ? 'bg-amber-500' : 'bg-green-500';
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
            <p className="text-sm text-gray-400 mt-1 ml-11">Revisa todos tus análisis guardados.</p>
          </div>
          {analyses && analyses.length > 0 && (
            <Badge className="bg-purple-100 text-primary border-purple-200 font-bold px-3 py-1">
              {analyses.length} {analyses.length === 1 ? 'análisis' : 'guardados'}
            </Badge>
          )}
        </div>
      </div>

      {/* Main card */}
      <Reveal>
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
          <CardHeader>
            <CardTitle className="text-base font-black">Mis Análisis Guardados</CardTitle>
            <CardDescription className="text-sm">
              Despliega cualquier análisis para ver el informe completo con patrones resaltados.
            </CardDescription>
          </CardHeader>
          <CardContent>

            {/* Loading */}
            {loadingAnalyses && (
              <div className="flex flex-col items-center justify-center text-center p-14">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-4 animate-pulse shadow-lg">
                  <Loader className="w-6 h-6 text-white animate-spin" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Cargando tu historial…</p>
              </div>
            )}

            {/* List */}
            {!loadingAnalyses && analyses && analyses.length > 0 && (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {analyses.map((analysis) => (
                  <AccordionItem
                    key={analysis.id}
                    value={analysis.id!}
                    className="border border-purple-100/70 rounded-2xl overflow-hidden px-0 bg-white hover:border-purple-200 transition-colors data-[state=open]:border-purple-200 data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-purple-50/50 [&[data-state=open]]:bg-purple-50/50 rounded-2xl transition-colors">
                      <span className="flex items-center gap-4 text-left flex-1">
                        <span className="relative w-10 h-10 rounded-xl bg-purple-100 inline-flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                          {analysis.score && (
                            <span className={cn('absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white', riskDot(analysis.score.risk_level))} />
                          )}
                        </span>
                        <span className="flex-1 min-w-0 flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">{analysis.title}</span>
                          <span className="text-xs text-gray-400 inline-flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatAnalysisDate(analysis.createdAt)}
                          </span>
                        </span>
                        {analysis.score && (
                          <Badge
                            variant="outline"
                            className={cn('text-xs font-bold capitalize hidden sm:flex mr-4', riskBadgeStyle(analysis.score.risk_level))}
                          >
                            {analysis.score.risk_level}
                          </Badge>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-5">
                      {analysis.score
                        ? <AnalysisReport result={analysis} originalText={analysis.originalText || ''} compact />
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
                  Cuando guardes un análisis desde el panel principal, aparecerá aquí para consultarlo cuando quieras.
                </p>
              </div>
            )}

          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
