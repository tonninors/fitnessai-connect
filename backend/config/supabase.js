import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase con `service_role` compartido por todo el backend.
 *
 * Antes cada archivo de rutas creaba el suyo (5 instancias con sus propios
 * pools). Se crea de forma perezosa para que importar los routers en un test
 * no exija variables de entorno reales.
 */
let client = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno');
  }

  client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}

/** Sólo para tests: inyecta un doble y permite restaurar el estado. */
export function setSupabaseClient(mock) {
  const previous = client;
  client = mock;
  return () => { client = previous; };
}
