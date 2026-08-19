// Entorno mínimo para que los módulos que leen process.env no fallen al
// importarse. Ningún test toca servicios reales.
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key';
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'test-groq-key';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
process.env.APP_TIMEZONE = process.env.APP_TIMEZONE || 'UTC';
process.env.GROQ_RETRY_DELAYS_MS = process.env.GROQ_RETRY_DELAYS_MS || '1,1';
