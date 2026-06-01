'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { useUser } from '@/firebase';
import { useUserAvatar } from '@/hooks/use-user-avatar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  LogOut, Menu, LayoutDashboard, ChevronDown,
  Home, Info, Star, Tag, Users, Phone, X,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavKey = 'features' | 'problema' | 'solucion' | 'pricing' | 'team' | 'contact';

const navItems: { href: string; label: string; key: NavKey; icon: React.ElementType }[] = [
  { href: '/#features', label: 'Funcionalidades', key: 'features', icon: Star  },
  { href: '/#solucion', label: 'Solución',        key: 'solucion', icon: Info  },
  { href: '/#pricing',  label: 'Planes',           key: 'pricing',  icon: Tag   },
  { href: '/team',      label: 'Equipo',            key: 'team',     icon: Users },
  { href: '/contact',   label: 'Contacto',          key: 'contact',  icon: Phone },
];

type HeaderProps = { activeLink?: string | null };

export default function Header({ activeLink }: HeaderProps) {
  const { user, auth } = useUser();
  const avatarSrc = useUserAvatar();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    if (auth) auth.signOut().then(() => router.push('/'));
  };

  /* ── Logo / Wordmark ─────────────────────────────────────── */
  const Logo = ({ sm }: { sm?: boolean }) => (
    <Link href="/" className="flex items-center gap-2 shrink-0 group">
      <Image
        src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
        alt="Alumbra"
        width={sm ? 32 : 40}
        height={sm ? 32 : 40}
        className={cn(
          'object-contain transition-transform duration-300 group-hover:scale-110',
          sm ? 'w-8 h-8' : 'w-10 h-10'
        )}
      />
      <span className={cn(
        'font-wordmark font-extrabold tracking-tight text-gray-900 transition-colors group-hover:text-primary',
        sm ? 'text-[1.15rem]' : 'text-[1.3rem]'
      )}>
        Alumbra
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-gray-200/50 shadow-sm shadow-black/[0.04] supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Logo />

        {/* ── Desktop Nav — "segmented control" pill ─────────── */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-0.5 bg-gray-100/80 border border-gray-200/60 rounded-full p-1">
            {navItems.map((item) => {
              const isActive = activeLink === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm shadow-gray-200/80'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-4 bottom-1 h-[2px] rounded-full bg-gradient-to-r from-primary to-violet-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Desktop Auth ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-full hover:bg-gray-100 transition-colors border border-gray-200/60">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatarSrc} alt={user.displayName || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-[10px] font-bold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                    {user.displayName?.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 mt-2 rounded-2xl shadow-xl border border-gray-200/60 p-1.5" align="end">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100 my-1" />
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard')}
                  className="gap-2.5 rounded-xl px-3 py-2 cursor-pointer focus:bg-purple-50 focus:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-sm">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 my-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="gap-2.5 rounded-xl px-3 py-2 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild
                className="h-9 px-4 rounded-full text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
              >
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild
                className="h-9 px-5 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 shadow-md shadow-primary/25 border-0"
              >
                <Link href="/signup">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>

        {/* ── Tablet: nav pills colapsado + auth ──────────────── */}
        <div className="hidden md:flex lg:hidden items-center gap-2">
          {/* Nav abreviado: solo iconos con tooltip-like */}
          <div className="flex items-center gap-0.5 bg-gray-100/80 border border-gray-200/60 rounded-full p-1">
            {navItems.slice(0, 3).map((item) => {
              const isActive = activeLink === item.key;
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    'relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {!user ? (
            <Button asChild
              className="h-9 px-4 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 shadow-md border-0"
            >
              <Link href="/signup">Crear cuenta</Link>
            </Button>
          ) : (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-full hover:bg-gray-100 border border-gray-200/60"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={avatarSrc} alt="" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-[10px] font-bold">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">Panel</span>
            </button>
          )}

          {/* Hamburger para el resto de links */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 border border-gray-200/60 transition-colors">
                <Menu className="h-4 w-4 text-gray-600" />
              </button>
            </SheetTrigger>
            <MobileDrawer
              user={user}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              activeLink={activeLink}
              handleSignOut={handleSignOut}
            />
          </Sheet>
        </div>

        {/* ── Mobile: solo hamburger ───────────────────────────── */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Abrir menú"
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
                  isOpen
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100/80 hover:bg-gray-200/70 text-gray-700 border border-gray-200/60'
                )}
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </SheetTrigger>
            <MobileDrawer
              user={user}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              activeLink={activeLink}
              handleSignOut={handleSignOut}
            />
          </Sheet>
        </div>

      </div>
    </header>
  );
}

/* ── Mobile Drawer ───────────────────────────────────────────── */
function MobileDrawer({
  user, setIsOpen, activeLink, handleSignOut,
}: {
  user: ReturnType<typeof useUser>['user'];
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeLink?: string | null;
  handleSignOut: () => void;
}) {

  return (
    <SheetContent
      side="right"
      className="w-full max-w-[320px] p-0 flex flex-col border-l border-gray-200/60 bg-white"
    >
      {/* Header del drawer */}
      <SheetHeader className="px-5 py-4 border-b border-gray-100">
        <SheetTitle className="sr-only">Navegación</SheetTitle>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-sm">
              <Image src="https://i.postimg.cc/QCys4Rbt/favicon-light.png" alt="Alumbra" width={14} height={14} className="brightness-0 invert" />
            </div>
            <span className="font-wordmark font-extrabold text-[1.1rem] tracking-tight text-gray-900">Alumbra</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </SheetHeader>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">

        {/* Dashboard si está logueado */}
        {user && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-1.5">Mi cuenta</p>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-50 text-primary font-semibold text-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="h-3.5 w-3.5 text-primary" />
              </div>
              Dashboard
            </Link>
          </div>
        )}

        {/* Navegación principal */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-1.5">Navegación</p>
        <ul className="space-y-0.5">
          {navItems.map((item, i) => {
            const isActive = activeLink === item.key;
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-purple-50 text-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                    isActive ? 'bg-primary/10' : 'bg-gray-100'
                  )}>
                    <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-primary' : 'text-gray-500')} />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del drawer */}
      <div className="border-t border-gray-100 p-4">
        {user ? (
          <div className="space-y-3">
            {/* User card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                <AvatarImage src={avatarSrc} alt={user.displayName || ''} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-xs font-bold">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <Button variant="outline" asChild className="w-full h-11 rounded-2xl border-gray-200 font-medium text-sm">
              <Link href="/login" onClick={() => setIsOpen(false)}>Iniciar sesión</Link>
            </Button>
            <Button asChild className="w-full h-11 rounded-2xl font-semibold text-sm bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 shadow-md shadow-primary/20 border-0">
              <Link href="/signup" onClick={() => setIsOpen(false)}>Crear cuenta gratis →</Link>
            </Button>
            <p className="text-center text-[11px] text-gray-400">Sin tarjeta de crédito</p>
          </div>
        )}
      </div>
    </SheetContent>
  );
}
