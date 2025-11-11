'use server';

/**
 * @fileOverview Analyzes text for indicators of psychological abuse and provides a summarized list of findings.
 *
 * - analyzeTextAndSummarizeAbuseIndicators - A function that analyzes text input for indicators of psychological abuse and provides a summarized list of findings.
 * - AnalyzeTextAndSummarizeAbuseIndicatorsInput - The input type for the analyzeTextAndSummarizeAbuseIndicators function.
 * - AnalyzeTextAndSummarizeAbuseIndicatorsOutput - The return type for the analyzeTextAndSummarizeAbuseIndicators function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextAndSummarizeAbuseIndicatorsInputSchema = z.object({
  text: z
    .string()
    .describe('The text to analyze for indicators of psychological abuse.'),
});
export type AnalyzeTextAndSummarizeAbuseIndicatorsInput = z.infer<
  typeof AnalyzeTextAndSummarizeAbuseIndicatorsInputSchema
>;

const AnalyzeTextAndSummarizeAbuseIndicatorsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summarized list of the abuse indicators found in the text. If no indicators are found, it should state that no indicators were found.'
    ),
});
export type AnalyzeTextAndSummarizeAbuseIndicatorsOutput = z.infer<
  typeof AnalyzeTextAndSummarizeAbuseIndicatorsOutputSchema
>;

export async function analyzeTextAndSummarizeAbuseIndicators(
  input: AnalyzeTextAndSummarizeAbuseIndicatorsInput
): Promise<AnalyzeTextAndSummarizeAbuseIndicatorsOutput> {
  return analyzeTextAndSummarizeAbuseIndicatorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextAndSummarizeAbuseIndicatorsPrompt',
  input: {schema: AnalyzeTextAndSummarizeAbuseIndicatorsInputSchema},
  output: {schema: AnalyzeTextAndSummarizeAbuseIndicatorsOutputSchema},
  prompt: `You are an AI expert in identifying psychological abuse tactics in text. Review the following text and provide a summarized list of the abuse indicators found. If no indicators are found, clearly state that no indicators were found.\n\nText: {{{text}}}`,
});

const analyzeTextAndSummarizeAbuseIndicatorsFlow = ai.defineFlow(
  {
    name: 'analyzeTextAndSummarizeAbuseIndicatorsFlow',
    inputSchema: AnalyzeTextAndSummarizeAbuseIndicatorsInputSchema,
    outputSchema: AnalyzeTextAndSummarizeAbuseIndicatorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
