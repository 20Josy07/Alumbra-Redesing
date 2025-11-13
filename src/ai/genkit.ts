import {genkit, Model} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Environment variables are now loaded globally from `src/ai/dev.ts`

export const gemini25Flash = googleAI('gemini-2.5-flash');

// We are no longer exporting a pre-configured `ai` object.
// Configuration will happen on-demand within server actions.
