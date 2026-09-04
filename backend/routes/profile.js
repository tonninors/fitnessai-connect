import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../config/supabase.js';
import { asyncHandler, throwOnSupabaseError, badRequest } from '../lib/http.js';
import { pickAllowed, requireEnum, optionalText } from '../lib/validation.js';

const router = Router();

/** Campos que el usuario puede modificar de su propio perfil. */
export const EDITABLE_PROFILE_FIELDS = [
  'full_name',
  'goals',
  'availability',
  'notifications',
  'avatar_url',
  'onboarding_completed',
];

export const WEARABLE_PLATFORMS = ['apple_health', 'garmin', 'google_fit', 'fitbit'];

// GET perfil completo
router.get('/', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();

  const [profileRes, wearablesRes, statsRes] = await Promise.all([
    supabase.from('profiles')
      .select('*, trainer_profiles(full_name, rating, active_clients, specialties, instagram)')
      .eq('id', req.user.id)
      .maybeSingle(),

    supabase.from('wearable_connections')
      .select('platform, device_name, connected, last_sync_at')
      .eq('user_id', req.user.id),

    supabase.from('workout_sessions')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('status', 'completed'),
  ]);

  throwOnSupabaseError(profileRes.error);
  if (!profileRes.data) throw badRequest('Perfil no encontrado');

  // Los tokens OAuth de los wearables nunca salen de la base de datos: el
  // SELECT de arriba los excluye explícitamente.
  res.json({
    ...profileRes.data,
    email: req.user.email,
    wearables: wearablesRes.data || [],
    total_sessions: statsRes.data?.length || 0,
  });
}));

// PATCH actualizar perfil (whitelist estricta)
router.patch('/', requireAuth, asyncHandler(async (req, res) => {
  const updates = pickAllowed(req.body, EDITABLE_PROFILE_FIELDS);

  if (Object.keys(updates).length === 0) {
    throw badRequest(`Nada que actualizar. Campos permitidos: ${EDITABLE_PROFILE_FIELDS.join(', ')}`);
  }
  if ('full_name' in updates) {
    const name = optionalText(updates.full_name, 'full_name', { maxLength: 120 });
    if (!name) throw badRequest('full_name no puede estar vacío');
    updates.full_name = name;
  }
  if ('onboarding_completed' in updates && typeof updates.onboarding_completed !== 'boolean') {
    throw badRequest('onboarding_completed debe ser booleano');
  }

  updates.updated_at = new Date().toISOString();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', req.user.id)
    .select()
    .maybeSingle();

  throwOnSupabaseError(error);
  res.json(data);
}));

// POST conectar wearable
router.post('/wearables', requireAuth, asyncHandler(async (req, res) => {
  const platform = requireEnum(req.body?.platform, 'platform', WEARABLE_PLATFORMS);
  const deviceName = optionalText(req.body?.device_name, 'device_name', { maxLength: 120 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('wearable_connections')
    .upsert({
      user_id: req.user.id,
      platform,
      device_name: deviceName,
      connected: true,
      last_sync_at: new Date().toISOString(),
      // TODO(seguridad): cifrar en reposo con pgcrypto antes de soportar OAuth real.
      access_token: req.body?.access_token ?? null,
      refresh_token: req.body?.refresh_token ?? null,
    }, { onConflict: 'user_id,platform' })
    .select('platform, device_name, connected, last_sync_at')
    .maybeSingle();

  throwOnSupabaseError(error);
  res.json(data);
}));

// DELETE desconectar wearable
router.delete('/wearables/:platform', requireAuth, asyncHandler(async (req, res) => {
  const platform = requireEnum(req.params.platform, 'platform', WEARABLE_PLATFORMS);

  const supabase = getSupabase();
  const { error } = await supabase
    .from('wearable_connections')
    .update({ connected: false, access_token: null, refresh_token: null })
    .eq('user_id', req.user.id)
    .eq('platform', platform);

  throwOnSupabaseError(error);
  res.json({ ok: true });
}));

export default router;
