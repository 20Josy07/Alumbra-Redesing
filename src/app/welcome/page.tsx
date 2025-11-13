'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Download, Image as ImageIcon, Loader, Sparkles } from 'lucide-react';
import { performWallpaperGeneration } from '@/app/actions';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function WelcomePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('fuerza y calma');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect if not logged in
    router.push('/login');
    return null;
  }

  const handleGeneration = () => {
    setGeneratedImage(null);
    startTransition(async () => {
      const { data, error } = await performWallpaperGeneration(prompt);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error al generar',
          description: error,
        });
      } else if (data) {
        setGeneratedImage(data.imageUrl);
      }
    });
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `alumbra-wallpaper-${prompt.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit mb-4">
            <Sparkles className="w-12 h-12 text-primary bg-primary/10 p-2 rounded-full" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">¡Bienvenido/a a Alumbra, {user.displayName?.split(' ')[0]}!</CardTitle>
          <CardDescription className="text-lg mt-2 text-gray-600">Gracias por unirte. Estamos aquí para darte claridad y apoyo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p>Como un pequeño regalo de bienvenida, crea un fondo de pantalla personalizado que te inspire.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Escribe una palabra o frase (ej: calma, fuerza, nuevo comienzo)</Label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Escribe tu inspiración..."
                disabled={isPending}
              />
              <Button onClick={handleGeneration} disabled={isPending || !prompt}>
                {isPending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generar
              </Button>
            </div>
          </div>

          <div className="relative aspect-[9/16] w-full max-w-xs mx-auto bg-muted rounded-2xl flex items-center justify-center overflow-hidden border">
            {isPending && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader className="w-8 h-8 animate-spin" />
                <p>Generando tu fondo...</p>
              </div>
            )}
            {!isPending && generatedImage && (
              <Image src={generatedImage} alt="Fondo de pantalla generado" layout="fill" objectFit="cover" />
            )}
            {!isPending && !generatedImage && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-8 h-8" />
                <p className="text-center text-sm">Tu fondo de pantalla aparecerá aquí.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleDownload} variant="outline" className="w-full" disabled={!generatedImage || isPending}>
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Ir a mi Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
