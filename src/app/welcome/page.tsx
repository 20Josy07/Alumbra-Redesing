'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MessageSquareText, FileText, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function WelcomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const firstName = user.displayName?.split(' ')[0] || 'profesional';

  const steps = [
    { icon: MessageSquareText, title: 'Pega una conversación', desc: 'WhatsApp, SMS, correo o una transcripción de sesión.' },
    { icon: Sparkles, title: 'Recibe el análisis', desc: 'Patrones detectados, nivel de riesgo y sugerencias en segundos.' },
    { icon: FileText, title: 'Guarda y da seguimiento', desc: 'Consulta tu historial cuando lo necesites.' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Top bar minimal */}
      <header className="px-6 sm:px-10 py-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
            alt="Alumbra"
            width={26}
            height={26}
            className="w-[26px] h-[26px] object-contain"
          />
          <span className="text-lg font-black tracking-tight text-gray-900">Alumbra</span>
        </Link>
      </header>

      {/* Contenido centrado */}
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">

          {/* Encabezado */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-purple-50 border border-purple-100 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Cuenta activa
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-[1.05] mb-4">
              Todo listo,<br />
              <span className="text-gradient">{firstName}.</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md">
              Tu panel profesional está preparado. Así funciona en tres pasos.
            </p>
          </div>

          {/* Pasos numerados */}
          <div className="border-t border-gray-100 mb-10">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="flex items-start gap-5 py-5 border-b border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${i * 90 + 150}ms` }}
              >
                <span className="text-sm font-black text-gray-300 tabular-nums pt-0.5 w-6 flex-shrink-0">
                  0{i + 1}
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={() => router.push('/dashboard')}
              className="group w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-lg shadow-primary/20 text-sm"
              size="lg"
            >
              Ir a mi panel
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Plan Gratis · 10 análisis al mes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
