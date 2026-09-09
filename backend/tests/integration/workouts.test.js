import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createTestApp, authHeader } from '../helpers/test-app.js';
import { hasFilter, TEST_USER, TEST_SESSION_ID, TEST_EXERCISE_ID } from '../helpers/supabase-mock.js';
import { todayISO, addDays } from '../../lib/dates.js';

let ctx;
afterEach(() => ctx?.restore());

/** Catálogo público de ejercicios que devuelve el doble de Supabase. */
// Huella biomecánica incluida: es lo que ordena las alternativas.
const CATALOG = [
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', name: 'Press Banca con Barra', muscle_groups: ['pecho', 'tríceps', 'hombros'], equipment: ['barra', 'banco'], description: 'Baja al esternón y empuja.', image_url: null, video_url: null, exercise_type: 'strength', movement_pattern: 'horizontal_push', movement_angle: 0, muscle_map: { pecho: 1.0, tríceps: 0.75, 'deltoides anterior': 0.65 }, joint_actions: { hombro: ['aduccion_horizontal'], codo: ['extension'] }, rom: 2, muscle_length_bias: 'mid', resistance_profile: [0.5, 1.0, 0.7], body_support: { position: 'supine', chest_supported: false, back_supported: true }, stability_demand: 3, laterality: 'bilateral', is_compound: true, kinetic_chain: 'open', fatigue: { systemic: 4, lower_back: 1, grip: 2, stability: 3 } },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', name: 'Press Banca con Mancuernas', muscle_groups: ['pecho', 'tríceps', 'hombros'], equipment: ['mancuernas', 'banco'], description: 'Baja controlando y empuja.', image_url: null, video_url: null, exercise_type: 'strength', movement_pattern: 'horizontal_push', movement_angle: 0, muscle_map: { pecho: 1.0, tríceps: 0.75, 'deltoides anterior': 0.65 }, joint_actions: { hombro: ['aduccion_horizontal'], codo: ['extension'] }, rom: 2, muscle_length_bias: 'mid', resistance_profile: [0.5, 1.0, 0.7], body_support: { position: 'supine', chest_supported: false, back_supported: true }, stability_demand: 3, laterality: 'bilateral', is_compound: true, kinetic_chain: 'open', fatigue: { systemic: 4, lower_back: 1, grip: 2, stability: 3 } },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', name: 'Flexiones de Pecho', muscle_groups: ['pecho', 'tríceps', 'core'], equipment: [], description: 'Cuerpo en línea recta.', image_url: null, video_url: null, exercise_type: 'strength', movement_pattern: 'horizontal_push', movement_angle: 0, muscle_map: { pecho: 1.0, tríceps: 0.75, 'deltoides anterior': 0.6, core: 0.5 }, joint_actions: { hombro: ['aduccion_horizontal'], codo: ['extension'] }, rom: 2, muscle_length_bias: 'mid', resistance_profile: [0.5, 1.0, 0.7], body_support: { position: 'prone', chest_supported: false, back_supported: false }, stability_demand: 3, laterality: 'bilateral', is_compound: true, kinetic_chain: 'closed', fatigue: { systemic: 3, lower_back: 2, grip: 1, stability: 3 } },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', name: 'Aperturas con Mancuernas', muscle_groups: ['pecho'], equipment: ['mancuernas', 'banco'], description: 'Abre en arco.', image_url: null, video_url: null, exercise_type: 'strength', movement_pattern: 'horizontal_push', movement_angle: 0, muscle_map: { pecho: 1.0, 'deltoides anterior': 0.4 }, joint_actions: { hombro: ['aduccion_horizontal'] }, rom: 3, muscle_length_bias: 'lengthened', resistance_profile: [1.0, 0.8, 0.3], body_support: { position: 'supine', chest_supported: false, back_supported: true }, stability_demand: 3, laterality: 'bilateral', is_compound: false, kinetic_chain: 'open', fatigue: { systemic: 2, lower_back: 1, grip: 2, stability: 3 } },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', name: 'Postura del Niño', muscle_groups: ['espalda baja'], equipment: [], description: 'Siéntate sobre los talones.', image_url: null, video_url: null, exercise_type: 'cooldown', movement_pattern: 'stretch', muscle_map: { 'espalda baja': 1.0 }, joint_actions: { columna: ['flexion'] } },
];

const PRESS_BARRA = CATALOG[0];
const PRESS_MANCUERNAS = CATALOG[1];

/** Ejercicio de la sesión: press de banca ya enlazado al catálogo. */
const OWNED_EXERCISE = {
  id: TEST_EXERCISE_ID,
  sets: 4,
  exercise_id: PRESS_BARRA.id,
  exercise_name: PRESS_BARRA.name,
  exercise_type: 'strength',
};

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
      if (q.op === 'select') return { data: OWNED_EXERCISE, error: null };
      if (q.op === 'update') return { data: { id: TEST_EXERCISE_ID, completed: true }, error: null };
    }
    if (q.table === 'session_sets') return { data: { id: 'set-1', set_number: 2 }, error: null };
    if (q.table === 'profiles') return { data: { current_streak: 3, longest_streak: 5 }, error: null };
    if (q.table === 'exercises') {
      // `maybeSingle()` = búsqueda del ejercicio destino de la sustitución;
      // sin él, es la carga del catálogo completo.
      if (q.maybeSingle) {
        const id = q.filters.find(([op, col]) => op === 'eq' && col === 'id')?.[2];
        return { data: CATALOG.find(e => e.id === id) ?? null, error: null };
      }
      return { data: CATALOG, error: null };
    }
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
    // El modal reanuda el cronómetro desde aquí.
    expect(columns).toContain('elapsed_seconds');
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

describe('PATCH /api/workouts/sessions/:id/progress', () => {
  const url = `/api/workouts/sessions/${TEST_SESSION_ID}/progress`;

  it('guarda el tiempo entrenado sobre la sesión del usuario', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    const res = await request(ctx.app).patch(url).set(authHeader).send({ elapsed_seconds: 754 });
    expect(res.status).toBe(204);

    const update = ctx.supabase.queriesFor('workout_sessions').find(q => q.op === 'update');
    expect(update.payload).toEqual({ elapsed_seconds: 754 });
    expect(hasFilter(update, 'eq', 'user_id', TEST_USER.id)).toBe(true);
  });

  it('nunca retrocede: sólo escribe si el valor guardado es menor', async () => {
    // Un envío rezagado (p. ej. el de "segundo plano" llegando tarde) no debe
    // pisar una sincronización más reciente con más tiempo.
    ctx = createTestApp({ resolver: ownedResolver() });
    await request(ctx.app).patch(url).set(authHeader).send({ elapsed_seconds: 120 });

    const update = ctx.supabase.queriesFor('workout_sessions').find(q => q.op === 'update');
    expect(hasFilter(update, 'lt', 'elapsed_seconds', 120)).toBe(true);
  });

  it('exige elapsed_seconds entero y no negativo', async () => {
    ctx = createTestApp({ resolver: ownedResolver() });
    expect((await request(ctx.app).patch(url).set(authHeader).send({})).status).toBe(400);
    expect((await request(ctx.app).patch(url).set(authHeader).send({ elapsed_seconds: -5 })).status).toBe(400);
    expect((await request(ctx.app).patch(url).set(authHeader).send({ elapsed_seconds: 12.5 })).status).toBe(400);
    expect(ctx.supabase.queriesFor('workout_sessions').some(q => q.op === 'update')).toBe(false);
  });

  it('devuelve 403 si la sesión es de otro usuario', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).patch(url).set(authHeader).send({ elapsed_seconds: 30 });
    expect(res.status).toBe(403);
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

describe('POST .../exercises/:exerciseId/alternatives', () => {
  const url = `/api/workouts/sessions/${TEST_SESSION_ID}/exercises/${TEST_EXERCISE_ID}/alternatives`;

  const AI_REPLY = JSON.stringify({
    alternatives: [
      { name: 'Press Banca con Mancuernas', reason: 'Mismo empuje con más recorrido.' },
      { name: 'Flexiones de Pecho', reason: 'Empuje horizontal sin material.' },
    ],
  });

  it('devuelve las alternativas elegidas por la IA', async () => {
    ctx = createTestApp({ resolver: ownedResolver(), groqReply: AI_REPLY });

    const res = await request(ctx.app).post(url).set(authHeader).send({});

    expect(res.status).toBe(200);
    expect(res.body.alternatives).toHaveLength(2);
    expect(res.body.alternatives[0]).toMatchObject({
      id: PRESS_MANCUERNAS.id,
      name: 'Press Banca con Mancuernas',
      muscle_groups: ['pecho', 'tríceps', 'hombros'],
      equipment: ['mancuernas', 'banco'],
      image_url: null,
      video_url: null,
      description: 'Baja controlando y empuja.',
      reason: 'Mismo empuje con más recorrido.',
    });
    // Score y desglose salen del motor determinista, no de la IA.
    expect(res.body.alternatives[0].score).toBeGreaterThan(80);
    expect(res.body.alternatives[0].breakdown).toMatchObject({
      muscular: expect.any(Number),
      biomecanica: expect.any(Number),
      fatiga: expect.any(Number),
    });
  });

  it('sólo consulta el catálogo público y nunca propone el propio ejercicio', async () => {
    ctx = createTestApp({ resolver: ownedResolver(), groqReply: AI_REPLY });
    const res = await request(ctx.app).post(url).set(authHeader).send({});

    expect(hasFilter(ctx.supabase.queriesFor('exercises')[0], 'eq', 'is_public', true)).toBe(true);
    expect(res.body.alternatives.map(a => a.id)).not.toContain(PRESS_BARRA.id);
  });

  it('nunca devuelve ejercicios de otro bloque', async () => {
    ctx = createTestApp({ resolver: ownedResolver(), groqReply: AI_REPLY });
    const res = await request(ctx.app).post(url).set(authHeader).send({});
    expect(res.body.alternatives.map(a => a.name)).not.toContain('Postura del Niño');
  });

  it('cae al respaldo determinista si la IA falla (nunca 502)', async () => {
    // El usuario está a mitad de un entrenamiento: un fallo del proveedor no
    // puede bloquearlo.
    ctx = createTestApp({
      resolver: ownedResolver(),
      groqReply: () => { throw new Error('ECONNRESET en groq.com'); },
    });

    const res = await request(ctx.app).post(url).set(authHeader).send({});

    expect(res.status).toBe(200);
    expect(res.body.alternatives.length).toBeGreaterThan(0);
    expect(res.body.alternatives.length).toBeLessThanOrEqual(3);
    expect(res.body.alternatives[0].id).toBe(PRESS_MANCUERNAS.id);
    expect(res.body.alternatives.every(a => typeof a.reason === 'string' && a.reason !== '')).toBe(true);
  });

  it('cae al respaldo si la IA responde sin JSON utilizable', async () => {
    ctx = createTestApp({ resolver: ownedResolver(), groqReply: 'Claro, te propongo estos ejercicios...' });
    const res = await request(ctx.app).post(url).set(authHeader).send({});

    expect(res.status).toBe(200);
    expect(res.body.alternatives).toHaveLength(3);
  });

  it('devuelve [] si el catálogo no tiene candidatos del mismo bloque', async () => {
    ctx = createTestApp({
      resolver: ownedResolver({
        exercises: q => (q.maybeSingle ? undefined : { data: [CATALOG[4]], error: null }),
      }),
      groqReply: AI_REPLY,
    });

    const res = await request(ctx.app).post(url).set(authHeader).send({});
    expect(res.status).toBe(200);
    expect(res.body.alternatives).toEqual([]);
    expect(ctx.groq.calls).toHaveLength(0);
  });

  it('devuelve [] en vez de 5xx si el catálogo no se puede leer', async () => {
    // Pasa cuando falta aplicar el bloque MIGRACIONES y `exercises.exercise_type`
    // no existe todavía. A mitad de un entrenamiento eso debe traducirse en "no
    // hay alternativas", no en un error con un reintento que nunca funcionaría.
    ctx = createTestApp({
      resolver: ownedResolver({
        exercises: q => (q.maybeSingle
          ? undefined
          : { data: null, error: { message: 'column exercises.exercise_type does not exist' } }),
      }),
      groqReply: AI_REPLY,
    });

    const res = await request(ctx.app).post(url).set(authHeader).send({});

    expect(res.status).toBe(200);
    expect(res.body.alternatives).toEqual([]);
    expect(ctx.groq.calls).toHaveLength(0);
  });

  it('IDOR: 403 si la sesión es de otro usuario', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }), groqReply: AI_REPLY });

    const res = await request(ctx.app).post(url).set(authHeader).send({});

    expect(res.status).toBe(403);
    expect(ctx.supabase.queriesFor('exercises')).toHaveLength(0);
    expect(ctx.groq.calls).toHaveLength(0);
  });

  it('404 si el ejercicio no pertenece a la sesión', async () => {
    ctx = createTestApp({
      resolver: ownedResolver({ session_exercises: () => ({ data: null, error: null }) }),
      groqReply: AI_REPLY,
    });

    const res = await request(ctx.app).post(url).set(authHeader).send({});
    expect(res.status).toBe(404);
  });

  it('rechaza un id de sesión que no es UUID', async () => {
    ctx = createTestApp({ resolver: ownedResolver(), groqReply: AI_REPLY });
    const res = await request(ctx.app)
      .post(`/api/workouts/sessions/no-uuid/exercises/${TEST_EXERCISE_ID}/alternatives`)
      .set(authHeader).send({});
    expect(res.status).toBe(400);
  });
});

describe('PATCH .../exercises/:exerciseId/substitute', () => {
  const url = `/api/workouts/sessions/${TEST_SESSION_ID}/exercises/${TEST_EXERCISE_ID}/substitute`;

  /** Fila actualizada tal y como la devolvería PostgREST con el join anidado. */
  const UPDATED_ROW = {
    id: TEST_EXERCISE_ID,
    exercise_name: PRESS_MANCUERNAS.name,
    exercise_id: PRESS_MANCUERNAS.id,
    sets: 4,
    reps: 8,
    weight_kg: 60,
    rest_seconds: 120,
    duration_seconds: null,
    exercise_type: 'strength',
    order_num: 2,
    completed: false,
    exercises: { image_url: null, video_url: null, description: 'Baja controlando y empuja.' },
  };

  function substituteResolver(overrides = {}) {
    return ownedResolver({
      session_exercises: q => (q.op === 'update' ? { data: UPDATED_ROW, error: null } : undefined),
      ...overrides,
    });
  }

  it('sustituye el ejercicio y devuelve la fila con la media enlazada', async () => {
    ctx = createTestApp({ resolver: substituteResolver() });

    const res = await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: PRESS_MANCUERNAS.id });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ exercise: UPDATED_ROW });
  });

  it('actualiza sólo exercise_id y exercise_name de esa fila de la sesión', async () => {
    ctx = createTestApp({ resolver: substituteResolver() });
    await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: PRESS_MANCUERNAS.id });

    const update = ctx.supabase.queriesFor('session_exercises').find(q => q.op === 'update');
    // Series, repeticiones, descansos y orden se conservan: no se tocan aquí.
    expect(update.payload).toEqual({ exercise_id: PRESS_MANCUERNAS.id, exercise_name: PRESS_MANCUERNAS.name });
    expect(hasFilter(update, 'eq', 'id', TEST_EXERCISE_ID)).toBe(true);
    expect(hasFilter(update, 'eq', 'session_id', TEST_SESSION_ID)).toBe(true);
  });

  it('no toca el plan ni otras sesiones', async () => {
    ctx = createTestApp({ resolver: substituteResolver() });
    await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: PRESS_MANCUERNAS.id });

    expect(ctx.supabase.queriesFor('workout_plans')).toHaveLength(0);
    expect(ctx.supabase.queriesFor('workout_sessions').every(q => q.op === 'select')).toBe(true);
  });

  it('usa el nombre canónico del catálogo, no el que mande el cliente', async () => {
    ctx = createTestApp({ resolver: substituteResolver() });
    await request(ctx.app).patch(url).set(authHeader)
      .send({ exercise_id: PRESS_MANCUERNAS.id, exercise_name: 'Nombre inyectado' });

    const update = ctx.supabase.queriesFor('session_exercises').find(q => q.op === 'update');
    expect(update.payload.exercise_name).toBe(PRESS_MANCUERNAS.name);
  });

  it('devuelve exercises: null si el join no trae media', async () => {
    ctx = createTestApp({
      resolver: ownedResolver({
        session_exercises: q => (q.op === 'update' ? { data: { ...UPDATED_ROW, exercises: null }, error: null } : undefined),
      }),
    });

    const res = await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: PRESS_MANCUERNAS.id });
    expect(res.status).toBe(200);
    expect(res.body.exercise.exercises).toBeNull();
  });

  it('rechaza un exercise_id ausente o que no es UUID', async () => {
    ctx = createTestApp({ resolver: substituteResolver() });

    const sinId = await request(ctx.app).patch(url).set(authHeader).send({});
    expect(sinId.status).toBe(400);
    expect(sinId.body.error).toMatch(/exercise_id/);

    const malId = await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: 'no-es-uuid' });
    expect(malId.status).toBe(400);
  });

  it('404 si el ejercicio destino no está en el catálogo público', async () => {
    ctx = createTestApp({ resolver: substituteResolver() });
    const res = await request(ctx.app).patch(url).set(authHeader)
      .send({ exercise_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' });

    expect(res.status).toBe(404);
    expect(ctx.supabase.queriesFor('session_exercises').some(q => q.op === 'update')).toBe(false);
  });

  it('exige is_public en la comprobación del catálogo', async () => {
    ctx = createTestApp({ resolver: substituteResolver() });
    await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: PRESS_MANCUERNAS.id });

    const lookup = ctx.supabase.queriesFor('exercises').find(q => q.maybeSingle);
    expect(hasFilter(lookup, 'eq', 'is_public', true)).toBe(true);
  });

  it('IDOR: 403 si la sesión es de otro usuario', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });

    const res = await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: PRESS_MANCUERNAS.id });

    expect(res.status).toBe(403);
    expect(ctx.supabase.queriesFor('session_exercises')).toHaveLength(0);
  });

  it('404 si el ejercicio no pertenece a la sesión', async () => {
    ctx = createTestApp({
      resolver: ownedResolver({ session_exercises: () => ({ data: null, error: null }) }),
    });

    const res = await request(ctx.app).patch(url).set(authHeader).send({ exercise_id: PRESS_MANCUERNAS.id });

    expect(res.status).toBe(404);
    expect(ctx.supabase.queriesFor('session_exercises').some(q => q.op === 'update')).toBe(false);
  });
});
