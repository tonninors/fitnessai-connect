import { Router } from 'express';
import { getSupabase } from '../config/supabase.js';
import { asyncHandler } from '../lib/http.js';
import { requireEmail } from '../lib/validation.js';

const router = Router();

const PAGE_SIZE = 1000;
/** Tope de páginas para no barrer la tabla entera en cada login. */
const MAX_PAGES = 10;

/**
 * Comprueba si un email está registrado en Supabase Auth.
 *
 * NOTA DE SEGURIDAD: este endpoint permite enumerar cuentas. Se mantiene
 * porque el login lo usa para distinguir "correo no registrado" de "contraseña
 * incorrecta", pero está limitado por el rate limit específico de `/api/auth`
 * (ver `app.js`). La alternativa recomendada es eliminarlo y mostrar un único
 * mensaje "correo o contraseña incorrectos".
 */
export async function emailExists(supabase, email) {
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: PAGE_SIZE });
    if (error) throw error;

    const users = data?.users ?? [];
    if (users.some(u => u.email?.toLowerCase() === email)) return true;

    // Última página: no hay más usuarios que revisar.
    if (users.length < PAGE_SIZE) return false;
  }

  // Antes se miraba sólo la primera página de 1000 usuarios y se devolvía
  // `false` en silencio; al menos ahora queda registrado.
  console.warn('[auth] check-email superó el tope de páginas; resultado no concluyente');
  return false;
}

router.post('/check-email', asyncHandler(async (req, res) => {
  const email = requireEmail(req.body?.email);
  const exists = await emailExists(getSupabase(), email);
  res.json({ exists });
}));

export default router;
