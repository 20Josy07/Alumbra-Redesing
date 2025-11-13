'use client';

import React, { useEffect } from 'react';
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Home, History, User, Settings, LifeBuoy, LogOut } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, auth } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = () => {
    if (auth) {
      auth.signOut().then(() => {
        router.push('/');
      });
    }
  };

  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <div className="flex h-14 items-center justify-between p-2 group-data-[collapsible=icon]:justify-center">
            <Link href="/" className="flex items-center gap-2 font-bold group-data-[collapsible=icon]:hidden">
                <span className="text-xl">Alumbra</span>
            </Link>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard/history'}>
                <Link href="/dashboard/history">
                  <History />
                  <span>Historial</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <User />
                  <span>Mi Perfil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Settings />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/resources">
                  <LifeBuoy />
                  <span>Recursos de Ayuda</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <div data-sidebar="footer" className="flex flex-col gap-2 p-2 mt-auto">
            <div className="flex items-center gap-3 rounded-md p-2 text-sm font-medium">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Avatar'} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                 <div className="group-data-[collapsible=icon]:hidden flex-1">
                    <p className="text-sm font-semibold truncate">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
            </div>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut}>
                        <LogOut />
                        <span>Cerrar Sesión</span>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
