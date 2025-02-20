import { GEMINI_API_KEY } from '@env';

// Debug environment variables
console.log('Environment Variables Debug:');
console.log(
  'GEMINI_API_KEY:',
  GEMINI_API_KEY ? 'Present (starts with: ' + GEMINI_API_KEY.substring(0, 8) + '...)' : 'Missing'
);

// Validate environment variables
if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set in environment variables');
}

export const ENV = {
  GEMINI_API_KEY: GEMINI_API_KEY || '',
};
