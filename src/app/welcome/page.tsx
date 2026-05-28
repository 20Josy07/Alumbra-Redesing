'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Brain, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WelcomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-xl animate-pulse">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen hero-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-96 h-96 rounded-full bg-purple-300/20 blur-3xl animate-orb pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-violet-300/18 blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-700">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-purple-200/50 border border-purple-100/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />

          <div className="p-8 text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <Link href="/">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg">
                    <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={20} height={20} className="brightness-0 invert" />
                  </div>
                  <span className="text-2xl font-black">Alumbra</span>
                </div>
              </Link>
            </div>

            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-xl glow-purple-sm animate-float">
              <Sparkles className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
              ¡Bienvenido/a, {user.displayName?.split(' ')[0]}! 🎉
            </h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Tu cuenta profesional está lista. Estamos aquí para darte claridad y apoyo en tu práctica clínica.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8 text-left">
              {[
                { icon: Brain, text: 'Analizador de conversaciones con IA especializada' },
                { icon: Shield, text: 'Panel profesional seguro y confidencial' },
                { icon: CheckCircle2, text: '3 análisis gratuitos para empezar ahora mismo' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-100/60">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-lg glow-purple-sm text-sm"
              size="lg"
            >
              Ir a mi Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-gray-400 mt-4">Sin tarjeta de crédito · Cancela cuando quieras</p>
          </div>
        </div>
      </div>
    </div>
  );
}
