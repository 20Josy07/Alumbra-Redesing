'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLink = {
  href: string;
  label: string;
  key: 'how-it-works' | 'reviews' | 'pricing' | 'team' | 'contact' | 'features';
};

const navItems: NavLink[] = [
  { href: '/#how-it-works', label: 'Cómo funciona', key: 'how-it-works' },
  { href: '/#reviews', label: 'Reseñas', key: 'reviews' },
  { href: '/#pricing', label: 'Precios', key: 'pricing' },
  { href: '/team', label: 'Equipo', key: 'team' },
  { href: '/contact', label: 'Contacto', key: 'contact' },
];

type HeaderProps = {
  activeLink?: string | null;
};

export default function Header({ activeLink }: HeaderProps) {
  const { user, auth } = useUser();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();


  const handleSignOut = () => {
    if (auth) {
      auth.signOut().then(() => {
        router.push('/');
      });
    }
  };

  const navLinks = (
    <>
      {navItems.map((item) => (
        <li key={item.key}>
          <Link 
            href={item.href} 
            className={cn(
              'hover:text-primary transition-colors',
              activeLink === item.key && 'text-primary font-semibold underline underline-offset-4'
            )}
            onClick={() => setIsSheetOpen(false)}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </>
  );

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-12 text-lg font-medium">
            {navLinks}
          </ul>
        </nav>

        <div className="hidden md:block">
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
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <span>Dashboard</span>
                </DropdownMenuItem>
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
              <SheetHeader className="p-6">
                <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                   <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                      <Image
                        src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
                        alt="Alumbra logo"
                        width={28}
                        height={28}
                      />
                      <span className="text-xl font-bold">Alumbra</span>
                    </Link>
                </SheetHeader>
                <nav className="flex-1 px-6">
                  <ul className="flex flex-col gap-6 text-xl font-medium">
                    {user && (
                         <li>
                            <Link href="/dashboard" className='text-primary font-semibold transition-colors' onClick={() => setIsSheetOpen(false)}>
                                Dashboard
                            </Link>
                        </li>
                    )}
                    {navLinks}
                  </ul>
                </nav>
                <div className="p-6 border-t">
                  {user ? (
                      <div className="flex items-center gap-4">
                         <Avatar className="h-12 w-12">
                           <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Avatar de usuario'} />
                           <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                         </Avatar>
                         <div className="flex-1">
                           <p className="font-semibold">{user.displayName}</p>
                           <Button variant="ghost" size="sm" onClick={handleSignOut} className="p-0 h-auto text-destructive hover:bg-transparent hover:text-destructive">
                             Cerrar sesión
                           </Button>
                         </div>
                      </div>
                  ) : (
                    <Button asChild className="w-full" size="lg">
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>Inicia sesión ahora</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
