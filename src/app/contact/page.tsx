
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
                <section className="py-20 md:py-28 text-center bg-gray-50">
                    <div className="container mx-auto px-6 animate-in fade-in-0 slide-in-from-top-12 duration-700">
                        <p className="font-semibold text-primary">CONTACTO</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mt-2 mb-6 tracking-tight">
                            Estamos aquí para ayudarte
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            ¿Tienes alguna pregunta, comentario o simplemente quieres saludar? Nos encantaría saber de ti.
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
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Correo Electrónico</h3>
                                            <p className="text-gray-600 mt-1">Envíanos tus preguntas a nuestro correo de soporte.</p>
                                            <a href="mailto:soporte@alumbra.com" className="text-primary hover:underline font-semibold mt-1 inline-block">soporte@alumbra.com</a>
                                        </div>
                                    </div>
                                </CardContent>
                             </Card>
                             <Card className="bg-transparent border-none shadow-none">
                                <CardContent className="p-0">
                                    <div className="flex items-start gap-4">
                                         <div className="bg-primary/10 p-3 rounded-full">
                                            <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
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
                                    <a href="https://www.instagram.com/alumbra.ia/" aria-label="Instagram" className="text-gray-500 hover:text-primary transition-transform hover:scale-110 duration-200">
                                        <Instagram className="h-7 w-7" />
                                    </a>
                                     <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-primary transition-transform hover:scale-110 duration-200">
                                        <Linkedin className="h-7 w-7" />
                                    </a>
                                     <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-primary transition-transform hover:scale-110 duration-200">
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
                                    <AccordionTrigger className="text-lg font-semibold">¿Mi información es privada y segura?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Absolutamente. Tu privacidad es nuestra máxima prioridad. Todas las conversaciones se analizan de forma anónima y se eliminan de nuestros sistemas inmediatamente después del análisis. No almacenamos tus datos personales ni el contenido de tus chats.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-semibold">¿Qué tipo de abuso puede detectar la IA?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Nuestra IA está entrenada para identificar una amplia gama de tácticas de abuso psicológico y emocional, incluyendo (pero no limitado a) gaslighting, manipulación, control coercitivo, aislamiento, intimidación, amenazas veladas y descalificaciones constantes.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-lg font-semibold">¿Alumbra reemplaza la terapia o el consejo profesional?</AccordionTrigger>
                                    <AccordionContent className="text-base text.gray-600">
                                        No. Alumbra es una herramienta de detección y concienciación. Ofrece una primera evaluación para darte claridad, pero no reemplaza el diagnóstico ni el consejo de un profesional de la salud mental o legal. Te animamos a usar nuestro informe como un punto de partida para buscar ayuda calificada si es necesario.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-lg font-semibold">¿El servicio es realmente gratuito?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí, el análisis básico de conversaciones es y siempre será gratuito. Creemos que todo el mundo merece tener acceso a herramientas que protejan su bienestar. En el futuro, podríamos ofrecer funciones avanzadas opcionales con un costo, pero el núcleo de Alumbra permanecerá accesible para todos.
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
