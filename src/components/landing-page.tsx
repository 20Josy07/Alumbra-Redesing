'use client';
import { ArrowRight, CheckCircle2, Facebook, Instagram, Linkedin, Twitter, XCircle, Youtube } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Header from './header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { BrainCircuit, Lock } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';

export default function LandingPage() {
  const { ref: ref1, isIntersecting: isIntersecting1 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref2, isIntersecting: isIntersecting2 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref3, isIntersecting: isIntersecting3 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref4, isIntersecting: isIntersecting4 } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: ref5, isIntersecting: isIntersecting5 } = useIntersectionObserver({ threshold: 0.1 });

  const { user } = useUser();
  const router = useRouter();

  const handleAnalysisClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const getImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id);
  };

  const plans = [
    {
      name: "Plan Básico",
      price: "$12.000",
      description: "Empieza a analizar sin complicaciones",
      features: [
        { text: "30 análisis al mes", included: true },
        { text: "Acceso al analizador de conversaciones", included: true },
        { text: "Resultados claros y directos", included: true },
        { text: "No incluye dashboard de gestión", included: false },
      ],
      cta: "Empezar ahora",
      popular: false,
    },
    {
      name: "Plan Pro",
      price: "$25.000",
      description: "Más control, más análisis",
      features: [
        { text: "60 análisis al mes", included: true },
        { text: "Dashboard de gestión básico", included: true },
        { text: "Historial de análisis", included: true },
        { text: "Visualización de resultados", included: true },
        { text: "Funciones avanzadas limitadas", included: false },
      ],
      cta: "Elegir Plan Pro",
      popular: true,
    },
    {
      name: "Plan Premium",
      price: "$45.000",
      description: "Análisis sin límites y control total",
      features: [
        { text: "Análisis ilimitados", included: true },
        { text: "Dashboard de gestión completo", included: true },
        { text: "Historial completo", included: true },
        { text: "Herramientas avanzadas de control y visualización", included: true },
        { text: "Acceso prioritario a nuevas funciones", included: true },
      ],
      cta: "Pasar a Premium",
      popular: false,
    }
  ];


  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />

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
                <Button size="lg" className="group" onClick={handleAnalysisClick}>
                    Analiza ahora • es gratis
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="analysis-section" className="py-20 md:py-24 bg-gray-50 scroll-mt-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                    Analiza una Conversación Ahora
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    Inicia sesión para obtener un análisis instantáneo, gratuito y 100% anónimo desde tu dashboard personal.
                </p>
                </div>

                <Card className="shadow-2xl relative overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="text-primary" />
                    Analizador de Abuso Emocional
                    </CardTitle>
                    <CardDescription>
                    Pega la conversación que quieres analizar en el cuadro de texto de tu dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-40 bg-muted rounded-md flex items-center justify-center p-6">
                        <p className="text-muted-foreground text-center">Inicia sesión para acceder al analizador.</p>
                    </div>
                </CardContent>
                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                    <Lock className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Función Disponible para Usuarios</h3>
                    <p className="text-gray-600 mb-6 max-w-sm">
                        Para proteger tu privacidad, el análisis se realiza en tu dashboard personal una vez que has iniciado sesión.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/login">Inicia Sesión Para Analizar</Link>
                    </Button>
                     <p className="text-sm text-muted-foreground mt-4">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/signup" className="text-primary font-semibold hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </div>
                </Card>
            </div>
        </section>

        <section ref={ref1} className={cn("py-20 md:py-24 bg-white transition-opacity duration-700", isIntersecting1 ? "opacity-100" : "opacity-0")}>
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
                  {getImage('feature1') && <Image
                    src={getImage('feature1')!.imageUrl}
                    alt={getImage('feature1')!.description}
                    fill
                    className="object-cover"
                    data-ai-hint={getImage('feature1')!.imageHint}
                  />}
                </div>
                <h3 className="text-xl font-bold mb-2">Pega tu conversación y analiza al instante</h3>
                <p className="text-gray-600">Detecta abuso emocional al instante con una interfaz simple y humana.</p>
              </div>
              <div className={cn("bg-white p-6 rounded-3xl shadow-lg", isIntersecting1 && "animate-in fade-in slide-in-from-bottom-16 duration-700 delay-200")}>
                <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6">
                   {getImage('feature2') && <Image
                    src={getImage('feature2')!.imageUrl}
                    alt={getImage('feature2')!.description}
                    fill
                    className="object-cover"
                    data-ai-hint={getImage('feature2')!.imageHint}
                  />}
                </div>
                <h3 className="text-xl font-bold mb-2">Análisis avanzado de abuso emocional</h3>
                <p className="text-gray-600">Detecta gaslighting, chantaje emocional y manipulación sutil sin que tengas que entender psicología. Alumbra lo hace por ti en segundos.</p>
              </div>
              <div className={cn("bg-white p-6 rounded-3xl shadow-lg", isIntersecting1 && "animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300")}>
                <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6">
                  {getImage('feature3') && <Image
                    src={getImage('feature3')!.imageUrl}
                    alt={getImage('feature3')!.description}
                    fill
                    className="object-cover"
                    data-ai-hint={getImage('feature3')!.imageHint}
                  />}
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
                    <h3 className="text-xl font-bold">Inicia sesión y ve a tu dashboard</h3>
                    <p className="text-gray-600 mt-1">Tu espacio seguro para analizar conversaciones.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="text-2xl font-bold text-primary opacity-50">02</div>
                  <div>
                    <h3 className="text-xl font-bold">Pega tu chat y Alumbra analiza</h3>
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
                {getImage('protection') && <Image src={getImage('protection')!.imageUrl} alt={getImage('protection')!.description} fill className="object-cover rounded-3xl" data-ai-hint={getImage('protection')!.imageHint} />}
            </div>
          </div>
        </section>

        <section ref={ref3} className={cn("py-20 md:py-32 bg-gray-50 transition-opacity duration-700", isIntersecting3 ? "opacity-100" : "opacity-0")}>
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className={cn("md:w-1/2", isIntersecting3 && "animate-in fade-in slide-in-from-left-16 duration-700")}>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Amada por quienes se<br />protegen y quienes<br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">ayudan</span>
              </h2>
            </div>
            <div className={cn("md:w-1/2 max-w-lg", isIntersecting3 && "animate-in fade-in slide-in-from-right-16 duration-700 delay-200")}>
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="flex -space-x-2 mb-6 justify-start">
                        {['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5'].map((id) => {
                            const image = getImage(id);
                            if (!image) return null;
                            return (
                                <Image
                                key={id}
                                src={image.imageUrl}
                                alt={image.description}
                                width={40}
                                height={40}
                                className="rounded-full ring-2 ring-white"
                                data-ai-hint={image.imageHint}
                                />
                            );
                        })}
                    </div>
                    <blockquote className="text-base text-gray-600 border-l-4 border-primary/20 pl-4 mb-6">
                        “Alumbra me dio la claridad que necesitaba en un momento muy confuso. Por primera vez entendí lo que estaba viviendo y pude actuar. Gracias a esta herramienta hoy estoy fuera de una relación tóxica y más fuerte que nunca.”
                    </blockquote>
                    <div>
                        <p className="font-semibold text-gray-800">María José Ramírez</p>
                        <p className="text-sm text-gray-500">Usuaria desde marzo 2025</p>
                    </div>
                </div>
            </div>
          </div>
        </section>
        
        <section ref={ref4} className={cn("py-20 md:py-24 bg-white transition-opacity duration-700", isIntersecting4 ? "opacity-100" : "opacity-0")}>
          <div className="container mx-auto px-6">
            <div className={cn("text-center max-w-3xl mx-auto", isIntersecting4 && "animate-in fade-in slide-in-from-bottom-12 duration-700")}>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Un plan para cada necesidad
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Desde un análisis ocasional hasta el uso intensivo, tenemos un plan que se ajusta a ti. Empieza gratis, mejora cuando quieras.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto items-start">
              {plans.map((plan) => (
                <Card key={plan.name} className={cn("flex flex-col h-full rounded-2xl", plan.popular ? "border-2 border-primary shadow-2xl relative" : "shadow-lg")}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 right-6">⭐ Más Popular</Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-center mb-6">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="text-muted-foreground"> / mes</span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          {feature.included ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                          <span className={cn(!feature.included && "text-muted-foreground")}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-col">
                    <Button size="lg" variant={plan.popular ? "default" : "outline"} className="w-full">
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      

      <footer ref={ref5} className={cn("bg-primary text-primary-foreground py-20 transition-opacity duration-700", isIntersecting5 ? "opacity-100" : "opacity-0")}>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={32} height={32} />
              <span className="text-2xl font-bold text-white">Alumbra</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-primary-foreground/80">
              La primera IA que detecta abuso emocional en conversaciones y te da claridad instantánea para proteger tu bienestar.
            </p>
            <div className="mt-8">
                <p className="text-xs text-primary-foreground/60 mb-4">Follow us on:</p>
                <div className="flex gap-5 text-primary-foreground/80">
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
              <li><Link href="/" className="hover:text-white transition-colors text-primary-foreground/80">Home</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors text-primary-foreground/80">Cómo funciona</Link></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Precios</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Reseñas</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">All Pages</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Equipo</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">Términos de uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-primary-foreground/80">404</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>© 2025 Alumbra. Todos los derechos reservados. <span className="ml-4 opacity-70">Made with love in Colombia</span></p>
        </div>
      </footer>
    </div>
  );
}
