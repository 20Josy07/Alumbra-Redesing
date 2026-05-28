'use client';
import { Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { AnalysisRecord, AnalysisResult } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface AnalysisData extends AnalysisResult {
    title: string;
    originalText: string;
}

export async function saveAnalysis(db: Firestore, userId: string, analysisData: AnalysisData) {
  if (!userId) {
    throw new Error('User ID is required to save an analysis.');
  }
  
  const analysesCollection = collection(db, 'users', userId, 'analyses');

  const newAnalysis: Omit<AnalysisRecord, 'id'> = {
    userId,
    title: analysisData.title,
    originalText: analysisData.originalText,
    rules: analysisData.rules,
    score: analysisData.score,
    help: analysisData.help,
    ai_suggestion: analysisData.ai_suggestion,
    createdAt: serverTimestamp(),
  };

  try {
    return await addDoc(analysesCollection, newAnalysis);
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: analysesCollection.path,
      operation: 'create',
      requestResourceData: newAnalysis,
      originalError: serverError,
    } satisfies SecurityRuleContext);

    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  }
}
