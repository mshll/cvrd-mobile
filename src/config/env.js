import { GEMINI_API_KEY } from '@env';

// Validate environment variables
if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set in environment variables');
}

export const ENV = {
  GEMINI_API_KEY: GEMINI_API_KEY || '',
};
