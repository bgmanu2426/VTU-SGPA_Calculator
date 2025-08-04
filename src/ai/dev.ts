import { config } from 'dotenv';
config();

import '@/ai/flows/extract-marksheet-data.ts';
import '@/ai/flows/validate-extracted-data.ts';