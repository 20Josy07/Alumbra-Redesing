import { config } from 'dotenv';
config();

// We import flows here to register them with Genkit's dev UI
import '@/ai/flows/generate-wallpaper-flow';

// The analysis flows are now defined directly in `src/app/actions.ts`
// and don't need to be registered here for development.
