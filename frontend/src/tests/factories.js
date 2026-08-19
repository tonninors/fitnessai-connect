/**
 * Fábricas de datos de prueba con contenido realista en español,
 * equivalentes a lo que devuelve el backend.
 */

let seq = 0;
const nextId = prefix => `${prefix}-${++seq}`;

export function makeExercise(over = {}) {
  return {
    id: nextId('ex'),
    exercise_name: 'Press Banca con Barra',
    order_num: 1,
    sets: 4,
    reps: 6,
    weight_kg: 60,
    rest_seconds: 180,
    duration_seconds: null,
    exercise_type: 'strength',
    completed: false,
    ...over,
  };
}

/** Sesión con los 4 bloques: calentamiento, fuerza, cardio y estiramiento. */
export function makeSession(over = {}) {
  return {
    id: nextId('sess'),
    name: 'Push A — Pecho y Hombros',
    scheduled_date: '2026-08-18',
    status: 'scheduled',
    estimated_duration: 60,
    estimated_calories: 350,
    rpe_target: 7,
    focus_areas: ['pecho', 'hombros'],
    week_number: 1,
    day_order: 1,
    session_exercises: [
      makeExercise({ exercise_name: 'Movilidad de hombro', exercise_type: 'warmup', sets: 1, reps: null, weight_kg: null, rest_seconds: null, duration_seconds: 45, order_num: 1 }),
      makeExercise({ exercise_name: 'Press Banca con Barra', exercise_type: 'strength', sets: 2, reps: 6, weight_kg: 60, rest_seconds: 120, order_num: 2 }),
      makeExercise({ exercise_name: 'Elevaciones Laterales', exercise_type: 'strength', sets: 3, reps: 12, weight_kg: 10, rest_seconds: 60, order_num: 3 }),
      makeExercise({ exercise_name: 'Estiramiento de pectoral', exercise_type: 'cooldown', sets: 1, reps: null, weight_kg: null, rest_seconds: null, duration_seconds: 40, order_num: 4 }),
    ],
    ...over,
  };
}

export function makePlan(over = {}) {
  return {
    id: nextId('plan'),
    name: 'Plan Fuerza 4 Semanas',
    description: 'Push / Pull / Legs',
    total_weeks: 4,
    current_week: 1,
    focus_areas: ['pecho', 'espalda'],
    ai_generated: true,
    workout_sessions: [makeSession()],
    ...over,
  };
}

export function makeHomeData(over = {}) {
  return {
    greeting: 'Buenos días',
    profile: { full_name: 'Carlos Mendoza', current_streak: 5, subscription_plan: 'pro', trainer_id: null },
    today_session: makeSession(),
    next_session: null,
    ai_insight: 'Tu HRV está estable. Mantén la intensidad planificada.',
    activity_rings: { movement: 60, exercise: 45, standing: 80 },
    hrv: 62,
    week_sessions: [],
    ...over,
  };
}

export function makeProfile(over = {}) {
  return {
    id: 'user-1',
    full_name: 'Carlos Mendoza',
    email: 'carlos@example.com',
    subscription_plan: 'pro',
    current_streak: 5,
    level: 2,
    level_name: 'En forma',
    total_sessions: 12,
    onboarding_completed: true,
    goals: { primary: 'ganar_musculo', all: ['ganar_musculo', 'perder_grasa'] },
    availability: { days_per_week: 4, session_duration: 60, cardio_minutes: 15 },
    wearables: [],
    ...over,
  };
}

export function makeProgressStats(over = {}) {
  return {
    streak: 5,
    longest_streak: 11,
    level: 2,
    level_name: 'En forma',
    total_workouts: 12,
    total_calories: 4200,
    total_hours: 9,
    weekly_volume: [
      { label: 'S1', val: 120 },
      { label: 'S2', val: 180 },
      { label: 'S3', val: 90 },
      { label: 'S4', val: 210 },
    ],
    ...over,
  };
}
