import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * This is the central configuration for Genkit.
 * It creates a global 'ai' object that is configured with the necessary plugins.
 * This object should be imported and used by all other AI-related flows and actions.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY }),
  ],
});
