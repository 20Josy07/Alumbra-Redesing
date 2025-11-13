import { firebaseApp } from './config';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

export function initializeFirebase() {
  const app = firebaseApp;
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export * from './provider';
export * from './auth/use-user';
