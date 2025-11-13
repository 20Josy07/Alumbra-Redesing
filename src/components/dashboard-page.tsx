'use client';

import { useUser, useFirestore, useCollection } from "@/firebase";
import AnalysisSection from "./analysis-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FileText, Clock, Sparkles, AlertCircle, BrainCircuit, Loader } from "lucide-react";
import Resources from "./resources";
import { type AnalysisResult } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { saveAnalysis } from "@/firebase/firestore/analyses";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisRecord } from "@/types";
import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";

interface DashboardPageProps {
  pendingAnalysis?: AnalysisResult | null;
  setPendingAnalysis: (analysis: AnalysisResult | null) => void;
}

export default function DashboardPage({ pendingAnalysis, setPendingAnalysis }: DashboardPageProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const analysesQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const { data: analyses, loading: loadingAnalyses } = useCollection<AnalysisRecord>(analysesQuery);

    const handleSaveAnalysis = async () => {
        if (!pendingAnalysis || !user || !firestore) return;

        try {
            const analysisToSave = {
                ...pendingAnalysis,
                title: `Análisis del ${new Date().toLocaleDateString()}`,
                originalText: sessionStorage.getItem('lastAnalyzedText') || '',
            };
            await saveAnalysis(firestore, user.uid, analysisToSave);
            toast({
                title: "Análisis guardado",
                description: "Tu análisis ha sido guardado en tu historial.",
            });
            setPendingAnalysis(null); // Clear the pending analysis from view
            sessionStorage.removeItem('lastAnalyzedText');
        } catch (error) {
            console.error("Error saving analysis:", error);
            toast({
                variant: "destructive",
                title: "Error al guardar",
                description: "No se pudo guardar el análisis. Inténtalo de nuevo.",
            });
        }
    };

    const renderPendingAnalysis = () => {
        if (!pendingAnalysis) return null;
        
        const { abuseAnalysis, summary } = pendingAnalysis;

        return (
             <Card className="border-primary border-2 animate-in fade-in-0 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BrainCircuit className="text-primary" />
                    Resultados de tu Análisis Reciente
                  </CardTitle>
                  <CardDescription>
                    Aquí está el análisis completo del texto que proporcionaste antes de iniciar sesión.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Sparkles className="text-primary w-5 h-5" />
                      Resumen Detallado de la IA
                    </h3>
                    <p className="text-muted-foreground mt-1 text-base">{summary.summary}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <AlertCircle className={cn("w-5 h-5", abuseAnalysis.abuseDetected ? 'text-destructive' : 'text-green-600')} />
                      Detección y Explicación de Abuso
                    </h3>
                    <p className={cn("mt-1 text-base", abuseAnalysis.abuseDetected ? 'text-destructive' : 'text-green-700')}>{abuseAnalysis.explanation}</p>
                  </div>
                   <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/10">
                     <h3 className="font-bold text-yellow-800">Próximos Pasos y Recomendaciones</h3>
                     <p className="text-yellow-700 mt-1">
                         {abuseAnalysis.abuseDetected 
                            ? "Hemos detectado indicadores preocupantes. Es importante que busques apoyo. Consulta nuestros recursos de ayuda para obtener orientación profesional. Guarda este análisis en tu historial para futuras referencias."
                            : "No hemos detectado indicadores claros de abuso en este texto, pero tu intuición es importante. Si sigues sintiendo que algo no está bien, considera hablar con un profesional. Revisa nuestros recursos para más información."
                         }
                     </p>
                  </div>
                </CardContent>
                <CardContent>
                    <Button onClick={handleSaveAnalysis}>Guardar Análisis en el Historial</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hola de nuevo, {user?.displayName?.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Bienvenido/a a tu espacio seguro. Estamos aquí para ayudarte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {pendingAnalysis ? renderPendingAnalysis() : <AnalysisSection />}
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Análisis</CardTitle>
                            <CardDescription>Revisa tus análisis guardados anteriormente.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingAnalyses ? (
                                <div className="flex items-center justify-center p-6">
                                    <Loader className="w-6 h-6 animate-spin" />
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {analyses && analyses.length > 0 ? (
                                        analyses.map((analysis) => (
                                            <li key={analysis.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-accent-foreground" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-sm">{analysis.title}</h3>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        {analysis.createdAt ? new Date(analysis.createdAt.seconds * 1000).toLocaleString() : 'Fecha desconocida'}
                                                    </p>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">No tienes análisis guardados.</p>
                                    )}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="lg:col-span-3">
               <Resources />
            </div>

        </div>
    );
}
