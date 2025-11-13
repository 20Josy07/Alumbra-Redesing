import { Timestamp, FieldValue } from "firebase/firestore";
import { type AnalysisResult } from "@/app/actions";

export interface AnalysisRecord extends AnalysisResult {
    id?: string;
    userId: string;
    title: string;
    originalText: string;
    createdAt: Timestamp | FieldValue;
}
