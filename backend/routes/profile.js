import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth.js';

const router   = Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET perfil completo
router.get('/', requireAuth, async (req, res) => {
  const [profileRes, wearablesRes, statsRes] = await Promise.all([
    supabase.from('profiles')
      .select('*, trainer_profiles(full_name, rating, active_clients, specialties, instagram)')
      .eq('id', req.user.id)
      .single(),

    supabase.from('wearable_connections')
      .select('platform, device_name, connected, last_sync_at')
      .eq('user_id', req.user.id),

    supabase.from('workout_sessions')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('status', 'completed'),
  ]);

  if (profileRes.error) return res.status(400).json({ error: profileRes.error.message });

  res.json({
    ...profileRes.data,
    email:      req.user.email,
    wearables:  wearablesRes.data || [],
    total_sessions: statsRes.data?.length || 0,
  });
});

// PATCH actualizar perfil
router.patch('/', requireAuth, async (req, res) => {
  const allowed = ['full_name', 'goals', 'availability', 'notifications', 'avatar_url', 'onboarding_completed'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST conectar wearable
router.post('/wearables', requireAuth, async (req, res) => {
  const { platform, device_name, access_token, refresh_token } = req.body;

  const { data, error } = await supabase
    .from('wearable_connections')
    .upsert({
      user_id:       req.user.id,
      platform,
      device_name,
      connected:     true,
      last_sync_at:  new Date().toISOString(),
      access_token,   // cifrar en producción
      refresh_token,
    }, { onConflict: 'user_id,platform' })
    .select('platform, device_name, connected, last_sync_at')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE desconectar wearable
router.delete('/wearables/:platform', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('wearable_connections')
    .update({ connected: false })
    .eq('user_id', req.user.id)
    .eq('platform', req.params.platform);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

export default router;
