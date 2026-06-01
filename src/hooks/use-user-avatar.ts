'use client';

import { doc } from 'firebase/firestore';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';

/** Foto de perfil: prioridad Firestore (base64) → Auth (Google, etc.). */
export function useUserAvatar(): string {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );

  const { data } = useDoc<{ avatarDataUrl?: string | null }>(userDocRef);
  return data?.avatarDataUrl || user?.photoURL || '';
}
