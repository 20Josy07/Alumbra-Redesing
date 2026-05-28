
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, LifeBuoy, ClipboardPaste, BrainCircuit } from "lucide-react";
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
                                    <AccordionTrigger className="text-lg font-semibold">¿Cómo se garantiza la confidencialidad de los datos de mis pacientes?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                       La confidencialidad es un pilar fundamental de Alumbra. La plataforma no almacena permanentemente los textos analizados; estos se procesan y eliminan de forma segura. Si utiliza una cuenta profesional, los informes guardados están encriptados y solo usted tiene acceso a ellos, cumpliendo con altos estándares de seguridad para proteger la información sensible.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-lg font-semibold">¿La IA de Alumbra puede emitir un diagnóstico clínico?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        No, en absoluto. Alumbra es una herramienta de apoyo y no reemplaza el juicio clínico de un profesional. La IA identifica patrones y ofrece indicadores que pueden ser útiles para la evaluación, pero no está diseñada para diagnosticar. El informe debe ser siempre interpretado y contextualizado por un terapeuta calificado.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-lg font-semibold">¿En qué modelos teóricos se basa el análisis de la IA?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        El modelo de IA ha sido entrenado y supervisado por psicólogos expertos, basándose en la literatura científica sobre violencia psicológica, dinámicas de poder y tácticas de manipulación (como el gaslighting, control coercitivo, etc.). El objetivo es detectar patrones lingüísticos asociados a estos conceptos teóricos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-lg font-semibold">¿Cómo puedo integrar Alumbra en mi práctica clínica de manera ética?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Alumbra puede usarse como una herramienta de psicoeducación, para explorar la percepción del paciente sobre sus conversaciones, o como un punto de partida para discutir dinámicas específicas. Es crucial obtener el consentimiento informado del paciente para usar la herramienta y discutir sus resultados siempre en el marco de la sesión terapéutica, como un complemento a su evaluación.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger className="text-lg font-semibold">¿Qué tan preciso es el análisis y cómo maneja los matices culturales?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        La IA tiene una alta precisión en la identificación de patrones claros, pero como toda tecnología, no es infalible y puede tener limitaciones con sarcasmos, ironías o contextos culturales muy específicos. Por ello, el informe de Alumbra debe considerarse una hipótesis de trabajo que el profesional debe validar y no un veredicto final.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger className="text-lg font-semibold">¿Puedo gestionar los informes de varios pacientes en la plataforma?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí, los planes profesionales de Alumbra incluyen un dashboard de gestión donde puede guardar, titular y organizar los informes de manera segura y confidencial. Esto le permite llevar un registro estructurado del progreso y los patrones observados a lo largo del tiempo para cada caso.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-7">
                                    <AccordionTrigger className="text-lg font-semibold">¿Ofrecen planes para instituciones o clínicas?</AccordionTrigger>
                                    <AccordionContent className="text-base text-gray-600">
                                        Sí, ofrecemos soluciones personalizadas para clínicas, universidades y otras instituciones de salud mental. Póngase en contacto con nuestro equipo a través del formulario para discutir sus necesidades y cómo Alumbra puede integrarse en el flujo de trabajo de su organización.
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

    
