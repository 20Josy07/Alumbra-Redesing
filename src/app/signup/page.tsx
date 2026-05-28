'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Sparkles, Shield, Brain, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function getAuthErrorCode(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : '';
  }
  return '';
}

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
  const getStrength = () => {
    if (!password) return { level: 'none', text: '', score: 0 };
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const hasLength = password.length >= 8;
    const score = [hasNumber, hasUpper, hasLower, hasSpecial, hasLength].filter(Boolean).length;
    if (score <= 2) return { level: 'low', text: 'Baja', score };
    if (score <= 4) return { level: 'medium', text: 'Media', score };
    return { level: 'strong', text: 'Fuerte', score };
  };
  const { level, text } = getStrength();
  if (level === 'none') return null;
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all duration-300', {
            'bg-red-400': level === 'low' && i === 1,
            'bg-amber-400': level === 'medium' && i <= 2,
            'bg-green-400': level === 'strong',
            'bg-gray-100': (level === 'low' && i > 1) || (level === 'medium' && i > 2),
          })} />
        ))}
      </div>
      <span className={cn('text-xs font-semibold w-10', {
        'text-red-500': level === 'low',
        'text-amber-500': level === 'medium',
        'text-green-500': level === 'strong',
      })}>{text}</span>
    </div>
  );
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "¡Bienvenido/a a Alumbra!", description: "Tu cuenta ha sido creada." });
      router.push('/welcome');
    } catch (error: unknown) {
      if (getAuthErrorCode(error) === 'auth/cancelled-popup-request') return;
      toast({ variant: "destructive", title: "Error al registrarte", description: "Problema con Google. Inténtalo de nuevo." });
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || passwordError) return;
    if (password !== confirmPassword) { setPasswordError('Las contraseñas no coinciden'); return; }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) await updateProfile(userCredential.user, { displayName: name });
      toast({ title: "¡Bienvenido/a a Alumbra!", description: "Tu cuenta ha sido creada." });
      router.push('/welcome');
    } catch (error: unknown) {
      let description = "Hubo un problema al crear tu cuenta.";
      const code = getAuthErrorCode(error);
      if (code === 'auth/email-already-in-use') description = "Este correo ya está en uso. Inicia sesión.";
      else if (code === 'auth/weak-password') description = "La contraseña es muy débil (mín. 6 caracteres).";
      toast({ variant: "destructive", title: "Error al registrarte", description });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPassword(v);
    setPasswordError(confirmPassword && v !== confirmPassword ? 'Las contraseñas no coinciden' : null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setConfirmPassword(v);
    setPasswordError(password !== v ? 'Las contraseñas no coinciden' : null);
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel: Brand ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden section-dark-purple flex-col justify-between p-12">
        <div className="absolute top-[-20%] right-[-15%] w-96 h-96 rounded-full bg-violet-500/15 blur-3xl animate-orb pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 rounded-full bg-purple-400/15 blur-3xl animate-pulse-glow pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-400 flex items-center justify-center shadow-lg">
              <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={18} height={18} className="brightness-0 invert" />
            </div>
            <span className="text-xl font-black text-white">Alumbra</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Únete a más de{' '}
              <span className="text-gradient-light">500 profesionales</span>{' '}
              de la salud mental.
            </h2>
            <p className="text-purple-300 text-base leading-relaxed">
              Empieza gratis con 3 análisis de regalo. Sin tarjeta de crédito.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: Brain, text: 'Análisis de abuso psicológico con IA' },
              { icon: Shield, text: 'Datos cifrados y completamente privados' },
              { icon: Sparkles, text: 'Informes clínicos estructurados al instante' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 glass-dark rounded-2xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-purple-200" />
                </div>
                <p className="text-sm text-purple-200">{text}</p>
              </div>
            ))}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-3 glass-dark rounded-2xl px-4 py-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-purple-200">4.9/5 · Más de 200 reseñas de profesionales</p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-purple-400/60">
          © 2025 Alumbra · Made with ❤️ in Colombia
        </div>
      </div>

      {/* ── Right Panel: Form ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-purple-100/60">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
              <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={16} height={16} className="brightness-0 invert" />
            </div>
            <span className="font-black text-lg">Alumbra</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-purple-50/40 to-white">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">

            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Crea tu cuenta</h1>
              <p className="text-gray-500 text-sm">Empieza gratis y protege el bienestar emocional de tus pacientes.</p>
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700 font-medium mb-6"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              Continuar con Google
            </Button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">o con tu correo</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nombre completo</Label>
                <Input
                  id="name" type="text" placeholder="Tu nombre completo" required
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Correo Electrónico</Label>
                <Input
                  id="email" type="email" placeholder="tu@email.com" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPassword ? "text" : "password"} required
                    value={password} onChange={handlePasswordChange}
                    className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm pr-12"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <PasswordStrengthIndicator password={password} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirm-password" type={showConfirmPassword ? "text" : "password"} required
                    value={confirmPassword} onChange={handleConfirmPasswordChange}
                    className={cn("h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm pr-12", passwordError && 'border-destructive focus:border-destructive')}
                  />
                  <button
                    type="button" onClick={() => setShowConfirmPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-destructive font-medium">{passwordError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 text-white font-bold text-sm shadow-lg glow-purple-sm mt-2"
                disabled={!!passwordError || !name || !email || !password || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Crear Cuenta Gratis
                    <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="text-primary hover:underline">Términos de uso</a>{' '}
              y{' '}
              <a href="#" className="text-primary hover:underline">Política de privacidad</a>.
            </p>

            <p className="text-center text-sm text-gray-500 mt-5">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
