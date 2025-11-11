'use server';
/**
 * @fileOverview Analyzes text input for indicators of psychological abuse.
 *
 * - analyzeTextInputForAbuse - Analyzes text input for indicators of psychological abuse.
 * - AnalyzeTextInputForAbuseInput - The input type for the analyzeTextInputForAbuse function.
 * - AnalyzeTextInputForAbuseOutput - The return type for the analyzeTextInputForAbuse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextInputForAbuseInputSchema = z.object({
  text: z
    .string()
    .describe(
      'The text to analyze for indicators of psychological abuse.'
    ),
});
export type AnalyzeTextInputForAbuseInput = z.infer<typeof AnalyzeTextInputForAbuseInputSchema>;

const AnalyzeTextInputForAbuseOutputSchema = z.object({
  abuseDetected: z
    .boolean()
    .describe('Whether or not psychological abuse is detected.'),
  explanation: z
    .string()
    .describe('Explanation of why abuse was or was not detected.'),
});
export type AnalyzeTextInputForAbuseOutput = z.infer<typeof AnalyzeTextInputForAbuseOutputSchema>;

export async function analyzeTextInputForAbuse(input: AnalyzeTextInputForAbuseInput): Promise<AnalyzeTextInputForAbuseOutput> {
  return analyzeTextInputForAbuseFlow(input);
}

const analyzeTextInputForAbusePrompt = ai.definePrompt({
  name: 'analyzeTextInputForAbusePrompt',
  input: {schema: AnalyzeTextInputForAbuseInputSchema},
  output: {schema: AnalyzeTextInputForAbuseOutputSchema},
  prompt: `You are an AI expert in detecting psychological abuse in text.

  Analyze the following text and determine if it contains indicators of psychological abuse. Return abuseDetected as true if psychological abuse is detected in the provided text, otherwise return false. Provide a short explanation for your determination. 

  Text: {{{text}}}`,
});

const analyzeTextInputForAbuseFlow = ai.defineFlow(
  {
    name: 'analyzeTextInputForAbuseFlow',
    inputSchema: AnalyzeTextInputForAbuseInputSchema,
    outputSchema: AnalyzeTextInputForAbuseOutputSchema,
  },
  async input => {
    const {output} = await analyzeTextInputForAbusePrompt(input);
    return output!;
  }
);
