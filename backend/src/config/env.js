import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
};

// Validate Critical Environment Variables for Production Hardening
if (!ENV.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is missing in environment variables. The server cannot start.');
  process.exit(1);
}

if (ENV.NODE_ENV === 'production' && ENV.JWT_SECRET === 'fallback_secret') {
  console.warn('WARNING: Running in production with a fallback JWT secret is insecure. Please set JWT_SECRET.');
}
