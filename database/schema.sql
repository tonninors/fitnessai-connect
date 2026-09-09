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
  -- Único: el catálogo se referencia por nombre desde el plan generado por IA
  -- y el seed es idempotente gracias a esta restricción (ON CONFLICT (name)).
  name           TEXT     NOT NULL UNIQUE,
  -- Identificador estable del catálogo (`exercise_id` del CSV). El nombre en
  -- español puede reescribirse; el slug no, así que es la clave de importación.
  slug           TEXT     UNIQUE,
  name_en        TEXT,
  muscle_groups  TEXT[]   NOT NULL,
  equipment      TEXT[]   DEFAULT '{}',
  description    TEXT,
  video_url      TEXT,
  image_url      TEXT,
  difficulty     INT      CHECK (difficulty BETWEEN 1 AND 5),
  -- Bloque del entrenamiento al que pertenece el ejercicio del catálogo.
  -- Permite filtrar candidatos al proponer alternativas.
  exercise_type  TEXT     DEFAULT 'strength' CHECK (exercise_type IN ('warmup','strength','cardio','cooldown')),

  -- ── HUELLA BIOMECÁNICA ──
  -- Alimenta el motor de similitud (backend/lib/similarity.js). Dos ejercicios
  -- pueden compartir músculos y no ser intercambiables: cambian la trayectoria,
  -- la estabilidad, el rango y la fatiga.
  --
  -- AVISO SOBRE LA PROCEDENCIA DE ESTOS DATOS: los campos cuantitativos
  -- (resistance_profile, muscle_length_bias, rom, stability_demand, fatigue,
  -- skill_demand) son ESTIMACIONES HEURÍSTICAS revisadas a mano, no mediciones
  -- de laboratorio. En particular NO derivan de amplitudes de EMG, que no están
  -- validadas como predictor de hipertrofia. Trátalos como una clasificación
  -- editorial.
  --
  -- Fuente: database/catalog/exercises_v2_science_based.csv, importado con
  -- `node backend/scripts/import-catalog-v2.mjs`.

  -- Zona del cuerpo ('chest','back','legs'…). Agrupa el catálogo para la UI.
  body_region        TEXT,
  -- Familia del ejercicio ('bench_press','barbell_row'…): distingue una variante
  -- del mismo ejercicio de otro con huella parecida. La usa familySimilarity().
  exercise_family    TEXT,
  -- Vocabulario del catálogo v2 (47 patrones) + los tres del catálogo v1
  -- ('core','cardio','mobility'), que sobreviven en las filas ya referenciadas
  -- por sesiones antiguas.
  movement_pattern   TEXT CHECK (movement_pattern IN (
                       'ankle_dorsiflexion','anti_extension','anti_lateral_flexion',
                       'anti_rotation','calf_raise','carry','diagonal_adduction','diagonal_pull',
                       'diagonal_push','dip_push','elbow_extension','elbow_flexion',
                       'external_rotation','forearm_rotation','grip_isometric','hip_abduction',
                       'hip_adduction','hip_extension','hip_flexion','hip_flexion_extension',
                       'hip_hinge','hip_rotation','horizontal_abduction','horizontal_adduction',
                       'horizontal_pull','horizontal_push','knee_extension','knee_flexion',
                       'locomotion','lunge','posterior_pelvic_tilt','rear_delt_pull','rotation',
                       'scapular_elevation','shoulder_abduction','shoulder_circumduction',
                       'shoulder_extension','shoulder_flexion','spinal_flexion_extension',
                       'squat','stretch','trunk_flexion','vertical_pull','vertical_push',
                       'wrist_extension','wrist_flexion','wrist_flexion_extension',
                       'core','cardio','mobility')),
  -- Patrón acompañante cuando el ejercicio encadena dos (mismo vocabulario que
  -- `movement_pattern`; sin CHECK para no duplicar la lista).
  secondary_pattern  TEXT,
  -- 0 = trayectoria horizontal, 90 = vertical. Negativo = declinado (press
  -- declinado a -15°, fondos con sesgo a pecho a -35°). NULL si no aplica.
  movement_angle     INT  CHECK (movement_angle BETWEEN -90 AND 90),
  -- Músculo → contribución. 1.00 objetivo · 0.75 alta · 0.50 secundario · 0.25 estabilizador.
  muscle_map         JSONB DEFAULT '{}'::jsonb,
  -- Porción del músculo → contribución, p. ej. {"pectoralis_major.sternal":1.0}.
  region_bias        JSONB,
  -- Articulación → acciones, p. ej. {"hombro":["extension"],"codo":["flexion"]}.
  joint_actions      JSONB DEFAULT '{}'::jsonb,
  rom                INT  CHECK (rom BETWEEN 1 AND 3),
  -- 'dynamic' es para el material que recorre todo el rango (movilidad, cardio).
  muscle_length_bias TEXT CHECK (muscle_length_bias IN ('lengthened','mid','shortened','balanced','dynamic')),
  -- Dificultad relativa en [recorrido largo, medio, corto].
  resistance_profile JSONB,
  -- Accesorio de polea/máquina ('rope','single_handle'…). NULL si no aplica.
  attachment         TEXT,
  -- {"position":"bent_over","torso_angle":45,"chest_supported":false,"back_supported":false}
  body_support       JSONB DEFAULT '{}'::jsonb,
  -- {"orientation":"pronated","width":"medium","elbow_path":"tucked"}
  grip               JSONB DEFAULT '{}'::jsonb,
  -- 1 = máquina con pecho apoyado · 5 = unilateral de pie.
  stability_demand   INT  CHECK (stability_demand BETWEEN 1 AND 5),
  laterality         TEXT CHECK (laterality IN (
                       'bilateral','unilateral','alternating',
                       'independent_bilateral','unilateral_direction','unilateral_or_bilateral')),
  is_compound        BOOLEAN,
  kinetic_chain      TEXT CHECK (kinetic_chain IN ('open','closed','mixed')),
  -- {"systemic":4,"lower_back":5,"grip":3} en escala 1-5.
  fatigue            JSONB DEFAULT '{}'::jsonb,
  -- Técnica que exige el ejercicio: 1 = una máquina · 5 = arrancada olímpica.
  skill_demand       INT  CHECK (skill_demand BETWEEN 1 AND 5),

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
  elapsed_seconds       INT    NOT NULL DEFAULT 0, -- tiempo entrenado (sin pausas), sincronizado durante la sesión
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
  -- Bloque al que pertenece el ejercicio dentro de la sesion.
  exercise_type    TEXT     DEFAULT 'strength' CHECK (exercise_type IN ('warmup','strength','cardio','cooldown')),
  -- Duracion para ejercicios por tiempo (movilidad, cardio, estiramientos).
  duration_seconds INT,
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
  logged_at            TIMESTAMPTZ DEFAULT NOW(),
  -- Requerido por el upsert de POST /workouts/.../sets (onConflict).
  UNIQUE(session_exercise_id, set_number)
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

-- ── ÍNDICES ──────────────────────────────────────────────────
-- Sin estos índices, cada consulta del dashboard hacía un seq scan sobre
-- workout_sessions. Cubren los filtros reales del backend.
CREATE INDEX IF NOT EXISTS idx_sessions_user_date     ON workout_sessions (user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sessions_user_status   ON workout_sessions (user_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at  ON workout_sessions (user_id, completed_at) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_sessions_plan          ON workout_sessions (plan_id);
CREATE INDEX IF NOT EXISTS idx_plans_user_status      ON workout_plans (user_id, status);
CREATE INDEX IF NOT EXISTS idx_session_exercises_sess ON session_exercises (session_id, order_num);
CREATE INDEX IF NOT EXISTS idx_session_sets_exercise  ON session_sets (session_exercise_id);
CREATE INDEX IF NOT EXISTS idx_metrics_user_date      ON progress_metrics (user_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_insights_user_created  ON ai_insights (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_trainer       ON profiles (trainer_id);
CREATE INDEX IF NOT EXISTS idx_messages_pair          ON messages (sender_id, receiver_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_receiver      ON messages (receiver_id, created_at DESC);
-- Catálogo: el generador de planes y el buscador de alternativas leen los
-- ejercicios públicos filtrando por bloque.
CREATE INDEX IF NOT EXISTS idx_exercises_public_type  ON exercises (exercise_type) WHERE is_public = TRUE;
-- Alternativas: la familia es la señal más fuerte del motor de similitud y se
-- filtra por ella para acotar candidatos antes de puntuarlos.
CREATE INDEX IF NOT EXISTS idx_exercises_family        ON exercises (exercise_family) WHERE is_public = TRUE;

-- ── MIGRACIONES ──────────────────────────────────────────────
-- Ejecutar este bloque si la base de datos ya existe.
-- Es idempotente: se puede correr varias veces sin efectos.
--
-- IMPORTANTE: después de este bloque hay que ejecutar TAMBIÉN el INSERT del
-- catálogo de ejercicios (sección SEED, al final del archivo) y el índice
-- `idx_exercises_public_type`. Sin el catálogo, /alternatives no encuentra
-- candidatos y los planes nuevos no pueden enlazar `exercise_id`.

-- 1. Onboarding (ya existente en instalaciones anteriores).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 2. Bloques del entrenamiento. El backend y el WorkoutModal dependen de estas
--    dos columnas; faltaban en el schema versionado.
ALTER TABLE session_exercises
  ADD COLUMN IF NOT EXISTS exercise_type TEXT DEFAULT 'strength';
ALTER TABLE session_exercises
  ADD COLUMN IF NOT EXISTS duration_seconds INT;
UPDATE session_exercises SET exercise_type = 'strength' WHERE exercise_type IS NULL;

-- 3. Clave única que necesita el upsert de series
--    (POST /api/workouts/sessions/:s/exercises/:e/sets). Sin ella el endpoint
--    fallaba con "there is no unique or exclusion constraint matching...".
--    Primero se eliminan duplicados, si los hubiera.
DELETE FROM session_sets a
  USING session_sets b
  WHERE a.id < b.id
    AND a.session_exercise_id = b.session_exercise_id
    AND a.set_number = b.set_number;
ALTER TABLE session_sets
  DROP CONSTRAINT IF EXISTS session_sets_session_exercise_id_set_number_key;
ALTER TABLE session_sets
  ADD CONSTRAINT session_sets_session_exercise_id_set_number_key
  UNIQUE (session_exercise_id, set_number);

-- 4. Catálogo de ejercicios: bloque del entrenamiento y nombre único.
--    `exercise_type` permite filtrar candidatos al proponer alternativas;
--    el UNIQUE(name) es lo que hace idempotente el seed y lo que permite
--    resolver `session_exercises.exercise_id` a partir del nombre.
ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS exercise_type TEXT DEFAULT 'strength';
UPDATE exercises SET exercise_type = 'strength' WHERE exercise_type IS NULL;
ALTER TABLE exercises
  DROP CONSTRAINT IF EXISTS exercises_exercise_type_check;
ALTER TABLE exercises
  ADD CONSTRAINT exercises_exercise_type_check
  CHECK (exercise_type IN ('warmup','strength','cardio','cooldown'));

-- Duplicados por nombre antes de crear el UNIQUE: se conserva la fila más
-- antigua y las referencias de `session_exercises` se reapuntan a ella.
UPDATE session_exercises se
  SET exercise_id = keep.id
  FROM exercises dup
  JOIN LATERAL (
    SELECT e.id FROM exercises e WHERE e.name = dup.name ORDER BY e.created_at, e.id LIMIT 1
  ) keep ON TRUE
  WHERE se.exercise_id = dup.id AND keep.id <> dup.id;
DELETE FROM exercises a
  USING exercises b
  WHERE a.name = b.name AND (a.created_at, a.id) > (b.created_at, b.id);
ALTER TABLE exercises
  DROP CONSTRAINT IF EXISTS exercises_name_key;
ALTER TABLE exercises
  ADD CONSTRAINT exercises_name_key UNIQUE (name);

-- 5. Huella biomecánica del catálogo. Alimenta el motor de similitud que
--    propone ejercicios alternativos (backend/lib/similarity.js). Antes de
--    esto, sin atributos que comparar, las alternativas salían por orden
--    alfabético y un remo podía "sustituirse" por un curl de bíceps.
--
--    Los campos cuantitativos son estimaciones heurísticas revisadas a mano,
--    NO mediciones (ver el comentario de la tabla `exercises`).
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS movement_pattern   TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS movement_angle     INT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS muscle_map         JSONB DEFAULT '{}'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS joint_actions      JSONB DEFAULT '{}'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS rom                INT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS muscle_length_bias TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS resistance_profile JSONB;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS body_support       JSONB DEFAULT '{}'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS stability_demand   INT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS laterality         TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS is_compound        BOOLEAN;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS kinetic_chain      TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS fatigue            JSONB DEFAULT '{}'::jsonb;

-- Los CHECK se recrean para que la migración sea repetible y para no fallar si
-- una instalación anterior ya tenía una versión distinta de la restricción.
--
-- `movement_pattern`, `movement_angle`, `muscle_length_bias` y `laterality` NO
-- se restringen aquí: el punto 6 los define con el vocabulario del catálogo v2,
-- que es más amplio. Si se declararan aquí con la lista v1, volver a correr el
-- bloque sobre una base que ya tiene el catálogo v2 fallaría.
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_rom_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_rom_check
  CHECK (rom IS NULL OR rom BETWEEN 1 AND 3);

ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_stability_demand_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_stability_demand_check
  CHECK (stability_demand IS NULL OR stability_demand BETWEEN 1 AND 5);

ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_kinetic_chain_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_kinetic_chain_check
  CHECK (kinetic_chain IS NULL OR kinetic_chain IN ('open','closed','mixed'));

-- Índice para filtrar candidatos por patrón dentro de un bloque.
CREATE INDEX IF NOT EXISTS idx_exercises_pattern
  ON exercises (movement_pattern) WHERE is_public = TRUE;

-- 6. Catálogo v2 (150 ejercicios). Amplía la huella biomecánica del punto 5 con
--    las columnas que trae `database/catalog/exercises_v2_science_based.csv` y
--    abre los CHECK a su vocabulario, mucho más fino que el del catálogo v1.
--
--    Después de este bloque hay que ejecutar
--    `database/migrations/2026-09-05-catalogo-v2.sql`, que borra el catálogo
--    viejo e inserta el nuevo. Los planes ya generados apuntan a ejercicios del
--    catálogo v1: hay que regenerarlos.
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS slug              TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS name_en           TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS body_region       TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS exercise_family   TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS secondary_pattern TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS region_bias       JSONB;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS attachment        TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS grip              JSONB DEFAULT '{}'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS skill_demand      INT;

-- `slug` es la clave de importación del catálogo: el nombre en español puede
-- reescribirse, el slug no. Las filas del catálogo v1 se quedan con slug NULL
-- (Postgres admite varios NULL en un UNIQUE) hasta que el ON CONFLICT (name)
-- del seed v2 se lo asigne.
--
-- Duplicados por slug antes de crear el UNIQUE: mismo criterio que el punto 4
-- con el nombre — se conserva la fila más antigua y las referencias de
-- `session_exercises` se reapuntan a ella para no violar la FK al borrar.
UPDATE session_exercises se
  SET exercise_id = keep.id
  FROM exercises dup
  JOIN LATERAL (
    SELECT e.id FROM exercises e WHERE e.slug = dup.slug ORDER BY e.created_at, e.id LIMIT 1
  ) keep ON TRUE
  WHERE dup.slug IS NOT NULL AND se.exercise_id = dup.id AND keep.id <> dup.id;
DELETE FROM exercises a
  USING exercises b
  WHERE a.slug IS NOT NULL AND a.slug = b.slug AND (a.created_at, a.id) > (b.created_at, b.id);
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_slug_key;
ALTER TABLE exercises ADD CONSTRAINT exercises_slug_key UNIQUE (slug);

ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_skill_demand_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_skill_demand_check
  CHECK (skill_demand IS NULL OR skill_demand BETWEEN 1 AND 5);

-- Los 47 patrones del CSV v2. Se conservan 'core', 'cardio' y 'mobility' del
-- catálogo v1: las filas referenciadas por sesiones antiguas no se borran y
-- seguirían llevando esos valores, así que recortar la lista rompería el ALTER.
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_movement_pattern_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_movement_pattern_check
  CHECK (movement_pattern IS NULL OR movement_pattern IN (
    'ankle_dorsiflexion','anti_extension','anti_lateral_flexion',
    'anti_rotation','calf_raise','carry','diagonal_adduction','diagonal_pull',
    'diagonal_push','dip_push','elbow_extension','elbow_flexion',
    'external_rotation','forearm_rotation','grip_isometric','hip_abduction',
    'hip_adduction','hip_extension','hip_flexion','hip_flexion_extension',
    'hip_hinge','hip_rotation','horizontal_abduction','horizontal_adduction',
    'horizontal_pull','horizontal_push','knee_extension','knee_flexion',
    'locomotion','lunge','posterior_pelvic_tilt','rear_delt_pull','rotation',
    'scapular_elevation','shoulder_abduction','shoulder_circumduction',
    'shoulder_extension','shoulder_flexion','spinal_flexion_extension',
    'squat','stretch','trunk_flexion','vertical_pull','vertical_push',
    'wrist_extension','wrist_flexion','wrist_flexion_extension',
    'core','cardio','mobility'));

-- El CSV v2 marca en negativo los ángulos declinados (press declinado a -15°),
-- que el CHECK original (0-90) rechazaba.
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_movement_angle_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_movement_angle_check
  CHECK (movement_angle IS NULL OR movement_angle BETWEEN -90 AND 90);

-- 'dynamic': el ejercicio recorre todo el rango sin sesgo (movilidad, cardio).
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_muscle_length_bias_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_muscle_length_bias_check
  CHECK (muscle_length_bias IS NULL OR muscle_length_bias IN (
    'lengthened','mid','shortened','balanced','dynamic'));

-- Los seis valores del CSV v2: además de bilateral/unilateral/alternating,
-- 'independent_bilateral' (dos cargas independientes), 'unilateral_direction'
-- (bilateral con sesgo a un lado) y 'unilateral_or_bilateral'.
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_laterality_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_laterality_check
  CHECK (laterality IS NULL OR laterality IN (
    'bilateral','unilateral','alternating',
    'independent_bilateral','unilateral_direction','unilateral_or_bilateral'));

-- Índice para acotar candidatos por familia al proponer alternativas.
CREATE INDEX IF NOT EXISTS idx_exercises_family
  ON exercises (exercise_family) WHERE is_public = TRUE;

-- 7. Tiempo entrenado por sesión (segundos, sin pausas). El cronómetro vivía
--    sólo en el navegador y una recarga o un cambio de dispositivo lo perdía.
--    El cliente lo sincroniza en PATCH /api/workouts/sessions/:id/progress y
--    /api/workouts/plan y /api/home lo devuelven para reanudar desde ahí.
--    (Mismo contenido que database/migrations/2026-09-08-tiempo-entrenado.sql.)
ALTER TABLE workout_sessions
  ADD COLUMN IF NOT EXISTS elapsed_seconds INT NOT NULL DEFAULT 0;

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

-- ── SEED: CATÁLOGO DE EJERCICIOS ─────────────────────────────
-- El catálogo NO vive aquí: son 150 ejercicios con huella biomecánica y
-- mantenerlos en línea haría este archivo ilegible.
--
-- Fuente de verdad:  database/catalog/exercises_v2_science_based.csv
-- Generar el SQL:    node backend/scripts/import-catalog-v2.mjs
-- Aplicar en Supabase: database/migrations/2026-09-05-APLICAR-catalogo-v2.sql
--                     (lleva las migraciones y el catálogo, en ese orden)
--
-- Sin ejecutar ese archivo la tabla `exercises` queda vacía: no habrá
-- alternativas que proponer y los planes generados por IA no podrán enlazar
-- `session_exercises.exercise_id`.
