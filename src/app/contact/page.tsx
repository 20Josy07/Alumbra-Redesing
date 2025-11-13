
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Facebook } from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
    return (
        <div className="bg-white text-gray-800">
            <Header activeLink="contact" />

            <main>
                {/* Hero Section */}
                <section className="py-20 md:py-28 text-center bg-gray-50">
                    <div className="container mx-auto px-6">
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
                        <div className="bg-gray-50 p-8 md:p-12 rounded-3xl shadow-lg">
                            <h2 className="text-3xl font-extrabold tracking-tight mb-6">Envíanos un mensaje</h2>
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
                                <div className="text-right">
                                    <Button type="submit" size="lg" className="group">
                                        Enviar Mensaje
                                        <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-extrabold tracking-tight mb-6">Información de Contacto</h2>
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold">Correo Electrónico</h3>
                                    <p className="text-gray-600">Envíanos tus preguntas a nuestro correo de soporte.</p>
                                    <a href="mailto:soporte@alumbra.com" className="text-primary hover:underline font-medium">soporte@alumbra.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold">Ubicación</h3>
                                    <p className="text-gray-600">Estamos basados en Colombia, trabajando para todo el mundo.</p>
                                    <p className="font-medium">Bogotá, Colombia</p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
                                <div className="flex gap-6">
                                    <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-primary transition-colors">
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                     <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-primary transition-colors">
                                        <Linkedin className="h-6 w-6" />
                                    </a>
                                     <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-primary transition-colors">
                                        <Facebook className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
