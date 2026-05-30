'use client';

import {
  ArrowRight, CheckCircle2, Facebook, Instagram, Linkedin,
  Twitter, XCircle, AlertCircle, ShieldCheck,
  Sparkles, Star, Zap, Shield, Brain, Heart,
  Play, Youtube, Users, MessageCircle, Eye, Lock,
  TrendingUp, Award, BookOpen,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Header from './header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';
import { useActiveSection } from '@/hooks/use-active-section';
import { useEffect, useState } from 'react';

/* ─── Static data ──────────────────────────────────────────────────── */

const plans = [
  {
    name: 'Gratis',
    price: '$0',
    description: 'Ideal para explorar la herramienta.',
    features: [
      { text: '10 análisis al mes', included: true },
      { text: 'Analizador de conversaciones', included: true },
      { text: 'Resultados básicos', included: true },
      { text: 'Resultados detallados', included: false },
      { text: 'Dashboard de gestión', included: false },
    ],
    cta: 'Empezar Gratis',
    popular: false,
  },
  {
    name: 'Básico',
    price: '$12.000',
    description: 'Empieza a analizar sin complicaciones.',
    features: [
      { text: '30 análisis al mes', included: true },
      { text: 'Analizador de conversaciones', included: true },
      { text: 'Resultados claros y directos', included: true },
      { text: 'Dashboard de gestión', included: false },
    ],
    cta: 'Empezar ahora',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$25.000',
    description: 'Más control, más análisis.',
    features: [
      { text: 'Análisis ilimitados', included: true },
      { text: 'Dashboard de gestión básico', included: true },
      { text: 'Historial de análisis', included: true },
      { text: 'Visualización de resultados', included: true },
      { text: 'Funciones avanzadas', included: false },
    ],
    cta: 'Elegir Pro',
    popular: true,
  },
  {
    name: 'Premium',
    price: '$45.000',
    description: 'Sin límites y control total.',
    features: [
      { text: 'Análisis ilimitados', included: true },
      { text: 'Dashboard completo', included: true },
      { text: 'Historial completo', included: true },
      { text: 'Herramientas avanzadas', included: true },
      { text: 'Acceso prioritario', included: true },
    ],
    cta: 'Ir a Premium',
    popular: false,
  },
];

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

const testimonials = [
  {
    quote: 'Alumbra me permitió identificar patrones de comunicación que yo intuía pero no podía articular. Ahora tengo un respaldo concreto para guiar mis intervenciones.',
    name: 'Dra. Laura Martínez',
    role: 'Psicóloga Clínica',
    city: 'Madrid',
    initials: 'LM',
    color: 'from-primary to-violet-500',
  },
  {
    quote: 'Como trabajadora social, me enfrento a casos complejos donde el lenguaje es clave. Esta herramienta me da claridad en minutos. Es un antes y un después en mi trabajo.',
    name: 'Andrea Rojas',
    role: 'Trabajadora Social',
    city: 'Bogotá',
    initials: 'AR',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    quote: 'Recomiendo Alumbra a todo el equipo de salud mental de nuestra institución. Facilita el análisis y abre conversaciones importantes con los pacientes de forma estructurada.',
    name: 'Dr. Carlos Ibáñez',
    role: 'Médico Psiquiatra',
    city: 'Buenos Aires',
    initials: 'CI',
    color: 'from-fuchsia-500 to-purple-600',
  },
];

/* ─── Component ────────────────────────────────────────────────────── */

export default function LandingPage() {
  const { ref: ref1, isIntersecting: isIntersecting1 } = useIntersectionObserver({ threshold: 0.08 });
  const { ref: ref2, isIntersecting: isIntersecting2 } = useIntersectionObserver({ threshold: 0.08 });
  const { ref: ref3, isIntersecting: isIntersecting3 } = useIntersectionObserver({ threshold: 0.08 });
  const { ref: ref4, isIntersecting: isIntersecting4 } = useIntersectionObserver({ threshold: 0.05 });
  const { ref: ref5, isIntersecting: isIntersecting5 } = useIntersectionObserver({ threshold: 0.05 });

  const { user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const activeSection = useActiveSection(['features', 'how-it-works', 'reviews', 'pricing']);
  const handleCta = () => router.push(user ? '/dashboard' : '/login');
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 overflow-x-clip">
      <Header activeLink={activeSection} />

      <main className="flex-1">

        {/* ══════════════════════════════════════════════════════════
            1. HERO — dark cinematic, product mockup
        ══════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-[96vh] flex flex-col justify-center overflow-hidden font-inter"
          style={{ background: 'linear-gradient(155deg, hsl(262 45% 6%) 0%, hsl(270 42% 9%) 50%, hsl(258 38% 7%) 100%)' }}
        >
          {/* ── Fondo: malla + orbs animados ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Grid sutil */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
            {/* Orbs */}
            <div className="absolute top-[-25%] left-[-12%] w-[700px] h-[700px] rounded-full bg-primary/12 blur-[120px] animate-orb" />
            <div className="absolute bottom-[-20%] right-[-8%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[100px] animate-pulse-glow" />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-500/8 blur-[80px] animate-orb-reverse" />
          </div>

          <div className="container mx-auto px-6 relative z-10 py-20 pb-28">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">

              {/* ── Columna izquierda: texto ── */}
              <div className="space-y-8 max-w-xl">

                {/* Badge eyebrow */}
                <div className="inline-flex items-center gap-2 bg-white/8 text-purple-200 border border-white/12 rounded-full px-4 py-1.5 text-xs font-bold backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                  <Sparkles size={11} className="text-primary" />
                  IA para el área de la salud
                </div>

                {/* Headline */}
                <h1 className="text-[52px] md:text-[64px] lg:text-[70px] font-black leading-[0.95] tracking-tight text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                  Ilumina lo que<br />
                  el abuso oculta<br />
                  <span className="text-gradient">en las palabras.</span>
                </h1>

                {/* Descripción */}
                <p className="text-lg text-purple-200/65 leading-relaxed animate-in fade-in duration-700 delay-200">
                  La primera IA que detecta patrones de abuso emocional en conversaciones.
                  Diseñada para todos los profesionales del área de la salud que trabajan con personas.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in duration-700 delay-300">
                  <Button
                    size="lg"
                    className="group h-14 px-8 text-base rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 shadow-2xl glow-purple-sm font-bold text-white border-0"
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
                    <Link href="#how-it-works">
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      Ver cómo funciona
                    </Link>
                  </Button>
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-4 animate-in fade-in duration-700 delay-400">
                  <div className="flex -space-x-2.5">
                    {['avatar1', 'avatar2', 'avatar3', 'avatar4'].map((id) => {
                      const img = getImage(id);
                      return img ? (
                        <Image key={id} src={img.imageUrl} alt={img.description} width={36} height={36} className="rounded-full ring-2 ring-white/15 object-cover" />
                      ) : (
                        <div key={id} className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-400 ring-2 ring-white/15" />
                      );
                    })}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-xs text-purple-300/70 font-medium">
                      <span className="font-black text-white">+500</span> profesionales de la salud confían en Alumbra
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Columna derecha: mockup del producto ── */}
              <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-700 delay-200">

                {/* Glow ambiental detrás del mockup */}
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/18 via-violet-500/12 to-fuchsia-500/8 rounded-3xl blur-3xl pointer-events-none" />

                {/* Ventana tipo app */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-15px_rgba(139,92,246,0.35)] backdrop-blur-sm"
                  style={{ background: 'rgba(15, 8, 35, 0.75)' }}
                >
                  {/* Barra de chrome (browser) */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                      <div className="w-3 h-3 rounded-full bg-green-400/50" />
                    </div>
                    <div className="flex-1 mx-4 bg-white/6 border border-white/6 rounded-md px-3 py-1 flex items-center gap-2">
                      <Lock className="w-2.5 h-2.5 text-green-400/60 flex-shrink-0" />
                      <span className="text-[10px] text-purple-400/50 font-mono">alumbra.ia/dashboard</span>
                    </div>
                  </div>

                  {/* Cuerpo del mockup */}
                  <div className="p-5 space-y-4">

                    {/* Header del analizador */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg">
                          <Brain className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white leading-none">Análisis en curso</p>
                          <p className="text-[9px] text-purple-400/60 mt-0.5">Conversación #47 · WhatsApp</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-500/12 border border-green-400/20 rounded-full px-2.5 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] font-bold text-green-300">En vivo</span>
                      </div>
                    </div>

                    {/* Burbujas de chat */}
                    <div className="space-y-2.5 bg-white/3 rounded-xl p-3.5 border border-white/5">

                      {/* Mensaje 1 — normal */}
                      <div className="flex gap-2 items-end">
                        <div className="w-5 h-5 rounded-full bg-sky-500/30 border border-sky-400/30 inline-flex items-center justify-center flex-shrink-0">
                          <span className="text-[7px] font-black text-sky-300">J</span>
                        </div>
                        <div className="bg-white/7 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[70%]">
                          <p className="text-[10px] text-purple-100/90 leading-relaxed">¿Podemos hablar sobre lo de ayer?</p>
                        </div>
                      </div>

                      {/* Mensaje 2 — Gaslighting, rojo */}
                      <div className="flex gap-2 items-end">
                        <div className="w-5 h-5 rounded-full bg-sky-500/30 border border-sky-400/30 inline-flex items-center justify-center flex-shrink-0">
                          <span className="text-[7px] font-black text-sky-300">J</span>
                        </div>
                        <div className="relative bg-red-500/14 border border-red-400/22 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[82%]">
                          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 inline-flex items-center justify-center shadow-md">
                            <AlertCircle className="w-2 h-2 text-white" />
                          </span>
                          <p className="text-[10px] leading-relaxed">
                            <span className="text-red-300 font-semibold underline decoration-red-400/40 decoration-dotted">Siempre exageras todo.</span>
                            {' '}<span className="text-purple-200/80">Nadie más se queja de mí.</span>
                          </p>
                        </div>
                      </div>

                      {/* Respuesta — víctima */}
                      <div className="flex gap-2 items-end justify-end">
                        <div className="bg-primary/18 border border-primary/18 rounded-xl rounded-br-sm px-2.5 py-1.5 max-w-[55%]">
                          <p className="text-[10px] text-purple-100/80 leading-relaxed">Ok... quizás tienes razón.</p>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-primary/40 border border-primary/30 inline-flex items-center justify-center flex-shrink-0">
                          <span className="text-[7px] font-black text-purple-200">M</span>
                        </div>
                      </div>

                      {/* Mensaje 3 — minimización, ámbar */}
                      <div className="flex gap-2 items-end">
                        <div className="w-5 h-5 rounded-full bg-sky-500/30 border border-sky-400/30 inline-flex items-center justify-center flex-shrink-0">
                          <span className="text-[7px] font-black text-sky-300">J</span>
                        </div>
                        <div className="relative bg-amber-500/12 border border-amber-400/22 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[80%]">
                          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 inline-flex items-center justify-center shadow-md">
                            <AlertCircle className="w-2 h-2 text-white" />
                          </span>
                          <p className="text-[10px] text-amber-200/90 leading-relaxed">
                            Te lo estás imaginando. Eso <span className="font-semibold underline decoration-amber-400/40 decoration-dotted">nunca pasó así.</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Separador */}
                    <div className="divider-gradient" />

                    {/* Resultado del análisis */}
                    <div className="rounded-xl border border-red-400/18 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(220,38,38,0.06) 100%)' }}
                    >
                      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-red-400/12">
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-[10px] font-black text-red-300 uppercase tracking-wider">Nivel de Riesgo</span>
                        </div>
                        <span className="text-[10px] font-black text-red-300 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-400/18">
                          ALTO · 78%
                        </span>
                      </div>
                      <div className="px-3.5 py-2.5 space-y-2">
                        {/* Barra de progreso */}
                        <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                          <div className="h-full w-[78%] bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
                        </div>
                        {/* Tags de patrones */}
                        <div className="flex flex-wrap gap-1.5">
                          {['Gaslighting', 'Minimización', 'Control coercitivo'].map(tag => (
                            <span key={tag} className="text-[9px] font-semibold bg-white/5 border border-white/8 text-purple-300/80 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Floating badge — arriba derecha */}
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

                {/* Floating badge — abajo izquierda */}
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
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/6 z-10"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
          >
            <div className="container mx-auto px-6 py-3.5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              <span className="text-[10px] text-purple-400/40 font-semibold uppercase tracking-widest hidden sm:block">Avalado por</span>
              {[
                { icon: ShieldCheck, text: 'Certificado GDPR / HIPAA' },
                { icon: Award, text: 'Colegio Psicológico Nacional' },
                { icon: TrendingUp, text: '98% de precisión validada' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-purple-300/55 font-medium">
                  <Icon size={13} className="text-primary/60" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. TICKER — profesiones que usan Alumbra
        ══════════════════════════════════════════════════════════ */}
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
            3. PROBLEMA — sección blanca con statement editorial
        ══════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">

            {/* Statement central */}
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-5">
                El problema que enfrentamos
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.0] tracking-tight text-gray-900">
                El abuso emocional{' '}
                <span className="text-gradient">es invisible.</span>
                <br className="hidden md:block" />
                {' '}Hasta que lo analizas.
              </h2>
              <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Las palabras tienen un poder que el ojo humano no puede procesar en tiempo real.
                Alumbra detecta los patrones ocultos para que puedas enfocarte en lo que importa.
              </p>
            </div>

            {/* Stats — tarjetas con acento de borde izquierdo + entrada escalonada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: '1 de 3', label: 'personas experimenta abuso emocional en sus relaciones', accent: 'border-red-400',   bg: 'bg-red-50/60',    num: 'text-red-500'   },
                { value: '70%',    label: 'de los casos pasa desapercibido en consultas de salud',   accent: 'border-amber-400', bg: 'bg-amber-50/60',  num: 'text-amber-500' },
                { value: '98%',    label: 'de precisión en la detección de patrones con Alumbra',    accent: 'border-green-400', bg: 'bg-green-50/60',  num: 'text-green-600' },
                { value: '<3 min', label: 'para obtener un informe completo de la conversación',      accent: 'border-primary',   bg: 'bg-purple-50/60', num: 'text-gradient'  },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`${s.bg} border border-gray-100 border-l-4 ${s.accent} rounded-2xl p-6 animate-fade-up`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className={`text-3xl font-black mb-2 ${s.num === 'text-gradient' ? 'text-gradient' : s.num}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. QUIÉN PUEDE USARLA
        ══════════════════════════════════════════════════════════ */}
        <section
          ref={ref1}
          className={cn(
            'py-24 bg-white transition-all duration-700',
            isIntersecting1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                ¿Para quién es?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Si trabajas con personas,{' '}
                <span className="text-gradient">Alumbra es para ti</span>
              </h2>
              <p className="mt-4 text-gray-500 text-lg leading-relaxed">
                Cualquier profesional del área de la salud que necesite entender dinámicas
                comunicativas complejas encontrará en Alumbra un aliado indispensable.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {professions.map(({ label, icon: Icon }, i) => (
                <div
                  key={label}
                  className={cn(
                    'group relative p-6 rounded-3xl bg-white border border-purple-100/70 shadow-sm card-lift cursor-default overflow-hidden',
                    isIntersecting1 && 'animate-scale-in'
                  )}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 to-violet-400/60 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/10 flex items-center justify-center group-hover:from-primary group-hover:to-violet-500 group-hover:border-0 transition-all duration-300 shadow-sm">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 text-sm">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hint */}
            <p className="text-center text-sm text-gray-400 mt-8">
              ¿Tu profesión no está aquí?{' '}
              <Link href="/contact" className="text-primary font-bold hover:underline">
                Contáctanos —
              </Link>{' '}
              Alumbra se adapta a múltiples contextos del área de la salud.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. FEATURES — bento grid editorial
        ══════════════════════════════════════════════════════════ */}
        <section
          id="features"
          className="py-24 scroll-mt-20 bg-white"
        >
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                Qué hace Alumbra
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Todo lo que necesitas para{' '}
                <span className="text-gradient">ver lo invisible</span>
              </h2>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">

              {/* Card grande — Feature principal */}
              <div className="md:col-span-2 group relative bg-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift animate-fade-up" style={{ animationDelay: '0ms' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
                <div className="grid md:grid-cols-2 gap-0 h-full">
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-6 shadow-md">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">Análisis inteligente de conversaciones</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Copia y pega cualquier conversación — WhatsApp, SMS, correo, transcripciones —
                        y obtén un análisis detallado de los patrones de comunicación en segundos.
                        Sin configuración, sin curva de aprendizaje.
                      </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {['Gaslighting', 'Control coercitivo', 'Manipulación', 'Intimidación'].map(t => (
                        <span key={t} className="text-xs bg-purple-50 text-primary border border-purple-200/60 px-3 py-1 rounded-full font-semibold">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="relative hidden md:block bg-gradient-to-br from-purple-50 to-violet-50 min-h-[280px]">
                    {getImage('feature1') && (
                      <Image
                        src={getImage('feature1')!.imageUrl}
                        alt={getImage('feature1')!.description}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        data-ai-hint={getImage('feature1')!.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-purple-50/40" />
                  </div>
                </div>
              </div>

              {/* Card vertical */}
              <div className="group relative bg-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift flex flex-col animate-fade-up" style={{ animationDelay: '120ms' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                <div className="relative h-48 bg-gradient-to-br from-purple-50 to-violet-50 overflow-hidden">
                  {getImage('feature2') && (
                    <Image
                      src={getImage('feature2')!.imageUrl}
                      alt={getImage('feature2')!.description}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                      data-ai-hint={getImage('feature2')!.imageHint}
                    />
                  )}
                </div>
                <div className="p-6 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-md">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">Informes estructurados y accionables</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Recibe un informe con indicadores de riesgo, patrones detectados y sugerencias
                    orientativas para guiar tus próximas acciones profesionales.
                  </p>
                </div>
              </div>

              {/* Card oscura — destacada */}
              <div className="group relative rounded-3xl overflow-hidden card-lift section-dark-purple p-8 flex flex-col justify-between border border-white/5 animate-fade-up" style={{ animationDelay: '200ms' }}>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
                    <Lock className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 leading-tight">Privacidad absoluta garantizada</h3>
                  <p className="text-sm text-purple-300/80 leading-relaxed">
                    Los textos analizados no se almacenan permanentemente. Cifrado end-to-end.
                    Compatible con GDPR e HIPAA. Tu confianza y la de tus pacientes, protegida.
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-2">
                  {['🔒 Cifrado end-to-end', '🛡️ Compatible GDPR/HIPAA', '🚫 Sin almacenamiento de datos'].map(t => (
                    <span key={t} className="text-xs text-purple-200/70 font-medium">{t}</span>
                  ))}
                </div>
              </div>

              {/* Card horizontal */}
              <div className="md:col-span-2 group relative bg-white rounded-3xl border border-purple-100/80 shadow-sm overflow-hidden card-lift animate-fade-up" style={{ animationDelay: '300ms' }}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-fuchsia-400 to-primary" />
                <div className="grid md:grid-cols-2 gap-0 h-full">
                  <div className="relative h-52 md:h-auto bg-gradient-to-br from-purple-50 to-violet-50 overflow-hidden">
                    {getImage('feature3') && (
                      <Image
                        src={getImage('feature3')!.imageUrl}
                        alt={getImage('feature3')!.description}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        data-ai-hint={getImage('feature3')!.imageHint}
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-primary flex items-center justify-center mb-6 shadow-md">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">Resultados en menos de 3 minutos</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      No necesitas horas de revisión manual. Alumbra procesa la conversación
                      y entrega un informe completo en tiempo real. Ideal para sesiones presenciales,
                      supervisión de casos o trabajo en campo.
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-purple-50/80 rounded-2xl border border-purple-100/60">
                      <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                      <p className="text-xs text-gray-600 font-medium">
                        Tiempo promedio de análisis: <span className="font-black text-primary">47 segundos</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. DEMO / ANALYSIS TEASER
        ══════════════════════════════════════════════════════════ */}
        <section id="analysis-section" className="py-24 bg-white scroll-mt-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                Pruébalo ahora
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Un análisis vale más que{' '}
                <span className="text-gradient">mil palabras</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Inicia sesión y analiza tu primera conversación de forma gratuita.
                El proceso es 100% confidencial y toma menos de un minuto.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-200/50 border border-purple-100/60 group">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="https://i.postimg.cc/GmTTvyXx/Whats-App-Image-2026-01-14-at-5-13-17-PM.jpg"
                  alt="Vista previa de la herramienta"
                  fill
                  className="object-cover object-center transition-all duration-500 group-hover:opacity-0"
                />
                {getImage('analyzer-mockup') && (
                  <Image
                    src={getImage('analyzer-mockup')!.imageUrl}
                    alt={getImage('analyzer-mockup')!.description}
                    fill
                    className="object-cover object-top opacity-0 transition-all duration-500 group-hover:opacity-100"
                    data-ai-hint={getImage('analyzer-mockup')!.imageHint}
                  />
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/92 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-5 shadow-xl glow-purple-sm">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2">Accede a tu panel personal</h3>
                <p className="text-gray-500 mb-7 max-w-sm text-sm leading-relaxed">
                  Para proteger la confidencialidad de los datos, el análisis se realiza en tu espacio privado y protegido.
                </p>
                <Button size="lg" asChild className="rounded-2xl px-8 bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 shadow-lg font-bold">
                  <Link href="/login">Iniciar sesión y analizar</Link>
                </Button>
                <p className="text-sm text-gray-400 mt-4">
                  ¿Aún no tienes cuenta?{' '}
                  <Link href="/signup" className="text-primary font-bold hover:underline">Regístrate gratis</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            7. HOW IT WORKS
        ══════════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          ref={ref2}
          className={cn('py-24 scroll-mt-20 section-dark-purple transition-all duration-700', isIntersecting2 ? 'opacity-100' : 'opacity-0')}
        >
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Steps */}
              <div className={cn(isIntersecting2 && 'animate-in fade-in slide-in-from-left-12 duration-700')}>
                <Badge className="mb-6 bg-white/10 text-purple-200 border-white/15 font-bold">
                  Cómo funciona
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  De la conversación
                  <br />
                  al <span className="text-gradient-light">insight</span>,
                  <br />
                  en 3 pasos.
                </h2>
                <p className="text-purple-300/80 text-base mb-12 leading-relaxed">
                  Sin configuraciones complejas. Sin formación técnica. Solo pega, analiza y actúa.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      num: '01',
                      icon: Users,
                      title: 'Crea tu cuenta gratuita',
                      desc: 'Regístrate en segundos. Tu espacio personal y seguro te espera.',
                      color: 'from-primary to-violet-500',
                    },
                    {
                      num: '02',
                      icon: MessageCircle,
                      title: 'Pega la conversación',
                      desc: 'Cualquier texto: WhatsApp, SMS, correo, transcripción de sesión. Alumbra lo entiende todo.',
                      color: 'from-violet-500 to-fuchsia-500',
                    },
                    {
                      num: '03',
                      icon: Sparkles,
                      title: 'Obtén tu informe',
                      desc: 'Patrones detectados, nivel de riesgo, sugerencias orientativas. Todo en menos de un minuto.',
                      color: 'from-fuchsia-500 to-pink-500',
                    },
                  ].map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex gap-5 glass-dark rounded-2xl p-5 border border-white/8',
                          isIntersecting2 && 'animate-in fade-in slide-in-from-left-8 duration-700'
                        )}
                        style={{ animationDelay: `${i * 150 + 200}ms` }}
                      >
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex flex-col items-center justify-center shadow-lg flex-shrink-0`}>
                          <span className="text-[9px] font-black text-white/70 leading-none">{step.num}</span>
                          <StepIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-base mb-1">{step.title}</h3>
                          <p className="text-sm text-purple-300/80 leading-relaxed">{step.desc}</p>
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

              {/* Video */}
              <div className={cn('relative', isIntersecting2 && 'animate-in fade-in zoom-in-95 duration-700 delay-300')}>
                <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 to-violet-400/15 rounded-[36px] blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  {isClient ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `
                          <div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;">
                            <div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">
                              <iframe src="https://fast.wistia.net/embed/iframe/47mr7cajt1?seo=false&videoFoam=true" title="Alumbra Demo" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" msallowfullscreen width="100%" height="100%"></iframe>
                            </div>
                          </div>
                          <script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>
                        `,
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-purple-900 to-violet-900 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            8. TESTIMONIOS — carrusel automático
        ══════════════════════════════════════════════════════════ */}
        <section
          id="reviews"
          ref={ref3}
          className={cn('py-24 scroll-mt-20 bg-white transition-all duration-700', isIntersecting3 ? 'opacity-100' : 'opacity-0')}
        >
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                Testimonios
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Lo que dicen los{' '}
                <span className="text-gradient">profesionales</span>
              </h2>
            </div>

            {/* Big testimonial */}
            <div className="relative rounded-3xl overflow-hidden border border-purple-100/70 shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-violet-400 to-purple-300" />

              <div className="grid lg:grid-cols-[260px_1fr]">
                {/* Left sidebar — light, mismo tono que el resto */}
                <div className="bg-gray-50 border-r border-gray-100 p-8 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Confían en Alumbra</p>
                    <div className="space-y-2">
                      {testimonials.map((t, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveTestimonial(i)}
                          className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 text-left',
                            activeTestimonial === i
                              ? 'bg-white border border-purple-200 shadow-sm'
                              : 'hover:bg-white/70 border border-transparent'
                          )}
                        >
                          <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} inline-flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm`}>
                            {t.initials}
                          </span>
                          <span className="min-w-0 flex flex-col overflow-hidden">
                            <span className={cn('text-sm font-bold truncate transition-colors', activeTestimonial === i ? 'text-gray-900' : 'text-gray-500')}>{t.name}</span>
                            <span className="text-xs text-gray-400 truncate">{t.role}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="grid grid-cols-3 gap-2">
                      {[{ v: '500+', l: 'Usuarios' }, { v: '4.9', l: 'Rating' }, { v: '98%', l: 'Satisf.' }].map(s => (
                        <div key={s.v} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                          <p className="text-base font-black text-gradient">{s.v}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial content */}
                <div className="p-10 lg:p-12 bg-white flex flex-col justify-center">
                  <div className="text-7xl font-black text-primary/12 leading-none mb-4 select-none">&ldquo;</div>

                  <blockquote
                    key={activeTestimonial}
                    className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed mb-8 animate-in fade-in duration-500"
                  >
                    {testimonials[activeTestimonial].quote}
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonials[activeTestimonial].color} flex items-center justify-center text-white font-black shadow-md`}>
                      {testimonials[activeTestimonial].initials}
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{testimonials[activeTestimonial].name}</p>
                      <p className="text-sm text-gray-400">{testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].city}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-2 mt-8">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300',
                          activeTestimonial === i ? 'w-8 bg-primary' : 'w-1.5 bg-gray-200 hover:bg-purple-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            9. PRICING
        ══════════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          ref={ref4}
          className={cn('py-24 scroll-mt-20 bg-white transition-all duration-700', isIntersecting4 ? 'opacity-100' : 'opacity-0')}
        >
          <div className="container mx-auto px-6">
            <div className={cn('text-center max-w-2xl mx-auto mb-16', isIntersecting4 && 'animate-in fade-in slide-in-from-bottom-8 duration-700')}>
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-bold">
                Precios
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Elige el plan que se{' '}
                <span className="text-gradient">adapta a ti</span>
              </h2>
              <p className="mt-4 text-gray-500 text-lg">
                Sin contratos. Sin permanencia. Empieza gratis hoy mismo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto items-start">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={cn(
                    'relative flex flex-col rounded-3xl transition-all duration-300',
                    plan.popular
                      ? 'bg-gradient-to-b from-[hsl(262,83%,50%)] to-[hsl(275,70%,55%)] text-white shadow-2xl shadow-purple-400/30 scale-[1.04] z-10'
                      : 'bg-white border border-purple-100/80 shadow-sm hover:shadow-lg hover:border-purple-200',
                    isIntersecting4 && 'animate-scale-in'
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
                      <h3 className={cn('text-lg font-black mb-1', plan.popular ? 'text-white' : 'text-gray-900')}>
                        {plan.name}
                      </h3>
                      <p className={cn('text-xs', plan.popular ? 'text-purple-200' : 'text-gray-400')}>
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-8">
                      <span className={cn('text-4xl font-black tracking-tight', plan.popular ? 'text-white' : 'text-gradient')}>
                        {plan.price}
                      </span>
                      {plan.name !== 'Gratis' && (
                        <span className={cn('text-sm ml-1', plan.popular ? 'text-purple-200' : 'text-gray-400')}>/mes</span>
                      )}
                    </div>

                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((feature, fi) => (
                        <li key={fi} className={cn('flex items-center gap-2.5 text-sm', !feature.included && (plan.popular ? 'opacity-40' : 'opacity-40'))}>
                          {feature.included
                            ? <CheckCircle2 className={cn('w-4 h-4 flex-shrink-0', plan.popular ? 'text-green-300' : 'text-green-500')} />
                            : <XCircle className="w-4 h-4 flex-shrink-0 text-current" />
                          }
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        'w-full rounded-2xl h-11 font-bold text-sm',
                        plan.popular
                          ? 'bg-white text-primary hover:bg-purple-50 shadow-lg'
                          : 'bg-gradient-to-r from-primary to-violet-500 text-white hover:opacity-90 shadow-md'
                      )}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-400 mt-10">
              ¿Necesitas una solución para tu institución o equipo de salud?{' '}
              <Link href="/contact" className="text-primary font-bold hover:underline">Hablemos →</Link>
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            10. CTA FINAL
        ══════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center shadow-2xl glow-purple"
              style={{ background: 'linear-gradient(135deg, hsl(262,83%,50%) 0%, hsl(275,70%,55%) 50%, hsl(262,83%,45%) 100%)' }}
            >
              <div className="absolute top-[-40%] right-[-10%] w-80 h-80 rounded-full bg-white/8 blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-40%] left-[-10%] w-80 h-80 rounded-full bg-violet-300/15 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs text-white font-bold mb-6">
                  <Sparkles size={12} />
                  Empieza gratis hoy
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
                  Ilumina lo que el abuso<br />oculta en las conversaciones.
                </h2>
                <p className="text-purple-200 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
                  Únete a más de 500 profesionales del área de la salud
                  que ya usan Alumbra para proteger el bienestar de quienes atienden.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    className="rounded-2xl px-10 h-14 bg-white text-primary hover:bg-purple-50 font-black shadow-xl text-base"
                    onClick={handleCta}
                  >
                    Empezar gratis · sin tarjeta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-8 h-14 border-white/25 text-white hover:bg-white/12 font-bold text-base"
                    asChild
                  >
                    <Link href="/contact">Hablar con el equipo</Link>
                  </Button>
                </div>
                <p className="text-xs text-purple-300/60 mt-6">
                  3 análisis gratis al registrarte · Sin permanencia · Cancela cuando quieras
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer
        ref={ref5}
        className={cn('section-dark-purple text-white transition-all duration-700', isIntersecting5 ? 'opacity-100' : 'opacity-0')}
      >
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-400 flex items-center justify-center shadow-md">
                  <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={18} height={18} className="brightness-0 invert" />
                </div>
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
                  <a
                    key={label} href="#" aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/15 transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-widest mb-5">Navegación</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/', label: 'Inicio' },
                  { href: '/#features', label: 'Características' },
                  { href: '/#how-it-works', label: 'Cómo funciona' },
                  { href: '/#pricing', label: 'Precios' },
                  { href: '/#reviews', label: 'Testimonios' },
                  { href: '/contact', label: 'Contacto' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-purple-300/70 hover:text-white transition-colors duration-200">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
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
