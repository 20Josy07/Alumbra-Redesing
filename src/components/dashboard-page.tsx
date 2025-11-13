
'use client';

import { useUser } from "@/firebase";
import AnalysisSection from "./analysis-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FileText, Clock } from "lucide-react";
import Resources from "./resources";

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

export default function DashboardPage() {
    const { user } = useUser();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hola de nuevo, {user?.displayName?.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Bienvenido/a a tu espacio seguro. Estamos aquí para ayudarte.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnalysisSection />
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
