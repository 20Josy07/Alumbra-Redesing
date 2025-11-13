'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut } from 'lucide-react';

type HeaderProps = {
  activeLink?: 'how-it-works' | 'reviews' | 'team' | 'contact';
};

export default function Header({ activeLink }: HeaderProps) {
  const { user, auth } = useUser();

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

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
              <Link href="/contact" className={activeLink === 'contact' ? 'text-primary font-semibold transition-colors' : 'hover:text-primary transition-colors'}>
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Avatar de usuario'} />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/login">Inicia sesión ahora</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
