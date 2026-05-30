'use client';

import { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { collection, query, orderBy } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { type AnalysisRecord } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, FileText, Calendar, Loader, Check, Mail } from 'lucide-react';

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
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el perfil. Inténtalo de nuevo.' });
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    { label: 'Análisis guardados', value: analyses ? analyses.length.toString() : '—', icon: FileText },
    { label: 'Miembro desde', value: memberSince, icon: Calendar },
  ];

  return (
    <div className="space-y-7 max-w-3xl">
      {/* Header */}
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
          Mi Perfil
        </h1>
        <p className="text-sm text-gray-400 mt-1 ml-11">Gestiona tu información personal y revisa tu actividad.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border border-purple-100/60 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-lg font-black text-gray-900 capitalize truncate">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit profile */}
      <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
        <div className="h-1 bg-gradient-to-r from-primary via-violet-400 to-purple-300" />
        <CardHeader>
          <CardTitle className="text-base font-black">Información personal</CardTitle>
          <CardDescription className="text-sm">Actualiza cómo te ve el resto de la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-purple-100">
              <AvatarImage src={photoURL || ''} alt={displayName || 'Avatar'} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-xl font-black">
                {displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-gray-900">{displayName || 'Sin nombre'}</p>
              <Badge variant="secondary" className="mt-1 bg-purple-100 text-primary border-purple-200 text-xs font-semibold">
                Cuenta profesional
              </Badge>
            </div>
          </div>

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

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Correo electrónico</Label>
            <div className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email}
              <Badge variant="outline" className="ml-auto text-[10px] border-gray-200 text-gray-400">No editable</Badge>
            </div>
          </div>

          <div className="flex justify-end pt-2">
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
    </div>
  );
}
