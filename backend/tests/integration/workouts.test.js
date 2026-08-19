import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createTestApp, authHeader } from '../helpers/test-app.js';
import { hasFilter, TEST_USER, TEST_SESSION_ID, TEST_EXERCISE_ID } from '../helpers/supabase-mock.js';
import { todayISO, addDays } from '../../lib/dates.js';

let ctx;
afterEach(() => ctx?.restore());

/** Resolver base: la sesión pertenece al usuario y el ejercicio a la sesión. */
function ownedResolver(overrides = {}) {
  return (q) => {
    if (overrides[q.table]) {
      const result = overrides[q.table](q);
      if (result !== undefined) return result;
    }
    if (q.table === 'workout_sessions') {
      if (q.op === 'select') return { data: { id: TEST_SESSION_ID }, error: null };
      if (q.op === 'update') return { data: { id: TEST_SESSION_ID, status: 'completed' }, error: null };
    }
    if (q.table === 'session_exercises') {
      if (q.op === 'select') return { data: { id: TEST_EXERCISE_ID, sets: 4 }, error: null };
      if (q.op === 'update') return { data: { id: TEST_EXERCISE_ID, completed: true }, error: null };
    }
    if (q.table === 'session_sets') return { data: { id: 'set-1', set_number: 2 }, error: null };
    if (q.table === 'profiles') return { data: { current_streak: 3, longest_streak: 5 }, error: null };
    return { data: null, error: null };
  };
}

describe('GET /api/workouts/plan', () => {
  it('devuelve el plan activo del usuario autenticado', async () => {
    ctx = createTestApp({
      resolver: q => (q.table === 'workout_plans' ? { data: { id: 'plan-1', name: 'Plan Fuerza' } } : { data: null }),
    });

    const res = await request(ctx.app).get('/api/workouts/plan').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Plan Fuerza');

    const query = ctx.supabase.queriesFor('workout_plans')[0];
    expect(hasFilter(query, 'eq', 'user_id', TEST_USER.id)).toBe(true);
    expect(hasFilter(query, 'eq', 'status', 'active')).toBe(true);
  });

  it('pide exercise_type y duration_seconds (los necesita el flujo por bloques)', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null }) });
    await request(ctx.app).get('/api/workouts/plan').set(authHeader);
    const columns = ctx.supabase.queriesFor('workout_plans')[0].columns;
    expect(columns).toContain('exercise_type');
    expect(columns).toContain('duration_seconds');
  });

  it('devuelve null cuando el usuario no tiene plan', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).get('/api/workouts/plan').set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it('traduce un error de base de datos a 400', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: { message: 'boom' } }) });
    const res = await request(ctx.app).get('/api/workouts/plan').set(authHeader);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('boom');
  });
});

describe('GET /api/workouts/upcoming', () => {
  it('excluye sesiones completadas y saltadas del plan activo', async () => {
    ctx = createTestApp({ resolver: () => ({ data: [{ id: 's1' }], error: null }) });
    const res = await request(ctx.app).get('/api/workouts/upcoming').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);

    const query = ctx.supabase.queriesFor('workout_sessions')[0];
    expect(hasFilter(query, 'neq', 'status', 'completed')).toBe(true);
    expect(hasFilter(query, 'neq', 'status', 'skipped')).toBe(true);
    expect(hasFilter(query, 'eq', 'workout_plans.status', 'active')).toBe(true);
  });

  it('devuelve [] si no hay datos', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).get('/api/workouts/upcoming').set(authHeader);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/workouts/sessions/:id/start', () => {
  it('marca la sesión como in_progress', async () => {
    ctx = createTestApp({
      resolver: q => (q.table === 'workout_sessions'
        ? { data: { id: TEST_SESSION_ID, status: 'in_progress' }, error: null }
        : { data: null }),
    });

    const res = await request(ctx.app).post(`/api/workouts/sessions/${TEST_SESSION_ID}/start`).set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in_progress');
  });

  it('devuelve 403 si la sesión es de otro usuario', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).post(`/api/workouts/sessions/${TEST_SESSION_ID}/start`).set(authHeader);
    expect(res.status).toBe(403);
  });

  it('rechaza un id que no es UUID', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app).post('/api/workouts/sessions/not-a-uuid/start').set(authHeader);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/workouts/sessions/:id/complete', () => {
  it('completa la sesión y persiste las métricas validadas', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });

    const res = await request(ctx.app)
      .patch(`/api/workouts/sessions/${TEST_SESSION_ID}/complete`)
      .set(authHeader)
      .send({ actual_duration: 48, actual_calories: 420, rpe_actual: 8 });

    expect(res.status).toBe(200);

    const update = ctx.supabase.queriesFor('workout_sessions').find(q => q.op === 'update');
    expect(update.payload).toMatchObject({ status: 'completed', actual_duration: 48, actual_calories: 420, rpe_actual: 8 });
    expect(update.payload.completed_at).toBeTruthy();
  });

  it('acepta un cuerpo vacío (finalizar sin métricas)', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app)
      .patch(`/api/workouts/sessions/${TEST_SESSION_ID}/complete`)
      .set(authHeader)
      .send({});
    expect(res.status).toBe(200);
  });

  it('rechaza un RPE fuera de rango', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app)
      .patch(`/api/workouts/sessions/${TEST_SESSION_ID}/complete`)
      .set(authHeader)
      .send({ rpe_actual: 42 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/rpe_actual/);
  });

  it('devuelve 403 si la sesión no es del usuario', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app)
      .patch(`/api/workouts/sessions/${TEST_SESSION_ID}/complete`)
      .set(authHeader)
      .send({});
    expect(res.status).toBe(403);
  });

  it('incrementa la racha si ayer también entrenó', async () => {
    const yesterday = addDays(todayISO(), -1);
    ctx = createTestApp({
      resolver: ownedResolver({
        workout_sessions: (q) => {
          if (q.op !== 'select') return undefined;
          if (hasFilter(q, 'eq', 'scheduled_date', yesterday)) return { data: [{ id: 'ayer' }], error: null };
          if (hasFilter(q, 'eq', 'scheduled_date', todayISO())) return { data: [], error: null };
          return { data: { id: TEST_SESSION_ID }, error: null };
        },
      }),
    });

    await request(ctx.app)
      .patch(`/api/workouts/sessions/${TEST_SESSION_ID}/complete`)
      .set(authHeader)
      .send({});

    const profileUpdate = ctx.supabase.queriesFor('profiles').find(q => q.op === 'update');
    expect(profileUpdate.payload).toMatchObject({ current_streak: 4, longest_streak: 5, level: 1 });
  });

  it('no vuelve a incrementar la racha si hoy ya se completó otra sesión', async () => {
    const yesterday = addDays(todayISO(), -1);
    ctx = createTestApp({
      resolver: ownedResolver({
        workout_sessions: (q) => {
          if (q.op !== 'select') return undefined;
          if (hasFilter(q, 'eq', 'scheduled_date', yesterday)) return { data: [{ id: 'ayer' }], error: null };
          if (hasFilter(q, 'eq', 'scheduled_date', todayISO())) {
            return { data: [{ id: 'otra-de-hoy' }, { id: TEST_SESSION_ID }], error: null };
          }
          return { data: { id: TEST_SESSION_ID }, error: null };
        },
      }),
    });

    await request(ctx.app)
      .patch(`/api/workouts/sessions/${TEST_SESSION_ID}/complete`)
      .set(authHeader)
      .send({});

    const profileUpdate = ctx.supabase.queriesFor('profiles').find(q => q.op === 'update');
    expect(profileUpdate.payload.current_streak).toBe(3);
  });
});

describe('PATCH .../exercises/:exerciseId/toggle', () => {
  const url = `/api/workouts/sessions/${TEST_SESSION_ID}/exercises/${TEST_EXERCISE_ID}/toggle`;

  it('marca el ejercicio como completado', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app).patch(url).set(authHeader).send({ completed: true });
    expect(res.status).toBe(200);

    const update = ctx.supabase.queriesFor('session_exercises').find(q => q.op === 'update');
    expect(update.payload).toEqual({ completed: true });
  });

  it('exige que completed sea booleano', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app).patch(url).set(authHeader).send({ completed: 'sí' });
    expect(res.status).toBe(400);
  });

  it('devuelve 403 si la sesión es de otro usuario', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).patch(url).set(authHeader).send({ completed: true });
    expect(res.status).toBe(403);
  });

  it('devuelve 404 si el ejercicio no pertenece a la sesión', async () => {
    ctx = createTestApp({
      resolver: ownedResolver({ session_exercises: () => ({ data: null, error: null }) }),
    });
    const res = await request(ctx.app).patch(url).set(authHeader).send({ completed: true });
    expect(res.status).toBe(404);
  });
});

describe('POST .../exercises/:exerciseId/sets', () => {
  const url = `/api/workouts/sessions/${TEST_SESSION_ID}/exercises/${TEST_EXERCISE_ID}/sets`;

  it('registra la serie con upsert idempotente', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });

    const res = await request(ctx.app).post(url).set(authHeader)
      .send({ set_number: 2, reps_actual: 8, weight_actual_kg: 60 });

    expect(res.status).toBe(200);
    const upsert = ctx.supabase.queriesFor('session_sets')[0];
    expect(upsert.op).toBe('upsert');
    expect(upsert.options.onConflict).toBe('session_exercise_id,set_number');
    expect(upsert.payload).toMatchObject({
      session_exercise_id: TEST_EXERCISE_ID,
      set_number: 2,
      reps_actual: 8,
      weight_actual_kg: 60,
      completed: true,
    });
  });

  it('IDOR: no permite escribir series en la sesión de otro usuario', async () => {
    // Regresión de seguridad: este endpoint no comprobaba la propiedad de la
    // sesión, así que cualquier usuario autenticado podía registrar series en
    // el ejercicio de otro conociendo su id.
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });

    const res = await request(ctx.app).post(url).set(authHeader).send({ set_number: 1 });

    expect(res.status).toBe(403);
    expect(ctx.supabase.queriesFor('session_sets')).toHaveLength(0);
  });

  it('exige set_number', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app).post(url).set(authHeader).send({ reps_actual: 10 });
    expect(res.status).toBe(400);
  });

  it('rechaza pesos negativos', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app).post(url).set(authHeader).send({ set_number: 1, weight_actual_kg: -20 });
    expect(res.status).toBe(400);
  });
});
