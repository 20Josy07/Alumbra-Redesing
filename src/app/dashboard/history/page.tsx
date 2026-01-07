
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { type AnalysisRecord } from "@/types";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader, FileText, Clock, Sparkles, AlertCircle, Inbox, ShieldAlert, BarChart, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
    
    const renderAnalysisContent = (analysis: AnalysisRecord) => {
        const { rules, score, help, ai_suggestion } = analysis;
        const analysisDetails = [
            { label: "Insultos Graves", count: rules.severe_insult_count },
            { label: "Insultos", count: rules.insult_count },
            { label: "Control", count: rules.control_count },
            { label: "Gaslighting", count: rules.gaslighting_count },
            { label: "Amenazas", count: rules.threat_count },
        ].filter(detail => detail.count > 0);

        const riskColor = {
            bajo: "text-green-600",
            medio: "text-yellow-600",
            alto: "text-orange-600",
            "muy alto": "text-red-600",
        }[score.risk_level] || "text-gray-600";
        
        return (
            <div className="space-y-6 pt-4 pl-4 border-l-2 ml-2 border-primary/20">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                           <ShieldAlert className={cn("w-7 h-7", riskColor)} />
                            Nivel de Riesgo: <span className={cn("capitalize", riskColor)}>{score.risk_level}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Progress value={score.score_percent} className="flex-1" />
                            <span className={cn("text-xl font-bold", riskColor)}>{score.score_percent}%</span>
                        </div>
                        <p className="text-muted-foreground">{score.message}</p>
                    </CardContent>
                </Card>

                 {analysisDetails.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <BarChart />
                                Patrones Detectados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                {analysisDetails.map(detail => (
                                    <li key={detail.label} className="p-3 bg-muted/50 rounded-md">
                                        <p className="font-semibold">{detail.label}</p>
                                        <p className="text-lg font-bold text-primary">{detail.count}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Sparkles className="text-primary"/>
                            Sugerencia de la IA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{ai_suggestion}</p>
                    </CardContent>
                </Card>

                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <AlertTitle className="text-red-800 font-bold">{help.title}</AlertTitle>
                    <AlertDescription className="text-red-700">
                        {help.message}
                    </AlertDescription>
                </Alert>
                
                <div>
                    <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                        <MessageSquareQuote />
                        Texto Original Analizado
                    </h4>
                    <blockquote className="border-l-4 border-muted-foreground/20 pl-4 py-2 bg-muted/50 rounded-r-lg max-h-40 overflow-y-auto">
                        <p className="text-muted-foreground italic text-sm">{analysis.originalText}</p>
                    </blockquote>
                </div>
            </div>
        )
    }

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
                                    <AccordionContent>
                                        {analysis.score ? renderAnalysisContent(analysis) : <p>Datos de análisis no disponibles.</p>}
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
