'use client';
import { ArrowRight, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import AnalysisSection from './analysis-section';

export default function LandingPage() {
  const { ref: ref1, isIntersecting: isIntersecting1 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref2, isIntersecting: isIntersecting2 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref3, isIntersecting: isIntersecting3 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref4, isIntersecting: isIntersecting4 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref5, isIntersecting: isIntersecting5 } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-in fade-in-0 duration-500">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
              alt="Alumbra logo"
              width={28}
              height={28}
            />
            <span className="text-xl font-bold">Alumbra</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6 text-sm font-medium">
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Reseñas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Equipo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </nav>
          <Button>Inicia sesión ahora</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="text-center py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <p className="font-semibold text-primary animate-in fade-in slide-in-from-top-4 duration-700">IA Que detecta abuso emocional en conversaciones</p>
              <h1 className="text-4xl md:text-6xl font-extrabold mt-2 mb-6 tracking-tight animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
                Detecta el abuso en <br /> solo unos clicks
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
                Analiza, protege y actúa en tiempo real — todo en una plataforma poderosa. Eleva tu bienestar emocional con claridad instantánea y recomendaciones prácticas.
              </p>
              <div className="animate-in fade-in zoom-in-95 duration-700 delay-300">
                <Button size="lg" className="group" asChild>
                  <Link href="#analysis-section">
                    Analiza ahora • es gratis
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="analysis-section" className="py-20 md:py-24 bg-gray-50/50">
          <div className="container mx-auto px-6">
              <AnalysisSection />
          </div>
        </section>


        <section ref={ref1} className={cn("py-20 md:py-24 bg-gray-50 transition-opacity duration-700", isIntersecting1 ? "opacity-100" : "opacity-0")}>
          <div className="container mx-auto px-6">
            <div className={cn("text-center max-w-3xl mx-auto", isIntersecting1 && "animate-in fade-in slide-in-from-bottom-12 duration-700")}>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                La herramienta esencial para proteger tu bienestar emocional
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Todo lo que necesitas para detectar abuso emocional, obtener claridad y protegerte — en una sola plataforma simple y segura.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className={cn("bg-white p-6 rounded-3xl shadow-lg", isIntersecting1 && "animate-in fade-in slide-in-from-bottom-16 duration-700 delay-100")}>
                <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6">
                  <Image
                    src="https://picsum.photos/seed/feature1/700/553"
                    alt="Pega tu conversación y analiza al instante"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="conversation analysis"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Pega tu conversación y analiza al instante</h3>
                <p className="text-gray-600">Detecta abuso emocional al instante con una interfaz simple y humana.</p>
              </div>
              <div className={cn("bg-white p-6 rounded-3xl shadow-lg", isIntersecting1 && "animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200")}>
                <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6">
                  <Image
                    src="https://picsum.photos/seed/feature2/701/551"
                    alt="Análisis avanzado de abuso emocional"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="advanced analysis"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Análisis avanzado de abuso emocional</h3>
                <p className="text-gray-600">Detecta gaslighting, chantaje emocional y manipulación sutil sin que tengas que entender psicología. Alumbra lo hace por ti en segundos.</p>
              </div>
              <div className={cn("bg-white p-6 rounded-3xl shadow-lg", isIntersecting1 && "animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300")}>
                <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6">
                  <Image
                    src="https://picsum.photos/seed/feature3/700/558"
                    alt="Soporte en tiempo real"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="real-time support"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Soporte en tiempo real</h3>
                <p className="text-gray-600">Conecta con recursos de ayuda o profesionales en el momento exacto en que Alumbra detecta un riesgo.</p>
              </div>
            </div>
          </div>
        </section>

        <section ref={ref2} className={cn("py-20 md:py-24 transition-opacity duration-700", isIntersecting2 ? "opacity-100" : "opacity-0")}>
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className={cn(isIntersecting2 && "animate-in fade-in slide-in-from-left-16 duration-700")}>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Simplifica tu<br />protección</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="text-2xl font-bold text-primary opacity-50">01</div>
                  <div>
                    <h3 className="text-xl font-bold">Pega tu chat</h3>
                    <p className="text-gray-600 mt-1">Copia el chat de WhatsApp, SMS o cualquier otra app.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="text-2xl font-bold text-primary opacity-50">02</div>
                  <div>
                    <h3 className="text-xl font-bold">Alumbra analiza</h3>
                    <p className="text-gray-600 mt-1">Alumbra detecta patrones de abuso emocional automáticamente, sin que tengas que hacer nada más.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="text-2xl font-bold text-primary opacity-50">03</div>
                  <div>
                    <h3 className="text-xl font-bold">Recibes un informe con riesgo y acciones</h3>
                    <p className="text-gray-600 mt-1">Obtén al instante un reporte claro con puntaje de riesgo, tipo de abuso y pasos concretos para protegerte, listo para usar o compartir.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={cn("relative h-96 md:h-[600px] w-full bg-gray-200 rounded-3xl", isIntersecting2 && "animate-in fade-in zoom-in-95 duration-700 delay-200")}>
               <Image src="https://picsum.photos/seed/protection/800/600" alt="Simplifica tu protección" layout="fill" objectFit="cover" className="rounded-3xl" data-ai-hint="protection steps" />
            </div>
          </div>
        </section>

        <section ref={ref3} className={cn("py-20 md:py-32 bg-white transition-opacity duration-700", isIntersecting3 ? "opacity-100" : "opacity-0")}>
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className={cn("md:w-1/2", isIntersecting3 && "animate-in fade-in slide-in-from-left-16 duration-700")}>
              <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Amada por quienes se<br />protegen y quienes<br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">ayudan</span>
              </h2>
            </div>
            <div className={cn("md:w-1/2 max-w-lg", isIntersecting3 && "animate-in fade-in slide-in-from-right-16 duration-700 delay-200")}>
              <div className="flex gap-3 mb-8">
                <Image src="https://picsum.photos/seed/avatar1/56/56" alt="Usuario" width={56} height={56} className="rounded-2xl shadow-md" data-ai-hint="woman face" />
                <Image src="https://picsum.photos/seed/avatar2/56/56" alt="Usuario" width={56} height={56} className="rounded-2xl shadow-md" data-ai-hint="man face" />
                <Image src="https://picsum.photos/seed/avatar3/56/56" alt="Usuario" width={56} height={56} className="rounded-2xl shadow-lg scale-110 ring-2 ring-purple-500 z-10" data-ai-hint="person face" />
                <Image src="https://picsum.photos/seed/avatar4/56/56" alt="Usuario" width={56} height={56} className="rounded-2xl shadow-md" data-ai-hint="woman smiling" />
                <Image src="https://picsum.photos/seed/avatar5/56/56" alt="Usuario" width={56} height={56} className="rounded-2xl shadow-md" data-ai-hint="man smiling" />
              </div>
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-primary pl-6 mb-6">
                “Alumbra me dio la claridad que necesitaba en un momento muy confuso. Por primera vez entendí lo que estaba viviendo y pude actuar. Gracias a esta herramienta hoy estoy fuera de una relación tóxica y más fuerte que nunca.”
              </blockquote>
              <p className="font-semibold">
                María José Ramírez<br />
                <span className="font-normal text-gray-500">Usuaria desde marzo 2025</span>
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer ref={ref5} className={cn("bg-gray-900 text-gray-400 py-20 transition-opacity duration-700", isIntersecting5 ? "opacity-100" : "opacity-0")}>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={32} height={32} />
              <span className="text-2xl font-bold text-white">Alumbra</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              La primera IA que detecta abuso emocional en conversaciones y te da claridad instantánea para proteger tu bienestar.
            </p>
            <div className="mt-8">
                <p className="text-xs text-gray-500 mb-4">Follow us on:</p>
                <div className="flex gap-5">
                    <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook size={20} /></a>
                    <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter size={20} /></a>
                    <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram size={20} /></a>
                    <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin size={20} /></a>
                    <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube size={20} /></a>
                </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">Cómo funciona</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reseñas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">All Pages</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Equipo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">404</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© 2025 Alumbra. Todos los derechos reservados. <span className="ml-4 opacity-70">Made with love in Colombia</span></p>
        </div>
      </footer>
    </div>
  );
}
