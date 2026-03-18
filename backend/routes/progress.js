import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth.js';

const router   = Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET stats mensuales + racha + nivel
router.get('/stats', requireAuth, async (req, res) => {
  const userId     = req.user.id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [profileRes, sessionsRes] = await Promise.all([
    supabase.from('profiles')
      .select('current_streak, longest_streak, level, level_name')
      .eq('id', userId)
      .single(),

    supabase.from('workout_sessions')
      .select('actual_calories, actual_duration, completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('completed_at', startOfMonth.toISOString()),
  ]);

  const sessions     = sessionsRes.data || [];
  const totalCal     = sessions.reduce((s, x) => s + (x.actual_calories || 0), 0);
  const totalMin     = sessions.reduce((s, x) => s + (x.actual_duration || 0), 0);

  res.json({
    streak:          profileRes.data?.current_streak  || 0,
    longest_streak:  profileRes.data?.longest_streak  || 0,
    level:           profileRes.data?.level           || 1,
    level_name:      profileRes.data?.level_name      || 'Principiante',
    total_workouts:  sessions.length,
    total_calories:  totalCal,
    total_hours:     Math.round(totalMin / 60),
    weekly_volume:   buildWeeklyChart(sessions, 4),
  });
});

// GET datos de gráfica (4S / 3M / 1A)
router.get('/chart', requireAuth, async (req, res) => {
  const { period = '4w' } = req.query;
  const weeks  = period === '3m' ? 12 : period === '1y' ? 52 : 4;
  const since  = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

  const { data } = await supabase
    .from('workout_sessions')
    .select('completed_at, actual_duration')
    .eq('user_id', req.user.id)
    .eq('status', 'completed')
    .gte('completed_at', since.toISOString());

  res.json(buildWeeklyChart(data || [], weeks));
});

// POST registrar métricas corporales / HRV / sueño
router.post('/metrics', requireAuth, async (req, res) => {
  const { body_weight_kg, body_fat_pct, hrv_score, resting_hr, sleep_hours, sleep_quality, notes, source } = req.body;

  const { data, error } = await supabase
    .from('progress_metrics')
    .upsert({
      user_id:        req.user.id,
      metric_date:    new Date().toISOString().split('T')[0],
      body_weight_kg,
      body_fat_pct,
      hrv_score,
      resting_hr,
      sleep_hours,
      sleep_quality,
      notes,
      source:         source || 'manual',
    }, { onConflict: 'user_id,metric_date' })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET historial de métricas (últimos N días)
router.get('/metrics', requireAuth, async (req, res) => {
  const { days = 30 } = req.query;
  const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('progress_metrics')
    .select('metric_date, body_weight_kg, body_fat_pct, hrv_score, resting_hr, sleep_hours')
    .eq('user_id', req.user.id)
    .gte('metric_date', since)
    .order('metric_date', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data || []);
});

function buildWeeklyChart(sessions, weeks) {
  return Array.from({ length: weeks }, (_, i) => {
    const weekIdx = weeks - 1 - i;
    const start   = new Date(Date.now() - (weekIdx + 1) * 7 * 24 * 60 * 60 * 1000);
    const end     = new Date(Date.now() - weekIdx * 7 * 24 * 60 * 60 * 1000);
    const mins    = sessions
      .filter(s => { const d = new Date(s.completed_at); return d >= start && d < end; })
      .reduce((sum, s) => sum + (s.actual_duration || 0), 0);

    return { label: `S${i + 1}`, val: mins };
  });
}

export default router;
