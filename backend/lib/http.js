/**
 * Helpers de transporte HTTP compartidos por todas las rutas.
 */

/** Error de dominio con status HTTP asociado. */
export class HttpError extends Error {
  constructor(status, message, { code, cause } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    if (code) this.code = code;
    if (cause) this.cause = cause;
  }
}

export const badRequest   = (msg, opts) => new HttpError(400, msg, opts);
export const forbidden    = (msg = 'Sin acceso', opts) => new HttpError(403, msg, opts);
export const notFound     = (msg = 'No encontrado', opts) => new HttpError(404, msg, opts);

/**
 * Envuelve un handler async para que cualquier rechazo llegue al middleware de
 * errores de Express en lugar de convertirse en un unhandled rejection (que en
 * Node >= 15 termina el proceso).
 */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/**
 * Traduce un error de PostgREST/Supabase a un `HttpError`.
 * `PGRST116` = "no rows returned" con `.single()` → 404 en lugar de 400.
 */
export function fromSupabaseError(error, { notFoundMessage = 'No encontrado' } = {}) {
  if (!error) return null;
  if (error.code === 'PGRST116') return new HttpError(404, notFoundMessage, { code: error.code });
  return new HttpError(400, error.message || 'Error de base de datos', { code: error.code });
}

/** Lanza si `error` viene informado. Uso: `throwOnSupabaseError(error)`. */
export function throwOnSupabaseError(error, opts) {
  const httpError = fromSupabaseError(error, opts);
  if (httpError) throw httpError;
}
