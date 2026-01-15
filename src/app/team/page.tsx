
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { ArrowRight, Linkedin, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const teamMembers = [
    {
        id: "team-elena",
        name: "María De Los Ríos",
        role: "Co-Fundadora",
        bio: "Impulsada por una profunda pasión por la justicia social y la tecnología, Elena lidera la visión de Alumbra. Con experiencia en desarrollo de productos y una empatía inquebrantable, su misión es crear herramientas que empoderen y protejan a las personas.",
        socials: {
            instagram: "https://www.instagram.com/_mgdlrc_/",
            linkedin: "#",
        }
    },
    {
        id: "team-marco",
        name: "Josimar Acosta",
        role: "Co-Fundador",
        bio: "Marco es el arquitecto detrás de la inteligencia artificial de Alumbra. Como experto en IA y procesamiento de lenguaje natural, se dedica a construir una tecnología robusta, segura y precisa que pueda marcar una diferencia real en la vida de los usuarios.",
        socials: {
            instagram: "https://www.instagram.com/not.josimar/",
            linkedin: "#",
        }
    }
];

const whyWeExistPoints = [
    "El bienestar emocional es muy complicado. Eliminamos la complejidad innecesaria.",
    "El flujo de trabajo para obtener ayuda está fragmentado. Unimos herramientas esenciales en una sola experiencia.",
    "La velocidad para actuar importa. Optimizamos para una ejecución rápida sin comprometer la calidad del análisis.",
    "La privacidad no es negociable. La convertimos en un pilar de nuestro diseño.",
    "La claridad prospera con estructura. Proporcionamos un camino claro sin sofocar la autonomía del usuario.",
    "Las herramientas deben funcionar para las personas, no al revés. Diseñamos con empatía y claridad."
];

export default function TeamPage() {
    const getImage = (id: string) => {
        return PlaceHolderImages.find(img => img.id === id);
    }
    
    return (
        <div className="bg-white text-gray-800">
            <Header activeLink="team" />

            <main>
                {/* Mission Hero Section */}
                <section className="py-20 md:py-28 bg-white">
                    <div className="container mx-auto px-6 text-center animate-in fade-in-0 slide-in-from-top-12 duration-700">
                         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Tecnología responsable al servicio de la práctica terapéutica
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                           La misión de Alumbra es proporcionar una plataforma de análisis de conversaciones basada en inteligencia artificial, orientada a apoyar el trabajo de profesionales de la salud mental en la identificación temprana de indicadores asociados a abuso psicológico.  La herramienta está diseñada para complementar la evaluación clínica, facilitar la reflexión sobre dinámicas comunicativas complejas y promover un uso ético, confidencial y responsable de la tecnología en contextos terapéuticos.
                        </p>
                        <div className="relative h-64 md:h-[600px] w-full max-w-6xl mx-auto bg-gray-100 rounded-3xl shadow-2xl overflow-hidden">
                           {getImage('team-group') && <Image 
                                src={getImage('team-group')?.imageUrl as string}
                                alt="Equipo de Alumbra"
                                fill
                                className="object-cover rounded-3xl"
                                data-ai-hint={getImage('team-group')?.imageHint}
                            />}
                        </div>
                    </div>
                </section>
                
                {/* From Idea to Impact Section */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-6 text-center max-w-3xl">
                         <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            Cuando las conversaciones impactan la salud mental
                        </h2>
                        <div className="mt-6 text-lg text-gray-600 space-y-6 text-left">
                            <p>
                                Alumbra nace a partir de la observación de que muchas personas experimentan malestar psicológico como consecuencia de las dinámicas comunicativas presentes en sus interacciones cotidianas.  Estas conversaciones, cuando son persistentes o dañinas, pueden impactar de forma significativa en el bienestar y la salud mental. Frente a esta realidad, Alumbra fue concebida como una herramienta tecnológica orientada a apoyar el análisis profesional de dichas dinámicas, promoviendo una comprensión más clara y responsable de su influencia en el contexto terapéutico.
                            </p>
                            <p>
                                Nuestra plataforma ha sido diseñada para integrarse de forma ética y funcional en la práctica clínica. No pretendemos reemplazar el juicio del terapeuta, sino complementarlo, ofreciendo una perspectiva adicional que pueda enriquecer el proceso de evaluación y acompañamiento. Consideramos que, al facilitar una aproximación estructurada al análisis de las conversaciones, Alumbra puede ser un recurso valioso para profesionales comprometidos con la salud mental de sus pacientes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why We Exist Section */}
                <section className="py-20 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-96 md:h-[600px] w-full bg-gray-200 rounded-3xl shadow-lg">
                           {getImage('mockup-2') && <Image 
                               src={getImage('mockup-2')?.imageUrl as string}
                               alt="Maqueta de la aplicación Alumbra"
                               fill
                               className="object-cover rounded-3xl"
                               data-ai-hint={getImage('mockup-2')?.imageHint}
                           />}
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
                                Por qué existimos
                            </h2>
                            <ul className="space-y-6">
                                {whyWeExistPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <ArrowRight className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                        <span className="text-lg text-gray-700">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                
                {/* Hero Section */}
                <section className="py-20 md:py-28 text-center bg-white">
                    <div className="container mx-auto px-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4 tracking-tight">
                           Conoce a nuestro equipo
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Somos un equipo pequeño pero apasionado, comprometido con el uso de la tecnología para crear un impacto social positivo y duradero.
                        </p>
                    </div>
                </section>

                {/* Team Members Section */}
                <section className="py-20 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
                            {teamMembers.map((member, index) => {
                                const image = getImage(member.id);
                                return (
                                    <div key={member.id} className={cn("text-left animate-in fade-in-0 slide-in-from-bottom-12 duration-700")} style={{ animationDelay: `${index * 150}ms` }}>
                                        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                            <CardContent className="p-0">
                                                {image && (
                                                    <div className="relative w-full aspect-[4/5]">
                                                        <Image
                                                            src={image.imageUrl}
                                                            alt={`Foto de ${member.name}`}
                                                            fill
                                                            className="object-cover"
                                                            data-ai-hint={image.imageHint}
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <h2 className="text-xl font-bold">{member.name}</h2>
                                                    <p className="text-primary font-semibold mt-1 mb-4">{member.role}</p>
                                                    <div className="flex gap-4 items-center">
                                                         {member.socials.instagram && member.socials.instagram !== '#' && (
                                                            <a href={member.socials.instagram} aria-label={`${member.name} on Instagram`} className="text-gray-400 hover:text-primary transition-colors">
                                                                <Instagram className="h-5 w-5" />
                                                            </a>
                                                        )}
                                                        {member.socials.linkedin && member.socials.linkedin !== '#' && (
                                                            <a href={member.socials.linkedin} aria-label={`${member.name} on LinkedIn`} className="text-gray-400 hover:text-primary transition-colors">
                                                                <Linkedin className="h-5 w-5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-28 text-center bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            Únete a nuestra misión
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Creemos en el poder de la claridad. Si tienes dudas, analiza una conversación. Es un paso valiente hacia tu bienestar.
                        </p>
                        <div className="mt-8">
                             <Button size="lg" className="group" asChild>
                                <Link href="/#analysis-section">
                                    Analiza ahora • es gratis
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-primary text-primary-foreground py-12 md:py-20">
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
                      <li><Link href="/#how-it-works" className="hover:text-white transition-colors text-primary-foreground/80">Cómo funciona</Link></li>
                      <li><Link href="/#pricing" className="hover:text-white transition-colors text-primary-foreground/80">Precios</Link></li>
                      <li><Link href="/#reviews" className="hover:text-white transition-colors text-primary-foreground/80">Reseñas</Link></li>
                      <li><Link href="/contact" className="hover:text-white transition-colors text-primary-foreground/80">Contacto</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-6">All Pages</h4>
                    <ul className="space-y-3 text-sm">
                      <li><a href="#" aria-label="About us" className="hover:text-white transition-colors text-primary-foreground/80">Sobre nosotros</a></li>
                      <li><Link href="/team" className="hover:text-white transition-colors text-primary-foreground/80">Equipo</Link></li>
                      <li><a href="#" aria-label="Blog" className="hover:text-white transition-colors text-primary-foreground/80">Blog</a></li>
                      <li><a href="#" aria-label="Privacy" className="hover:text-white transition-colors text-primary-foreground/80">Privacidad</a></li>
                      <li><a href="#" aria-label="Terms of use" className="hover:text-white transition-colors text-primary-foreground/80">Términos de uso</a></li>
                      <li><a href="/404" className="hover:text-white transition-colors text-primary-foreground/80">404</a></li>
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


    

