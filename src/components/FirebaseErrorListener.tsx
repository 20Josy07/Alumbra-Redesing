'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      if (process.env.NODE_ENV === 'development') {
        // Keep detailed diagnostics visible while developing.
        console.error(error);
        return;
      }

      // In production we report the error without breaking the app shell.
      console.error('Firestore permission error:', error);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
