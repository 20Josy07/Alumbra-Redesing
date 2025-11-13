
'use client'

import Resources from "@/components/resources";
import Header from "@/components/header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Phone, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const internationalResources = [
  {
    name: "The National Domestic Violence Hotline (USA)",
    description: "Soporte confidencial 24/7 para cualquier persona que experimente violencia doméstica o busque recursos e información.",
    phone: "1-800-799-7233",
    website: "https://www.thehotline.org/",
    icon: Phone,
  },
  {
    name: "National Coalition Against Domestic Violence (NCADV - USA)",
    description: "Proporciona recursos y aboga por las víctimas y sobrevivientes de la violencia doméstica.",
    website: "https://ncadv.org/",
    icon: Globe,
  },
  {
    name: "Love Is Respect (USA)",
    description: "Un recurso para que los jóvenes prevengan y pongan fin a las relaciones abusivas.",
    phone: "1-866-331-9474",
    website: "https://www.loveisrespect.org/",
    icon: Phone,
  },
   {
    name: "Línea Nacional de Ayuda contra la Violencia de Género (España)",
    description: "Servicio telefónico gratuito y confidencial de información y asesoramiento jurídico en materia de violencia de género.",
    phone: "016",
    website: "https://violenciagenero.igualdad.gob.es/informacionUtil/recursos/telefono/016/home.htm",
    icon: Phone,
  },
  {
    name: "Línea Púrpura (Colombia)",
    description: "Línea telefónica gratuita que brinda atención psicosocial y orientación a mujeres víctimas de violencias.",
    phone: "01 8000 112 137",
    website: "https://www.secretariadelamujer.gov.co/servicios/linea-purpura",
    icon: Phone,
  },
   {
    name: "Línea 144 (Argentina)",
    description: "Brinda atención telefónica a mujeres y LGBTI+ en situación de violencia. Es anónima, gratuita y nacional. Atiende los 365 días del año, las 24 horas.",
    phone: "144",
    website: "https://www.argentina.gob.ar/generos/linea-144",
    icon: Phone,
  },
];

export default function ResourcesPage() {
    return (
        <div className="bg-white text-gray-800">
            <Header activeLink="contact" />

            <main>
                <section className="py-20 md:py-28 text-center bg-gray-50">
                    <div className="container mx-auto px-6">
                        <p className="font-semibold text-primary">RECURSOS DE AYUDA</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mt-2 mb-6 tracking-tight">
                           No estás solo/a, busca ayuda
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                           Hemos recopilado una lista de organizaciones y líneas de ayuda que pueden ofrecerte apoyo, orientación y un espacio seguro.
                        </p>
                    </div>
                </section>

                <section className="py-20 md:py-24">
                     <div className="container mx-auto px-6 max-w-4xl">
                        <Card>
                          <CardHeader>
                            <CardTitle>Recursos de Ayuda y Soporte</CardTitle>
                            <CardDescription>No estás solo/a. Aquí hay algunas organizaciones que pueden ayudarte.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-6">
                              {internationalResources.map((resource, index) => (
                                <li key={resource.name}>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <resource.icon className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{resource.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-1 mb-3">{resource.description}</p>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                            {resource.phone && (
                                                <a href={`tel:${resource.phone}`} className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
                                                <Phone className="w-4 h-4" />
                                                {resource.phone}
                                                </a>
                                            )}
                                            {resource.website && (
                                                <a href={resource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
                                                <Globe className="w-4 h-4" />
                                                Visitar sitio web
                                                </a>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                  {index < internationalResources.length - 1 && <Separator className="mt-6" />}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                     </div>
                </section>
            </main>
        </div>
    )
}
