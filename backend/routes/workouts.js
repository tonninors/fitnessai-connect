import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth.js';

const router   = Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET plan activo con sesiones
router.get('/plan', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('workout_plans')
    .select(`
      id, name, description, total_weeks, current_week, sport, focus_areas, ai_generated,
      trainer_profiles(full_name, rating),
      workout_sessions(
        id, name, scheduled_date, status, estimated_duration, focus_areas, rpe_target, week_number, day_order,
        session_exercises(id, exercise_name, order_num, sets, reps, weight_kg, rest_seconds, completed)
      )
    `)
    .eq('user_id', req.user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET próximas sesiones (sin completar)
router.get('/upcoming', requireAuth, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('id, name, scheduled_date, estimated_duration, focus_areas, rpe_target, status')
    .eq('user_id', req.user.id)
    .gte('scheduled_date', today)
    .neq('status', 'completed')
    .neq('status', 'skipped')
    .order('scheduled_date', { ascending: true })
    .limit(5);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data || []);
});

// POST iniciar sesión
router.post('/sessions/:id/start', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .update({ status: 'in_progress' })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PATCH completar sesión
router.patch('/sessions/:id/complete', requireAuth, async (req, res) => {
  const { actual_duration, actual_calories, rpe_actual, wearable_data } = req.body;

  const { data, error } = await supabase
    .from('workout_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      actual_duration,
      actual_calories,
      rpe_actual,
      wearable_data: wearable_data || {},
    })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  await updateStreak(req.user.id);

  res.json(data);
});

// PATCH marcar ejercicio como completado
router.patch('/sessions/:sessionId/exercises/:exerciseId/toggle', requireAuth, async (req, res) => {
  const { completed } = req.body;

  // Verificar que la sesión pertenece al usuario
  const { data: session } = await supabase
    .from('workout_sessions')
    .select('id')
    .eq('id', req.params.sessionId)
    .eq('user_id', req.user.id)
    .single();

  if (!session) return res.status(403).json({ error: 'Sin acceso' });

  const { data, error } = await supabase
    .from('session_exercises')
    .update({ completed })
    .eq('id', req.params.exerciseId)
    .eq('session_id', req.params.sessionId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST registrar una serie
router.post('/sessions/:sessionId/exercises/:exerciseId/sets', requireAuth, async (req, res) => {
  const { set_number, reps_actual, weight_actual_kg } = req.body;

  const { data, error } = await supabase
    .from('session_sets')
    .upsert({
      session_exercise_id: req.params.exerciseId,
      set_number,
      reps_actual,
      weight_actual_kg,
      completed: true,
    }, { onConflict: 'session_exercise_id,set_number' })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

async function updateStreak(userId) {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const [{ data: profile }, { data: yday }] = await Promise.all([
    supabase.from('profiles').select('current_streak, longest_streak').eq('id', userId).single(),
    supabase.from('workout_sessions')
      .select('id').eq('user_id', userId).eq('scheduled_date', yesterday).eq('status', 'completed').limit(1),
  ]);

  const newStreak  = (yday?.length > 0) ? (profile?.current_streak || 0) + 1 : 1;
  const newLongest = Math.max(newStreak, profile?.longest_streak || 0);

  const level      = Math.floor(newStreak / 10) + 1;
  const levelNames = ['Principiante', 'En forma', 'Atleta', 'Avanzado', 'Elite'];
  const levelName  = levelNames[Math.min(level - 1, levelNames.length - 1)];

  await supabase.from('profiles').update({
    current_streak: newStreak,
    longest_streak: newLongest,
    level,
    level_name: levelName,
  }).eq('id', userId);
}

export default router;
