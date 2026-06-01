import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;

export function getAdminFirestore(): Firestore | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;

  if (!adminApp) {
    try {
      const serviceAccount = JSON.parse(raw);
      adminApp = getApps().length
        ? getApps()[0]
        : initializeApp({ credential: cert(serviceAccount) });
    } catch {
      return null;
    }
  }

  return getFirestore(adminApp);
}
