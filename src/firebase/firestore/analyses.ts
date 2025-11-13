import { Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { AnalysisRecord } from '@/types';
import type { AnalysisResult } from '@/app/actions';

interface AnalysisData extends AnalysisResult {
    title: string;
    originalText: string;
}

export async function saveAnalysis(db: Firestore, userId: string, analysisData: AnalysisData): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to save an analysis.');
  }
  
  const analysesCollection = collection(db, 'users', userId, 'analyses');

  const newAnalysis: Omit<AnalysisRecord, 'id'> = {
    userId,
    title: analysisData.title,
    originalText: analysisData.originalText,
    abuseAnalysis: analysisData.abuseAnalysis,
    summary: analysisData.summary,
    createdAt: serverTimestamp() as any, // Let Firestore handle the timestamp
  };

  await addDoc(analysesCollection, newAnalysis);
}
