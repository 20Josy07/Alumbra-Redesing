
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';

type HeaderProps = {
  activeLink?: 'how-it-works' | 'reviews' | 'team';
};

export default function Header({ activeLink }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-in fade-in-0 duration-500">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
            alt="Alumbra logo"
            width={28}
            height={28}
          />
          <span className="text-xl font-bold">Alumbra</span>
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link href="/how-it-works" className={activeLink === 'how-it-works' ? 'text-primary font-semibold transition-colors' : 'hover:text-primary transition-colors'}>
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link href="/reviews" className={activeLink === 'reviews' ? 'text-primary font-semibold transition-colors' : 'hover:text-primary transition-colors'}>
                Reseñas
              </Link>
            </li>
            <li>
              <Link href="/team" className={activeLink === 'team' ? 'text-primary font-semibold transition-colors' : 'hover:text-primary transition-colors'}>
                Equipo
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Contacto
              </a>
            </li>
          </ul>
        </nav>
        <Button>Inicia sesión ahora</Button>
      </div>
    </header>
  );
}
