"use server";

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Environment variables are now loaded globally from `src/ai/dev.ts`

// Define schemas and types directly in the action file
const AbuseAnalysisSchema = z.object({
  abuseDetected: z.boolean().describe('Indica si se detectó abuso psicológico.'),
  explanation: z.string().describe('Una explicación de por qué se detectó o no el abuso.'),
});
export type AnalyzeTextInputForAbuseOutput = z.infer<typeof AbuseAnalysisSchema>;

const SummarySchema = z.object({
  summary: z.string().describe('Una lista resumida de los indicadores de abuso encontrados en el texto. Si no se encuentran indicadores, debe indicar que no se encontraron.'),
});
export type AnalyzeTextAndSummarizeAbuseIndicatorsOutput = z.infer<typeof SummarySchema>;

export interface AnalysisResult {
  abuseAnalysis: AnalyzeTextInputForAbuseOutput;
  summary: AnalyzeTextAndSummarizeAbuseIndicatorsOutput;
}

export async function performAnalysis(text: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  if (!text || text.trim().length < 20) {
    return { data: null, error: "Por favor, introduce una descripción más detallada (al menos 20 caracteres)." };
  }
  
  try {
    const abuseAnalysisFlow = ai.defineFlow(
      {
        name: 'abuseAnalysisFlow',
        inputSchema: z.string(),
        outputSchema: AbuseAnalysisSchema,
      },
      async (text) => {
        const prompt = `Eres un experto en IA para detectar abuso psicológico en textos. Analiza el siguiente texto y determina si contiene indicadores de abuso psicológico. Responde con abuseDetected como true si se detecta abuso, de lo contrario, false. Proporciona una breve explicación en español. Texto: ${text}`;
        
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
         const prompt = `Eres un experto en IA para identificar tácticas de abuso psicológico en textos. Revisa el siguiente texto y proporciona una lista resumida en español de los indicadores de abuso encontrados. Si no se encuentran indicadores, indícalo claramente. Texto: ${text}`;

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
        throw new Error('Uno o más flujos de análisis de IA no devolvieron un resultado.');
    }

    const result: AnalysisResult = {
      abuseAnalysis: abuseResult,
      summary: summaryResult,
    };
    
    return { data: result, error: null };
  } catch (e: any) {
    console.error("Error during AI analysis:", e);
    const errorMessage = e.message || "Ocurrió un error inesperado durante el análisis. Por favor, inténtalo más tarde.";
    return { data: null, error: errorMessage };
  }
}
