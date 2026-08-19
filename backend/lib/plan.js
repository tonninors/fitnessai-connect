/**
 * Construcción del prompt del plan, extracción/validación del JSON devuelto
 * por la IA y mapeo a filas de base de datos. Lógica pura y testeable.
 */
import { badRequest } from './http.js';
import { addDays } from './dates.js';

export const EXERCISE_TYPES = ['warmup', 'strength', 'cardio', 'cooldown'];

/** Split recomendado según frecuencia semanal. */
export const SPLIT_GUIDE = {
  2: 'Full Body A / Full Body B — varía el enfoque de compuestos (día A: dominante de empuje; día B: dominante de jalón/piernas). 8-9 ejercicios de fuerza por sesión.',
  3: 'Push / Pull / Legs — día 1 empuje (pecho, hombros, tríceps), día 2 jalón (espalda, bíceps), día 3 piernas (cuádriceps, isquios, glúteos). 5-6 ejercicios de fuerza por sesión.',
  4: 'Upper A / Lower A / Upper B / Lower B — alterna tren superior e inferior. Upper A enfatiza press horizontal; Upper B press vertical y jalones. 5-6 ejercicios de fuerza por sesión.',
  5: 'Push / Pull / Legs / Upper / Lower — cubre todos los grupos 1.5× por semana. 5 ejercicios de fuerza por sesión para controlar volumen.',
  6: 'Push / Pull / Legs / Push / Pull / Legs — doble frecuencia por grupo muscular. Día 1 y 4 empuje; 2 y 5 jalón; 3 y 6 piernas. 4-5 ejercicios de fuerza por sesión.',
};

/** Distribución de las sesiones dentro de la semana (offset en días). */
export const DAY_OFFSETS = {
  1: [0],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
};

export const DEFAULT_DAYS_PER_WEEK = 3;
export const MIN_DAYS_PER_WEEK = 1;
export const MAX_DAYS_PER_WEEK = 6;

/** Normaliza `days_per_week` a un entero soportado por el generador. */
export function normalizeDaysPerWeek(value) {
  const num = parseInt(value, 10);
  if (!Number.isFinite(num)) return DEFAULT_DAYS_PER_WEEK;
  return Math.min(Math.max(num, MIN_DAYS_PER_WEEK), MAX_DAYS_PER_WEEK);
}

export function splitGuideFor(days) {
  return SPLIT_GUIDE[days] ?? SPLIT_GUIDE[DEFAULT_DAYS_PER_WEEK];
}

export function dayOffsetsFor(days) {
  return DAY_OFFSETS[days] ?? DAY_OFFSETS[DEFAULT_DAYS_PER_WEEK];
}

export const PLAN_SYSTEM_PROMPT =
  'Eres un entrenador personal certificado. Crea planes de entrenamiento en JSON estructurado y válido. ' +
  'Responde SOLO con JSON, sin texto extra, sin bloques de código markdown.';

/** Prompt de usuario para `POST /api/ai/generate-plan`. */
export function buildPlanPrompt({
  goals,
  daysNum,
  fitness_level,
  equipment,
  focus_areas,
  cardio_minutes = 15,
}) {
  const cardioBlock = cardio_minutes === 0
    ? 'NO incluir este bloque'
    : `1 ejercicio cardiovascular variado (corre, escaladora, bicicleta estática, remo ergómetro) con duration_seconds: ${cardio_minutes * 60}, sets: 1. Sin reps ni weight_kg. Intensidad: objetivo ganar músculo → ligero; objetivo perder grasa → moderado-intenso.`;

  return `Crea un plan de entrenamiento de 4 semanas. Genera EXACTAMENTE ${daysNum} sesiones (semana 1):
- Objetivo: ${goals}
- Días por semana: ${daysNum}
- Nivel: ${fitness_level}
- Equipo disponible: ${equipment}
- Áreas de enfoque: ${focus_areas}

DISTRIBUCIÓN DE SESIONES (obligatoria):
${splitGuideFor(daysNum)}

REGLAS OBLIGATORIAS POR SESIÓN:
1. Cada sesión tiene exactamente 4 bloques ordenados:
   a) CALENTAMIENTO (exercise_type: "warmup"): 3 ejercicios de movilidad articular ESPECÍFICOS para los músculos que se trabajan ese día. duration_seconds: 30-60, sets: 1. Sin reps ni weight_kg.
   b) BLOQUE PRINCIPAL (exercise_type: "strength"): ejercicios ÚNICOS en cada sesión, nunca repetir el mismo ejercicio en dos días de la semana. Orden: primero compuestos multiarticulares (más pesados), luego secundarios, al final aislamientos. Descansos: compuestos pesados (sentadilla, peso muerto, press banca, remo) → rest_seconds: 150-180; compuestos secundarios → rest_seconds: 90-120; aislamientos → rest_seconds: 60.
   c) CARDIO (exercise_type: "cardio"): ${cardioBlock}
   d) ESTIRAMIENTO (exercise_type: "cooldown"): 3 estiramientos estáticos ESPECÍFICOS para los músculos trabajados ese día. duration_seconds: 30-45, sets: 1. Sin reps ni weight_kg.
2. Nivel ${fitness_level}: principiante → ejercicios básicos, menos series, pesos moderados; intermedio → variaciones, progresión ondulada; avanzado → técnicas avanzadas, alta intensidad.
3. NUNCA repetir el mismo ejercicio de fuerza en dos sesiones distintas del plan.

Responde SOLO con JSON válido, sin texto extra, sin markdown:
{
  "name": "...",
  "description": "...",
  "focus_areas": [...],
  "sessions": [
    {
      "name": "Nombre descriptivo del día (ej: Push A — Pecho y Hombros)",
      "day_order": 1,
      "estimated_duration": 60,
      "estimated_calories": 350,
      "rpe_target": 7,
      "focus_areas": ["músculo1", "músculo2"],
      "exercises": [
        { "exercise_type": "warmup",   "exercise_name": "...", "sets": 1, "duration_seconds": 45 },
        { "exercise_type": "warmup",   "exercise_name": "...", "sets": 1, "duration_seconds": 45 },
        { "exercise_type": "warmup",   "exercise_name": "...", "sets": 1, "duration_seconds": 30 },
        { "exercise_type": "strength", "exercise_name": "...", "sets": 4, "reps": 6,  "weight_kg": 0, "rest_seconds": 180 },
        { "exercise_type": "strength", "exercise_name": "...", "sets": 3, "reps": 10, "weight_kg": 0, "rest_seconds": 120 },
        { "exercise_type": "strength", "exercise_name": "...", "sets": 3, "reps": 12, "weight_kg": 0, "rest_seconds": 60 },
        { "exercise_type": "cooldown", "exercise_name": "...", "sets": 1, "duration_seconds": 40 },
        { "exercise_type": "cooldown", "exercise_name": "...", "sets": 1, "duration_seconds": 40 },
        { "exercise_type": "cooldown", "exercise_name": "...", "sets": 1, "duration_seconds": 30 }
      ]
    }
  ]
}`;
}

/**
 * Extrae el primer objeto JSON balanceado del texto de la IA.
 * Tolera bloques markdown y prosa alrededor (incluidas llaves sueltas al final,
 * que rompían el `match(/\{[\s\S]*\}/)` original por ser greedy).
 */
export function extractJsonObject(text) {
  if (typeof text !== 'string') return null;
  const cleaned = text.replace(/```(?:json)?/gi, '');

  const start = cleaned.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(cleaned.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

/**
 * Valida la forma mínima del plan devuelto por la IA antes de escribir en BD.
 * Sin esto, un JSON incompleto provocaba un fallo de NOT NULL en Postgres y un
 * 400 con el mensaje crudo de la base de datos.
 */
export function validatePlan(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw badRequest('La IA devolvió un formato inválido. Intenta de nuevo.');
  }
  if (typeof parsed.name !== 'string' || parsed.name.trim() === '') {
    throw badRequest('La IA no devolvió un nombre de plan válido. Intenta de nuevo.');
  }
  if (!Array.isArray(parsed.sessions) || parsed.sessions.length === 0) {
    throw badRequest('La IA no devolvió sesiones para el plan. Intenta de nuevo.');
  }

  const sessions = parsed.sessions
    .filter(s => s && typeof s === 'object' && typeof s.name === 'string' && s.name.trim() !== '')
    .map((session, index) => ({
      ...session,
      name: session.name.trim(),
      day_order: Number.isInteger(session.day_order) && session.day_order > 0 ? session.day_order : index + 1,
      exercises: Array.isArray(session.exercises) ? session.exercises : [],
    }));

  if (sessions.length === 0) {
    throw badRequest('La IA no devolvió sesiones válidas. Intenta de nuevo.');
  }

  return {
    name: parsed.name.trim(),
    description: typeof parsed.description === 'string' ? parsed.description.trim() : null,
    focus_areas: Array.isArray(parsed.focus_areas) ? parsed.focus_areas.filter(a => typeof a === 'string') : [],
    sessions,
  };
}

/** Fecha programada de una sesión según su `day_order` y la frecuencia semanal. */
export function scheduledDateFor(startDate, dayOrder, daysNum) {
  const offsets = dayOffsetsFor(daysNum);
  const offset = offsets[dayOrder - 1] ?? (dayOrder - 1);
  return addDays(startDate, offset);
}

/** Fila de `workout_sessions` a partir de una sesión del JSON de la IA. */
export function toSessionRow(session, { planId, userId, startDate, daysNum, weekNumber = 1 }) {
  return {
    plan_id: planId,
    user_id: userId,
    name: session.name,
    scheduled_date: scheduledDateFor(startDate, session.day_order, daysNum),
    estimated_duration: Number.isFinite(session.estimated_duration) ? session.estimated_duration : null,
    estimated_calories: Number.isFinite(session.estimated_calories) ? session.estimated_calories : null,
    rpe_target: Number.isInteger(session.rpe_target) && session.rpe_target >= 1 && session.rpe_target <= 10
      ? session.rpe_target
      : null,
    focus_areas: Array.isArray(session.focus_areas) ? session.focus_areas : [],
    week_number: weekNumber,
    day_order: session.day_order,
    ai_insight: `Sesión generada por IA · ${session.name}`,
  };
}

/** Filas de `session_exercises` para una sesión ya persistida. */
export function toExerciseRows(exercises, sessionId) {
  return (Array.isArray(exercises) ? exercises : [])
    .filter(ex => ex && typeof ex.exercise_name === 'string' && ex.exercise_name.trim() !== '')
    .map((ex, idx) => ({
      session_id: sessionId,
      exercise_name: ex.exercise_name.trim(),
      order_num: idx + 1,
      // `sets` es NOT NULL en el schema: nunca lo dejamos nulo.
      sets: Number.isInteger(ex.sets) && ex.sets > 0 ? ex.sets : 1,
      reps: Number.isInteger(ex.reps) ? ex.reps : null,
      weight_kg: Number.isFinite(ex.weight_kg) ? ex.weight_kg : null,
      rest_seconds: Number.isInteger(ex.rest_seconds) ? ex.rest_seconds : null,
      duration_seconds: Number.isInteger(ex.duration_seconds) ? ex.duration_seconds : null,
      exercise_type: EXERCISE_TYPES.includes(ex.exercise_type) ? ex.exercise_type : 'strength',
    }));
}
