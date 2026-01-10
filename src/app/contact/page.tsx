
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
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Mi información es privada y segura?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Absolutamente. Tu privacidad es nuestra máxima prioridad. Todas las conversaciones se analizan de forma anónima y se eliminan de nuestros sistemas inmediatamente después del análisis. Si decides crear una cuenta, tus análisis guardados están protegidos y solo tú puedes acceder a ellos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Qué tipo de abuso puede detectar la IA?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Nuestra IA está entrenada para identificar una amplia gama de tácticas de abuso psicológico y emocional, incluyendo (pero no limitado a) gaslighting, manipulación, control coercitivo, aislamiento, intimidación, amenazas veladas y descalificaciones constantes.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Alumbra reemplaza la terapia o el consejo profesional?</AccordionTrigger>
                                    <AccordionContent className="text-base text.gray-600">
                                        No. Alumbra es una herramienta de detección y concienciación. Ofrece una primera evaluación para darte claridad, pero no reemplaza el diagnóstico ni el consejo de un profesional de la salud mental o legal. Te animamos a usar nuestro informe como un punto de partida para buscar ayuda calificada si es necesario.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿El servicio es realmente gratuito?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí, el análisis básico de conversaciones es y siempre será gratuito. Creemos que todo el mundo merece tener acceso a herramientas que protejan su bienestar. En el futuro, podríamos ofrecer funciones avanzadas opcionales con un costo, pero el núcleo de Alumbra permanecerá accesible para todos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Es el análisis 100% preciso?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        No. La IA es una herramienta increíblemente poderosa, pero no es infalible. Puede haber matices culturales o contextuales que la IA no capte. Alumbra debe usarse como una guía para la reflexión, no como un veredicto final. Tu intuición y juicio son igualmente importantes.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Puedo guardar mis resultados?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí. Si creas una cuenta gratuita, puedes guardar tus análisis en un historial privado. Esto te permite hacer un seguimiento de los patrones a lo largo del tiempo y tener un registro documentado si decides buscar ayuda profesional.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-7">
                                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">¿Qué hago si la IA detecta abuso?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Si Alumbra detecta un riesgo, te proporcionaremos una lista de recursos de ayuda profesional, como líneas de atención y organizaciones de apoyo. Es crucial que hables con un experto. Nuestro informe puede ser un punto de partida útil para esa conversación.
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
