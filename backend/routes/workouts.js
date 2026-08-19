import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../config/supabase.js';
import { asyncHandler, throwOnSupabaseError, forbidden, notFound } from '../lib/http.js';
import { optionalInt, optionalNumber, requireUuid } from '../lib/validation.js';
import { todayISO, addDays } from '../lib/dates.js';
import { computeStreak } from '../lib/streak.js';

const router = Router();

const UPCOMING_LIMIT = 5;

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
    .select('id, sets')
    .eq('id', exerciseId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (error) throwOnSupabaseError(error);
  if (!data) throw notFound('Ejercicio no encontrado en esta sesión');
  return data;
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
        id, name, scheduled_date, status, estimated_duration, focus_areas, rpe_target, week_number, day_order,
        session_exercises(id, exercise_name, order_num, sets, reps, weight_kg, rest_seconds, duration_seconds, exercise_type, completed)
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
