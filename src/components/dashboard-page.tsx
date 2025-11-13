
'use client';

import { useUser } from "@/firebase";
import AnalysisSection from "./analysis-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FileText, Clock, Sparkles, AlertCircle, CheckCircle, BrainCircuit } from "lucide-react";
import Resources from "./resources";
import { type AnalysisResult } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const recentAnalyses = [
    {
        title: "Conversación de WhatsApp con Alex",
        date: "Hace 2 horas",
        risk: "Alto",
        summary: "Se detectaron múltiples indicadores de gaslighting y manipulación..."
    },
    {
        title: "Email de mi jefe",
        date: "Ayer",
        risk: "Bajo",
        summary: "Comunicación directa pero con tono exigente. No se detectaron tácticas de abuso."
    },
    {
        title: "SMS con María",
        date: "Hace 3 días",
        risk: "Medio",
        summary: "Se identificaron patrones de chantaje emocional y control coercitivo leve."
    }
];

interface DashboardPageProps {
  pendingAnalysis?: AnalysisResult | null;
}

export default function DashboardPage({ pendingAnalysis }: DashboardPageProps) {
    const { user } = useUser();

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
                    <Button>Guardar Análisis en el Historial</Button>
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
                            <ul className="space-y-4">
                                {recentAnalyses.map((analysis, index) => (
                                    <li key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-accent-foreground" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm">{analysis.title}</h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" />{analysis.date}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
