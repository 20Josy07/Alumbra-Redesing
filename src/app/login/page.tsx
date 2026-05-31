'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

/** Mensaje claro según el código de error de Firebase Auth */
function googleErrorMessage(code: string): string | null {
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return null; // el usuario canceló, no mostramos error
    case 'auth/operation-not-allowed':
      return 'El inicio con Google no está habilitado. Actívalo en Firebase → Authentication → Sign-in method → Google.';
    case 'auth/unauthorized-domain':
      return 'Este dominio no está autorizado. Agrégalo en Firebase → Authentication → Settings → Dominios autorizados.';
    default:
      return 'Hubo un problema con Google. Inténtalo de nuevo.';
  }
}
import { ArrowRight, Eye, EyeOff, Sparkles, Shield, Brain, CheckCircle2 } from "lucide-react";

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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "¡Bienvenido/a de nuevo!", description: "Has iniciado sesión correctamente." });
      router.push('/dashboard');
    } catch (error: unknown) {
      let description = "Hubo un problema al iniciar sesión. Verifica tus credenciales.";
      const code = getAuthErrorCode(error);
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        description = "Correo o contraseña incorrectos.";
      } else if (code === 'auth/invalid-api-key' || code.includes('identity-toolkit')) {
        description = "La configuración de autenticación no es correcta.";
      }
      toast({ variant: "destructive", title: "Error al iniciar sesión", description });
    } finally {
      setIsLoading(false);
    }
  };

  // Completa el flujo si se usó redirect (cuando el popup está bloqueado)
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          toast({ title: "¡Bienvenido/a!", description: "Has iniciado sesión correctamente." });
          router.push('/dashboard');
        }
      })
      .catch(() => {});
  }, [auth, router, toast]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "¡Bienvenido/a!", description: "Has iniciado sesión correctamente." });
      router.push('/dashboard');
    } catch (error: unknown) {
      const code = getAuthErrorCode(error);
      // Si el popup fue bloqueado, intenta con redirect
      if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch {
          toast({ variant: "destructive", title: "Error al iniciar sesión", description: "No se pudo abrir Google. Permite las ventanas emergentes e inténtalo de nuevo." });
          return;
        }
      }
      const msg = googleErrorMessage(code);
      if (msg) toast({ variant: "destructive", title: "Error al iniciar sesión", description: msg });
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel: Brand ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden section-dark-purple flex-col justify-between p-12">
        {/* Orbs */}
        <div className="absolute top-[-20%] left-[-15%] w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-orb pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-80 h-80 rounded-full bg-violet-400/15 blur-3xl animate-pulse-glow pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Image
              src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
              alt="Alumbra"
              width={40}
              height={40}
              className="w-10 h-10 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-black text-white">Alumbra</span>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Bienvenido/a de{' '}
              <span className="text-gradient-light">regreso.</span>
            </h2>
            <p className="text-purple-300 text-base leading-relaxed">
              Tu panel profesional para el análisis clínico de conversaciones te está esperando.
            </p>
          </div>

          <div className="space-y-4">
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
        </div>

        {/* Bottom badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs text-purple-400/70">
            <CheckCircle2 size={14} className="text-green-400" />
            Certificado GDPR / HIPAA · 100% Confidencial
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-purple-100/60">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
              alt="Alumbra"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="font-black text-lg">Alumbra</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-purple-50/40 to-white">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Inicia Sesión</h1>
              <p className="text-gray-500 text-sm">Accede a tu cuenta para ver tu historial y resultados completos.</p>
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700 font-medium transition-all mb-6"
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
            <form onSubmit={handleEmailSignIn} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Contraseña</Label>
                  <Link href="#" className="text-xs text-primary hover:underline font-medium">¿Olvidaste tu contraseña?</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 text-white font-bold text-sm shadow-lg glow-purple-sm transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Iniciar Sesión
                    <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              ¿No tienes una cuenta?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
