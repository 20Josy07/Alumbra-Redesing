import { firebaseApp } from './config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useMemo } from 'react';
import type { DocumentReference, Query } from 'firebase/firestore';
import type { DependencyList } from 'react';

export function initializeFirebase() {
  const app = firebaseApp;
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export * from './provider';
export * from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';

/**
 * A hook that memoizes a Firestore query or document reference.
 * This is useful to prevent infinite loops in `useCollection` or `useDoc` when the query is created inline.
 * @param factory A function that returns a Firestore query or document reference.
 * @param deps The dependencies of the query.
 * @returns The memoized query or document reference.
 */
export function useMemoFirebase<T extends DocumentReference | Query>(
  factory: () => T | null,
  deps: DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
