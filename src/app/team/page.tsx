
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { ArrowRight, Linkedin, Instagram, Facebook } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";

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
                    <div className="container mx-auto px-6 text-center">
                         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Nuestra misión es más que <br /> tecnología, es empatía.
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                           En Alumbra, estamos construyendo la nueva generación de herramientas de bienestar emocional: simples, seguras y ultrarrápidas. Nuestra misión es empoderar a las personas para que pasen de la incertidumbre a la claridad sin fricciones.
                        </p>
                        <div className="relative h-96 md:h-[600px] w-full max-w-6xl mx-auto bg-gray-100 rounded-3xl shadow-2xl overflow-hidden">
                           {getImage('team-group') && <Image 
                                src={getImage('team-group')?.imageUrl as string}
                                alt="Equipo de Alumbra"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-3xl"
                                data-ai-hint={getImage('team-group')?.imageHint}
                            />}
                        </div>
                    </div>
                </section>
                
                {/* From Idea to Impact Section */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-6 text-center max-w-3xl">
                         <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            De la idea al impacto
                        </h2>
                        <div className="mt-6 text-lg text-gray-600 space-y-6 text-left">
                            <p>
                                El bienestar emocional ya no es solo para terapia, se trata de claridad, rapidez y acción. En Alumbra, estamos redefiniendo cómo se obtiene apoyo en la era digital. Creemos que cualquier persona con una duda o una preocupación merece una respuesta clara que le permita actuar.
                            </p>
                            <p>
                                Nacimos de la frustración con la falta de herramientas accesibles y discretas. Alumbra fue creada para dar a las personas una forma más inteligente y simple de evaluar su situación. Ya sea que estés analizando una conversación, buscando entender una dinámica o simplemente necesites una segunda opinión, Alumbra es el espacio donde la claridad se encuentra con la acción.
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
                               layout="fill"
                               objectFit="cover"
                               className="rounded-3xl"
                               data-ai-hint={getImage('mockup-2')?.imageHint}
                           />}
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
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
                            {teamMembers.map((member) => {
                                const image = getImage(member.id);
                                return (
                                    <div key={member.id} className="text-left">
                                        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                            <CardContent className="p-0">
                                                {image && (
                                                    <div className="relative w-full aspect-[4/5]">
                                                        <Image
                                                            src={image.imageUrl}
                                                            alt={`Foto de ${member.name}`}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                            data-ai-hint={image.imageHint}
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-6">
                                                    <h2 className="text-xl font-bold">{member.name}</h2>
                                                    <p className="text-gray-500 mt-1 mb-4">{member.role}</p>
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
        </div>
    );
}
