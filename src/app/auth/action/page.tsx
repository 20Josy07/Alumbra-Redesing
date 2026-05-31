'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import {
  authActionErrorMessage,
  getAuthErrorCode,
  parseAuthActionMode,
  safeContinueUrl,
  type AuthActionMode,
} from '@/lib/auth-action';

type PageState = 'loading' | 'ready' | 'success' | 'error';

function AuthActionContent() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = parseAuthActionMode(searchParams.get('mode'));
  const oobCode = searchParams.get('oobCode')?.trim() || '';
  const continueUrl = safeContinueUrl(searchParams.get('continueUrl'));

  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successDescription, setSuccessDescription] = useState('');

  const goNext = () => {
    router.push(continueUrl || '/login');
  };

  const fail = (message: string) => {
    setErrorMessage(message);
    setPageState('error');
  };

  const succeed = (title: string, description: string) => {
    setSuccessTitle(title);
    setSuccessDescription(description);
    setPageState('success');
  };

  useEffect(() => {
    if (!auth) return;

    if (!mode || !oobCode) {
      fail('El enlace no es válido. Revisa que hayas copiado la URL completa del correo.');
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        if (mode === 'resetPassword') {
          const email = await verifyPasswordResetCode(auth, oobCode);
          if (cancelled) return;
          setAccountEmail(email);
          setPageState('ready');
          return;
        }

        if (mode === 'verifyEmail') {
          await applyActionCode(auth, oobCode);
          if (cancelled) return;
          succeed(
            'Correo verificado',
            'Tu dirección de correo quedó confirmada. Ya puedes iniciar sesión con normalidad.'
          );
          return;
        }

        if (mode === 'recoverEmail' || mode === 'verifyAndChangeEmail') {
          await applyActionCode(auth, oobCode);
          if (cancelled) return;
          succeed(
            'Cuenta actualizada',
            'Los cambios en tu correo se aplicaron correctamente. Inicia sesión para continuar.'
          );
          return;
        }
      } catch (error: unknown) {
        if (cancelled) return;
        fail(authActionErrorMessage(getAuthErrorCode(error)));
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, [auth, mode, oobCode]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || mode !== 'resetPassword' || !oobCode) return;

    if (password.length < 6) {
      fail('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      fail('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      succeed(
        'Contraseña actualizada',
        'Tu contraseña se cambió correctamente. Ya puedes iniciar sesión con la nueva.'
      );
    } catch (error: unknown) {
      fail(authActionErrorMessage(getAuthErrorCode(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = modeTitle(mode, pageState);
  const subtitle = modeSubtitle(mode, pageState, accountEmail);

  return (
    <AuthActionShell title={title} subtitle={subtitle}>
      {pageState === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-8">
          <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Validando enlace…</p>
        </div>
      )}

      {pageState === 'error' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="h-12 rounded-2xl">
              <Link href="/login">Ir a iniciar sesión</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-2xl">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      )}

      {pageState === 'ready' && mode === 'resetPassword' && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          {accountEmail && (
            <p className="text-sm text-gray-600 rounded-2xl bg-purple-50/80 border border-purple-100 px-4 py-3">
              Cuenta: <strong>{accountEmail}</strong>
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Nueva contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
              Confirmar contraseña
            </Label>
            <Input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-white text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 text-white font-bold text-sm shadow-lg glow-purple-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Guardar contraseña
                <ArrowRight size={16} />
              </span>
            )}
          </Button>
        </form>
      )}

      {pageState === 'success' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">{successTitle}</p>
              <p className="text-sm text-green-800 mt-1">{successDescription}</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={goNext}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 text-white font-bold text-sm shadow-lg glow-purple-sm"
          >
            Continuar
          </Button>
        </div>
      )}
    </AuthActionShell>
  );
}

function modeTitle(mode: AuthActionMode | null, state: PageState): string {
  if (state === 'success') return '¡Listo!';
  if (state === 'error') return 'Enlace no disponible';
  if (state === 'loading') return 'Un momento…';

  switch (mode) {
    case 'resetPassword':
      return 'Nueva contraseña';
    case 'verifyEmail':
      return 'Verificando correo';
    case 'recoverEmail':
    case 'verifyAndChangeEmail':
      return 'Actualizando cuenta';
    default:
      return 'Acción de cuenta';
  }
}

function modeSubtitle(
  mode: AuthActionMode | null,
  state: PageState,
  email: string
): string {
  if (state === 'success') return 'Tu solicitud se completó correctamente.';
  if (state === 'error') return 'Revisa el enlace o solicita uno nuevo.';
  if (state === 'loading') return 'Estamos comprobando tu enlace de Alumbra.';

  switch (mode) {
    case 'resetPassword':
      return email
        ? `Elige una contraseña segura para ${email}.`
        : 'Elige una contraseña segura para tu cuenta.';
    case 'verifyEmail':
      return 'Confirmando tu dirección de correo electrónico.';
    case 'recoverEmail':
    case 'verifyAndChangeEmail':
      return 'Aplicando los cambios en tu cuenta.';
    default:
      return 'Gestiona tu cuenta de Alumbra.';
  }
}

function AuthActionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden section-dark-purple flex-col justify-between p-12">
        <div className="absolute top-[-20%] left-[-15%] w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-orb pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-80 h-80 rounded-full bg-violet-400/15 blur-3xl animate-pulse-glow pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <Image
              src="/alumbra-logo.png"
              alt="Alumbra"
              width={40}
              height={40}
              className="w-10 h-10 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-black text-white">Alumbra</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black text-white leading-tight">
            Tu cuenta,{' '}
            <span className="text-gradient-light">en tu dominio.</span>
          </h2>
          <p className="text-purple-300 text-base leading-relaxed">
            Restablecer contraseña, verificar correo y más — todo con la experiencia de Alumbra.
          </p>
          <div className="space-y-3">
            {[
              { icon: Shield, text: 'Enlaces seguros de un solo uso' },
              { icon: Sparkles, text: 'Sin pantallas genéricas de terceros' },
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

        <div className="relative z-10 text-xs text-purple-400/60">© Alumbra · Cuidamos tu privacidad</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center p-6 border-b border-purple-100/60">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/alumbra-logo.png" alt="Alumbra" width={32} height={32} className="w-8 h-8 object-contain" />
            <span className="font-black text-lg">Alumbra</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-purple-50/40 to-white">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{title}</h1>
              <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthActionFallback() {
  return (
    <AuthActionShell title="Un momento…" subtitle="Cargando…">
      <div className="flex justify-center py-8">
        <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    </AuthActionShell>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={<AuthActionFallback />}>
      <AuthActionContent />
    </Suspense>
  );
}
