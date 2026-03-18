-- ============================================================
-- FitnessAI Connect — Supabase / PostgreSQL Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── TRAINER PROFILES ─────────────────────────────────────────
CREATE TABLE trainer_profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT NOT NULL,
  bio            TEXT,
  specialties    TEXT[]   DEFAULT '{}',
  rating         DECIMAL(3,2) DEFAULT 5.0,
  active_clients INT      DEFAULT 0,
  plan           TEXT     DEFAULT 'starter' CHECK (plan IN ('starter','pro','elite')),
  instagram      TEXT,
  tiktok         TEXT,
  verified       BOOLEAN  DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── USER PROFILES ────────────────────────────────────────────
CREATE TABLE profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            TEXT NOT NULL,
  avatar_url           TEXT,
  current_streak       INT     DEFAULT 0,
  longest_streak       INT     DEFAULT 0,
  level                INT     DEFAULT 1,
  level_name           TEXT    DEFAULT 'Principiante',
  subscription_plan    TEXT    DEFAULT 'free' CHECK (subscription_plan IN ('free','pro','elite')),
  subscription_expires TIMESTAMPTZ,
  goals                JSONB   DEFAULT '{"primary":null,"secondary":null}',
  availability         JSONB   DEFAULT '{"days":[],"time":null}',
  notifications        JSONB   DEFAULT '{"reminders":true,"achievements":true,"ai_insights":true}',
  trainer_id           UUID    REFERENCES trainer_profiles(id),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── EXERCISE LIBRARY ─────────────────────────────────────────
CREATE TABLE exercises (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT     NOT NULL,
  muscle_groups  TEXT[]   NOT NULL,
  equipment      TEXT[]   DEFAULT '{}',
  description    TEXT,
  video_url      TEXT,
  image_url      TEXT,
  difficulty     INT      CHECK (difficulty BETWEEN 1 AND 5),
  is_public      BOOLEAN  DEFAULT TRUE,
  created_by     UUID     REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── WORKOUT PLANS ────────────────────────────────────────────
CREATE TABLE workout_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trainer_id    UUID     REFERENCES trainer_profiles(id),
  name          TEXT     NOT NULL,
  description   TEXT,
  total_weeks   INT      DEFAULT 12,
  current_week  INT      DEFAULT 1,
  sport         TEXT     DEFAULT 'gym' CHECK (sport IN ('gym','swimming','cycling','running','yoga','mixed')),
  focus_areas   TEXT[]   DEFAULT '{}',
  status        TEXT     DEFAULT 'active' CHECK (status IN ('active','paused','completed','archived')),
  ai_generated  BOOLEAN  DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── WORKOUT SESSIONS ─────────────────────────────────────────
CREATE TABLE workout_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id               UUID     REFERENCES workout_plans(id) ON DELETE SET NULL,
  user_id               UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                  TEXT     NOT NULL,
  scheduled_date        DATE,
  completed_at          TIMESTAMPTZ,
  estimated_duration    INT,   -- minutes
  actual_duration       INT,   -- minutes
  estimated_calories    INT,
  actual_calories       INT,
  rpe_target            INT    CHECK (rpe_target BETWEEN 1 AND 10),
  rpe_actual            INT    CHECK (rpe_actual BETWEEN 1 AND 10),
  focus_areas           TEXT[] DEFAULT '{}',
  week_number           INT,
  day_order             INT,
  notes                 TEXT,
  status                TEXT   DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed','skipped')),
  wearable_data         JSONB  DEFAULT '{}',
  ai_insight            TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── SESSION EXERCISES ────────────────────────────────────────
CREATE TABLE session_exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID     NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id     UUID     REFERENCES exercises(id),
  exercise_name   TEXT     NOT NULL,  -- desnormalizado para velocidad
  order_num       INT      NOT NULL,
  sets            INT      NOT NULL,
  reps            INT,
  reps_range      TEXT,    -- ej: "8-12"
  weight_kg       DECIMAL(6,2),
  rest_seconds    INT,
  completed       BOOLEAN  DEFAULT FALSE,
  notes           TEXT
);

-- ── SESSION SETS (logs reales) ───────────────────────────────
CREATE TABLE session_sets (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_exercise_id  UUID     NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
  set_number           INT      NOT NULL,
  reps_actual          INT,
  weight_actual_kg     DECIMAL(6,2),
  completed            BOOLEAN  DEFAULT FALSE,
  logged_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── PROGRESS METRICS ─────────────────────────────────────────
CREATE TABLE progress_metrics (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  metric_date      DATE     NOT NULL DEFAULT CURRENT_DATE,
  body_weight_kg   DECIMAL(5,2),
  body_fat_pct     DECIMAL(4,2),
  hrv_score        INT,
  resting_hr       INT,
  sleep_hours      DECIMAL(3,1),
  sleep_quality    INT      CHECK (sleep_quality BETWEEN 1 AND 5),
  notes            TEXT,
  source           TEXT     DEFAULT 'manual' CHECK (source IN ('manual','apple_health','garmin','google_fit')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, metric_date)
);

-- ── WEARABLE CONNECTIONS ─────────────────────────────────────
CREATE TABLE wearable_connections (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform       TEXT     NOT NULL CHECK (platform IN ('apple_health','garmin','google_fit','fitbit')),
  device_name    TEXT,
  connected      BOOLEAN  DEFAULT FALSE,
  last_sync_at   TIMESTAMPTZ,
  -- IMPORTANTE: cifrar estos tokens en producción con pgcrypto
  access_token   TEXT,
  refresh_token  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- ── MESSAGES (chat entrenador ↔ usuario) ─────────────────────
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON messages FOR ALL
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ── AI INSIGHTS ──────────────────────────────────────────────
CREATE TABLE ai_insights (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID     NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT     CHECK (type IN ('recovery','volume_adjustment','strength_progression','hr_zone','form_tip','general')),
  content     TEXT     NOT NULL,
  context     JSONB    DEFAULT '{}',
  session_id  UUID     REFERENCES workout_sessions(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── VISTA: STATS MENSUALES ───────────────────────────────────
CREATE VIEW user_monthly_stats AS
SELECT
  ws.user_id,
  DATE_TRUNC('month', ws.completed_at) AS month,
  COUNT(*)                                                          FILTER (WHERE ws.status = 'completed') AS total_workouts,
  COALESCE(SUM(ws.actual_calories)    FILTER (WHERE ws.status = 'completed'), 0)                          AS total_calories,
  COALESCE(SUM(ws.actual_duration)    FILTER (WHERE ws.status = 'completed'), 0)                          AS total_minutes,
  COALESCE(SUM(ss.weight_actual_kg * ss.reps_actual), 0)                                                  AS total_weight_kg
FROM workout_sessions ws
LEFT JOIN session_exercises se ON se.session_id = ws.id
LEFT JOIN session_sets ss ON ss.session_exercise_id = se.id AND ss.completed = TRUE
GROUP BY ws.user_id, DATE_TRUNC('month', ws.completed_at);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises            ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans        ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises    ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_sets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_metrics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights          ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = id);
-- Trainer profiles: públicos para SELECT, privados para modificar
CREATE POLICY "trainers public read" ON trainer_profiles FOR SELECT USING (TRUE);
CREATE POLICY "trainers own write"   ON trainer_profiles FOR ALL    USING (auth.uid() = id);
-- Ejercicios: públicos o propios
CREATE POLICY "exercises public"     ON exercises FOR SELECT USING (is_public = TRUE OR auth.uid() = created_by);
-- Planes, sesiones, métricas: solo el dueño
CREATE POLICY "own plans"       ON workout_plans       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own sessions"    ON workout_sessions    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own metrics"     ON progress_metrics    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own wearables"   ON wearable_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own insights"    ON ai_insights         FOR ALL USING (auth.uid() = user_id);
-- session_exercises: acceso via sesión
CREATE POLICY "own session_exercises" ON session_exercises FOR ALL
  USING (EXISTS (SELECT 1 FROM workout_sessions ws WHERE ws.id = session_id AND ws.user_id = auth.uid()));
CREATE POLICY "own session_sets" ON session_sets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM session_exercises se
    JOIN workout_sessions ws ON ws.id = se.session_id
    WHERE se.id = session_exercise_id AND ws.user_id = auth.uid()
  ));

-- ── MIGRACIONES (si ya existe el schema, correr solo esto) ──
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- ── AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── SEED: EJERCICIOS BASE ────────────────────────────────────
INSERT INTO exercises (name, muscle_groups, equipment, difficulty) VALUES
  ('Press Banca con Barra',        ARRAY['pecho','tríceps','hombros'], ARRAY['barra','banco'], 3),
  ('Press Inclinado Mancuernas',   ARRAY['pecho superior','hombros'],  ARRAY['mancuernas','banco'], 3),
  ('Press Militar',                ARRAY['hombros','tríceps'],         ARRAY['barra'], 3),
  ('Elevaciones Laterales',        ARRAY['hombros'],                   ARRAY['mancuernas'], 2),
  ('Extensión Tríceps Cable',      ARRAY['tríceps'],                   ARRAY['cable'], 2),
  ('Face Pulls',                   ARRAY['hombros posteriores','manguito'], ARRAY['cable'], 2),
  ('Sentadilla con Barra',         ARRAY['cuádriceps','glúteos','isquios'], ARRAY['barra','rack'], 4),
  ('Peso Muerto Rumano',           ARRAY['isquios','glúteos','espalda baja'], ARRAY['barra'], 3),
  ('Hip Thrust',                   ARRAY['glúteos'],                   ARRAY['banco','barra'], 3),
  ('Prensa de Piernas',            ARRAY['cuádriceps','glúteos'],      ARRAY['máquina'], 2),
  ('Dominadas',                    ARRAY['espalda','bíceps'],          ARRAY['barra dominadas'], 4),
  ('Remo con Barra',               ARRAY['espalda','bíceps'],          ARRAY['barra'], 3),
  ('Curl de Bíceps',               ARRAY['bíceps'],                    ARRAY['mancuernas'], 2),
  ('Plancha',                      ARRAY['core','hombros'],            ARRAY[]::TEXT[], 2),
  ('Cardio LISS Running',          ARRAY['cardiovascular'],            ARRAY[]::TEXT[], 1);
