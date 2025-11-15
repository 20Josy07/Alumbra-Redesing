'use server';
/**
 * @fileOverview This file contains the Genkit flow for analyzing text for psychological abuse.
 *
 * - analyzeText - A function that takes a text and returns a comprehensive analysis.
 * - AnalysisResult - The output type for the analysis flow.
 */

import { ai } from './genkit'; // Import the configured 'ai' object
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

// Define the consolidated output schema for the analysis.
const AnalysisResultSchema = z.object({
  abuseAnalysis: z.object({
    abuseDetected: z.boolean().describe('Indica si se detectó abuso psicológico.'),
    explanation: z.string().describe('Una explicación en español de por qué se detectó o no el abuso.'),
  }),
  summary: z.object({
      summary: z.string().describe('Una lista resumida en español de los indicadores de abuso encontrados. Si no se encuentran, debe indicar que no se encontraron.'),
  })
});

// Export the TypeScript type for use in other parts of the application.
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// This is the main function that will be called by server actions.
export async function analyzeText(text: string): Promise<AnalysisResult> {
  return analysisFlow(text);
}

// Define the Genkit flow.
const analysisFlow = ai.defineFlow(
  {
    name: 'analysisFlow',
    inputSchema: z.string(),
    outputSchema: AnalysisResultSchema,
  },
  async (text) => {
    
    const prompt = `
      Eres un experto en IA altamente especializado en detectar abuso psicológico y emocional en textos.
      Tu tarea es analizar el siguiente texto y proporcionar una evaluación estructurada en formato JSON.

      El análisis debe incluir dos partes principales:
      1.  **Detección de Abuso (abuseAnalysis)**: Determina si el texto contiene indicadores de abuso.
          -   \`abuseDetected\`: Responde 'true' si se detecta cualquier forma de abuso psicológico (gaslighting, manipulación, control, etc.), de lo contrario, 'false'.
          -   \`explanation\`: Proporciona una explicación clara y concisa en español sobre tu determinación. Si detectas abuso, menciona qué tipo de tácticas identificaste. Si no, explica por qué el texto no parece contener abuso.

      2.  **Resumen (summary)**:
          -   \`summary\`: Crea una lista resumida y fácil de entender de los indicadores o tácticas de abuso encontradas. Si no encuentras ninguna, indícalo explícitamente diciendo "No se encontraron indicadores claros de abuso en el texto analizado.".

      Analiza el siguiente texto:
      ---
      ${text}
      ---
    `;

    const { output } = await ai.generate({
      prompt,
      model: googleAI('gemini-pro'),
      output: { schema: AnalysisResultSchema },
      config: {
        safetySettings: [
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE'
            }
        ]
      }
    });

    return output!;
  }
);
