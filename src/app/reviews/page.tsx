
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const reviews = [
    {
        id: "avatar1",
        name: "Ana Sofía R.",
        role: "Usuaria Verificada",
        review: "Alumbra fue un salvavidas. Me ayudó a ponerle nombre a lo que sentía y a entender que no estaba exagerando. El informe me dio la confianza para buscar ayuda profesional.",
        stars: 5,
    },
    {
        id: "avatar2",
        name: "Carlos G.",
        role: "Usuario Verificado",
        review: "Era escéptico al principio, pero la precisión del análisis me dejó sin palabras. Es una herramienta poderosa y necesaria. La recomiendo a cualquiera que tenga dudas sobre su relación.",
        stars: 5,
    },
    {
        id: "avatar4",
        name: "Laura V.",
        role: "Usuaria Verificada",
        review: "La interfaz es tan simple y el proceso es 100% anónimo. Me sentí segura en todo momento. Gracias a Alumbra, di el primer paso para salir de una situación muy oscura.",
        stars: 5,
    },
    {
        id: "avatar3",
        name: "Javier M.",
        role: "Usuario Verificado",
        review: "Ver los patrones de manipulación escritos en un informe fue impactante, pero increíblemente revelador. Esta herramienta debería ser conocida por todo el mundo.",
        stars: 5,
    },
    {
        id: "avatar5",
        name: "Valentina E.",
        role: "Psicóloga Clínica",
        review: "Como profesional, recomiendo Alumbra a mis pacientes como una herramienta de autoevaluación inicial. Facilita conversaciones difíciles y acelera el proceso terapéutico.",
        stars: 5,
    },
     {
        id: "avatar-new-1",
        name: "Isabella C.",
        role: "Usuaria Verificada",
        review: "Creía que el problema era yo. Alumbra me mostró con ejemplos de mis propios chats que estaba siendo víctima de gaslighting. Me cambió la vida.",
        stars: 5,
    },
];

const StarRating = ({ count }: { count: number }) => (
    <div className="flex items-center gap-1">
        {[...Array(count)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
    </div>
);

export default function ReviewsPage() {
    const getImage = (id: string) => {
        return PlaceHolderImages.find(img => img.id === id);
    }
    
    return (
        <div className="bg-white text-gray-800">
            <Header activeLink="reviews" />

            <main>
                {/* Hero Section */}
                <section className="py-20 md:py-28 text-center bg-gray-50">
                    <div className="container mx-auto px-6">
                        <p className="font-semibold text-primary">RESEÑAS DE USUARIOS</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold mt-2 mb-6 tracking-tight">
                            Historias de claridad y valentía
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Miles de personas ya han utilizado Alumbra para iluminar sus relaciones y recuperar su poder.
                            Estas son algunas de sus historias.
                        </p>
                    </div>
                </section>

                {/* Reviews Grid */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((review) => {
                                const image = getImage(review.id);
                                return (
                                    <Card key={review.id} className="flex flex-col justify-between p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                        <CardContent className="p-0">
                                            <div className="flex items-center mb-4">
                                                {image && (
                                                    <Image
                                                        src={image.imageUrl}
                                                        alt={`Avatar de ${review.name}`}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full"
                                                        data-ai-hint={image.imageHint}
                                                    />
                                                )}
                                                <div className="ml-4">
                                                    <h3 className="font-bold text-lg">{review.name}</h3>
                                                    <p className="text-sm text-gray-500">{review.role}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mb-4">&ldquo;{review.review}&rdquo;</p>
                                        </CardContent>
                                        <div className="mt-auto">
                                            <StarRating count={review.stars} />
                                        </div>
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
                            ¿Lista para escribir tu propia historia?
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Da el primer paso hacia la claridad. Analiza una conversación ahora. Es gratis, anónimo y seguro.
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
