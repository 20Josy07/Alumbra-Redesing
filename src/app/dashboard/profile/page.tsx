'use client';

import { useState, useEffect, useMemo } from 'react';
import { updateProfile } from 'firebase/auth';
import { collection, query, orderBy, type Timestamp } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { type AnalysisRecord } from '@/types';
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
  TrendingUp, BadgeCheck, Pencil,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: analyses } = useCollection<AnalysisRecord>(analysesQuery);

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

  const hasChanges =
    user && (displayName !== (user.displayName || '') || photoURL !== (user.photoURL || ''));

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim(), photoURL: photoURL.trim() });
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

      {/* ── Tarjeta de portada con avatar ── */}
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
          {/* Cover */}
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

          {/* Avatar + info */}
          <CardContent className="px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg flex-shrink-0">
                <AvatarImage src={photoURL || ''} alt={displayName || 'Avatar'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-3xl font-black">
                  {initial}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 sm:pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black text-gray-900 truncate">{displayName || 'Sin nombre'}</h1>
                  <Badge className="bg-primary/10 text-primary border-0 text-[11px] font-bold gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Profesional
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Miembro desde {memberSince}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Stats ── */}
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

      {/* ── Editar información ── */}
      <Reveal as="div" delay={80} className="rounded-3xl overflow-hidden">
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
            {/* Name */}
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

            {/* Photo URL */}
            <div className="space-y-1.5">
              <Label htmlFor="photo" className="text-sm font-semibold text-gray-700">URL de foto de perfil</Label>
              <Input
                id="photo"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://…"
                className="h-11 rounded-xl border-gray-200 focus:border-primary"
              />
              <p className="text-xs text-gray-400">Pega el enlace de una imagen para usarla como avatar.</p>
            </div>

            {/* Email read-only */}
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
