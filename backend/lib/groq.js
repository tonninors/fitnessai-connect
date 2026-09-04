import Groq from 'groq-sdk';
import { HttpError } from './http.js';

/**
 * Backoff entre reintentos ante 429 (ms).
 * `GROQ_RETRY_DELAYS_MS` permite acortarlo en tests o ajustarlo en producción.
 */
export const RETRY_DELAYS_MS = (process.env.GROQ_RETRY_DELAYS_MS || '2000,5000')
  .split(',')
  .map(v => Number(v.trim()))
  .filter(v => Number.isFinite(v) && v >= 0);

export const MODEL = 'openai/gpt-oss-120b';

let client = null;

/** Cliente Groq perezoso: importar el router no exige tener la API key. */
export function getGroq() {
  if (client) return client;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new HttpError(503, 'El servicio de IA no está configurado.');
  client = new Groq({ apiKey });
  return client;
}

/** Sólo para tests: inyecta un doble y devuelve la función para restaurar. */
export function setGroqClient(mock) {
  const previous = client;
  client = mock;
  return () => { client = previous; };
}

export function isRateLimitError(err) {
  return err?.status === 429
    || err?.message?.includes('Too Many Requests')
    || err?.message?.includes('rate_limit');
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Llama al modelo con reintentos ante 429.
 * Traduce el rate limit agotado a un `HttpError` 429 con mensaje para el
 * usuario y cualquier otro fallo del proveedor a un 502.
 */
export async function chat(messages, { maxTokens = 120, retries = RETRY_DELAYS_MS.length, delays = RETRY_DELAYS_MS } = {}) {
  const groq = getGroq();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await groq.chat.completions.create({
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      });
      const content = res?.choices?.[0]?.message?.content;
      if (typeof content !== 'string' || content.trim() === '') {
        throw new HttpError(502, 'El servicio de IA devolvió una respuesta vacía.');
      }
      return content;
    } catch (err) {
      if (err instanceof HttpError) throw err;

      if (isRateLimitError(err)) {
        if (attempt < retries) {
          await sleep(delays[attempt] ?? delays[delays.length - 1]);
          continue;
        }
        throw new HttpError(429, 'El servicio de IA está muy ocupado. Espera unos segundos e inténtalo de nuevo.');
      }

      throw new HttpError(502, 'El servicio de IA no está disponible ahora mismo.', { cause: err });
    }
  }

  throw new HttpError(502, 'El servicio de IA no está disponible ahora mismo.');
}
