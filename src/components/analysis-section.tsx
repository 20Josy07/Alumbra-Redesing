'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, BrainCircuit, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { performAnalysis, type AnalysisResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

type AnalysisState = 'idle' | 'loading' | 'error' | 'success_public' | 'success_user';

export default function AnalysisSection() {
  const [text, setText] = useState('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const handleAnalysis = async () => {
    setError(null);
    setAnalysisResult(null);
    setAnalysisState('loading');
    startTransition(async () => {
      // Store the text to be analyzed in sessionStorage
      sessionStorage.setItem('lastAnalyzedText', text);
      const { data, error } = await performAnalysis(text);
      
      if (error) {
        setError(error);
        setAnalysisState('error');
        toast({
          variant: "destructive",
          title: "Error de Análisis",
          description: error,
        });
      } else if (data) {
        setAnalysisResult(data);
        if (user) {
          // If user is logged in, they can see the results directly
          // For now, let's store it and redirect to dashboard to show it there
          sessionStorage.setItem('pendingAnalysisResult', JSON.stringify(data));
          router.push('/dashboard');
        } else {
          // If user is not logged in, show the blurred results and prompt to log in
          setAnalysisState('success_public');
          sessionStorage.setItem('pendingAnalysisResult', JSON.stringify(data));
           toast({
            title: "Análisis Completado",
            description: "Inicia sesión o crea una cuenta para ver los resultados completos.",
          });
        }
      }
    });
  };

  const renderPublicResult = () => {
    if (!analysisResult) return null;
    
    const { abuseAnalysis, summary } = analysisResult;

    return (
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Análisis Preliminar
          </CardTitle>
          <CardDescription>
            Tu informe está listo. Inicia sesión para desbloquear el análisis completo y las recomendaciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Resumen de la IA
            </h3>
            <p className="text-gray-600 mt-1">{summary.summary.substring(0, 70)}...</p>
          </div>
           <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertCircle className={cn("w-5 h-5", abuseAnalysis.abuseDetected ? 'text-red-500' : 'text-green-500')} />
              Detección de Abuso
            </h3>
            <p className="text-gray-600 mt-1">{abuseAnalysis.explanation.substring(0, 70)}...</p>
          </div>
        </CardContent>
         <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Lock className="w-16 h-16 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">Resultados Bloqueados</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
                Tu análisis está listo. Inicia sesión para ver el informe completo, obtener recomendaciones y guardar tu historial de forma segura.
            </p>
            <Button size="lg" asChild>
                <Link href="/login">Inicia Sesión Para Ver Resultados</Link>
            </Button>
             <p className="text-sm text-muted-foreground mt-4">
                ¿No tienes una cuenta?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                    Regístrate
                </Link>
            </p>
        </div>
      </Card>
    );
  };
  

  return (
    <section id="analysis-section" className="py-20 md:py-24 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Analiza una Conversación Ahora
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Pega el texto de un chat para obtener un análisis instantáneo, gratuito y 100% anónimo.
          </p>
        </div>

        <Card className="shadow-2xl">
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
            {error && analysisState === 'error' && (
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
        
        {analysisState === 'success_public' && <div className="mt-8">{renderPublicResult()}</div>}
      </div>
    </section>
  );
}
