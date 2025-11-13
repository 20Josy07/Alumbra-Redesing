"use server";

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define schemas and types directly in the action file
const AbuseAnalysisSchema = z.object({
  abuseDetected: z.boolean().describe('Whether or not psychological abuse is detected.'),
  explanation: z.string().describe('Explanation of why abuse was or was not detected.'),
});
export type AnalyzeTextInputForAbuseOutput = z.infer<typeof AbuseAnalysisSchema>;

const SummarySchema = z.object({
  summary: z.string().describe('A summarized list of the abuse indicators found in the text. If no indicators are found, it should state that no indicators were found.'),
});
export type AnalyzeTextAndSummarizeAbuseIndicatorsOutput = z.infer<typeof SummarySchema>;

export interface AnalysisResult {
  abuseAnalysis: AnalyzeTextInputForAbuseOutput;
  summary: AnalyzeTextAndSummarizeAbuseIndicatorsOutput;
}

export async function performAnalysis(text: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  if (!text || text.trim().length < 20) {
    return { data: null, error: "Please enter a more detailed description (at least 20 characters)." };
  }
  
  try {
    const abuseAnalysisFlow = ai.defineFlow(
      {
        name: 'abuseAnalysisFlow',
        inputSchema: z.string(),
        outputSchema: AbuseAnalysisSchema,
      },
      async (text) => {
        const prompt = `You are an AI expert in detecting psychological abuse in text. Analyze the following text and determine if it contains indicators of psychological abuse. Return abuseDetected as true if psychological abuse is detected, otherwise return false. Provide a short explanation. Text: ${text}`;
        
        const { output } = await ai.generate({
          prompt,
          model: 'googleai/gemini-2.5-flash',
          output: { schema: AbuseAnalysisSchema },
        });
        return output!;
      }
    );

    const summaryFlow = ai.defineFlow(
      {
        name: 'summaryFlow',
        inputSchema: z.string(),
        outputSchema: SummarySchema,
      },
      async (text) => {
         const prompt = `You are an AI expert in identifying psychological abuse tactics in text. Review the following text and provide a summarized list of the abuse indicators found. If no indicators are found, clearly state that. Text: ${text}`;

        const { output } = await ai.generate({
          prompt,
          model: 'googleai/gemini-2.5-flash',
          output: { schema: SummarySchema },
        });
        return output!;
      }
    );

    // Run analyses in parallel
    const [abuseResult, summaryResult] = await Promise.all([
      abuseAnalysisFlow(text),
      summaryFlow(text),
    ]);

    if (!abuseResult || !summaryResult) {
        throw new Error('One or more AI analysis flows failed to return a result.');
    }

    const result: AnalysisResult = {
      abuseAnalysis: abuseResult,
      summary: summaryResult,
    };
    
    return { data: result, error: null };
  } catch (e: any) {
    console.error("Error during AI analysis:", e);
    const errorMessage = e.message || "An unexpected error occurred during analysis. Please try again later.";
    return { data: null, error: errorMessage };
  }
}
