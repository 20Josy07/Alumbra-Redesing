'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore';

export function useDoc<T>(ref: DocumentReference<DocumentData> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (ref === null) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setData(null);
    setError(null);

    const unsubscribe = onSnapshot(ref, 
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching document:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // We disable the exhaustive-deps rule here because the ref object is memoized with useMemoFirebase
  // and including it in the dependency array would cause an infinite loop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return { data, loading, error };
}
