"use server";

import { analyzeTextInputForAbuse, type AnalyzeTextInputForAbuseOutput } from '@/ai/flows/analyze-text-input-for-abuse';
import { analyzeTextAndSummarizeAbuseIndicators, type AnalyzeTextAndSummarizeAbuseIndicatorsOutput } from '@/ai/flows/summarize-abuse-indicators';
import { generateWallpaper, type GenerateWallpaperOutput } from '@/ai/flows/generate-wallpaper-flow';


export interface AnalysisResult {
  abuseAnalysis: AnalyzeTextInputForAbuseOutput;
  summary: AnalyzeTextAndSummarizeAbuseIndicatorsOutput;
}

export async function performAnalysis(text: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  if (!text || text.trim().length < 20) {
    return { data: null, error: "Please enter a more detailed description (at least 20 characters)." };
  }
  
  try {
    // Run analyses in parallel for better performance
    const [abuseResult, summaryResult] = await Promise.all([
      analyzeTextInputForAbuse({ text }),
      analyzeTextAndSummarizeAbuseIndicators({ text }),
    ]);

    if (!abuseResult || !summaryResult) {
        throw new Error('One or more AI analysis flows failed to return a result.');
    }

    const result: AnalysisResult = {
      abuseAnalysis: abuseResult,
      summary: summaryResult,
    };
    
    return { data: result, error: null };
  } catch (e) {
    console.error("Error during AI analysis:", e);
    return { data: null, error: "An unexpected error occurred during analysis. Please try again later." };
  }
}

export async function performWallpaperGeneration(prompt: string): Promise<{ data: GenerateWallpaperOutput | null; error: string | null }> {
  if (!prompt || prompt.trim().length === 0) {
    return { data: null, error: "Please enter a prompt for the wallpaper." };
  }
  
  try {
    const result = await generateWallpaper({ prompt });
    return { data: result, error: null };
  } catch (e) {
    console.error("Error during wallpaper generation:", e);
    return { data: null, error: "An unexpected error occurred while generating the wallpaper. Please try again." };
  }
}
