
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { ArrowRight, Linkedin, Instagram } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
    {
        id: "team-elena",
        name: "Maria Gabriela De Los Rios Camacho",
        role: "Co-Fundadora",
        bio: "Impulsada por una profunda pasión por la justicia social y la tecnología, Elena lidera la visión de Alumbra. Con experiencia en desarrollo de productos y una empatía inquebrantable, su misión es crear herramientas que empoderen y protejan a las personas.",
        socials: {
            instagram: "https://www.instagram.com/_mgdlrc_/",
            linkedin: "#",
        }
    },
    {
        id: "team-marco",
        name: "Josimar Acosta Martínez",
        role: "Co-Fundador",
        bio: "Marco es el arquitecto detrás de la inteligencia artificial de Alumbra. Como experto en IA y procesamiento de lenguaje natural, se dedica a construir una tecnología robusta, segura y precisa que pueda marcar una diferencia real en la vida de los usuarios.",
        socials: {
            instagram: "https://www.instagram.com/not.josimar/",
            linkedin: "#",
        }
    }
];

export default function TeamPage() {
    const getImage = (id: string) => {
        return PlaceHolderImages.find(img => img.id === id);
    }
    
    return (
        <div className="bg-white text-gray-800">
            <Header activeLink="team" />

            <main>
                {/* Hero Section */}
                <section className="py-20 md:py-28 text-center bg-gray-50">
                    <div className="container mx-auto px-6">
                        <p className="font-semibold text-primary">NUESTRO EQUIPO</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mt-2 mb-6 tracking-tight">
                            Las mentes y corazones detrás de Alumbra
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Somos un equipo pequeño pero apasionado, comprometido con el uso de la tecnología para crear un impacto social positivo y duradero.
                        </p>
                    </div>
                </section>

                {/* Team Members Section */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
                            {teamMembers.map((member) => {
                                const image = getImage(member.id);
                                return (
                                    <Card key={member.id} className="text-center border-none shadow-none">
                                        <CardContent className="p-0">
                                            {image && (
                                                <div className="relative h-64 w-64 mx-auto mb-6">
                                                    <Image
                                                        src={image.imageUrl}
                                                        alt={`Foto de ${member.name}`}
                                                        width={256}
                                                        height={256}
                                                        className="rounded-full object-cover shadow-lg"
                                                        data-ai-hint={image.imageHint}
                                                    />
                                                </div>
                                            )}
                                            <h2 className="text-2xl font-bold tracking-tight">{member.name}</h2>
                                            <p className="text-primary font-semibold mt-1 mb-3">{member.role}</p>
                                            <p className="text-gray-600 max-w-sm mx-auto">{member.bio}</p>
                                            <div className="flex justify-center gap-4 mt-6">
                                                {member.socials.instagram && member.socials.instagram !== '#' && (
                                                    <Button variant="outline" size="icon" asChild>
                                                        <a href={member.socials.instagram} aria-label={`${member.name} on Instagram`}>
                                                            <Instagram className="h-5 w-5" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {member.socials.linkedin && member.socials.linkedin !== '#' && (
                                                    <Button variant="outline" size="icon" asChild>
                                                        <a href={member.socials.linkedin} aria-label={`${member.name} on LinkedIn`}>
                                                            <Linkedin className="h-5 w-5" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-28 text-center bg-gray-50">
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
