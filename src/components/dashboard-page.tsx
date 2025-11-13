'use client';

import { useUser, useFirestore } from "@/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { FileText, Clock, Sparkles, AlertCircle, BrainCircuit, Loader, Lock } from "lucide-react";
import Resources from "./resources";
import { type AnalysisResult, performAnalysis } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { saveAnalysis } from "@/firebase/firestore/analyses";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisRecord } from "@/types";
import { useMemo, useState, useTransition } from "react";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { useCollection, useMemoFirebase } from "@/firebase";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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
            setLastAnalyzedText(text); // Save text for potential save action
            const { data, error } = await performAnalysis(text);
            
            if (error) {
                setError(error);
                toast({
                    variant: "destructive",
                    title: "Error de Análisis",
                    description: error,
                });
            } else if (data) {
                setPendingAnalysis(data);
                setText(''); // Clear textarea after successful analysis
            }
        });
    };

    const handleSaveAnalysis = async () => {
        if (!pendingAnalysis || !user || !firestore) return;

        try {
            const analysisToSave = {
                ...pendingAnalysis,
                title: `Análisis del ${new Date().toLocaleDateString('es-ES')}`,
                originalText: lastAnalyzedText,
            };
            await saveAnalysis(firestore, user.uid, analysisToSave);
            toast({
                title: "Análisis guardado",
                description: "Tu análisis ha sido guardado en tu historial.",
            });
            setPendingAnalysis(null);
            setLastAnalyzedText('');
        } catch (error) {
            console.error("Error saving analysis:", error);
            toast({
                variant: "destructive",
                title: "Error al guardar",
                description: "No se pudo guardar el análisis. Inténtalo de nuevo.",
            });
        }
    };

    const handleDiscardAnalysis = () => {
        setPendingAnalysis(null);
        setLastAnalyzedText('');
        toast({
            title: "Análisis descartado",
            description: "El análisis no ha sido guardado.",
        });
    };
    
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


    const renderPendingAnalysis = () => {
        if (!pendingAnalysis) return null;
        
        const { abuseAnalysis, summary } = pendingAnalysis;

        return (
             <Card className="border-primary border-2 animate-in fade-in-0 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BrainCircuit className="text-primary" />
                    Resultados de tu Análisis
                  </CardTitle>
                  <CardDescription>
                    Aquí está el análisis completo del texto que proporcionaste. Puedes guardarlo en tu historial o descartarlo.
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
                     <p className={cn("mt-1 text-base", abuseAnalysis.abuseDetected ? 'text-destructive-foreground/90' : 'text-green-700', abuseAnalysis.abuseDetected && 'p-2 bg-destructive/80 rounded-md' )}>
                        {abuseAnalysis.explanation}
                    </p>
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
                <CardFooter>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Button onClick={handleSaveAnalysis} className="flex-1">Guardar Análisis en el Historial</Button>
                        <Button onClick={handleDiscardAnalysis} variant="outline" className="flex-1">Descartar Análisis</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }
    
    const renderAnalysisForm = () => (
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="text-primary" />
              Analizador de Abuso Emocional
            </CardTitle>
            <CardDescription>
              Pega la conversación que quieres analizar en el cuadro de abajo. Mínimo 20 caracteres.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Pega aquí el texto de WhatsApp, SMS, email, etc."
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isPending}
              className="text-base"
            />
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button onClick={handleAnalysis} disabled={isPending || text.trim().length < 20} size="lg" className="w-full">
              {isPending ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Analizando...
                </>
              ) : (
                'Analizar Texto'
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Lock className="w-3 h-3" />
              <span>Análisis 100% anónimo y seguro</span>
            </div>
          </CardFooter>
        </Card>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hola de nuevo, {user?.displayName?.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Bienvenido/a a tu espacio seguro. Estamos aquí para ayudarte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {pendingAnalysis ? renderPendingAnalysis() : renderAnalysisForm()}
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial Reciente</CardTitle>
                            <CardDescription>Tus últimos 5 análisis guardados.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingAnalyses ? (
                                <div className="flex items-center justify-center p-6">
                                    <Loader className="w-6 h-6 animate-spin" />
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {analyses && analyses.length > 0 ? (
                                        analyses.slice(0, 5).map((analysis) => (
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
                                                        {formatDate(analysis.createdAt)}
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
