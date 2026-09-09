import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../config/supabase.js';
import { asyncHandler, throwOnSupabaseError, badRequest, forbidden, notFound } from '../lib/http.js';
import { optionalInt, optionalNumber, requireUuid } from '../lib/validation.js';
import { todayISO, addDays } from '../lib/dates.js';
import { computeStreak } from '../lib/streak.js';
import { chat } from '../lib/groq.js';
import {
  ALTERNATIVES_SYSTEM_PROMPT,
  buildAlternativesPrompt,
  fallbackAlternatives,
  parseAlternatives,
  rankCandidates,
} from '../lib/alternatives.js';
import { buildCatalogIndex, normalizeExerciseName } from '../lib/plan.js';

const router = Router();

const UPCOMING_LIMIT = 5;
const ALTERNATIVES_MAX_TOKENS = 400;
const MAX_ELAPSED_SECONDS = 24 * 60 * 60;

/** Columnas del catálogo que necesitan las alternativas y la media enlazada. */
const CATALOG_COLUMNS = 'id, name, muscle_groups, equipment, description, image_url, video_url, exercise_type, '
  + 'movement_pattern, movement_angle, muscle_map, joint_actions, rom, muscle_length_bias, '
  + 'resistance_profile, body_support, stability_demand, laterality, is_compound, kinetic_chain, fatigue';

/** Columnas de `session_exercises` que devuelve la sustitución. */
const SUBSTITUTE_COLUMNS =
  'id, exercise_name, exercise_id, sets, reps, weight_kg, rest_seconds, duration_seconds, exercise_type, order_num, completed, exercises(image_url, video_url, description)';

/**
 * Comprueba que la sesión pertenece al usuario autenticado.
 * Todas las escrituras sobre sesiones y ejercicios pasan por aquí: el endpoint
 * de series no lo hacía y permitía escribir sets de cualquier usuario (IDOR).
 */
async function assertSessionOwnership(supabase, sessionId, userId) {
  requireUuid(sessionId, 'sessionId');

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throwOnSupabaseError(error);
  if (!data) throw forbidden('Sin acceso a esta sesión');
  return data;
}

/** Comprueba que el ejercicio pertenece a la sesión indicada. */
async function assertExerciseInSession(supabase, exerciseId, sessionId) {
  requireUuid(exerciseId, 'exerciseId');

  const { data, error } = await supabase
    .from('session_exercises')
    .select('id, sets, exercise_id, exercise_name, exercise_type')
    .eq('id', exerciseId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (error) throwOnSupabaseError(error);
  if (!data) throw notFound('Ejercicio no encontrado en esta sesión');
  return data;
}

/**
 * Catálogo público de ejercicios (fuente de las alternativas y de la media).
 *
 * Un fallo aquí NO se propaga como 5xx: el usuario está a mitad de un
 * entrenamiento y un catálogo inaccesible (típicamente porque falta aplicar el
 * bloque MIGRACIONES y no existe `exercises.exercise_type`) debe traducirse en
 * "no hay alternativas", no en un error rojo con un reintento que nunca va a
 * funcionar. El motivo real queda en el log del servidor.
 */
async function loadCatalog(supabase) {
  const { data, error } = await supabase
    .from('exercises')
    .select(CATALOG_COLUMNS)
    .eq('is_public', true);

  if (error) {
    console.error('[workouts] no se pudo cargar el catálogo de ejercicios:', error.message);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// GET plan activo con sesiones
router.get('/plan', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('workout_plans')
    .select(`
      id, name, description, total_weeks, current_week, sport, focus_areas, ai_generated,
      trainer_profiles(full_name, rating),
      workout_sessions(
        id, name, scheduled_date, status, estimated_duration, focus_areas, rpe_target, week_number, day_order, elapsed_seconds,
        session_exercises(
          id, exercise_name, exercise_id, order_num, sets, reps, weight_kg, rest_seconds, duration_seconds, exercise_type, completed,
          exercises(image_url, video_url, description)
        )
      )
    `)
    .eq('user_id', req.user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  throwOnSupabaseError(error);
  res.json(data ?? null);
}));

// GET próximas sesiones (sin completar, solo del plan activo)
router.get('/upcoming', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('id, name, scheduled_date, estimated_duration, focus_areas, rpe_target, status, day_order, workout_plans!inner(status)')
    .eq('user_id', req.user.id)
    .eq('workout_plans.status', 'active')
    .neq('status', 'completed')
    .neq('status', 'skipped')
    .order('scheduled_date', { ascending: true })
    .limit(UPCOMING_LIMIT);

  throwOnSupabaseError(error);
  res.json(data || []);
}));

// POST iniciar sesión
router.post('/sessions/:id/start', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  await assertSessionOwnership(supabase, req.params.id, req.user.id);

  const { data, error } = await supabase
    .from('workout_sessions')
    .update({ status: 'in_progress' })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  throwOnSupabaseError(error);
  if (!data) throw notFound('Sesión no encontrada');
  res.json(data);
}));

// PATCH tiempo entrenado (segundos, sin pausas) de una sesión en curso.
// El cliente lo sincroniza mientras entrena para que una recarga, un cambio de
// pestaña o de dispositivo no pierdan el cronómetro. Sólo avanza: un envío
// rezagado con un valor menor no pisa a uno más reciente.
router.patch('/sessions/:id/progress', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  await assertSessionOwnership(supabase, req.params.id, req.user.id);

  const elapsed = optionalInt(req.body?.elapsed_seconds, 'elapsed_seconds', { min: 0, max: MAX_ELAPSED_SECONDS });
  if (elapsed === null) throw badRequest('elapsed_seconds es obligatorio');

  const { error } = await supabase
    .from('workout_sessions')
    .update({ elapsed_seconds: elapsed })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .lt('elapsed_seconds', elapsed);

  throwOnSupabaseError(error);
  res.status(204).end();
}));

// PATCH completar sesión
router.patch('/sessions/:id/complete', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const sessionId = req.params.id;
  await assertSessionOwnership(supabase, sessionId, req.user.id);

  const updates = {
    status: 'completed',
    completed_at: new Date().toISOString(),
    actual_duration: optionalInt(req.body?.actual_duration, 'actual_duration', { min: 0, max: 24 * 60 }),
    actual_calories: optionalInt(req.body?.actual_calories, 'actual_calories', { min: 0, max: 20000 }),
    rpe_actual: optionalInt(req.body?.rpe_actual, 'rpe_actual', { min: 1, max: 10 }),
    wearable_data: req.body?.wearable_data && typeof req.body.wearable_data === 'object'
      ? req.body.wearable_data
      : {},
  };

  const { data, error } = await supabase
    .from('workout_sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  throwOnSupabaseError(error);
  if (!data) throw notFound('Sesión no encontrada');

  await updateStreak(supabase, req.user.id, { excludeSessionId: sessionId });

  res.json(data);
}));

// PATCH marcar ejercicio como completado
router.patch('/sessions/:sessionId/exercises/:exerciseId/toggle', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { sessionId, exerciseId } = req.params;

  if (typeof req.body?.completed !== 'boolean') {
    const err = new Error('completed debe ser booleano');
    err.status = 400;
    throw err;
  }

  await assertSessionOwnership(supabase, sessionId, req.user.id);
  await assertExerciseInSession(supabase, exerciseId, sessionId);

  const { data, error } = await supabase
    .from('session_exercises')
    .update({ completed: req.body.completed })
    .eq('id', exerciseId)
    .eq('session_id', sessionId)
    .select()
    .maybeSingle();

  throwOnSupabaseError(error);
  if (!data) throw notFound('Ejercicio no encontrado');
  res.json(data);
}));

// POST registrar una serie
router.post('/sessions/:sessionId/exercises/:exerciseId/sets', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { sessionId, exerciseId } = req.params;

  // Sin esta comprobación cualquier usuario autenticado podía escribir series
  // en el ejercicio de otro con sólo conocer su id.
  await assertSessionOwnership(supabase, sessionId, req.user.id);
  await assertExerciseInSession(supabase, exerciseId, sessionId);

  const setNumber = optionalInt(req.body?.set_number, 'set_number', { min: 1, max: 50 });
  if (setNumber === null) {
    const err = new Error('set_number es obligatorio');
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from('session_sets')
    .upsert({
      session_exercise_id: exerciseId,
      set_number: setNumber,
      reps_actual: optionalInt(req.body?.reps_actual, 'reps_actual', { min: 0, max: 1000 }),
      weight_actual_kg: optionalNumber(req.body?.weight_actual_kg, 'weight_actual_kg', { min: 0, max: 1000 }),
      completed: true,
    }, { onConflict: 'session_exercise_id,set_number' })
    .select()
    .maybeSingle();

  throwOnSupabaseError(error);
  res.json(data);
}));

// POST alternativas para un ejercicio de la sesión
router.post('/sessions/:sessionId/exercises/:exerciseId/alternatives', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { sessionId, exerciseId } = req.params;

  await assertSessionOwnership(supabase, sessionId, req.user.id);
  const exercise = await assertExerciseInSession(supabase, exerciseId, sessionId);

  const catalog = await loadCatalog(supabase);

  // La huella biomecánica del original sale del catálogo. Si el ejercicio no
  // quedó enlazado (planes generados antes de que el catálogo existiera) se
  // resuelve por nombre normalizado: sin esto no hay nada que comparar y las
  // alternativas acababan saliendo por orden alfabético.
  const catalogRow = (exercise.exercise_id
    ? catalog.find(row => row.id === exercise.exercise_id)
    : buildCatalogIndex(catalog).get(normalizeExerciseName(exercise.exercise_name))) ?? null;

  const current = {
    ...(catalogRow ?? {}),
    exercise_id: exercise.exercise_id ?? catalogRow?.id ?? null,
    exercise_name: exercise.exercise_name,
    exercise_type: exercise.exercise_type ?? catalogRow?.exercise_type ?? 'strength',
    muscle_groups: catalogRow?.muscle_groups ?? [],
    equipment: catalogRow?.equipment ?? [],
  };

  const ranked = rankCandidates(catalog, current);
  if (ranked.length === 0) return res.json({ alternatives: [] });
  const candidates = ranked.map(entry => entry.row);

  // La IA sólo redacta la razón: el ranking ya lo decidió el motor de
  // similitud. Si falla o devuelve basura se sirve el respaldo con el mismo
  // orden, así que solo se pierde la prosa. El usuario está a mitad de un
  // entrenamiento y este endpoint nunca debe bloquearlo con un 502.
  let alternatives = [];
  try {
    const text = await chat([
      { role: 'system', content: ALTERNATIVES_SYSTEM_PROMPT },
      { role: 'user', content: buildAlternativesPrompt(current, candidates) },
    ], { maxTokens: ALTERNATIVES_MAX_TOKENS });
    alternatives = parseAlternatives(text, ranked);
  } catch (err) {
    console.warn('[workouts] alternativas sin IA, se usa el respaldo:', err.message);
  }

  if (alternatives.length === 0) alternatives = fallbackAlternatives(ranked);

  res.json({ alternatives });
}));

// PATCH sustituir un ejercicio por otro del catálogo (sólo en esta sesión)
router.patch('/sessions/:sessionId/exercises/:exerciseId/substitute', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { sessionId, exerciseId } = req.params;

  const targetId = requireUuid(req.body?.exercise_id, 'exercise_id');

  await assertSessionOwnership(supabase, sessionId, req.user.id);
  await assertExerciseInSession(supabase, exerciseId, sessionId);

  const { data: target, error: targetErr } = await supabase
    .from('exercises')
    .select('id, name')
    .eq('id', targetId)
    .eq('is_public', true)
    .maybeSingle();

  throwOnSupabaseError(targetErr);
  if (!target) throw notFound('Ejercicio no encontrado en el catálogo');

  // Sólo esta fila: la sustitución vale para esta sesión, no para el plan ni
  // para las demás sesiones. El resto de columnas (sets, reps, weight_kg,
  // rest_seconds, duration_seconds, exercise_type, order_num) se conserva.
  const { data, error } = await supabase
    .from('session_exercises')
    .update({ exercise_id: target.id, exercise_name: target.name })
    .eq('id', exerciseId)
    .eq('session_id', sessionId)
    .select(SUBSTITUTE_COLUMNS)
    .maybeSingle();

  throwOnSupabaseError(error);
  if (!data) throw notFound('Ejercicio no encontrado');

  res.json({ exercise: toSubstitutedExercise(data) });
}));

/**
 * Forma exacta que espera el cliente tras una sustitución.
 * Se construye a mano para que el contrato no dependa de lo que devuelva
 * PostgREST: `exercises` puede llegar como objeto, como array (relación
 * anidada) o ausente.
 */
function toSubstitutedExercise(row) {
  const media = Array.isArray(row.exercises) ? row.exercises[0] : row.exercises;
  return {
    id: row.id,
    exercise_name: row.exercise_name,
    exercise_id: row.exercise_id ?? null,
    sets: row.sets ?? null,
    reps: row.reps ?? null,
    weight_kg: row.weight_kg ?? null,
    rest_seconds: row.rest_seconds ?? null,
    duration_seconds: row.duration_seconds ?? null,
    exercise_type: row.exercise_type ?? 'strength',
    order_num: row.order_num ?? null,
    completed: row.completed ?? false,
    exercises: media
      ? {
        image_url: media.image_url ?? null,
        video_url: media.video_url ?? null,
        description: media.description ?? null,
      }
      : null,
  };
}

/**
 * Recalcula racha y nivel tras completar una sesión.
 *
 * Reglas:
 * - Se suma un día si ayer también hubo sesión completada.
 * - Si hoy ya había otra sesión completada la racha NO se vuelve a incrementar
 *   (antes, entrenar dos veces en un día sumaba dos días de racha).
 */
export async function updateStreak(supabase, userId, { excludeSessionId = null, today = todayISO() } = {}) {
  const yesterday = addDays(today, -1);

  const [profileRes, yesterdayRes, todayRes] = await Promise.all([
    supabase.from('profiles').select('current_streak, longest_streak').eq('id', userId).maybeSingle(),
    supabase.from('workout_sessions')
      .select('id').eq('user_id', userId).eq('scheduled_date', yesterday).eq('status', 'completed').limit(1),
    supabase.from('workout_sessions')
      .select('id').eq('user_id', userId).eq('scheduled_date', today).eq('status', 'completed'),
  ]);

  const todaySessions = Array.isArray(todayRes.data) ? todayRes.data : [];
  const yesterdaySessions = Array.isArray(yesterdayRes.data) ? yesterdayRes.data : [];

  const next = computeStreak({
    currentStreak: profileRes.data?.current_streak ?? 0,
    longestStreak: profileRes.data?.longest_streak ?? 0,
    completedYesterday: yesterdaySessions.length > 0,
    alreadyCountedToday: todaySessions.some(s => s.id !== excludeSessionId),
  });

  const { error } = await supabase.from('profiles').update(next).eq('id', userId);
  if (error) console.error('[workouts] no se pudo actualizar la racha:', error.message);

  return next;
}

export default router;
