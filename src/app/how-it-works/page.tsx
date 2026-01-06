
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FileText, LifeBuoy, Lock, ClipboardPaste, BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const steps = [
    {
        icon: <ClipboardPaste className="w-12 h-12 text-primary" />,
        title: "1. Pega tu Conversación",
        description: "Copia el texto de cualquier conversación (WhatsApp, SMS, email, etc.) y pégalo directamente en nuestro analizador seguro. No hay límites ni formatos complicados.",
        imageId: "step1"
    },
    {
        icon: <BrainCircuit className="w-12 h-12 text-primary" />,
        title: "2. La IA Analiza en Segundos",
        description: "Nuestra inteligencia artificial, entrenada por expertos en psicología, escanea el texto en busca de patrones y tácticas de abuso emocional como gaslighting, manipulación y control coercitivo.",
        imageId: "step2"
    },
    {
        icon: <FileText className="w-12 h-12 text-primary" />,
        title: "3. Recibe tu Informe Detallado",
        description: "Obtén un reporte claro y fácil de entender con un puntaje de riesgo, los tipos de abuso detectados, ejemplos concretos de tu texto y recomendaciones personalizadas para protegerte.",
        imageId: "step3"
    },
    {
        icon: <LifeBuoy className="w-12 h-12 text-primary" />,
        title: "4. Conecta con Ayuda (Opcional)",
        description: "Si el informe detecta un riesgo, te ofrecemos acceso directo a una lista de recursos verificados, como líneas de ayuda y terapeutas especializados, para que no estés solo/a.",
        imageId: "step4"
    }
];

export default function HowItWorksPage() {
    const getImage = (id: string) => {
        return PlaceHolderImages.find(img => img.id === id);
    }

    return (
        <div className="bg-white text-gray-800">
            <Header activeLink="how-it-works" />

            <main>
                {/* Hero Section */}
                <section className="py-20 md:py-28 text-center bg-gray-50">
                    <div className="container mx-auto px-6">
                        <p className="font-semibold text-primary">CÓMO FUNCIONA</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mt-2 mb-6 tracking-tight">
                            Claridad y protección en 4 simples pasos
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Diseñamos un proceso intuitivo y seguro para que puedas entender tu situación
                            y tomar el control de tu bienestar emocional sin complicaciones.
                        </p>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="space-y-20">
                            {steps.map((step, index) => {
                                const image = getImage(step.imageId);
                                return (
                                <div key={index} className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                                    <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                                        {step.icon}
                                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 mb-4">{step.title}</h2>
                                        <p className="text-lg text-gray-600">{step.description}</p>
                                    </div>
                                    <div className={`relative h-80 md:h-96 w-full bg-gray-100 rounded-3xl shadow-lg overflow-hidden ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                                        {image && (
                                            <Image 
                                                src={image.imageUrl} 
                                                alt={image.description}
                                                fill
                                                className="object-cover rounded-3xl"
                                                data-ai-hint={image.imageHint}
                                            />
                                        )}
                                    </div>
                                </div>
                            )})}
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
                                       Absolutamente. Tu privacidad es nuestra máxima prioridad. Todas las conversaciones se analizan de forma anónima y se eliminan de nuestros sistemas inmediatamente después del análisis. Si decides crear una cuenta, tus análisis guardados están protegidos y solo tú puedes acceder a ellos.
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
                                <AccordionItem value="item-5">
                                    <AccordionTrigger className="text-lg font-semibold">¿Es el análisis 100% preciso?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        No. La IA es una herramienta increíblemente poderosa, pero no es infalible. Puede haber matices culturales o contextuales que la IA no capte. Alumbra debe usarse como una guía para la reflexión, no como un veredicto final. Tu intuición y juicio son igualmente importantes.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger className="text-lg font-semibold">¿Puedo guardar mis resultados?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí. Si creas una cuenta gratuita, puedes guardar tus análisis en un historial privado. Esto te permite hacer un seguimiento de los patrones a lo largo del tiempo y tener un registro documentado si decides buscar ayuda profesional.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-7">
                                    <AccordionTrigger className="text-lg font-semibold">¿Qué hago si la IA detecta abuso?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Si Alumbra detecta un riesgo, te proporcionaremos una lista de recursos de ayuda profesional, como líneas de atención y organizaciones de apoyo. Es crucial que hables con un experto. Nuestro informe puede ser un punto de partida útil para esa conversación.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-28 text-center">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                            ¿Lista para recuperar tu tranquilidad?
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Da el primer paso hacia la claridad emocional. Analiza una conversación ahora, es gratis, anónimo y podría cambiarlo todo.
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

    
