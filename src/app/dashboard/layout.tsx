'use client';

import React, { useEffect } from 'react';
import { useUser } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
  SidebarProvider, SidebarTrigger, SidebarInset,
} from "@/components/ui/sidebar";
import { Home, History, User, Settings, LifeBuoy, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navMain = [
  { href: '/dashboard', icon: Home, label: 'Inicio' },
  { href: '/dashboard/history', icon: History, label: 'Historial' },
  { href: '/dashboard/profile', icon: User, label: 'Mi Perfil' },
  { href: '/dashboard/settings', icon: Settings, label: 'Configuración' },
];

const navSecondary = [
  { href: '/resources', icon: LifeBuoy, label: 'Recursos de Ayuda' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, auth } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const handleSignOut = async () => {
    if (!auth) return;
    try { await auth.signOut(); router.push('/'); } catch {}
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-xl animate-pulse">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-2.5 text-center">
            <Skeleton className="h-3 w-48 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar
        side="left"
        collapsible="icon"
        className="border-r-0"
        style={{ background: 'linear-gradient(175deg, hsl(262 40% 7%) 0%, hsl(275 35% 11%) 100%)' }}
      >
        {/* Header */}
        <SidebarHeader className="border-b border-white/8">
          <div className="flex h-16 items-center justify-between px-4 group-data-[collapsible=icon]:justify-center">
            <Link href="/" className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden">
              <Image
                src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
                alt="Alumbra"
                width={32}
                height={32}
                className="w-8 h-8 object-contain brightness-0 invert"
              />
              <span className="font-black text-white text-lg">Alumbra</span>
            </Link>
            <SidebarTrigger className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg" />
          </div>
        </SidebarHeader>

        {/* Nav */}
        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            {navMain.map(({ href, icon: Icon, label }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href}
                  className={cn(
                    'rounded-xl h-10 text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200',
                    'data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/80 data-[active=true]:to-violet-600/70',
                    'data-[active=true]:text-white data-[active=true]:shadow-md'
                  )}
                >
                  <Link href={href}>
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarSeparator className="my-3 bg-white/8" />

          <SidebarMenu>
            {navSecondary.map(({ href, icon: Icon, label }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton
                  asChild
                  className="rounded-xl h-10 text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
                >
                  <Link href={href}>
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer */}
        <div data-sidebar="footer" className="mt-auto p-3 border-t border-white/8">
          {/* User info */}
          <div className="flex items-center gap-3 px-2 py-2 mb-1 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 ring-2 ring-white/20 flex-shrink-0">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Avatar'} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-xs font-black">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="rounded-xl h-10 text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Cerrar Sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>

      {/* ── Main content ────────────────────────────────────────── */}
      <SidebarInset className="bg-gradient-to-br from-purple-50/40 via-white to-white">
        {/* Barra superior móvil — abre el sidebar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/85 backdrop-blur-xl border-b border-purple-100/60">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://i.postimg.cc/QCys4Rbt/favicon-light.png"
              alt="Alumbra"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
            <span className="font-black text-base text-gray-900">Alumbra</span>
          </Link>
          <SidebarTrigger className="h-9 w-9 rounded-full text-gray-600 hover:bg-purple-50 hover:text-primary border border-gray-200/60" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-9">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
