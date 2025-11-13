import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Environment variables are now loaded globally from `src/ai/dev.ts`

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
});
