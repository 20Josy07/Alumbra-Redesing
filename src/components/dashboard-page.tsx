'use client';

import { useUser, useFirestore } from "@/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { FileText, Clock, Sparkles, AlertCircle, BrainCircuit, Loader, Lock, ShieldAlert, BarChart, MessageSquareQuote } from "lucide-react";
import Resources from "./resources";
import { type AnalysisResult, performAnalysis } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { saveAnalysis } from "@/firebase/firestore/analyses";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisRecord } from "@/types";
import { useState, useTransition } from "react";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { useCollection, useMemoFirebase } from "@/firebase";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";

interface DashboardPageProps {
  pendingAnalysis: AnalysisResult | null;
  setPendingAnalysis: (analysis: AnalysisResult | null) => void;
}

const RiskIndicator = ({ level }: { level: string }) => {
  const levelInfo = {
    bajo: { color: "bg-green-500", label: "Bajo" },
    medio: { color: "bg-yellow-500", label: "Medio" },
    alto: { color: "bg-orange-500", label: "Alto" },
    "muy alto": { color: "bg-red-500", label: "Muy Alto" },
  };

  const { color, label } = levelInfo[level as keyof typeof levelInfo] || { color: "bg-gray-400", label: "Indeterminado" };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full", color)}></div>
      <span className="font-semibold">{label}</span>
    </div>
  );
};


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
        
        const { rules, score, help } = pendingAnalysis;

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
             <Card className="border-primary border-2 animate-in fade-in-0 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BrainCircuit className="text-primary" />
                    Resultados de tu Análisis
                  </CardTitle>
                  <CardDescription>
                    Aquí está el análisis completo del texto que proporcionaste.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                            <p className="text-muted-foreground italic text-sm">{lastAnalyzedText}</p>
                        </blockquote>
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
         <Card className="shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isPending}
              className="text-base min-h-[120px]"
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
            <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
                <h1 className="text-3xl font-bold tracking-tight">Hola de nuevo, {user?.displayName?.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Bienvenido/a a tu espacio seguro. Estamos aquí para ayudarte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {pendingAnalysis ? renderPendingAnalysis() : renderAnalysisForm()}
                </div>
                <div className="lg:col-span-1">
                    <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
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
            
            <div className="lg:col-span-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
               <Resources />
            </div>

        </div>
    );
}
