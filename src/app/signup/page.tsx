'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Header from "@/components/header";
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.5C5,8.75 8.36,5.73 12.19,5.73C15.22,5.73 16.63,7.27 17.59,8.1L19.83,6.19C17.67,4.38 15.22,3 12.19,3C6.42,3 2,7.42 2,13C2,18.58 6.42,23 12.19,23C17.96,23 22,18.58 22,13C22,12.31 21.69,11.66 21.35,11.1V11.1Z" />
    </svg>
);

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
    const getStrength = () => {
        if (!password) return { level: 'none', text: '' };
        const hasNumber = /\d/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        const hasLength = password.length >= 8;

        const score = [hasNumber, hasUpper, hasLower, hasSpecial, hasLength].filter(Boolean).length;

        if (score <= 2) return { level: 'low', text: 'Baja' };
        if (score <= 4) return { level: 'medium', text: 'Media' };
        return { level: 'strong', text: 'Fuerte' };
    };

    const { level, text } = getStrength();

    if (level === 'none') return null;

    return (
        <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={cn('h-full transition-all duration-300 rounded-full', {
                    'w-1/3 bg-red-500': level === 'low',
                    'w-2/3 bg-yellow-500': level === 'medium',
                    'w-full bg-green-500': level === 'strong',
                })} />
            </div>
            <span className={cn('text-xs font-medium', {
                'text-red-500': level === 'low',
                'text-yellow-500': level === 'medium',
                'text-green-500': level === 'strong',
            })}>{text}</span>
        </div>
    );
};

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (confirmPassword && newPassword !== confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
        } else {
            setPasswordError(null);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        if (password !== newConfirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
        } else {
            setPasswordError(null);
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12 px-6">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-extrabold tracking-tight">Crea una Cuenta</CardTitle>
                        <CardDescription className="mt-2">Empieza a usar Alumbra para proteger tu bienestar emocional.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" type="text" placeholder="Tu nombre completo" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" type="email" placeholder="tu@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input 
                                  id="password" 
                                  type={showPassword ? "text" : "password"} 
                                  required 
                                  value={password}
                                  onChange={handlePasswordChange}
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:bg-transparent"
                                  onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </Button>
                            </div>
                            <PasswordStrengthIndicator password={password} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                             <div className="relative">
                                <Input 
                                  id="confirm-password" 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  required 
                                  value={confirmPassword}
                                  onChange={handleConfirmPasswordChange}
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(prev => !prev)}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </Button>
                            </div>
                            {passwordError && <p className="text-sm font-medium text-destructive">{passwordError}</p>}
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={!!passwordError}>
                            Crear Cuenta
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    O regístrate con
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" size="lg">
                            <GoogleIcon />
                            Registrarse con Google
                        </Button>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/login" className="text-primary font-semibold hover:underline">
                                Inicia Sesión
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
