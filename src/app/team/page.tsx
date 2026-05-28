import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { ArrowRight, Linkedin, Instagram, Facebook, Twitter, Youtube, CheckCircle2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
  {
    id: "team-elena",
    name: "María De Los Ríos",
    role: "Co-Fundadora",
    bio: "Impulsada por una profunda pasión por la justicia social y la tecnología, María lidera la visión de Alumbra. Con experiencia en desarrollo de productos y una empatía inquebrantable, su misión es crear herramientas que empoderen y protejan a las personas.",
    gradient: "from-primary to-violet-500",
    socials: {
      instagram: "https://www.instagram.com/_mgdlrc_/",
      linkedin: "#",
    },
  },
  {
    id: "team-marco",
    name: "Josimar Acosta",
    role: "Co-Fundador",
    bio: "Josimar es el arquitecto detrás de la inteligencia artificial de Alumbra. Como experto en IA y procesamiento de lenguaje natural, se dedica a construir una tecnología robusta, segura y precisa que pueda marcar una diferencia real en la vida de los usuarios.",
    gradient: "from-violet-500 to-fuchsia-500",
    socials: {
      instagram: "https://www.instagram.com/not.josimar/",
      linkedin: "#",
    },
  },
];

const whyWeExistPoints = [
  "El bienestar emocional es complejo. Eliminamos la complejidad innecesaria.",
  "El flujo de trabajo para obtener ayuda está fragmentado. Unimos herramientas esenciales en una sola experiencia.",
  "La velocidad para actuar importa. Optimizamos para una ejecución rápida sin comprometer la calidad del análisis.",
  "La privacidad no es negociable. La convertimos en un pilar de nuestro diseño.",
  "La claridad prospera con estructura. Proporcionamos un camino claro sin sofocar la autonomía.",
  "Las herramientas deben funcionar para las personas, no al revés. Diseñamos con empatía.",
];

export default function TeamPage() {
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Header activeLink="team" />

      <main>
        {/* ── Mission Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32 hero-mesh">
          <div className="absolute top-[-15%] right-[-5%] w-96 h-96 rounded-full bg-purple-200/20 blur-3xl animate-orb pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-violet-200/18 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center animate-in fade-in-0 slide-in-from-top-8 duration-700">
            <Badge variant="secondary" className="mb-6 bg-purple-100 text-primary border-purple-200 font-semibold">
              Nuestra Misión
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Tecnología responsable al servicio de{' '}
              <span className="text-gradient">la práctica terapéutica</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-14 leading-relaxed">
              La misión de Alumbra es proporcionar una plataforma de análisis de conversaciones basada en IA,
              orientada a apoyar el trabajo de profesionales de la salud mental en la identificación temprana de
              indicadores asociados a abuso psicológico.
            </p>

            {/* Team photo */}
            <div className="relative h-64 md:h-[520px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-purple-200/50 border border-purple-100/60">
              {getImage('team-group') && (
                <Image
                  src={getImage('team-group')?.imageUrl as string}
                  alt="Equipo de Alumbra"
                  fill
                  className="object-cover"
                  data-ai-hint={getImage('team-group')?.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </section>

        {/* ── Story ────────────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 bg-purple-100 text-primary border-purple-200 font-semibold">
              Nuestra historia
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
              Cuando las conversaciones{' '}
              <span className="text-gradient">impactan la salud mental</span>
            </h2>
            <div className="text-base text-gray-500 space-y-6 text-left leading-relaxed">
              <p>
                Alumbra nace a partir de la observación de que muchas personas experimentan malestar psicológico como
                consecuencia de las dinámicas comunicativas presentes en sus interacciones cotidianas. Estas conversaciones,
                cuando son persistentes o dañinas, pueden impactar de forma significativa en el bienestar y la salud mental.
              </p>
              <p>
                Frente a esta realidad, Alumbra fue concebida como una herramienta tecnológica orientada a apoyar el análisis
                profesional de dichas dinámicas. No pretendemos reemplazar el juicio del terapeuta, sino complementarlo,
                ofreciendo una perspectiva adicional que pueda enriquecer el proceso de evaluación y acompañamiento.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why We Exist ──────────────────────────────────────────── */}
        <section className="py-20 md:py-24" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f5f0ff 50%, #faf5ff 100%)' }}>
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center max-w-6xl">
            {/* Mockup */}
            <div className="relative h-80 md:h-[560px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-purple-200/50 border border-purple-100/60">
              {getImage('mockup-2') && (
                <Image
                  src={getImage('mockup-2')?.imageUrl as string}
                  alt="Maqueta de Alumbra"
                  fill
                  className="object-cover"
                  data-ai-hint={getImage('mockup-2')?.imageHint}
                />
              )}
            </div>

            {/* Points */}
            <div>
              <Badge variant="secondary" className="mb-6 bg-purple-100 text-primary border-purple-200 font-semibold">
                Valores
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                Por qué{' '}
                <span className="text-gradient">existimos</span>
              </h2>
              <ul className="space-y-4">
                {whyWeExistPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-purple-100/60 shadow-sm">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Team Members ─────────────────────────────────────────── */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-primary border-purple-200 font-semibold">
                El equipo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Conoce a los{' '}
                <span className="text-gradient">fundadores</span>
              </h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
                Somos un equipo pequeño pero apasionado, comprometido con el uso de la tecnología para crear un impacto social positivo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {teamMembers.map((member, index) => {
                const image = getImage(member.id);
                return (
                  <div
                    key={member.id}
                    className="group animate-in fade-in-0 slide-in-from-bottom-10 duration-700 rounded-3xl overflow-hidden border border-purple-100/60 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all bg-white"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Image */}
                    {image && (
                      <div className="relative w-full aspect-[4/5] overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={`Foto de ${member.name}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint={image.imageHint}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        {/* Role badge */}
                        <div className="absolute bottom-4 left-4">
                          <span className={`inline-block bg-gradient-to-r ${member.gradient} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-6">
                      <h2 className="text-xl font-black text-gray-900 mb-1">{member.name}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{member.bio}</p>
                      <div className="flex gap-3">
                        {member.socials.instagram && member.socials.instagram !== '#' && (
                          <a
                            href={member.socials.instagram} aria-label={`${member.name} on Instagram`}
                            className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                          >
                            <Instagram className="h-4 w-4" />
                          </a>
                        )}
                        {member.socials.linkedin && member.socials.linkedin !== '#' && (
                          <a
                            href={member.socials.linkedin} aria-label={`${member.name} on LinkedIn`}
                            className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-purple-700 p-12 text-center shadow-2xl glow-purple">
              <div className="absolute top-[-30%] right-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-4 leading-tight">Únete a nuestra misión</h2>
                <p className="text-purple-200 mb-8 leading-relaxed">
                  Creemos en el poder de la claridad. Si tienes dudas, analiza una conversación. Es un paso valiente.
                </p>
                <Button size="lg" className="rounded-full px-8 h-12 bg-white text-primary hover:bg-purple-50 font-bold shadow-lg" asChild>
                  <Link href="/#analysis-section">
                    Analiza ahora · es gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
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
