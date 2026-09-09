-- ── Tiempo entrenado por sesión ──────────────────────────────
-- Aplicar en Supabase → SQL Editor. Idempotente.
--
-- El cronómetro del entrenamiento vivía sólo en el navegador (localStorage):
-- una recarga, un cambio de pestaña en el móvil o de dispositivo lo perdían.
-- Ahora el cliente lo sincroniza en PATCH /api/workouts/sessions/:id/progress
-- y el backend lo devuelve en /api/workouts/plan y /api/home para reanudar
-- desde ahí. La clave de la traza es el propio `workout_sessions.id`.

ALTER TABLE workout_sessions
  ADD COLUMN IF NOT EXISTS elapsed_seconds INT NOT NULL DEFAULT 0;
