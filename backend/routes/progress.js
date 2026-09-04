import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../config/supabase.js';
import { asyncHandler, throwOnSupabaseError } from '../lib/http.js';
import { optionalInt, optionalNumber, optionalEnum, optionalText } from '../lib/validation.js';
import { todayISO } from '../lib/dates.js';
import { buildWeeklyChart, summarizeSessions, weeksForPeriod, CHART_PERIODS } from '../lib/progress.js';

const router = Router();

const METRIC_SOURCES = ['manual', 'apple_health', 'garmin', 'google_fit'];
const MAX_METRIC_DAYS = 365;
const DEFAULT_METRIC_DAYS = 30;

/** Primer día del mes en curso, en UTC. */
function startOfMonth(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

// GET stats mensuales + racha + nivel
router.get('/stats', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const userId = req.user.id;

  const [profileRes, sessionsRes] = await Promise.all([
    supabase.from('profiles')
      .select('current_streak, longest_streak, level, level_name')
      .eq('id', userId)
      .maybeSingle(),

    supabase.from('workout_sessions')
      .select('actual_calories, actual_duration, completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('completed_at', startOfMonth().toISOString()),
  ]);

  throwOnSupabaseError(sessionsRes.error);

  const sessions = sessionsRes.data || [];
  const totals = summarizeSessions(sessions);

  res.json({
    streak: profileRes.data?.current_streak || 0,
    longest_streak: profileRes.data?.longest_streak || 0,
    level: profileRes.data?.level || 1,
    level_name: profileRes.data?.level_name || 'Principiante',
    total_workouts: totals.total_workouts,
    total_calories: totals.total_calories,
    total_hours: totals.total_hours,
    weekly_volume: buildWeeklyChart(sessions, 4),
  });
}));

// GET datos de gráfica (4S / 3M / 1A)
router.get('/chart', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const period = optionalEnum(req.query.period, 'period', Object.keys(CHART_PERIODS), { fallback: '4w' });
  const weeks = weeksForPeriod(period);
  const since = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('completed_at, actual_duration')
    .eq('user_id', req.user.id)
    .eq('status', 'completed')
    .gte('completed_at', since.toISOString());

  throwOnSupabaseError(error);
  res.json(buildWeeklyChart(data || [], weeks));
}));

// POST registrar métricas corporales / HRV / sueño
router.post('/metrics', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const body = req.body ?? {};

  const row = {
    user_id: req.user.id,
    metric_date: todayISO(),
    body_weight_kg: optionalNumber(body.body_weight_kg, 'body_weight_kg', { min: 20, max: 400 }),
    body_fat_pct: optionalNumber(body.body_fat_pct, 'body_fat_pct', { min: 1, max: 75 }),
    hrv_score: optionalInt(body.hrv_score, 'hrv_score', { min: 0, max: 300 }),
    resting_hr: optionalInt(body.resting_hr, 'resting_hr', { min: 20, max: 200 }),
    sleep_hours: optionalNumber(body.sleep_hours, 'sleep_hours', { min: 0, max: 24 }),
    sleep_quality: optionalInt(body.sleep_quality, 'sleep_quality', { min: 1, max: 5 }),
    notes: optionalText(body.notes, 'notes', { maxLength: 1000 }),
    source: optionalEnum(body.source, 'source', METRIC_SOURCES, { fallback: 'manual' }),
  };

  const { data, error } = await supabase
    .from('progress_metrics')
    .upsert(row, { onConflict: 'user_id,metric_date' })
    .select()
    .maybeSingle();

  throwOnSupabaseError(error);
  res.json(data);
}));

// GET historial de métricas (últimos N días)
router.get('/metrics', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();

  // `Number('abc')` daba NaN y `new Date(NaN).toISOString()` lanzaba
  // RangeError, tumbando la petición con un 500 sin mensaje.
  const days = optionalInt(req.query.days, 'days', {
    min: 1,
    max: MAX_METRIC_DAYS,
    fallback: DEFAULT_METRIC_DAYS,
  });

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('progress_metrics')
    .select('metric_date, body_weight_kg, body_fat_pct, hrv_score, resting_hr, sleep_hours')
    .eq('user_id', req.user.id)
    .gte('metric_date', since)
    .order('metric_date', { ascending: true });

  throwOnSupabaseError(error);
  res.json(data || []);
}));

export default router;
