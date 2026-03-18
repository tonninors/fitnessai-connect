import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth.js';

const router   = Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const today  = new Date().toISOString().split('T')[0];

  const [profileRes, sessionRes, insightRes, metricsRes] = await Promise.all([
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

  res.json({
    greeting,
    profile:      profileRes.data,
    today_session: sessionRes.data,
    ai_insight:    insightRes.data?.content ?? null,
    activity_rings: {
      movement: Math.min(100, Math.round(activeMinutes / 30 * 100)),  // objetivo: 30 min
      exercise: Math.min(100, Math.round(activeMinutes / 20 * 100)),  // objetivo: 20 min
      standing: metricsRes.data ? 80 : 0,                             // placeholder hasta wearable real
    },
    hrv: metricsRes.data?.hrv_score ?? null,
  });
});

export default router;
