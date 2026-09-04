import dotenv from 'dotenv';

dotenv.config();

// `createApp` se importa después de cargar el .env porque los routers leen
// variables de entorno al inicializarse.
const { createApp } = await import('./app.js');

const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`[api] Faltan variables de entorno obligatorias: ${missing.join(', ')}`);
  process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
  console.warn('[api] GROQ_API_KEY no está definida: los endpoints de IA responderán 503.');
}

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`FitnessAI API → http://localhost:${PORT}`));
