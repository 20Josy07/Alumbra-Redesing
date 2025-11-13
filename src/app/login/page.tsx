
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Header from "@/components/header";
import { useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.5C5,8.75 8.36,5.73 12.19,5.73C15.22,5.73 16.63,7.27 17.59,8.1L19.83,6.19C17.67,4.38 15.22,3 12.19,3C6.42,3 2,7.42 2,13C2,18.58 6.42,23 12.19,23C17.96,23 22,18.58 22,13C22,12.31 21.69,11.66 21.35,11.1V11.1Z" />
    </svg>
);


export default function LoginPage() {
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast({
                title: "¡Bienvenido/a!",
                description: "Has iniciado sesión correctamente.",
            });
            router.push('/dashboard');
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            toast({
                variant: "destructive",
                title: "Error al iniciar sesión",
                description: "Hubo un problema al intentar iniciar sesión con Google. Por favor, inténtalo de nuevo.",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12 px-6">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-extrabold tracking-tight">Inicia Sesión</CardTitle>
                        <CardDescription className="mt-2">Accede a tu cuenta para ver tu historial y resultados completos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" type="email" placeholder="tu@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link href="#" className="text-sm text-primary hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" size="lg">
                            Iniciar Sesión
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    O continúa con
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" size="lg" onClick={handleGoogleSignIn}>
                            <GoogleIcon />
                            Iniciar Sesión con Google
                        </Button>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/signup" className="text-primary font-semibold hover:underline">
                                Regístrate
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
