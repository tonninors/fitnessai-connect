/**
 * Modelo compartido del entrenamiento: bloques, series y formato.
 * Lo usan Home, Planes y WorkoutModal, que antes duplicaban estas reglas con
 * criterios ligeramente distintos.
 */

export const BLOCK_ORDER = ['warmup', 'strength', 'cardio', 'cooldown'];

export const BLOCK_META = {
  warmup:   { label: 'Calentamiento', colorClass: 'text-green',      bgClass: 'bg-green/10',      dotClass: 'bg-green',      borderClass: 'border-l-green' },
  strength: { label: 'Entrenamiento', colorClass: 'text-accent',     bgClass: 'bg-accent/10',     dotClass: 'bg-accent',     borderClass: 'border-l-accent' },
  cardio:   { label: 'Cardio',        colorClass: 'text-orange-400', bgClass: 'bg-orange-400/10', dotClass: 'bg-orange-400', borderClass: 'border-l-orange-400' },
  cooldown: { label: 'Estiramiento',  colorClass: 'text-blue',       bgClass: 'bg-blue/10',       dotClass: 'bg-blue',       borderClass: 'border-l-blue' },
};

export const DEFAULT_EXERCISE_TYPE = 'strength';

/**
 * Tipo de un ejercicio, con respaldo a `strength`.
 * Sin esto, los ejercicios antiguos sin `exercise_type` desaparecían de todos
 * los bloques del WorkoutModal y la sesión nunca podía completarse.
 */
export function exerciseType(exercise) {
  const type = exercise?.exercise_type;
  return BLOCK_ORDER.includes(type) ? type : DEFAULT_EXERCISE_TYPE;
}

/** ¿El ejercicio se mide por tiempo en lugar de por series? */
export function isTimed(exercise) {
  return Number(exercise?.duration_seconds) > 0;
}

/** Series planificadas: los ejercicios por tiempo siempre tienen 1. */
export function totalSets(exercise) {
  if (isTimed(exercise)) return 1;
  const sets = Number(exercise?.sets);
  return Number.isFinite(sets) && sets > 0 ? sets : (exerciseType(exercise) === 'strength' ? 3 : 1);
}

/** Ejercicios ordenados por bloque y, dentro del bloque, por `order_num`. */
export function sortByBlock(exercises = []) {
  return [...exercises].sort((a, b) => {
    const diff = BLOCK_ORDER.indexOf(exerciseType(a)) - BLOCK_ORDER.indexOf(exerciseType(b));
    return diff !== 0 ? diff : (a?.order_num ?? 0) - (b?.order_num ?? 0);
  });
}

/** Bloques no vacíos, en orden, con su metadata de presentación. */
export function groupByBlock(exercises = []) {
  return BLOCK_ORDER
    .map(type => ({
      type,
      ...BLOCK_META[type],
      exercises: exercises.filter(ex => exerciseType(ex) === type),
    }))
    .filter(block => block.exercises.length > 0);
}

/** Primer ejercicio pendiente respetando el orden de bloques. */
export function nextPendingExercise(exercises = [], doneIds = new Set()) {
  return sortByBlock(exercises).find(ex => !doneIds.has(ex.id)) ?? null;
}

/** Progreso 0-100 de la sesión. */
export function completionPercent(total, done) {
  if (!Number.isFinite(total) || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

/**
 * ¿El ejercicio está hecho?
 *
 * Con una sesión en curso manda `doneIds` (lo que va marcando el modal, que
 * todavía no llegó a la base); si no, vale el `completed` que trae la fila.
 * Se unen los dos porque `doneIds` arranca justamente desde `completed`.
 */
export function isExerciseDone(exercise, doneIds = null) {
  if (doneIds?.has?.(exercise?.id)) return true;
  return !!exercise?.completed;
}

/**
 * Progreso por bloque, en orden y sin los bloques vacíos.
 * Alimenta la barra segmentada de Inicio: una parte por cada bloque que toca
 * ese día.
 */
export function blockProgress(exercises = [], doneIds = null) {
  return groupByBlock(exercises).map(({ type, label, dotClass, colorClass, exercises: list }) => {
    const done = list.filter(ex => isExerciseDone(ex, doneIds)).length;
    return { type, label, dotClass, colorClass, total: list.length, done, percent: completionPercent(list.length, done) };
  });
}

// ── Título corto de la sesión ───────────────────────────────────────────────
// La IA nombra las sesiones en inglés ("Lower A — Enfoque en Sentadilla"), que
// en Inicio confunde. Ahí se muestra la zona del cuerpo en español, deducida de
// `focus_areas`. Planes y el modal siguen usando el nombre completo.
//
// El orden de la lista define la prioridad: gana el primer grupo que aparezca
// en `focus_areas`, que es el músculo principal del día.
const FOCUS_GROUPS = [
  { label: 'Piernas', region: 'inferior', muscles: ['cuadriceps', 'gluteos', 'isquiotibiales', 'femoral', 'gemelos', 'pantorrillas', 'aductores', 'abductores', 'pierna', 'soleo', 'tren inferior'] },
  { label: 'Pecho',   region: 'superior', muscles: ['pecho', 'pectoral'] },
  { label: 'Espalda', region: 'superior', muscles: ['espalda', 'dorsal', 'trapecio', 'romboides'] },
  { label: 'Hombros', region: 'superior', muscles: ['hombro', 'deltoide', 'manguito rotador'] },
  { label: 'Brazos',  region: 'superior', muscles: ['biceps', 'triceps', 'antebrazo', 'brazo'] },
  { label: 'Core',    region: 'centro',   muscles: ['core', 'abdomen', 'abdominal', 'oblicuo', 'lumbar'] },
];

/**
 * Minúsculas y sin acentos: `focus_areas` llega como "cuádriceps".
 * `NFD` separa la letra de su tilde y `\p{M}` borra las marcas sueltas.
 */
function normalizeArea(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim();
}

function groupForArea(area) {
  return FOCUS_GROUPS.find(group => group.muscles.some(muscle => area.includes(muscle))) ?? null;
}

/**
 * Zona del cuerpo que toca la sesión, en una palabra.
 * Si `focus_areas` no dice nada reconocible se cae al nombre original: es
 * preferible un título en inglés a uno inventado.
 */
export function sessionFocusTitle(session) {
  const areas = Array.isArray(session?.focus_areas) ? session.focus_areas : [];
  const groups = areas.map(area => groupForArea(normalizeArea(area))).filter(Boolean);

  if (groups.length === 0) {
    return String(session?.name ?? '').trim() || 'Entrenamiento';
  }

  const regions = new Set(groups.map(group => group.region));
  if (regions.has('inferior') && regions.has('superior')) return 'Cuerpo completo';

  return groups[0].label;
}

/** `mm:ss` (o `hh:mm:ss` si pasa de una hora). */
export function formatTimer(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** "45s" para movilidad, "20 min" para cardio. */
export function formatDuration(seconds) {
  const safe = Number(seconds);
  if (!Number.isFinite(safe) || safe <= 0) return '';
  return safe >= 60 ? `${Math.round(safe / 60)} min` : `${safe}s`;
}

/** Resumen corto del ejercicio: "4 × 6 reps · 60kg" o "45s". */
export function describeExercise(exercise) {
  if (!exercise) return '';
  if (isTimed(exercise)) return formatDuration(exercise.duration_seconds);

  const reps = exercise.reps ?? '?';
  const weight = Number(exercise.weight_kg) > 0 ? ` · ${exercise.weight_kg}kg` : '';
  return `${totalSets(exercise)} × ${reps} reps${weight}`;
}

// ── Calorías ────────────────────────────────────────────────────────────────
// Estimación lineal a partir del RPE objetivo: un entrenamiento de fuerza ronda
// entre 6 kcal/min (RPE bajo) y 12 kcal/min (RPE alto).
// La fórmula anterior (`min * rpe * 0.03`) daba ~13 kcal por una hora de
// entrenamiento, un orden de magnitud por debajo de lo real, y ese valor se
// guardaba en `actual_calories` alimentando las estadísticas de Progreso.
export const KCAL_PER_MIN_BASE = 4;
export const KCAL_PER_MIN_PER_RPE = 0.8;
export const DEFAULT_RPE = 6;

export function kcalPerMinute(rpeTarget = DEFAULT_RPE) {
  const rpe = Number(rpeTarget);
  const safeRpe = Number.isFinite(rpe) && rpe >= 1 && rpe <= 10 ? rpe : DEFAULT_RPE;
  return KCAL_PER_MIN_BASE + safeRpe * KCAL_PER_MIN_PER_RPE;
}

export function estimateCalories(elapsedSeconds, rpeTarget = DEFAULT_RPE) {
  const seconds = Math.max(0, Number(elapsedSeconds) || 0);
  return (seconds / 60) * kcalPerMinute(rpeTarget);
}
