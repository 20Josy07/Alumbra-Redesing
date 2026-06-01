'use client';

import {
  ArrowRight, CheckCircle2, Facebook, Instagram, Linkedin,
  Twitter, XCircle, AlertCircle, ShieldCheck,
  Sparkles, Star, Zap, Shield, Brain, Heart,
  Play, Youtube, Users, MessageCircle, Eye, Lock,
  TrendingUp, Award, BookOpen, Rocket, Quote,
  History, Gauge, Highlighter,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Header from './header';
import { Reveal } from './reveal';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useActiveSection } from '@/hooks/use-active-section';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { PLANS, PLAN_NAMES, type PlanId } from '@/lib/plans';
import { lookupPromo } from '@/lib/promo-codes';
import { redirectToCheckout } from '@/lib/checkout-redirect';
import { setUserPlan, computePlanEnd } from '@/firebase/firestore/usage';
import { Tag } from 'lucide-react';

/* ─── Static data ──────────────────────────────────────────────────── */

const professions = [
  { label: 'Psicólogos', icon: Brain },
  { label: 'Terapeutas', icon: Heart },
  { label: 'Trabajadores sociales', icon: Users },
  { label: 'Orientadores', icon: BookOpen },
  { label: 'Médicos', icon: Shield },
  { label: 'Enfermeros', icon: Award },
  { label: 'Consejeros', icon: MessageCircle },
  { label: 'Educadores', icon: Eye },
];

const founders = [
  {
    name: 'María De Los Ríos',
    role: 'Co-fundadora · Producto',
    initials: 'MR',
    color: 'from-primary to-violet-500',
    quote: 'Quería que ninguna señal de abuso volviera a pasar desapercibida por falta de una herramienta.',
  },
  {
    name: 'Josimar Acosta',
    role: 'Co-fundador · Tecnología',
    initials: 'JA',
    color: 'from-violet-500 to-fuchsia-500',
    quote: 'Construí una IA que no juzga ni decide: ilumina, para que el profesional siempre tenga la última palabra.',
  },
];

/* ─── Component ────────────────────────────────────────────────────── */

export default function LandingPage() {
  const { ref: refFeatures, isIntersecting: inFeatures } = useIntersectionObserver({ threshold: 0.08 });
  const { ref: refSolution, isIntersecting: inSolution } = useIntersectionObserver({ threshold: 0.08 });
  const { ref: refPricing, isIntersecting: inPricing } = useIntersectionObserver({ threshold: 0.05 });
  const { ref: refFooter, isIntersecting: inFooter } = useIntersectionObserver({ threshold: 0.05 });

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const activeSection = useActiveSection(['features', 'problema', 'solucion', 'pricing']);
  const handleCta = () => router.push(user ? '/dashboard' : '/login');
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  /** Selección de plan: gratis → registro · pago → Mercado Pago */
  const handlePlanSelect = async (planId: PlanId) => {
    if (planId === 'gratis') {
      router.push(user ? '/dashboard' : '/signup');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, uid: user.uid, email: user.email }),
      });
      if (res.status === 503) {
        toast({
          title: 'Pagos próximamente',
          description: 'La pasarela de pago se activará muy pronto. ¡Gracias por tu interés!',
        });
        return;
      }
      const data = await res.json();
      if (!redirectToCheckout(data)) {
        toast({ variant: 'destructive', title: 'No se pudo iniciar el pago', description: 'Inténtalo de nuevo en un momento.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error de conexión', description: 'Revisa tu conexión e inténtalo de nuevo.' });
    } finally {
      setLoadingPlan(null);
    }
  };

  /** Canjea un código promocional (100% → activa el plan gratis) */
  const handleRedeem = async () => {
    const promo = lookupPromo(promoCode);
    if (!promo) {
      toast({ variant: 'destructive', title: 'Código no válido', description: 'Revisa el código e inténtalo de nuevo.' });
      return;
    }
    if (!user) {
      // Guarda el código y manda a iniciar sesión
      toast({ title: 'Inicia sesión', description: 'Crea tu cuenta o inicia sesión para canjear tu código.' });
      router.push('/login');
      return;
    }
    if (!firestore) return;
    setRedeeming(true);
    try {
      if (promo.percent >= 100) {
        // 100% → activar el plan directamente, sin cobro
        await setUserPlan(firestore, user.uid, promo.plan, computePlanEnd(1));
        toast({
          title: `¡Plan ${PLAN_NAMES[promo.plan]} activado!`,
          description: 'Tu código del 100% se aplicó correctamente. Sin cargos.',
        });
        router.push('/dashboard');
      } else {
        // Descuento parcial → pasar a checkout con el código
        toast({ title: 'Código aplicado', description: 'Continúa con el pago para completar tu suscripción.' });
        await handlePlanSelect(promo.plan);
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo aplicar el código. Inténtalo de nuevo.' });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 overflow-x-clip">
      <Header activeLink={activeSection} />

      <main className="flex-1">

        {/* ══════════════════════════════════════════════════════════
            1. HERO
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-[96vh] flex flex-col justify-center overflow-hidden font-inter"
          style={{ background: 'linear-gradient(155deg, hsl(262 45% 6%) 0%, hsl(270 42% 9%) 50%, hsl(258 38% 7%) 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
            <div className="absolute top-[-25%] left-[-12%] w-[700px] h-[700px] rounded-full bg-primary/12 blur-[120px] animate-orb" />
            <div className="absolute bottom-[-20%] right-[-8%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[100px] animate-pulse-glow" />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-500/8 blur-[80px] animate-orb-reverse" />
          </div>

          <div className="container mx-auto px-6 relative z-10 pt-14 pb-10 lg:py-20 lg:pb-28">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-14 items-center">

              {/* Columna izquierda */}
              <div className="space-y-8 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/8 text-purple-200 border border-white/12 rounded-full px-4 py-1.5 text-xs font-bold backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                  <Sparkles size={11} className="text-primary" />
                  IA para el área de la salud
                </div>

                <h1 className="text-[52px] md:text-[64px] lg:text-[70px] font-black leading-[0.95] tracking-tight text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                  Ilumina lo que<br />
                  el abuso oculta<br />
                  <span className="text-gradient">en las palabras.</span>
                </h1>

                <p className="text-lg text-purple-200/65 leading-relaxed animate-in fade-in duration-700 delay-200">
                  La primera IA que detecta patrones de abuso emocional en conversaciones.
                  Diseñada para todos los profesionales del área de la salud que trabajan con personas.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in duration-700 delay-300">
                  <Button
                    size="lg"
                    className="group sheen-hover h-14 px-8 text-base rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 shadow-2xl glow-purple-sm font-bold text-white border-0"
                    onClick={handleCta}
                  >
                    Analizar ahora · es gratis
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-14 px-8 text-base rounded-2xl text-purple-200 hover:text-white hover:bg-white/10 font-semibold border border-white/10 hover:border-white/20"
                    asChild
                  >
                    <Link href="#solucion">
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      Ver cómo funciona
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-col items-start gap-3 animate-in fade-in duration-700 delay-400">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5">
                      {['avatar1', 'avatar2', 'avatar3', 'avatar4'].map((id) => {
                        const img = getImage(id);
                        return img ? (
                          <Image key={id} src={img.imageUrl} alt={img.description} width={36} height={36} className="w-9 h-9 rounded-full ring-2 ring-white/15 object-cover" />
                        ) : (
                          <div key={id} className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-400 ring-2 ring-white/15" />
                        );
                      })}
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-sm text-purple-300/70 font-medium">
                    <span className="font-black text-white">+500</span> profesionales de la salud confían en Alumbra
                  </p>
                </div>
              </div>

              {/* Columna derecha: mockup */}
              <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-700 delay-200">
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/18 via-violet-500/12 to-fuchsia-500/8 rounded-3xl blur-3xl pointer-events-none" />

                <div className="relative rounded-[20px] overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(139,92,246,0.45)]"
                  style={{ background: 'linear-gradient(165deg, rgba(20,12,42,0.92) 0%, rgba(14,8,30,0.92) 100%)' }}
                >
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    </div>
                    <div className="flex-1 mx-2 bg-white/[0.04] rounded-lg px-3 py-1.5 flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3 text-emerald-400/70 flex-shrink-0" />
                      <span className="text-[11px] text-white/40 font-medium tracking-wide">alumbra.ia</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/30">
                        <Brain className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white leading-tight">Analizador de conversaciones</p>
                        <p className="text-[11px] text-white/40">Detección de patrones en tiempo real</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2.5 items-start">
                        <div className="w-6 h-6 rounded-full bg-white/10 inline-flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[9px] font-bold text-white/70">J</span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="bg-white/[0.07] rounded-2xl rounded-tl-md px-3.5 py-2.5">
                            <p className="text-[13px] text-white/90 leading-snug">Siempre exageras todo. Nadie más se queja de mí.</p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-400/20 rounded-full pl-1.5 pr-2.5 py-0.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-flex items-center justify-center">
                              <AlertCircle className="w-2.5 h-2.5 text-white" />
                            </span>
                            <span className="text-[10px] font-semibold text-red-300">Gaslighting detectado</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-primary/25 rounded-2xl rounded-tr-md px-3.5 py-2.5 max-w-[70%]">
                          <p className="text-[13px] text-white/85 leading-snug">Ok… quizás tienes razón.</p>
                        </div>
                      </div>
                    </div>

                    <div className="divider-gradient" />

                    <div className="rounded-2xl border border-white/[0.08] p-4"
                      style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(139,92,246,0.08) 100%)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-400" />
                          <span className="text-xs font-bold text-white/80">Nivel de riesgo</span>
                        </div>
                        <span className="text-lg font-black text-red-400 leading-none">Alto</span>
                      </div>
                      <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden mb-3">
                        <div className="h-full w-[78%] bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Gaslighting', 'Minimización', 'Control coercitivo'].map(tag => (
                          <span key={tag} className="text-[10px] font-medium bg-white/[0.06] border border-white/10 text-white/70 px-2.5 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-5 -right-5 glass-dark rounded-2xl px-3.5 py-2.5 border border-white/12 shadow-2xl animate-float z-20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-green-500/18 border border-green-400/22 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white leading-none">Informe listo</p>
                      <p className="text-[9px] text-purple-300/60 mt-0.5">en 47 segundos</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-5 glass-dark rounded-2xl px-3.5 py-2.5 border border-white/12 shadow-2xl animate-float-delayed z-20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/25 border border-primary/25 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white leading-none">3 patrones detectados</p>
                      <p className="text-[9px] text-purple-300/60 mt-0.5">IA · 98% precisión</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="relative lg:absolute lg:bottom-0 left-0 right-0 border-t border-white/[0.07] z-10 mt-10 lg:mt-0"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
          >
            <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5">
              <span className="text-[10px] text-purple-400/40 font-semibold uppercase tracking-widest w-full text-center sm:w-auto">Avalado por</span>
              {[
                { icon: ShieldCheck, text: 'Certificado GDPR / HIPAA' },
                { icon: Award, text: 'Colegio Psicológico Nacional' },
                { icon: TrendingUp, text: '98% de precisión validada' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs sm:text-sm text-purple-300/55 font-medium">
                  <Icon size={13} className="text-primary/60 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ticker de profesiones ── */}
        <div className="py-8 bg-white border-b border-gray-100 overflow-hidden">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
            Diseñado para profesionales de la salud como tú
          </p>
          <div className="relative flex overflow-x-hidden">
            <div className="flex animate-ticker whitespace-nowrap gap-0">
              {[...professions, ...professions].map(({ label, icon: PIcon }, i) => (
                <div key={i} className="inline-flex items-center gap-2.5 mx-8 text-gray-500">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <PIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            2. FUNCIONALIDADES
        ══════════════════════════════════════════════════════════ */}
        <section id="features" ref={refFeatures} className="py-24 scroll-mt-20 bg-white">
          <div className="container mx-auto px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                Funcionalidades
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Todo lo que necesitas para{' '}
                <span className="text-gradient">ver lo invisible</span>
              </h2>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                Una herramienta diseñada con profesionales de la salud, para que cada conversación
                revele lo que de otro modo permanecería oculto.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">

              {/* ── Card grande: Análisis (col-span-2) — con visual de chat ── */}
              <div className={cn("md:col-span-2 group relative bg-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift", inFeatures && 'animate-fade-up')} style={{ animationDelay: '0ms' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
                <div className="grid md:grid-cols-2 gap-0 h-full">
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-6 shadow-md">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">Análisis inteligente de conversaciones</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Copia y pega cualquier conversación — WhatsApp, SMS, correo o transcripciones —
                        y la IA identifica los patrones de abuso en segundos. Sin configuración, sin curva de aprendizaje.
                      </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {['Gaslighting', 'Control coercitivo', 'Manipulación', 'Intimidación'].map(t => (
                        <span key={t} className="text-xs bg-purple-50 text-primary border border-purple-200/60 px-3 py-1 rounded-full font-semibold">{t}</span>
                      ))}
                    </div>
                  </div>
                  {/* Visual: chat con frase resaltada */}
                  <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-50/60 p-8 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.5] pointer-events-none"
                      style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.12), transparent 60%)' }}
                    />
                    <div className="relative w-full max-w-[260px] space-y-2.5">
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-tl-md px-3.5 py-2.5 shadow-sm border border-purple-100/60 max-w-[85%]">
                          <p className="text-[13px] text-gray-700 leading-snug">
                            <mark className="bg-red-100 text-red-700 rounded px-1 font-semibold">Siempre exageras todo.</mark> Nadie más se queja de mí.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary/90 rounded-2xl rounded-tr-md px-3.5 py-2.5 shadow-sm max-w-[70%]">
                          <p className="text-[13px] text-white leading-snug">Ok… quizás tienes razón.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[11px] font-bold text-red-500">Gaslighting detectado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Card: Nivel de riesgo — con visual de medidor ── */}
              <div className={cn("group relative bg-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift flex flex-col", inFeatures && 'animate-fade-up')} style={{ animationDelay: '120ms' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-md">
                    <Gauge className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Nivel de riesgo claro</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Un puntaje y un nivel de riesgo objetivos para priorizar los casos que requieren atención.
                  </p>
                  {/* Mini medidor */}
                  <div className="mt-auto bg-red-50/70 border border-red-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Riesgo</span>
                      <span className="text-sm font-black text-red-500">Alto · 78%</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full w-[78%] bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Card oscura: Privacidad ── */}
              <div className={cn("group relative rounded-3xl overflow-hidden card-lift section-dark-purple p-8 flex flex-col justify-between border border-white/5", inFeatures && 'animate-fade-up')} style={{ animationDelay: '200ms' }}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
                    <Lock className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 leading-tight">Privacidad absoluta</h3>
                  <p className="text-sm text-purple-300/80 leading-relaxed">
                    Los textos no se almacenan permanentemente. Cifrado end-to-end y
                    cumplimiento GDPR / HIPAA. Tu confianza y la de tus pacientes, protegida.
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-2">
                  {['🔒 Cifrado end-to-end', '🛡️ Compatible GDPR/HIPAA', '🚫 Sin almacenamiento'].map(t => (
                    <span key={t} className="text-xs text-purple-200/70 font-medium">{t}</span>
                  ))}
                </div>
              </div>

              {/* ── Card: Resaltado en el texto — con visual ── */}
              <div className={cn("group relative bg-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift flex flex-col", inFeatures && 'animate-fade-up')} style={{ animationDelay: '280ms' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 to-orange-400" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 shadow-md">
                    <Highlighter className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Patrones resaltados</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Ve exactamente qué frase disparó cada alerta, resaltada y clasificada por tipo.
                  </p>
                  <div className="mt-auto bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <p className="text-[12px] text-gray-600 leading-relaxed">
                      <mark className="bg-orange-100 text-orange-700 rounded px-1 font-semibold">No fue para tanto,</mark> tú lo
                      <mark className="bg-red-100 text-red-700 rounded px-1 font-semibold ml-1">malinterpretas todo.</mark>
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Card: Historial ── */}
              <div className={cn("group relative bg-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift flex flex-col", inFeatures && 'animate-fade-up')} style={{ animationDelay: '360ms' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-violet-400" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-4 shadow-md">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Historial seguro</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    Guarda y consulta cada análisis para seguir la evolución de un caso en el tiempo.
                  </p>
                  <div className="mt-auto space-y-2">
                    {[{ d: 'bg-red-500', w: 'Análisis · hoy' }, { d: 'bg-amber-500', w: 'Análisis · ayer' }].map((r, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <span className={cn('w-2 h-2 rounded-full', r.d)} />
                        <span className="text-[12px] text-gray-500 font-medium">{r.w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Card ancha: Velocidad (col-span-3) ── */}
              <div className={cn("md:col-span-2 lg:col-span-3 group relative bg-gradient-to-br from-purple-50/80 to-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift", inFeatures && 'animate-fade-up')} style={{ animationDelay: '440ms' }}>
                <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-primary flex items-center justify-center shadow-md flex-shrink-0">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-gray-900 mb-1.5 leading-tight">Resultados en menos de 3 minutos</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                      Sin horas de revisión manual. Alumbra procesa la conversación y entrega un informe
                      completo en tiempo real — ideal para sesiones presenciales, supervisión de casos o trabajo en campo.
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-center bg-white rounded-2xl border border-purple-100/60 px-6 py-4 shadow-sm">
                    <p className="text-3xl font-black text-gradient leading-none">47s</p>
                    <p className="text-[11px] text-gray-400 mt-1 font-medium">tiempo promedio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. EL PROBLEMA
        ══════════════════════════════════════════════════════════ */}
        <section id="problema" className="py-24 scroll-mt-20 bg-gradient-to-b from-purple-50/40 to-white">
          <div className="container mx-auto px-6 max-w-5xl">

            <Reveal className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 bg-red-50 text-red-500 border-red-200 font-bold">
                El problema
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.02] tracking-tight text-gray-900">
                Una crisis silenciosa{' '}
                <span className="text-gradient">que casi nadie ve.</span>
              </h2>
              <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                El abuso psicológico es la forma de violencia más común y la más difícil de detectar.
                No deja marcas visibles, se normaliza con el tiempo y suele anteceder a la violencia física.
                Millones de personas lo viven sin saber ponerle nombre.
              </p>
            </Reveal>

            {/* Estadísticas de impacto */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { value: '1 de 2', label: 'personas sufrirá agresión psicológica de su pareja a lo largo de su vida', accent: 'border-red-400',     bg: 'bg-red-50/70',     num: 'text-red-500' },
                { value: '80%',    label: 'de los casos de violencia comienza con abuso emocional, no físico',       accent: 'border-orange-400',  bg: 'bg-orange-50/70',  num: 'text-orange-500' },
                { value: '7 años', label: 'es el tiempo medio que tarda una víctima en reconocer y pedir ayuda',     accent: 'border-amber-400',   bg: 'bg-amber-50/70',   num: 'text-amber-500' },
                { value: 'la mayoría', label: 'de los casos nunca llega a identificarse ni a registrarse',           accent: 'border-fuchsia-400', bg: 'bg-fuchsia-50/70', num: 'text-fuchsia-500' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} border border-gray-100 border-l-4 ${s.accent} rounded-2xl p-5 animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                  <p className={`text-2xl md:text-3xl font-black mb-2 capitalize leading-none ${s.num}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Bloque narrativo — por qué es tan difícil */}
            <Reveal as="div" delay={60} className="grid md:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
              {/* Tarjeta oscura con la cita */}
              <div className="relative overflow-hidden rounded-3xl section-dark-purple p-8 flex flex-col justify-center">
                <div className="absolute top-[-30%] right-[-10%] w-56 h-56 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />
                <Quote className="w-8 h-8 text-red-400/40 mb-4 relative z-10" />
                <p className="relative z-10 text-xl md:text-2xl font-bold text-white leading-snug">
                  &ldquo;Estás exagerando. Nadie más se queja de mí.
                  Tú me obligaste a reaccionar así.&rdquo;
                </p>
                <p className="relative z-10 text-sm text-purple-300/70 mt-4 leading-relaxed">
                  Frases que parecen inofensivas, repetidas durante meses, erosionan la autoestima
                  y distorsionan la percepción de la realidad. Lo más grave casi siempre es lo más sutil.
                </p>
              </div>

              {/* Razones por las que pasa desapercibido */}
              <div className="rounded-3xl bg-white border border-purple-100/70 shadow-sm p-8 flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-5">Por qué pasa desapercibido</p>
                <ul className="space-y-4">
                  {[
                    { icon: Eye, t: 'No deja marcas', d: 'A diferencia del daño físico, no hay evidencia visible que lo delate.' },
                    { icon: MessageCircle, t: 'Se esconde en el lenguaje', d: 'Los patrones se dispersan en cientos de mensajes cotidianos.' },
                    { icon: Brain, t: 'Se normaliza', d: 'Con el tiempo, la víctima y su entorno dejan de percibirlo como abuso.' },
                  ].map(({ icon: Icon, t, d }) => (
                    <li key={t} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Cierre que conecta con la solución */}
            <p className="text-center text-base text-gray-500 mt-12 max-w-2xl mx-auto leading-relaxed">
              El problema no es la falta de profesionales capaces.
              Es que <span className="font-bold text-gray-800">ningún ojo humano puede rastrear cada patrón</span> en tiempo real.
              <span className="text-primary font-bold"> Ahí entra Alumbra.</span>
            </p>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. LA SOLUCIÓN
        ══════════════════════════════════════════════════════════ */}
        <section
          id="solucion"
          ref={refSolution}
          className={cn('py-24 scroll-mt-20 section-dark-purple transition-all duration-700', inSolution ? 'opacity-100' : 'opacity-0')}
        >
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Texto + valor de la solución */}
              <div className={cn(inSolution && 'animate-in fade-in slide-in-from-left-12 duration-700')}>
                <Badge className="mb-6 bg-white/10 text-purple-200 border-white/15 font-bold">
                  La solución
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  Alumbra ve lo que{' '}
                  <span className="text-gradient-light">el ojo humano</span>{' '}
                  no puede.
                </h2>
                <p className="text-purple-300/80 text-base mb-10 leading-relaxed">
                  Una IA entrenada para reconocer las dinámicas de abuso emocional en el lenguaje.
                  Convierte lo que un profesional intuye en evidencia clara, objetiva y accionable.
                </p>

                {/* Valor — responde a cada faceta del problema */}
                <div className="space-y-4">
                  {[
                    {
                      icon: Eye,
                      title: 'Hace visible lo que no deja marcas',
                      desc: 'Reconoce gaslighting, control coercitivo, amenazas y manipulación, incluso cuando son sutiles.',
                      color: 'from-primary to-violet-500',
                    },
                    {
                      icon: Zap,
                      title: 'Rastrea cada palabra en segundos',
                      desc: 'Procesa cientos de mensajes y encuentra los patrones que tomaría horas revisar a mano.',
                      color: 'from-violet-500 to-fuchsia-500',
                    },
                    {
                      icon: Gauge,
                      title: 'Convierte la intuición en evidencia',
                      desc: 'Un nivel de riesgo y un informe estructurado que respaldan tu criterio profesional.',
                      color: 'from-fuchsia-500 to-pink-500',
                    },
                  ].map((v, i) => {
                    const VIcon = v.icon;
                    return (
                      <div
                        key={i}
                        className={cn('flex gap-4 glass-dark rounded-2xl p-5 border border-white/8', inSolution && 'animate-in fade-in slide-in-from-left-8 duration-700')}
                        style={{ animationDelay: `${i * 130 + 200}ms` }}
                      >
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <VIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-base mb-1">{v.title}</h3>
                          <p className="text-sm text-purple-300/80 leading-relaxed">{v.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-200/80 leading-relaxed">
                      <span className="font-bold text-amber-300">Importante:</span> Alumbra es una herramienta orientativa de apoyo.
                      No reemplaza el criterio profesional ni emite diagnósticos clínicos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual del flujo */}
              <div className={cn('relative', inSolution && 'animate-in fade-in zoom-in-95 duration-700 delay-300')}>
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/25 to-violet-400/15 rounded-[40px] blur-3xl pointer-events-none" />
                <div className="relative space-y-3">
                  <div className="glass-dark rounded-2xl p-5 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-3.5 h-3.5 text-purple-300" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300/60">Conversación</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-start">
                        <span className="bg-white/8 rounded-xl rounded-bl-sm px-3 py-1.5 max-w-[75%] text-[11px] text-purple-100/80">
                          Siempre exageras, nadie más se queja de ti.
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span className="bg-primary/20 rounded-xl rounded-br-sm px-3 py-1.5 max-w-[60%] text-[11px] text-purple-100/70">
                          Quizás tienes razón...
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/50" />
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg animate-breathe">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary/50" />
                  </div>

                  <div className="glass-dark rounded-2xl p-4 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-2.5">
                      <Brain className="w-4 h-4 text-violet-300 animate-pulse" />
                      <span className="text-[11px] text-purple-200/80 font-medium">Alumbra analiza los patrones…</span>
                      <span className="ml-auto flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse [animation-delay:200ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse [animation-delay:400ms]" />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-red-400/40" />
                    <ArrowRight className="w-4 h-4 text-purple-300/60 rotate-90" />
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-red-400/40" />
                  </div>

                  <div className="rounded-2xl border border-red-400/20 overflow-hidden shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(139,92,246,0.10) 100%)' }}
                  >
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span className="text-[11px] font-black text-red-300 uppercase tracking-wider">Informe orientativo</span>
                      </div>
                      <span className="text-[11px] font-black text-red-300 bg-red-500/15 px-2.5 py-0.5 rounded-full border border-red-400/20">
                        Riesgo ALTO · 78%
                      </span>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full w-[78%] bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Gaslighting', 'Minimización', 'Control coercitivo'].map(tag => (
                          <span key={tag} className="text-[10px] font-semibold bg-white/6 border border-white/10 text-purple-200/80 px-2.5 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tira inferior: empezar es simple (3 pasos) */}
            <div className={cn('mt-14 pt-10 border-t border-white/10', inSolution && 'animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500')}>
              <p className="text-center text-xs font-bold uppercase tracking-widest text-purple-300/50 mb-8">
                Y empezar es así de simple
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { num: '01', icon: Users, title: 'Crea tu cuenta', desc: 'Gratis y en segundos.' },
                  { num: '02', icon: MessageCircle, title: 'Pega la conversación', desc: 'WhatsApp, SMS, correo o transcripción.' },
                  { num: '03', icon: Sparkles, title: 'Obtén tu informe', desc: 'Patrones, riesgo y sugerencias al instante.' },
                ].map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={i} className="relative flex items-start gap-3.5 glass-dark rounded-2xl p-4 border border-white/8">
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <StepIcon className="w-4 h-4 text-purple-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-black text-primary">{step.num}</span>
                          <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        </div>
                        <p className="text-xs text-purple-300/70 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. FUNDADORES
        ══════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                Fundadores
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Nacimos de una{' '}
                <span className="text-gradient">convicción</span>
              </h2>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                Vimos cómo, una y otra vez, el daño en las relaciones se escondía en las palabras —
                difícil de nombrar, fácil de minimizar. Quisimos darle a los profesionales de la salud
                una herramienta que iluminara esos patrones. Así nació Alumbra.
              </p>
            </Reveal>

            <Reveal as="div" delay={80} className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {founders.map((f) => (
                <div
                  key={f.name}
                  className="group relative rounded-3xl border border-purple-100/70 shadow-sm card-lift bg-white p-8 overflow-hidden"
                >
                  {/* Glow decorativo en hover */}
                  <div className={cn('absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 -mr-10 -mt-10', f.color)} />

                  <Quote className="w-7 h-7 text-primary/15 mb-4" />
                  <p className="text-base text-gray-700 leading-relaxed font-medium mb-8 relative z-10">
                    {f.quote}
                  </p>

                  <div className="flex items-center gap-3.5">
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black shadow-md flex-shrink-0', f.color)}>
                      {f.initials}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 leading-tight">{f.name}</h3>
                      <p className="text-sm text-primary font-semibold">{f.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Reveal>

            <p className="text-center text-sm text-gray-400 mt-8">
              ¿Quieres conocer a todo el equipo?{' '}
              <Link href="/team" className="text-primary font-bold hover:underline">Conócenos →</Link>
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. CONSTRUIMOS JUNTOS
        ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-24 section-dark-purple">
          {/* Fondo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/12 blur-[120px] animate-orb" />
            <div className="absolute bottom-[-25%] right-[5%] w-[420px] h-[420px] rounded-full bg-fuchsia-500/10 blur-[100px] animate-pulse-glow" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '52px 52px' }}
            />
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <Reveal className="text-center mb-14">
              <Badge className="mb-5 bg-white/10 text-purple-200 border-white/15 font-bold">
                Esto apenas comienza
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-white mb-6">
                Construimos esto{' '}
                <span className="text-gradient-light">juntos</span>
              </h2>
              <p className="text-lg md:text-xl text-purple-200/85 leading-relaxed max-w-2xl mx-auto font-medium">
                La versión 1.0 ya hace esto realidad, y como todo en la vida puede mejorarse,
                a partir de aquí vamos a hacer cada mejora{' '}
                <span className="text-white font-black">juntos.</span>
              </p>
            </Reveal>

            {/* Hoja de ruta */}
            <Reveal as="div" delay={80} className="relative">
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    tag: 'Hoy', state: 'Disponible', icon: CheckCircle2,
                    title: 'Versión 1.0',
                    desc: 'Análisis de conversaciones, informes con nivel de riesgo, patrones resaltados e historial.',
                    nodeClass: 'bg-green-500/20 border-green-400/40 text-green-300',
                    tagClass: 'bg-green-500/15 text-green-300 border-green-400/20',
                  },
                  {
                    tag: 'En camino', state: 'Construyendo', icon: Rocket,
                    title: 'Próximas mejoras',
                    desc: 'Más idiomas, exportación de informes y métricas de evolución por caso. Priorizadas por la comunidad.',
                    nodeClass: 'bg-primary/25 border-primary/40 text-purple-200',
                    tagClass: 'bg-primary/15 text-purple-200 border-primary/25',
                  },
                  {
                    tag: 'Contigo', state: 'Tu voz cuenta', icon: MessageCircle,
                    title: 'Lo que tú pidas',
                    desc: 'Cada idea que compartes moldea el rumbo. Las funciones más pedidas son las que llegan primero.',
                    nodeClass: 'bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-300',
                    tagClass: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20',
                  },
                ].map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={i}
                      className="relative glass-dark rounded-3xl p-6 border border-white/8 text-center md:text-left"
                    >
                      <div className={cn('w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg mb-4 mx-auto md:mx-0 relative z-10', step.nodeClass)}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className={cn('inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border mb-3', step.tagClass)}>
                        {step.tag} · {step.state}
                      </span>
                      <h3 className="text-lg font-black text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-purple-300/75 leading-relaxed">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            {/* CTA */}
            <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="sheen-hover group rounded-2xl px-8 h-14 text-base bg-white text-primary hover:bg-purple-50 font-black shadow-xl"
                onClick={handleCta}
              >
                Súmate al camino
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 h-14 text-base border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white font-bold backdrop-blur-sm"
                asChild
              >
                <Link href="/contact">Comparte tu idea</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            7. PLAN
        ══════════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          ref={refPricing}
          className={cn('py-24 scroll-mt-20 bg-white transition-all duration-700', inPricing ? 'opacity-100' : 'opacity-0')}
        >
          <div className="container mx-auto px-6">
            <div className={cn('text-center max-w-2xl mx-auto mb-16', inPricing && 'animate-in fade-in slide-in-from-bottom-8 duration-700')}>
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                Planes
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Elige el plan que se{' '}
                <span className="text-gradient">adapta a ti</span>
              </h2>
              <p className="mt-4 text-gray-500 text-lg">
                Sin contratos. Sin permanencia. Empieza gratis hoy mismo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto items-stretch">
              {PLANS.map((plan, index) => (
                <div
                  key={plan.id}
                  className={cn(
                    'relative flex flex-col rounded-3xl transition-all duration-300',
                    plan.popular
                      ? 'bg-gradient-to-b from-[hsl(262,83%,50%)] to-[hsl(275,70%,55%)] text-white shadow-2xl shadow-purple-400/30 lg:scale-[1.04] z-10'
                      : 'bg-white border border-purple-100/80 shadow-sm hover:shadow-lg hover:border-purple-200',
                    inPricing && 'animate-scale-in'
                  )}
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                        ⭐ Más Popular
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex-1 flex flex-col">
                    <div className="mb-6">
                      <h3 className={cn('text-lg font-black mb-1', plan.popular ? 'text-white' : 'text-gray-900')}>{plan.name}</h3>
                      <p className={cn('text-xs leading-relaxed', plan.popular ? 'text-purple-200' : 'text-gray-400')}>{plan.description}</p>
                    </div>

                    <div className="mb-8">
                      <span className={cn('text-4xl font-black tracking-tight', plan.popular ? 'text-white' : 'text-gradient')}>{plan.price}</span>
                      {plan.id !== 'gratis' && (
                        <span className={cn('text-sm ml-1', plan.popular ? 'text-purple-200' : 'text-gray-400')}>/mes</span>
                      )}
                    </div>

                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((feature, fi) => (
                        <li key={fi} className={cn('flex items-center gap-2.5 text-sm', !feature.included && 'opacity-40')}>
                          {feature.included
                            ? <CheckCircle2 className={cn('w-4 h-4 flex-shrink-0', plan.popular ? 'text-green-300' : 'text-green-500')} />
                            : <XCircle className="w-4 h-4 flex-shrink-0 text-current" />
                          }
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={loadingPlan === plan.id}
                      className={cn(
                        'w-full rounded-2xl h-11 font-bold text-sm',
                        plan.popular
                          ? 'bg-white text-primary hover:bg-purple-50 shadow-lg'
                          : 'bg-gradient-to-r from-primary to-violet-500 text-white hover:opacity-90 shadow-md'
                      )}
                    >
                      {loadingPlan === plan.id ? 'Redirigiendo…' : plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Canjear código promocional */}
            <div className="max-w-md mx-auto mt-12">
              <div className="rounded-3xl border border-purple-100/70 bg-purple-50/40 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-primary" />
                  <p className="text-sm font-bold text-gray-800">¿Tienes un código promocional?</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                    placeholder="Ingresa tu código"
                    className="h-11 rounded-xl border-purple-200 focus:border-primary bg-white text-sm uppercase placeholder:normal-case placeholder:text-gray-400"
                  />
                  <Button
                    onClick={handleRedeem}
                    disabled={redeeming || !promoCode.trim()}
                    className="h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold text-sm shrink-0"
                  >
                    {redeeming ? 'Aplicando…' : 'Canjear'}
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 mt-8">
              ¿Necesitas una solución para tu institución o equipo de salud?{' '}
              <Link href="/contact" className="text-primary font-bold hover:underline">Hablemos →</Link>
            </p>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <Reveal
              className="relative overflow-hidden rounded-[32px] px-8 py-14 md:px-16 md:py-20 text-center shadow-2xl glow-purple"
              style={{ background: 'linear-gradient(140deg, hsl(262,80%,52%) 0%, hsl(275,68%,56%) 45%, hsl(258,75%,46%) 100%)' }}
            >
              <div className="absolute top-[-45%] right-[-12%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none animate-breathe" />
              <div className="absolute bottom-[-45%] left-[-12%] w-96 h-96 rounded-full bg-fuchsia-300/15 blur-3xl pointer-events-none" />
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-xs text-white font-bold mb-7 backdrop-blur-sm">
                  <Sparkles size={12} />
                  Plan gratuito disponible
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-[1.08] tracking-tight">
                  Ilumina lo que el abuso<br className="hidden sm:block" /> oculta en las conversaciones.
                </h2>

                <p className="text-purple-100/85 mb-9 text-lg max-w-xl mx-auto leading-relaxed">
                  Únete a más de 500 profesionales del área de la salud
                  que ya usan Alumbra para proteger el bienestar de quienes atienden.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10">
                  {['10 análisis gratis al mes', 'Sin tarjeta de crédito', 'Cancela cuando quieras'].map((feat) => (
                    <span key={feat} className="inline-flex items-center gap-1.5 text-sm text-white/90 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                      {feat}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    className="sheen-hover group rounded-2xl px-10 h-14 bg-white text-primary hover:bg-white font-black shadow-xl text-base"
                    onClick={handleCta}
                  >
                    Empezar gratis ahora
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-8 h-14 border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white font-bold text-base backdrop-blur-sm"
                    asChild
                  >
                    <Link href="/contact">Hablar con el equipo</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer
        ref={refFooter}
        className={cn('section-dark-purple text-white transition-all duration-700', inFooter ? 'opacity-100' : 'opacity-0')}
      >
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={40} height={40} className="w-10 h-10 object-contain brightness-0 invert" />
                <span className="text-xl font-black">Alumbra</span>
              </div>
              <p className="text-sm text-purple-300/80 leading-relaxed max-w-sm mb-8">
                La IA que detecta abuso emocional en conversaciones. Diseñada para el área de la salud.
                Porque proteger a las personas empieza por entender sus palabras.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Youtube, label: 'YouTube' },
                ].map(({ icon: Icon, label }) => (
                  <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/15 transition-all duration-200">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-widest mb-5">Navegación</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/#features', label: 'Funcionalidades' },
                  { href: '/#problema', label: 'El problema' },
                  { href: '/#solucion', label: 'La solución' },
                  { href: '/#pricing', label: 'Planes' },
                  { href: '/contact', label: 'Contacto' },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-purple-300/70 hover:text-white transition-colors duration-200">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-widest mb-5">Legal</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/team', label: 'Equipo' },
                  { href: '#', label: 'Sobre nosotros' },
                  { href: '#', label: 'Blog' },
                  { href: '#', label: 'Privacidad' },
                  { href: '#', label: 'Términos de uso' },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-purple-300/70 hover:text-white transition-colors duration-200">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-400/50">
            <p>© 2025 Alumbra · Todos los derechos reservados</p>
            <p>Made with ❤️ in Colombia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
