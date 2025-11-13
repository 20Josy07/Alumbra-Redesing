
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { type AnalysisRecord } from "@/types";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader, FileText, Clock, Sparkles, AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const analysesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const { data: analyses, loading: loadingAnalyses } = useCollection<AnalysisRecord>(analysesQuery);

    const formatDate = (timestamp: Timestamp | Date | undefined | null) => {
        if (!timestamp) return 'Fecha desconocida';
        const date = (timestamp as Timestamp)?.toDate ? (timestamp as Timestamp).toDate() : (timestamp as Date);
        if (date instanceof Date) {
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return 'Fecha inválida';
    };

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Historial de Análisis</h1>
                <p className="text-muted-foreground">Revisa todos tus análisis guardados anteriormente.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Mis Análisis Guardados</CardTitle>
                    <CardDescription>Aquí encontrarás todos los análisis que has decidido guardar para referencia futura.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingAnalyses && (
                        <div className="flex flex-col items-center justify-center text-center p-12">
                            <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Cargando tu historial...</p>
                        </div>
                    )}

                    {!loadingAnalyses && analyses && analyses.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {analyses.map((analysis) => (
                                <AccordionItem value={analysis.id!} key={analysis.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4 text-left">
                                            <FileText className="w-5 h-5 text-primary flex-shrink-0"/>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{analysis.title}</h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(analysis.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-6 pt-4 pl-4 border-l-2 ml-2 border-primary/20">
                                        <div>
                                            <h4 className="font-bold text-base flex items-center gap-2 mb-2">
                                                <Sparkles className="text-primary w-5 h-5" />
                                                Resumen de la IA
                                            </h4>
                                            <p className="text-muted-foreground text-base">{analysis.summary.summary}</p>
                                        </div>
                                        
                                        <div className={cn("p-4 rounded-lg", analysis.abuseAnalysis.abuseDetected ? 'bg-destructive/10' : 'bg-green-500/10')}>
                                            <h4 className="font-bold text-base flex items-center gap-2 mb-2">
                                                <AlertCircle className={cn("w-5 h-5", analysis.abuseAnalysis.abuseDetected ? 'text-destructive' : 'text-green-600')} />
                                                Detección de Abuso
                                            </h4>
                                             <Badge variant={analysis.abuseAnalysis.abuseDetected ? "destructive" : "default"} className={cn("mb-2", !analysis.abuseAnalysis.abuseDetected && "bg-green-600")}>
                                                {analysis.abuseAnalysis.abuseDetected ? "Abuso Detectado" : "No se detectó abuso"}
                                            </Badge>
                                            <p className={cn(analysis.abuseAnalysis.abuseDetected ? 'text-destructive' : 'text-green-700')}>{analysis.abuseAnalysis.explanation}</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-bold text-base mb-2">Texto Original Analizado</h4>
                                            <blockquote className="border-l-4 border-muted-foreground/20 pl-4 py-2 bg-muted/50 rounded-r-lg">
                                                <p className="text-muted-foreground italic text-sm">{analysis.originalText}</p>
                                            </blockquote>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {!loadingAnalyses && (!analyses || analyses.length === 0) && (
                        <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                            <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">Tu historial está vacío</h3>
                            <p className="text-muted-foreground mt-2">Cuando guardes un análisis, aparecerá aquí.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
