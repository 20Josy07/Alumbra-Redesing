
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send, Instagram, Linkedin, Facebook } from "lucide-react";
import Header from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
    return (
        <div className="bg-white text-gray-800">
            <Header activeLink="contact" />

            <main>
                {/* Hero Section */}
                <section className="py-20 md:py-28 text-center bg-primary/5">
                    <div className="container mx-auto px-6 animate-in fade-in-0 slide-in-from-top-12 duration-700">
                        <p className="font-semibold text-primary">CONTACTO</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mt-2 mb-6 tracking-tight">
                            Estamos disponibles para atenderte
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            ¿Tienes consultas sobre el uso profesional de la plataforma, acceso institucional o aspectos técnicos? Nuestro equipo estará encantado de atenderte.
                        </p>
                    </div>
                </section>

                {/* Contact Form & Info Section */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
                        {/* Contact Form */}
                        <div className="animate-in fade-in-0 slide-in-from-left-16 duration-700">
                            <Card className="p-8 md:p-12 rounded-3xl shadow-lg border-none bg-gray-50">
                                <CardContent className="p-0">
                                    <h2 className="text-3xl font-extrabold tracking-tight mb-8">Envíanos un mensaje</h2>
                                    <form className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                            <Input id="name" name="name" type="text" placeholder="Tu nombre completo" required />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                                            <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                                            <Textarea id="message" name="message" rows={5} placeholder="Cuéntanos cómo podemos ayudarte..." required />
                                        </div>
                                        <div className="text-right pt-2">
                                            <Button type="submit" size="lg" className="group">
                                                Enviar Mensaje
                                                <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8 pt-4 animate-in fade-in-0 slide-in-from-right-16 duration-700 delay-150">
                             <Card className="bg-transparent border-none shadow-none">
                                <CardContent className="p-0">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-4 rounded-full">
                                            <Mail className="w-8 h-8 text-primary flex-shrink-0" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Correo Electrónico</h3>
                                            <p className="text-gray-600 mt-1">Envíanos tus preguntas a nuestro correo de soporte.</p>
                                            <a href="mailto:soporte@alumbra.com" className="text-primary hover:text-primary/80 font-semibold mt-1 inline-block">soporte@alumbra.com</a>
                                        </div>
                                    </div>
                                </CardContent>
                             </Card>
                             <Card className="bg-transparent border-none shadow-none">
                                <CardContent className="p-0">
                                    <div className="flex items-start gap-4">
                                         <div className="bg-primary/10 p-4 rounded-full">
                                            <MapPin className="w-8 h-8 text-primary flex-shrink-0" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Ubicación</h3>
                                            <p className="text-gray-600 mt-1">Estamos basados en Colombia, trabajando para todo el mundo.</p>
                                            <p className="font-semibold mt-1">Barranquilla, Colombia</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="pt-6">
                                <h3 className="text-xl font-bold mb-4">Síguenos en Redes</h3>
                                <div className="flex gap-6">
                                    <a href="https://www.instagram.com/alumbra.ia/" aria-label="Instagram" className="text-primary hover:text-primary/80 transition-transform hover:scale-110 duration-200">
                                        <Instagram className="h-7 w-7" />
                                    </a>
                                     <a href="#" aria-label="LinkedIn" className="text-primary hover:text-primary/80 transition-transform hover:scale-110 duration-200">
                                        <Linkedin className="h-7 w-7" />
                                    </a>
                                     <a href="#" aria-label="Facebook" className="text-primary hover:text-primary/80 transition-transform hover:scale-110 duration-200">
                                        <Facebook className="h-7 w-7" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* FAQ Section */}
                <section className="py-20 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                                Preguntas Frecuentes
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Resolvemos tus dudas más importantes sobre Alumbra. Tu tranquilidad es nuestra prioridad.
                            </p>
                        </div>
                        <div className="max-w-3xl mx-auto mt-12">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Cómo se garantiza la confidencialidad de los datos de mis pacientes?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                       La confidencialidad es un pilar fundamental de Alumbra. La plataforma no almacena permanentemente los textos analizados; estos se procesan y eliminan de forma segura. Si utiliza una cuenta profesional, los informes guardados están encriptados y solo usted tiene acceso a ellos, cumpliendo con altos estándares de seguridad para proteger la información sensible.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿La IA de Alumbra puede emitir un diagnóstico clínico?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        No, en absoluto. Alumbra es una herramienta de apoyo y no reemplaza el juicio clínico de un profesional. La IA identifica patrones y ofrece indicadores que pueden ser útiles para la evaluación, pero no está diseñada para diagnosticar. El informe debe ser siempre interpretado y contextualizado por un terapeuta calificado.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿En qué modelos teóricos se basa el análisis de la IA?</AccordionTrigger>
                                    <AccordionContent className="text-base text.gray-600">
                                        El modelo de IA ha sido entrenado y supervisado por psicólogos expertos, basándose en la literatura científica sobre violencia psicológica, dinámicas de poder y tácticas de manipulación (como el gaslighting, control coercitivo, etc.). El objetivo es detectar patrones lingüísticos asociados a estos conceptos teóricos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Cómo puedo integrar Alumbra en mi práctica clínica de manera ética?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Alumbra puede usarse como una herramienta de psicoeducación, para explorar la percepción del paciente sobre sus conversaciones, o como un punto de partida para discutir dinámicas específicas. Es crucial obtener el consentimiento informado del paciente para usar la herramienta y discutir sus resultados siempre en el marco de la sesión terapéutica, como un complemento a su evaluación.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Qué tan preciso es el análisis y cómo maneja los matices culturales?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        La IA tiene una alta precisión en la identificación de patrones claros, pero como toda tecnología, no es infalible y puede tener limitaciones con sarcasmos, ironías o contextos culturales muy específicos. Por ello, el informe de Alumbra debe considerarse una hipótesis de trabajo que el profesional debe validar y no un veredicto final.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Puedo gestionar los informes de varios pacientes en la plataforma?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí, los planes profesionales de Alumbra incluyen un dashboard de gestión donde puede guardar, titular y organizar los informes de manera segura y confidencial. Esto le permite llevar un registro estructurado del progreso y los patrones observados a lo largo del tiempo para cada caso.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-7">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Ofrecen planes para instituciones o clínicas?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí, ofrecemos soluciones personalizadas para clínicas, universidades y otras instituciones de salud mental. Póngase en contacto con nuestro equipo a través del formulario para discutir sus necesidades y cómo Alumbra puede integrarse en el flujo de trabajo de su organización.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
