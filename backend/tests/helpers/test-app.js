import { createApp } from '../../app.js';
import { setSupabaseClient } from '../../config/supabase.js';
import { setGroqClient } from '../../lib/groq.js';
import { createSupabaseMock, TEST_USER } from './supabase-mock.js';

export const VALID_TOKEN = 'token-valido';

/**
 * Levanta la app real con Supabase y Groq sustituidos por dobles.
 * Devuelve `{ app, supabase, groq, restore }`; llama a `restore()` en afterEach.
 */
export function createTestApp({
  resolver = () => ({ data: null, error: null }),
  user = TEST_USER,
  groqReply = 'Respuesta de prueba',
} = {}) {
  const supabase = createSupabaseMock(resolver);

  supabase.auth.getUser = async (token) => (
    token === VALID_TOKEN
      ? { data: { user }, error: null }
      : { data: { user: null }, error: { message: 'invalid token' } }
  );

  const groq = {
    calls: [],
    chat: {
      completions: {
        create: async (params) => {
          groq.calls.push(params);
          if (typeof groqReply === 'function') return groqReply(params);
          return { choices: [{ message: { content: groqReply } }] };
        },
      },
    },
  };

  const restoreSupabase = setSupabaseClient(supabase);
  const restoreGroq = setGroqClient(groq);

  return {
    app: createApp({ env: { ...process.env, NODE_ENV: 'test' } }),
    supabase,
    groq,
    restore() { restoreSupabase(); restoreGroq(); },
  };
}

/** Cabecera de autorización con el token que el doble acepta. */
export const authHeader = { Authorization: `Bearer ${VALID_TOKEN}` };
