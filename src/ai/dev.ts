
import { config } from 'dotenv';
config({ path: '.env' });

// We import flows here to register them with Genkit's dev UI
import './analysis-flow';
