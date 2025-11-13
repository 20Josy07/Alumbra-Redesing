'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit mb-4">
            <Sparkles className="w-12 h-12 text-primary bg-primary/10 p-2 rounded-full" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">¡Bienvenido/a a Alumbra, {user.displayName?.split(' ')[0]}!</CardTitle>
          <CardDescription className="text-lg mt-2 text-gray-600">Gracias por unirte. Estamos aquí para darte claridad y apoyo.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-center text-muted-foreground">
            Has dado un paso importante hacia tu bienestar. Explora tu dashboard para empezar a utilizar nuestras herramientas.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/dashboard')} className="w-full" size="lg">
            Ir a mi Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
