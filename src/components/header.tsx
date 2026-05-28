'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut, Menu, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = () => {
    if (auth) {
      auth.signOut().then(() => router.push('/'));
    }
  };

  const navLinks = (
    <>
      {navItems.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            className={cn(
              'relative text-sm font-medium transition-colors duration-200 px-1 py-0.5',
              activeLink === item.key
                ? 'text-primary'
                : 'text-foreground/70 hover:text-foreground'
            )}
            onClick={() => setIsSheetOpen(false)}
          >
            {item.label}
            {activeLink === item.key && (
              <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-primary to-violet-400" />
            )}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-purple-100/60 shadow-sm shadow-purple-100/40'
          : 'bg-white/60 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-sm">
            <Image
              src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
              alt="Alumbra logo"
              width={18}
              height={18}
              className="brightness-0 invert"
            />
          </div>
          <span className="text-lg font-bold tracking-tight">Alumbra</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-7">
            {navLinks}
          </ul>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-full hover:bg-purple-50"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Usuario'} />
                    <AvatarFallback className="bg-primary text-white text-xs font-bold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-1 rounded-xl shadow-xl border-purple-100" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard')}
                  className="gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-sm h-9 px-4 rounded-full hover:bg-purple-50 hover:text-primary">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild className="text-sm h-9 px-5 rounded-full bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 shadow-sm glow-purple-sm">
                <Link href="/signup">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-purple-50">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 flex flex-col border-l border-purple-100">
              <SheetHeader className="p-6 pb-4 border-b border-purple-50">
                <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsSheetOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                    <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={16} height={16} className="brightness-0 invert" />
                  </div>
                  <span className="text-lg font-bold">Alumbra</span>
                </Link>
              </SheetHeader>

              <nav className="flex-1 px-6 py-6">
                <ul className="flex flex-col gap-1">
                  {user && (
                    <li>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/8 text-primary font-semibold text-sm"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </li>
                  )}
                  {navItems.map((item) => (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          activeLink === item.key
                            ? 'text-primary bg-purple-50'
                            : 'text-foreground/80 hover:bg-gray-50'
                        )}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-6 pt-4 border-t border-purple-50">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-purple-100">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Usuario'} />
                      <AvatarFallback className="bg-primary text-white font-bold">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user.displayName}</p>
                      <button
                        onClick={handleSignOut}
                        className="text-xs text-destructive hover:underline font-medium"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild className="w-full rounded-full border-purple-200">
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>Iniciar sesión</Link>
                    </Button>
                    <Button asChild className="w-full rounded-full bg-gradient-to-r from-primary to-violet-500">
                      <Link href="/signup" onClick={() => setIsSheetOpen(false)}>Crear cuenta gratis</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
