
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";
import PanicButton from "@/components/panic-button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      <main className="flex-1 flex items-center justify-center text-center">
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-8xl md:text-9xl font-extrabold text-gray-900 tracking-tighter -mb-2">404</h1>
          <p className="text-3xl md:text-5xl font-extrabold mt-4 mb-4 text-gray-900 tracking-tight">
            Página no encontrada
          </p>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </main>
      <PanicButton />
    </div>
  );
}
