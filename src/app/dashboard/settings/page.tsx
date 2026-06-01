'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { setTrustedContacts, type TrustedContact } from '@/firebase/firestore/usage';
import { planCaps, PLAN_NAMES, type PlanId } from '@/lib/plans';
import { buildAuthActionSettings } from '@/lib/auth-action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Settings, KeyRound, Bell, Save, Trash2, Loader, ShieldCheck, LogOut, HeartHandshake, Check, Plus, X, Crown } from 'lucide-react';

const PREFS_KEY = 'alumbra:prefs';

type Prefs = { autoSave: boolean; emailNotifications: boolean };
const defaultPrefs: Prefs = { autoSave: false, emailNotifications: true };

interface AccountDoc {
  plan?: PlanId;
  planEnds?: string;
  trustedContact?: { name?: string; email?: string } | null;
  trustedContacts?: { name?: string; email?: string }[];
  autoAlertEnabled?: boolean;
}

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [sendingReset, setSendingReset] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Contacto de confianza (alertas de riesgo alto)
  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: account } = useDoc<AccountDoc>(userDocRef);

  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [autoAlert, setAutoAlert] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [contactLoaded, setContactLoaded] = useState(false);

  // Plan y límite de contactos
  const storedPlan: PlanId = account?.plan ?? 'gratis';
  const subActive = storedPlan === 'gratis' || (!!account?.planEnds && new Date(account.planEnds).getTime() > Date.now());
  const plan: PlanId = subActive ? storedPlan : 'gratis';
  const maxContacts = planCaps(plan).trustedContacts;

  // Carga inicial de contactos desde Firestore (solo la primera vez)
  useEffect(() => {
    if (!account || contactLoaded) return;
    const initial = account.trustedContacts?.length
      ? account.trustedContacts
      : account.trustedContact ? [account.trustedContact] : [];
    setContacts(initial.map((c) => ({ name: c?.name ?? '', email: c?.email ?? '' })));
    setAutoAlert(account.autoAlertEnabled ?? true);
    setContactLoaded(true);
  }, [account, contactLoaded]);

  const updateContact = (i: number, field: 'name' | 'email', value: string) => {
    setContacts((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };
  const addContact = () => {
    if (contacts.length >= maxContacts) return;
    setContacts((prev) => [...prev, { name: '', email: '' }]);
  };
  const removeContact = (i: number) => {
    setContacts((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Cargar preferencias desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) setPrefs({ ...defaultPrefs, ...JSON.parse(saved) });
    } catch { /* noop */ }
  }, []);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSaveContact = async () => {
    if (!user || !firestore) return;
    const filled = contacts.filter((c) => c.email.trim());
    const invalid = filled.find((c) => !emailRe.test(c.email.trim()));
    if (invalid) {
      toast({ variant: 'destructive', title: 'Correo no válido', description: `Revisa el correo "${invalid.email}".` });
      return;
    }
    setSavingContact(true);
    try {
      await setTrustedContacts(firestore, user.uid, filled.slice(0, maxContacts), autoAlert);
      toast({
        title: 'Contactos guardados',
        description: filled.length
          ? `Avisaremos a ${filled.length} ${filled.length === 1 ? 'contacto' : 'contactos'} si detectamos riesgo alto.`
          : 'Ya no enviaremos alertas automáticas.',
      });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los contactos. Inténtalo de nuevo.' });
    } finally {
      setSavingContact(false);
    }
  };

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
      await sendPasswordResetEmail(auth, user.email, buildAuthActionSettings('/login'));
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
      <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden animate-blur-reveal" style={{ animationDelay: '60ms' }}>
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

      {/* Contacto de confianza */}
      <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden animate-blur-reveal" style={{ animationDelay: '110ms' }}>
        <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-black">
            <HeartHandshake className="w-4 h-4 text-primary" /> Contactos de confianza
          </CardTitle>
          <CardDescription className="text-sm">
            Si un análisis detecta un nivel de riesgo <span className="font-semibold text-rose-600">alto</span> o{' '}
            <span className="font-semibold text-red-600">muy alto</span>, avisaremos por correo a estas personas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Indicador de cupo según el plan */}
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-purple-50/60 border border-purple-100/60 px-4 py-2.5">
            <span className="text-xs font-medium text-gray-500">
              Plan <span className="font-bold text-primary">{PLAN_NAMES[plan]}</span> · {contacts.length}/{maxContacts} contactos
            </span>
            <Link href="/dashboard/billing" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Ampliar
            </Link>
          </div>

          {/* Lista de contactos */}
          <div className="space-y-3">
            {contacts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-2xl">
                Aún no has añadido contactos de confianza.
              </p>
            )}
            {contacts.map((c, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-center">
                <Input
                  value={c.name}
                  onChange={(e) => updateContact(i, 'name', e.target.value)}
                  placeholder="Nombre (opcional)"
                  className="h-11 rounded-xl border-gray-200 focus:border-primary"
                />
                <Input
                  type="email"
                  value={c.email}
                  onChange={(e) => updateContact(i, 'email', e.target.value)}
                  placeholder="contacto@email.com"
                  className="h-11 rounded-xl border-gray-200 focus:border-primary"
                />
                <button
                  onClick={() => removeContact(i)}
                  className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors flex-shrink-0"
                  aria-label="Quitar contacto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Añadir contacto */}
          {contacts.length < maxContacts ? (
            <button
              onClick={addContact}
              className="w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary bg-purple-50 hover:bg-purple-100 border border-dashed border-purple-200 rounded-xl py-2.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Añadir contacto
            </button>
          ) : (
            <p className="text-xs text-gray-400 text-center">
              Alcanzaste el máximo de tu plan ({maxContacts}).{' '}
              <Link href="/dashboard/billing" className="text-primary font-bold hover:underline">Mejora tu plan</Link> para añadir más.
            </p>
          )}

          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100/60">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <Label className="text-sm font-bold text-gray-900 cursor-pointer">Enviar alerta automáticamente</Label>
                <p className="text-xs text-gray-400">Cuando se detecte riesgo alto o muy alto, sin que tengas que confirmar.</p>
              </div>
            </div>
            <Switch checked={autoAlert} onCheckedChange={setAutoAlert} />
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Solo se enviará un correo de aviso (sin el contenido de la conversación).
          </p>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveContact}
              disabled={savingContact}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-md"
            >
              {savingContact ? <><Loader className="w-4 h-4 mr-2 animate-spin" /> Guardando…</> : <><Check className="w-4 h-4 mr-2" /> Guardar contactos</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden animate-blur-reveal" style={{ animationDelay: '140ms' }}>
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
      <Card className="rounded-3xl border border-red-200/70 shadow-sm overflow-hidden animate-blur-reveal" style={{ animationDelay: '220ms' }}>
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
