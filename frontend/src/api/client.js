import { createClient } from '@supabase/supabase-js';

// ── Supabase (auth + realtime) ──────────────────────────────────
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// ── Cliente REST ────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || '/api';

/** Tiempo máximo por petición: evita spinners eternos si el backend no responde. */
export const REQUEST_TIMEOUT_MS = 30_000;

async function request(path, { method = 'GET', body, signal } = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  // `AbortSignal.timeout` no existe en navegadores antiguos ni en algunos
  // entornos de test: se cae a la petición sin timeout.
  const timeoutSignal = signal
    ?? (typeof AbortSignal !== 'undefined' && AbortSignal.timeout
      ? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      : undefined);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: timeoutSignal,
    });
  } catch (err) {
    if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
      throw new Error('La petición tardó demasiado. Revisa tu conexión.');
    }
    throw new Error('No se pudo conectar con el servidor.');
  }

  if (!res.ok) {
    // El backend devuelve `{ error }`; ante un 502 de un proxy puede llegar
    // HTML, así que se cae al statusText en vez de reventar el JSON.parse.
    const payload = await res.json().catch(() => null);
    const error = new Error(payload?.error || res.statusText || 'Request failed');
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body: body ?? {} }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body: body ?? {} }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
