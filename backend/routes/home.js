import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth.js';

const router   = Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const today  = new Date().toISOString().split('T')[0];
  try {

  // Semana actual (lunes → domingo)
  const todayDate  = new Date(today);
  const dayOfWeek  = todayDate.getDay(); // 0=Dom
  const diffToMon  = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
  const monday     = new Date(todayDate); monday.setDate(todayDate.getDate() + diffToMon);
  const sunday     = new Date(monday);   sunday.setDate(monday.getDate() + 6);
  const mondayStr  = monday.toISOString().split('T')[0];
  const sundayStr  = sunday.toISOString().split('T')[0];

  const [profileRes, sessionRes, insightRes, metricsRes, nextSessionRes, weekSessionsRes] = await Promise.all([
    supabase.from('profiles')
      .select('full_name, current_streak, subscription_plan, trainer_id, trainer_profiles(full_name, rating, active_clients, specialties)')
      .eq('id', userId)
      .single(),

    supabase.from('workout_sessions')
      .select('id, name, estimated_duration, estimated_calories, rpe_target, focus_areas, status, ai_insight, session_exercises(id, exercise_name, sets, reps, weight_kg, rest_seconds, completed)')
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
      .gte('scheduled_date', mondayStr)
      .lte('scheduled_date', sundayStr)
      .order('scheduled_date', { ascending: true }),
  ]);

  const hour    = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  // Activity rings: idealmente vendrían de HealthKit/Garmin.
  // Por ahora los calculamos desde las sesiones completadas del día.
  const { data: todayCompleted } = await supabase
    .from('workout_sessions')
    .select('actual_duration')
    .eq('user_id', userId)
    .eq('scheduled_date', today)
    .eq('status', 'completed');

  const activeMinutes = (todayCompleted || []).reduce((s, x) => s + (x.actual_duration || 0), 0);

  const todaySession     = sessionRes.data;
  const isTodayDone      = todaySession?.status === 'completed';

  res.json({
    greeting,
    profile:      profileRes.data,
    today_session:  isTodayDone ? null : todaySession,
    next_session:   (!todaySession || isTodayDone) ? (nextSessionRes.data ?? null) : null,
    ai_insight:     insightRes.data?.content ?? null,
    activity_rings: {
      movement: Math.min(100, Math.round(activeMinutes / 30 * 100)),  // objetivo: 30 min
      exercise: Math.min(100, Math.round(activeMinutes / 20 * 100)),  // objetivo: 20 min
      standing: metricsRes.data ? 80 : 0,                             // placeholder hasta wearable real
    },
    hrv:           metricsRes.data?.hrv_score ?? null,
    week_sessions: weekSessionsRes.data ?? [],
  });
  } catch (err) {
    console.error('[home] error:', err);
    res.status(500).json({ error: 'Error al cargar el dashboard' });
  }
});

export default router;
