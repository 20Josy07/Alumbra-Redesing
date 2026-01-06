import { Timestamp, FieldValue } from "firebase/firestore";

export interface AnalysisRules {
    severe_insults_detected: string[];
    insults_detected: string[];
    control_detected: string[];
    gaslighting_detected: string[];
    threats_detected: string[];
    severe_insult_count: number;
    insult_count: number;
    control_count: number;
    gaslighting_count: number;
    threat_count: number;
}

export interface AnalysisScore {
    score_raw: number;
    score_percent: number;
    risk_level: "bajo" | "medio" | "alto" | "muy alto";
    message: string;
}

export interface AnalysisHelp {
    title: string;
    message: string;
}

export interface AnalysisResult {
    rules: AnalysisRules;
    score: AnalysisScore;
    help: AnalysisHelp;
}

export interface AnalysisRecord extends AnalysisResult {
    id?: string;
    userId: string;
    title: string;
    originalText: string;
    createdAt: Timestamp | FieldValue;
}
