import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      <Header />
      <main className="flex-1 flex items-center justify-center relative">
        {/* Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-purple-200/20 blur-3xl pointer-events-none animate-orb" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-violet-200/18 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 py-20 text-center relative z-10 animate-in fade-in-0 slide-in-from-bottom-8 duration-700">
          {/* 404 large */}
          <div className="relative inline-block mb-4">
            <h1 className="text-[140px] md:text-[200px] font-black leading-none tracking-tighter text-gradient opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-2xl glow-purple-sm animate-float">
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Página no encontrada
          </h2>
          <p className="text-lg text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
            La página que buscas no existe o ha sido movida. Vuelve al inicio para encontrar lo que necesitas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild size="lg"
              className="group h-12 px-7 rounded-full bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-lg glow-purple-sm"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Volver al inicio
              </Link>
            </Button>
            <Button
              asChild size="lg" variant="outline"
              className="h-12 px-7 rounded-full border-purple-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-purple-50/50"
            >
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Ir al Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
