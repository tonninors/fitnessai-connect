/**
 * Alternativas de ejercicio: selección de candidatos del catálogo, prompt para
 * la IA y parseo de su respuesta. Lógica pura y testeable.
 *
 * El usuario pide alternativas a mitad de un entrenamiento (le duele algo, la
 * máquina está ocupada), así que nada de esto puede depender de que la IA
 * responda: `fallbackAlternatives()` cubre el caso de fallo.
 */
import { extractJsonObject, normalizeExerciseName } from './plan.js';
import { compareExercises, toPercent } from './similarity.js';

/** Número máximo de alternativas que se devuelven al cliente. */
export const MAX_ALTERNATIVES = 3;

/** Candidatos que se envían al modelo: suficientes para elegir, sin inflar tokens. */
export const MAX_CANDIDATES = 8;

export const ALTERNATIVES_SYSTEM_PROMPT =
  'Eres un entrenador personal certificado. Propones sustituciones de ejercicios seguras y equivalentes. ' +
  'Respondes SOLO con JSON válido, sin texto extra y sin bloques de código markdown.';

/** Razón por defecto cuando la selección la hace el respaldo determinista. */
export const FALLBACK_REASON = 'Trabaja los mismos grupos musculares con un patrón de movimiento equivalente.';

const asArray = value => (Array.isArray(value) ? value : []);

/** Conjunto normalizado de textos (grupos musculares, equipo). */
function normalizedSet(values) {
  return new Set(asArray(values).map(v => normalizeExerciseName(v)).filter(v => v !== ''));
}

function overlapCount(a, b) {
  let count = 0;
  for (const value of a) if (b.has(value)) count += 1;
  return count;
}

/**
 * Candidatos del catálogo ordenados por similitud con `current`.
 *
 * - Mismo bloque (`exercise_type`): un estiramiento nunca sustituye a un press.
 * - Se excluye el propio ejercicio (por `id` y por nombre normalizado).
 * - El orden lo decide `compareExercises` (huella biomecánica completa), no la
 *   IA. Antes se ordenaba por solape de `muscle_groups` y, cuando el ejercicio
 *   de la sesión no estaba enlazado al catálogo, todo puntuaba 0 y el desempate
 *   alfabético proponía curls como sustituto de un remo.
 *
 * @returns {{ row: object, similarity: object }[]}
 */
export function rankCandidates(catalog, current, { limit = MAX_CANDIDATES } = {}) {
  const type = current?.exercise_type ?? 'strength';
  const currentName = normalizeExerciseName(current?.exercise_name ?? current?.name);

  return asArray(catalog)
    .filter(row => row && typeof row.name === 'string' && row.name.trim() !== '')
    .filter(row => (row.exercise_type ?? 'strength') === type)
    .filter(row => row.id !== current?.exercise_id && normalizeExerciseName(row.name) !== currentName)
    .map(row => ({ row, similarity: compareExercises(current, row) }))
    // Desempate por nombre: mismo score debe dar siempre el mismo orden.
    .sort((a, b) => (b.similarity.substitution - a.similarity.substitution)
      || a.row.name.localeCompare(b.row.name, 'es'))
    .slice(0, limit);
}

/** Solo las fichas, para construir el prompt. */
export function filterCandidates(catalog, current, options) {
  return rankCandidates(catalog, current, options).map(entry => entry.row);
}

/**
 * Prompt para redactar la razón de cada alternativa.
 *
 * Los candidatos llegan YA ordenados por el motor de similitud. La IA no
 * decide el ranking: solo explica por qué cada uno sustituye bien al original,
 * y para eso necesita ver el patrón de movimiento, no solo los músculos.
 */
export function buildAlternativesPrompt(current, candidates) {
  const muscles = asArray(current?.muscle_groups).join(', ') || 'no especificados';
  const equipment = asArray(current?.equipment).join(', ') || 'sin equipo';
  const list = asArray(candidates)
    .map((c, i) => {
      const m = asArray(c.muscle_groups).join('/');
      const e = asArray(c.equipment).length > 0 ? asArray(c.equipment).join('/') : 'sin equipo';
      return `${i + 1}. ${c.name} | ${c.movement_pattern ?? 'patrón no especificado'} | ${m} | ${e}`;
    })
    .join('\n');

  return `El usuario está entrenando y quiere sustituir este ejercicio:
- Nombre: ${current?.exercise_name ?? current?.name}
- Bloque: ${current?.exercise_type ?? 'strength'}
- Patrón de movimiento: ${current?.movement_pattern ?? 'no especificado'}
- Músculos: ${muscles}
- Equipo: ${equipment}

Candidatos disponibles, ya ordenados de mejor a peor por análisis biomecánico
(formato: nombre | patrón | músculos | equipo):
${list}

Elige entre 2 y ${MAX_ALTERNATIVES} alternativas de esa lista, respetando ese orden.
Copia el nombre EXACTAMENTE como aparece en la lista, sin inventar ejercicios.
Para cada una escribe una razón breve en español (máximo 15 palabras) que mencione
el patrón de movimiento o el músculo compartido con el original.

Responde SOLO con JSON válido:
{"alternatives":[{"name":"...","reason":"..."}]}`;
}

/**
 * Forma final de una alternativa en la respuesta del endpoint.
 *
 * `score` es el porcentaje de sustitución que ve el usuario; `breakdown` es el
 * desglose que se despliega al tocar la opción. Ambos salen del motor
 * determinista, no de la IA.
 */
export function toAlternative(row, reason, similarity = null) {
  return {
    id: row.id,
    name: row.name,
    muscle_groups: asArray(row.muscle_groups),
    equipment: asArray(row.equipment),
    image_url: row.image_url ?? null,
    video_url: row.video_url ?? null,
    description: row.description ?? null,
    reason: typeof reason === 'string' && reason.trim() !== '' ? reason.trim() : FALLBACK_REASON,
    score: toPercent(similarity?.substitution ?? null),
    breakdown: similarity
      ? {
        muscular: toPercent(similarity.muscular),
        biomecanica: toPercent(similarity.mechanical),
        fatiga: toPercent(similarity.fatigue),
      }
      : null,
  };
}

/**
 * Selección sin IA: los primeros candidatos del ranking determinista.
 *
 * Es lo que se sirve si Groq falla. Como el orden ya lo decide el motor de
 * similitud, un fallo de la IA solo cuesta la redacción de la razón, nunca la
 * calidad del emparejamiento.
 *
 * @param {{row: object, similarity: object}[]} ranked
 */
export function fallbackAlternatives(ranked, { limit = MAX_ALTERNATIVES } = {}) {
  return asArray(ranked).slice(0, limit)
    .map(entry => toAlternative(entry.row, FALLBACK_REASON, entry.similarity));
}

/**
 * Parsea la respuesta del modelo y la resuelve contra los candidatos.
 *
 * Sólo se aceptan nombres que estén en la lista enviada: la IA no puede colar
 * un ejercicio inexistente ni uno de otro bloque. Y el orden final lo sigue
 * marcando el ranking, no ella: aquí solo aporta la razón.
 * Devuelve `[]` si no hay nada aprovechable (el llamador usa el respaldo).
 *
 * @param {{row: object, similarity: object}[]} ranked
 */
export function parseAlternatives(text, ranked) {
  const parsed = extractJsonObject(text);
  const list = Array.isArray(parsed?.alternatives) ? parsed.alternatives : [];
  if (list.length === 0) return [];

  const index = new Map();
  for (const entry of asArray(ranked)) {
    const key = normalizeExerciseName(entry?.row?.name);
    if (key !== '' && !index.has(key)) index.set(key, entry);
  }

  const seen = new Set();
  const result = [];

  for (const item of list) {
    if (result.length >= MAX_ALTERNATIVES) break;
    const name = typeof item?.name === 'string' ? item.name : '';
    const entry = index.get(normalizeExerciseName(name));
    if (!entry || seen.has(entry.row.id)) continue;
    seen.add(entry.row.id);
    result.push(toAlternative(entry.row, item?.reason, entry.similarity));
  }

  // La IA puede devolverlas en cualquier orden; manda el score del motor.
  return result.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
