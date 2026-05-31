'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Settings, KeyRound, Bell, Save, Trash2, Loader, ShieldCheck, LogOut } from 'lucide-react';

const PREFS_KEY = 'alumbra:prefs';

type Prefs = { autoSave: boolean; emailNotifications: boolean };
const defaultPrefs: Prefs = { autoSave: false, emailNotifications: true };

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [sendingReset, setSendingReset] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar preferencias desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) setPrefs({ ...defaultPrefs, ...JSON.parse(saved) });
    } catch { /* noop */ }
  }, []);

  const updatePref = (key: keyof Prefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    toast({ title: 'Preferencia guardada', description: 'Tus ajustes se actualizaron correctamente.' });
  };

  const handlePasswordReset = async () => {
    if (!auth || !user?.email) return;
    setSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Correo enviado',
        description: `Te enviamos un enlace a ${user.email} para restablecer tu contraseña.`,
      });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo enviar el correo. Inténtalo de nuevo.' });
    } finally {
      setSendingReset(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try { await auth.signOut(); router.push('/'); } catch { /* noop */ }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteUser(user);
      toast({ title: 'Cuenta eliminada', description: 'Tu cuenta ha sido eliminada permanentemente.' });
      router.push('/');
    } catch (e: unknown) {
      const code = typeof e === 'object' && e && 'code' in e ? (e as { code: string }).code : '';
      if (code === 'auth/requires-recent-login') {
        toast({
          variant: 'destructive',
          title: 'Verificación requerida',
          description: 'Por seguridad, vuelve a iniciar sesión antes de eliminar tu cuenta.',
        });
        await auth?.signOut();
        router.push('/login');
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la cuenta. Inténtalo de nuevo.' });
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-7 max-w-3xl">
      {/* Header */}
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
            <Settings className="w-4 h-4 text-white" />
          </div>
          Configuración
        </h1>
        <p className="text-sm text-gray-400 mt-1 ml-11">Gestiona tu seguridad, preferencias y cuenta.</p>
      </div>

      {/* Seguridad */}
      <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
        <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-black">
            <ShieldCheck className="w-4 h-4 text-primary" /> Seguridad
          </CardTitle>
          <CardDescription className="text-sm">Protege el acceso a tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50/60 border border-purple-100/60">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <KeyRound className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900">Contraseña</p>
                <p className="text-xs text-gray-400">Te enviaremos un enlace por correo.</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handlePasswordReset}
              disabled={sendingReset}
              className="rounded-xl border-purple-200 text-primary hover:bg-purple-50 font-semibold flex-shrink-0"
            >
              {sendingReset ? <Loader className="w-4 h-4 animate-spin" /> : 'Cambiar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
        <div className="h-1 bg-gradient-to-r from-violet-400 to-fuchsia-400" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-black">
            <Bell className="w-4 h-4 text-primary" /> Preferencias
          </CardTitle>
          <CardDescription className="text-sm">Personaliza tu experiencia en Alumbra.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'autoSave' as const, icon: Save, title: 'Guardar análisis automáticamente', desc: 'Guarda cada análisis en tu historial sin confirmación.' },
            { key: 'emailNotifications' as const, icon: Bell, title: 'Notificaciones por correo', desc: 'Recibe novedades y consejos sobre el uso de la plataforma.' },
          ].map(({ key, icon: Icon, title, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <Label className="text-sm font-bold text-gray-900 cursor-pointer">{title}</Label>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
              <Switch checked={prefs[key]} onCheckedChange={(v) => updatePref(key, v)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Zona de peligro */}
      <Card className="rounded-3xl border border-red-200/70 shadow-sm overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
        <div className="h-1 bg-gradient-to-r from-red-400 to-orange-400" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-black text-red-600">
            <Trash2 className="w-4 h-4" /> Zona de peligro
          </CardTitle>
          <CardDescription className="text-sm">Acciones irreversibles sobre tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Cerrar sesión */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <LogOut className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Cerrar sesión</p>
                <p className="text-xs text-gray-400">Saldrás de tu cuenta en este dispositivo.</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="rounded-xl border-gray-200 font-semibold flex-shrink-0">
              Salir
            </Button>
          </div>

          {/* Eliminar cuenta */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-red-50/60 border border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Eliminar cuenta</p>
                <p className="text-xs text-gray-400">Borra tu cuenta y todos tus datos permanentemente.</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-xl font-semibold flex-shrink-0">Eliminar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black">¿Eliminar tu cuenta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción es <span className="font-bold text-red-600">permanente</span> y no se puede deshacer.
                    Se borrarán tu perfil y todos tus análisis guardados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="rounded-xl bg-red-500 hover:bg-red-600 focus:ring-red-400"
                  >
                    {deleting ? <><Loader className="w-4 h-4 mr-2 animate-spin" /> Eliminando…</> : 'Sí, eliminar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
