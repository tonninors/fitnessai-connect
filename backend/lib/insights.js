/**
 * Prompts de los insights de IA y normalización del tipo antes de persistir.
 */

export const INSIGHT_SYSTEM_PROMPT =
  'Eres un entrenador personal certificado experto. Responde siempre en español, ' +
  'de forma concisa (máximo 2 frases), motivadora y accionable.';

export const INSIGHT_TYPES = [
  'recovery',
  'workout_ready',
  'strength_progression',
  'live_feedback',
  'volume_adjustment',
];

export const DEFAULT_INSIGHT_TYPE = 'workout_ready';

/**
 * `ai_insights.type` tiene un CHECK en la base de datos que no incluye
 * `workout_ready` ni `live_feedback`. Sin este mapeo el INSERT fallaba en
 * silencio (era fire-and-forget) y ningún insight quedaba registrado.
 */
const DB_TYPE_BY_PROMPT_TYPE = {
  recovery: 'recovery',
  workout_ready: 'general',
  strength_progression: 'strength_progression',
  live_feedback: 'hr_zone',
  volume_adjustment: 'volume_adjustment',
};

export function toDbInsightType(type) {
  return DB_TYPE_BY_PROMPT_TYPE[type] ?? 'general';
}

/** Serializa el contexto evitando volcar objetos gigantes en el prompt. */
function safeContext(context) {
  try {
    const json = JSON.stringify(context ?? {});
    return json.length > 1500 ? `${json.slice(0, 1500)}…` : json;
  } catch {
    return '{}';
  }
}

/**
 * Prompt de usuario para cada tipo de insight.
 * Si el tipo no se reconoce se usa `workout_ready` (comportamiento histórico).
 */
export function buildInsightPrompt(type, context, profile) {
  const ctx = safeContext(context);
  const name = profile?.full_name ?? 'El usuario';
  const streak = profile?.current_streak ?? 0;

  const prompts = {
    recovery: `${name} tiene racha de ${streak} días. Datos biométricos: ${ctx}. Da un consejo de recuperación.`,
    workout_ready: `Datos de hoy: ${ctx}. Genera un mensaje motivador y útil antes del entrenamiento.`,
    strength_progression: `Progreso de fuerza: ${ctx}. Analiza la tendencia y sugiere ajuste de carga.`,
    live_feedback: `FC: ${context?.hr_bpm} bpm, zona objetivo: ${context?.target_zone}. Da feedback breve en tiempo real.`,
    volume_adjustment: `HRV bajó ${context?.hrv_drop_pct}% vs ayer. Recomienda ajuste de volumen para hoy.`,
  };

  return prompts[type] ?? prompts[DEFAULT_INSIGHT_TYPE];
}
