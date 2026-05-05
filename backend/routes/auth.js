import { createClient } from '@supabase/supabase-js';
import { Router } from 'express';

const router = Router();

// POST /api/auth/check-email — sin auth requerido
// Verifica si un email está registrado en Supabase Auth
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) return res.status(500).json({ error: 'Error interno al verificar' });

  const exists = data.users.some(u => u.email?.toLowerCase() === email.toLowerCase());
  res.json({ exists });
});

export default router;
