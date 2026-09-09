import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../config/supabase.js';
import { asyncHandler } from '../lib/http.js';
import { todayISO, getWeekRange, currentHour, greetingFor } from '../lib/dates.js';
import { ringPercent } from '../lib/progress.js';

const router = Router();

/** Objetivos diarios de los anillos de actividad (minutos). */
export const MOVEMENT_GOAL_MIN = 30;
export const EXERCISE_GOAL_MIN = 20;

router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const userId = req.user.id;
  const today = todayISO();
  const { monday, sunday } = getWeekRange(today);

  const [
    profileRes,
    sessionRes,
    insightRes,
    metricsRes,
    nextSessionRes,
    weekSessionsRes,
    completedTodayRes,
  ] = await Promise.all([
    supabase.from('profiles')
      .select('full_name, current_streak, subscription_plan, trainer_id, trainer_profiles(full_name, rating, active_clients, specialties)')
      .eq('id', userId)
      .maybeSingle(),

    supabase.from('workout_sessions')
      .select(`
        id, name, day_order, estimated_duration, estimated_calories, rpe_target, focus_areas, status, ai_insight, elapsed_seconds,
        session_exercises(
          id, exercise_name, exercise_id, order_num, sets, reps, weight_kg, rest_seconds, duration_seconds, exercise_type, completed,
          exercises(image_url, video_url, description)
        )
      `)
      .eq('user_id', userId)
      .eq('scheduled_date', today)
      .neq('status', 'skipped')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase.from('ai_insights')
      .select('content, type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase.from('progress_metrics')
      .select('hrv_score, resting_hr')
      .eq('user_id', userId)
      .eq('metric_date', today)
      .maybeSingle(),

    supabase.from('workout_sessions')
      .select('id, name, scheduled_date, estimated_duration, rpe_target, focus_areas, day_order, workout_plans!inner(status)')
      .eq('user_id', userId)
      .eq('workout_plans.status', 'active')
      .neq('status', 'completed')
      .neq('status', 'skipped')
      .order('scheduled_date', { ascending: true })
      .limit(1)
      .maybeSingle(),

    supabase.from('workout_sessions')
      .select('id, scheduled_date, status, day_order, week_number, workout_plans!inner(status)')
      .eq('user_id', userId)
      .eq('workout_plans.status', 'active')
      .gte('scheduled_date', monday)
      .lte('scheduled_date', sunday)
      .order('scheduled_date', { ascending: true }),

    // Anillos de actividad: hasta que haya wearable real se derivan de las
    // sesiones ya completadas hoy.
    supabase.from('workout_sessions')
      .select('actual_duration')
      .eq('user_id', userId)
      .eq('scheduled_date', today)
      .eq('status', 'completed'),
  ]);

  const activeMinutes = (completedTodayRes.data || [])
    .reduce((sum, s) => sum + (Number(s.actual_duration) || 0), 0);

  const todaySession = sessionRes.data;
  const isTodayDone = todaySession?.status === 'completed';

  res.json({
    greeting: greetingFor(currentHour()),
    profile: profileRes.data ?? null,
    today_session: isTodayDone ? null : (todaySession ?? null),
    next_session: (!todaySession || isTodayDone) ? (nextSessionRes.data ?? null) : null,
    ai_insight: insightRes.data?.content ?? null,
    activity_rings: {
      movement: ringPercent(activeMinutes, MOVEMENT_GOAL_MIN),
      exercise: ringPercent(activeMinutes, EXERCISE_GOAL_MIN),
      standing: metricsRes.data ? 80 : 0, // placeholder hasta integración con wearable
    },
    hrv: metricsRes.data?.hrv_score ?? null,
    week_sessions: weekSessionsRes.data ?? [],
  });
}));

export default router;
