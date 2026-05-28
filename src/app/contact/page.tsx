import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send, Instagram, Linkedin, Facebook, Twitter, Youtube } from "lucide-react";
import Header from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const faqs = [
    {
      q: "¿Cómo se garantiza la confidencialidad de los datos de mis pacientes?",
      a: "La confidencialidad es un pilar fundamental de Alumbra. La plataforma no almacena permanentemente los textos analizados; estos se procesan y eliminan de forma segura. Si utiliza una cuenta profesional, los informes guardados están encriptados y solo usted tiene acceso a ellos.",
    },
    {
      q: "¿La IA de Alumbra puede emitir un diagnóstico clínico?",
      a: "No, en absoluto. Alumbra es una herramienta de apoyo y no reemplaza el juicio clínico de un profesional. La IA identifica patrones y ofrece indicadores útiles, pero el informe debe ser siempre interpretado por un terapeuta calificado.",
    },
    {
      q: "¿En qué modelos teóricos se basa el análisis de la IA?",
      a: "El modelo ha sido entrenado por psicólogos expertos, basándose en la literatura científica sobre violencia psicológica, dinámicas de poder y tácticas de manipulación (gaslighting, control coercitivo, etc.).",
    },
    {
      q: "¿Cómo puedo integrar Alumbra en mi práctica clínica de manera ética?",
      a: "Alumbra puede usarse como herramienta de psicoeducación o punto de partida para discutir dinámicas específicas. Es crucial obtener el consentimiento informado del paciente y contextualizar los resultados en el marco terapéutico.",
    },
    {
      q: "¿Qué tan preciso es el análisis y cómo maneja los matices culturales?",
      a: "La IA tiene alta precisión, pero puede tener limitaciones con sarcasmos o contextos culturales muy específicos. Por ello, el informe debe considerarse una hipótesis de trabajo que el profesional valida, no un veredicto final.",
    },
    {
      q: "¿Pueden gestionar informes de varios pacientes?",
      a: "Sí, los planes profesionales incluyen un dashboard donde puede guardar, titular y organizar los informes de manera segura para llevar un registro estructurado del progreso de cada caso.",
    },
    {
      q: "¿Ofrecen planes para instituciones o clínicas?",
      a: "Sí, ofrecemos soluciones personalizadas para clínicas, universidades e instituciones de salud mental. Contáctenos a través del formulario para discutir sus necesidades específicas.",
    },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Header activeLink="contact" />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32 text-center hero-mesh">
          {/* Orbs */}
          <div className="absolute top-[-20%] left-[-5%] w-96 h-96 rounded-full bg-purple-200/25 blur-3xl pointer-events-none animate-orb" />
          <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-violet-200/20 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 animate-in fade-in-0 slide-in-from-top-8 duration-700">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-semibold">
              Contacto
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black mt-2 mb-6 tracking-tight leading-tight">
              Estamos aquí para{' '}
              <span className="text-gradient">ayudarte</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              ¿Tienes consultas sobre el uso profesional, acceso institucional o aspectos técnicos?
              Nuestro equipo estará encantado de atenderte.
            </p>
          </div>
        </section>

        {/* ── Form & Info ─────────────────────────────────────────── */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-14 items-start max-w-5xl">

            {/* Form */}
            <div className="animate-in fade-in-0 slide-in-from-left-12 duration-700">
              <div className="relative rounded-3xl overflow-hidden border border-purple-100/80 shadow-xl bg-white">
                <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
                <div className="p-8 md:p-10">
                  <h2 className="text-2xl font-black tracking-tight mb-8 text-gray-900">Envíanos un mensaje</h2>
                  <form className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre</label>
                      <Input
                        id="name" name="name" type="text" placeholder="Tu nombre completo" required
                        className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-purple-50/30 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
                      <Input
                        id="email" name="email" type="email" placeholder="tu@email.com" required
                        className="h-12 rounded-2xl border-gray-200 focus:border-primary bg-purple-50/30 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">Mensaje</label>
                      <Textarea
                        id="message" name="message" rows={5}
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                        required
                        className="rounded-2xl border-gray-200 focus:border-primary bg-purple-50/30 text-sm resize-none"
                      />
                    </div>
                    <div className="pt-1">
                      <Button
                        type="submit" size="lg"
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-md glow-purple-sm group"
                      >
                        Enviar Mensaje
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6 pt-2 animate-in fade-in-0 slide-in-from-right-12 duration-700 delay-150">
              {[
                {
                  icon: Mail,
                  title: 'Correo Electrónico',
                  desc: 'Envíanos tus preguntas a nuestro correo de soporte.',
                  link: { href: 'mailto:soporte@alumbra.com', label: 'soporte@alumbra.com' },
                  color: 'from-primary to-violet-500',
                },
                {
                  icon: MapPin,
                  title: 'Ubicación',
                  desc: 'Estamos basados en Colombia, trabajando para todo el mundo.',
                  link: { href: '#', label: 'Barranquilla, Colombia' },
                  color: 'from-violet-500 to-fuchsia-500',
                },
              ].map(({ icon: Icon, title, desc, link, color }) => (
                <div key={title} className="flex items-start gap-4 p-5 rounded-2xl bg-purple-50/60 border border-purple-100/60">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 mb-2 leading-relaxed">{desc}</p>
                    <a href={link.href} className="text-sm text-primary font-bold hover:underline">{link.label}</a>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100/60">
                <h3 className="text-base font-black text-gray-900 mb-4">Síguenos en Redes</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: 'https://www.instagram.com/alumbra.ia/', label: 'Instagram' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn' },
                    { icon: Facebook, href: '#', label: 'Facebook' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label} href={href} aria-label={label}
                      className="w-10 h-10 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-20 md:py-24" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f0ff 50%, #faf5ff 100%)' }}>
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-semibold">
                FAQ
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Preguntas{' '}
                <span className="text-gradient">Frecuentes</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                Resolvemos tus dudas más importantes. Tu tranquilidad es nuestra prioridad.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-purple-100/70 rounded-2xl overflow-hidden bg-white px-0 hover:border-purple-200 transition-colors shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-bold text-sm text-gray-900 hover:text-primary hover:no-underline [&[data-state=open]]:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="section-dark-purple text-white">
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-400 flex items-center justify-center shadow-lg">
                  <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={18} height={18} className="brightness-0 invert" />
                </div>
                <span className="text-xl font-black text-white">Alumbra</span>
              </div>
              <p className="text-sm text-purple-300/80 leading-relaxed max-w-xs mb-8">
                La primera IA que detecta abuso emocional en conversaciones.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/15 transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Navegación</h4>
              <ul className="space-y-3 text-sm">
                {[['/', 'Inicio'], ['/#how-it-works', 'Cómo funciona'], ['/#pricing', 'Precios'], ['/#reviews', 'Reseñas'], ['/contact', 'Contacto']].map(([href, label]) => (
                  <li key={href}><Link href={href} className="text-purple-300/80 hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm">
                {[['/team', 'Equipo'], ['#', 'Sobre nosotros'], ['#', 'Blog'], ['#', 'Privacidad'], ['#', 'Términos de uso']].map(([href, label]) => (
                  <li key={label}><Link href={href} className="text-purple-300/80 hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-400/60">
            <p>© 2025 Alumbra · Todos los derechos reservados</p>
            <p>Made with ❤️ in Colombia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
