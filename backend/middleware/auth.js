import { getSupabase } from '../config/supabase.js';

/**
 * Valida el JWT de Supabase con la clave `service_role` y adjunta el usuario a
 * la petición. No hace consulta adicional a la base de datos: la identidad se
 * toma del token ya verificado por Supabase.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (!token || scheme?.toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = data.user;
    req.supabase = supabase;
    return next();
  } catch (err) {
    return next(err);
  }
}

export default requireAuth;
