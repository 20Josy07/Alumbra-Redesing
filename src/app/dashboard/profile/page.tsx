'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo, useRef } from 'react';
import { updateProfile } from 'firebase/auth';
import { collection, query, orderBy, type Timestamp } from 'firebase/firestore';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { setAvatar } from '@/firebase/firestore/usage';
import { useUserAvatar } from '@/hooks/use-user-avatar';
import { type AnalysisRecord } from '@/types';
import { PLAN_NAMES, PLAN_LIMITS, planCaps, type PlanId } from '@/lib/plans';
import {
  compressImageToDataUrl,
  isAllowedAvatarType,
  MAX_AVATAR_FILE_BYTES,
} from '@/lib/profile-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Reveal } from '@/components/reveal';
import {
  FileText, Calendar, Loader, Check, Mail, ShieldAlert,
  TrendingUp, BadgeCheck, Pencil, Crown, Lock, CheckCircle2, ArrowRight, Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { doc } from 'firebase/firestore';
import { useDoc, useMemoFirebase } from '@/firebase';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const avatarSrc = useUserAvatar();

  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) setDisplayName(user.displayName || '');
  }, [user]);

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: analyses } = useCollection<AnalysisRecord>(analysesQuery);

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: account } = useDoc<{ plan?: PlanId; planEnds?: string; avatarDataUrl?: string | null }>(userDocRef);

  const storedPlan: PlanId = account?.plan ?? 'gratis';
  const subActive = storedPlan === 'gratis' || (!!account?.planEnds && new Date(account.planEnds).getTime() > Date.now());
  const plan: PlanId = subActive ? storedPlan : 'gratis';
  const caps = planCaps(plan);
  const planLimit = PLAN_LIMITS[plan];

  const shownAvatar = previewSrc || avatarSrc;
  const hasCustomAvatar = !!(previewSrc || account?.avatarDataUrl);

  const benefits = [
    { label: planLimit === Infinity ? 'Análisis ilimitados' : `${planLimit} análisis al mes`, on: true },
    { label: `${caps.trustedContacts} ${caps.trustedContacts === 1 ? 'contacto de confianza' : 'contactos de confianza'}`, on: true },
    { label: 'Informe detallado (patrones, resaltado e IA)', on: caps.detailedResults },
    { label: 'Historial de análisis guardado', on: caps.history },
    { label: 'Herramientas avanzadas', on: caps.advancedTools },
  ];

  const stats = useMemo(() => {
    const list = analyses ?? [];
    const now = new Date();
    const toDate = (r: AnalysisRecord) => {
      const ts = r.createdAt as Timestamp | undefined;
      return ts && typeof ts.toDate === 'function' ? ts.toDate() : null;
    };
    const thisMonth = list.filter((r) => {
      const d = toDate(r);
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const highRisk = list.filter((r) =>
      ['alto', 'muy alto'].includes((r.score?.risk_level || '').toLowerCase())
    ).length;
    return { total: list.length, thisMonth, highRisk };
  }, [analyses]);

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    : '—';

  const hasChanges = user && displayName !== (user.displayName || '');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user || !firestore) return;

    if (!isAllowedAvatarType(file.type)) {
      toast({ variant: 'destructive', title: 'Formato no válido', description: 'Usa una imagen JPG, PNG o WebP.' });
      return;
    }
    if (file.size > MAX_AVATAR_FILE_BYTES) {
      toast({ variant: 'destructive', title: 'Imagen muy pesada', description: 'El máximo es 2 MB.' });
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setPreviewSrc(dataUrl);
      await setAvatar(firestore, user.uid, dataUrl);
      setPreviewSrc(null);
      toast({ title: 'Foto actualizada', description: 'Tu nueva foto de perfil se guardó correctamente.' });
    } catch (err) {
      setPreviewSrc(null);
      const msg = err instanceof Error && err.message === 'too_large'
        ? 'La imagen sigue siendo muy grande tras comprimirla. Prueba con otra más simple.'
        : 'No se pudo procesar la imagen. Inténtalo con otra.';
      toast({ variant: 'destructive', title: 'Error al subir', description: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !firestore) return;
    setUploading(true);
    try {
      await setAvatar(firestore, user.uid, null);
      setPreviewSrc(null);
      toast({ title: 'Foto eliminada', description: 'Se quitó tu foto de perfil personalizada.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo quitar la foto.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast({ title: 'Perfil actualizado', description: 'Tus cambios se han guardado correctamente.' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const initial = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  const statCards = [
    { label: 'Análisis totales', value: stats.total.toString(), icon: FileText, color: 'from-primary to-violet-500' },
    { label: 'Este mes', value: stats.thisMonth.toString(), icon: TrendingUp, color: 'from-violet-500 to-purple-600' },
    { label: 'Riesgo alto', value: stats.highRisk.toString(), icon: ShieldAlert, color: 'from-rose-500 to-red-500' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">

      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
          <div className="relative h-28 overflow-hidden"
            style={{ background: 'linear-gradient(120deg, hsl(262 55% 24%) 0%, hsl(275 50% 30%) 55%, hsl(262 60% 22%) 100%)' }}
          >
            <div className="absolute top-[-60%] right-[-5%] w-56 h-56 rounded-full bg-primary/30 blur-3xl animate-breathe pointer-events-none" />
            <div className="absolute bottom-[-80%] left-[15%] w-48 h-48 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />
          </div>

          <CardContent className="px-6 pb-6 pt-0">
            <div className="-mt-12 mb-4">
              <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                <AvatarImage src={shownAvatar} alt={displayName || 'Avatar'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-3xl font-black">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900">
                {displayName || 'Completa tu nombre'}
              </h1>
              <Badge className="bg-primary/10 text-primary border-0 text-[11px] font-bold gap-1">
                <BadgeCheck className="w-3 h-3" />
                Plan {PLAN_NAMES[plan]}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              {user?.email}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              Miembro desde {memberSince}
            </p>
          </CardContent>
        </Card>
      </div>

      <Reveal as="div" className="grid grid-cols-3 gap-3 sm:gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="rounded-2xl border border-purple-100/60 shadow-sm card-lift">
            <CardContent className="p-4">
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm mb-3', color)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </Reveal>

      <Reveal as="div" delay={60}>
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-sm">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight">Plan {PLAN_NAMES[plan]}</p>
                  <p className="text-xs text-gray-400">Esto incluye tu plan actual</p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="rounded-xl border-purple-200 text-primary hover:bg-purple-50 font-semibold">
                <Link href="/dashboard/billing">
                  {plan === 'gratis' ? 'Mejorar' : 'Gestionar'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>

            <ul className="grid sm:grid-cols-2 gap-2.5">
              {benefits.map((b) => (
                <li key={b.label} className={cn('flex items-center gap-2.5 text-sm rounded-xl px-3 py-2.5 border', b.on ? 'bg-green-50/60 border-green-100 text-gray-700' : 'bg-gray-50 border-gray-100 text-gray-400')}>
                  {b.on
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <Lock className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                  <span className={cn(!b.on && 'line-through decoration-gray-300')}>{b.label}</span>
                </li>
              ))}
            </ul>

            {plan === 'gratis' && (
              <p className="text-xs text-gray-400 mt-4">
                Desbloquea el informe detallado y el historial con un plan de pago o un código promocional.
              </p>
            )}
          </CardContent>
        </Card>
      </Reveal>

      <Reveal as="div" delay={120} className="rounded-3xl overflow-hidden">
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-black">
              <Pencil className="w-4 h-4 text-primary" />
              Editar información
            </CardTitle>
            <CardDescription className="text-sm">Actualiza cómo te ve el resto de la plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nombre completo</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre"
                className="h-11 rounded-xl border-gray-200 focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">Foto de perfil</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-purple-100 flex-shrink-0">
                  <AvatarImage src={shownAvatar} alt="Foto" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-lg font-black">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-xl border-purple-200 text-primary hover:bg-purple-50 font-semibold"
                  >
                    {uploading ? (
                      <><Loader className="w-4 h-4 mr-2 animate-spin" /> Subiendo…</>
                    ) : (
                      <><Upload className="w-4 h-4 mr-2" /> Subir foto</>
                    )}
                  </Button>
                  {hasCustomAvatar && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleRemoveAvatar}
                      disabled={uploading}
                      className="rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 font-medium"
                    >
                      Quitar
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                JPG, PNG o WebP · máximo 2 MB. Se guarda comprimida en tu cuenta (sin Firebase Storage).
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">Correo electrónico</Label>
              <div className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{user?.email}</span>
                <Badge variant="outline" className="ml-auto text-[10px] border-gray-200 text-gray-400 flex-shrink-0">No editable</Badge>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 font-bold shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <><Loader className="w-4 h-4 mr-2 animate-spin" /> Guardando…</>
                ) : (
                  <><Check className="w-4 h-4 mr-2" /> Guardar cambios</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
