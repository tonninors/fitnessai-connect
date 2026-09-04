import { describe, it, expect, afterEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp, authHeader } from '../helpers/test-app.js';
import { hasFilter, TEST_USER } from '../helpers/supabase-mock.js';
import { todayISO } from '../../lib/dates.js';

let ctx;
afterEach(() => ctx?.restore());

const VALID_PLAN = {
  name: 'Plan Fuerza 4 Semanas',
  description: 'Push/Pull/Legs',
  focus_areas: ['pecho', 'espalda'],
  sessions: [
    {
      name: 'Push A — Pecho y Hombros',
      day_order: 1,
      estimated_duration: 60,
      estimated_calories: 350,
      rpe_target: 7,
      focus_areas: ['pecho'],
      exercises: [
        { exercise_type: 'warmup', exercise_name: 'Movilidad de hombro', sets: 1, duration_seconds: 45 },
        { exercise_type: 'strength', exercise_name: 'Press Banca con Barra', sets: 4, reps: 6, weight_kg: 60, rest_seconds: 180 },
        { exercise_type: 'cooldown', exercise_name: 'Estiramiento de pectoral', sets: 1, duration_seconds: 40 },
      ],
    },
    {
      name: 'Pull A — Espalda y Bíceps',
      day_order: 2,
      exercises: [{ exercise_type: 'strength', exercise_name: 'Remo con Barra', sets: 4, reps: 8, rest_seconds: 120 }],
    },
  ],
};

function planResolver(overrides = {}) {
  return (q) => {
    if (overrides[q.table]) {
      const result = overrides[q.table](q);
      if (result !== undefined) return result;
    }
    if (q.table === 'workout_plans' && q.op === 'insert') return { data: { id: 'plan-nuevo', name: VALID_PLAN.name }, error: null };
    if (q.table === 'workout_sessions' && q.op === 'insert') return { data: { id: `sess-${Math.random()}` }, error: null };
    return { data: null, error: null };
  };
}

describe('POST /api/ai/insight', () => {
  it('devuelve el insight generado por el modelo', async () => {
    ctx = createTestApp({ groqReply: 'Hoy toca intensidad moderada. ¡Vamos!' });
    const res = await request(ctx.app).post('/api/ai/insight').set(authHeader)
      .send({ type: 'workout_ready', context: { session_name: 'Push A' } });

    expect(res.status).toBe(200);
    expect(res.body.insight).toBe('Hoy toca intensidad moderada. ¡Vamos!');
  });

  it('persiste el insight con un tipo aceptado por el CHECK de la base de datos', async () => {
    // Regresión: se insertaba `type: 'workout_ready'`, que viola el CHECK de
    // `ai_insights`, y el INSERT fire-and-forget fallaba en silencio.
    ctx = createTestApp();
    await request(ctx.app).post('/api/ai/insight').set(authHeader)
      .send({ type: 'workout_ready', context: {} });

    await vi.waitFor(() => expect(ctx.supabase.queriesFor('ai_insights').length).toBeGreaterThan(0));
    const insert = ctx.supabase.queriesFor('ai_insights')[0];
    expect(insert.payload.type).toBe('general');
    expect(insert.payload.user_id).toBe(TEST_USER.id);
  });

  it('rechaza un tipo de insight desconocido', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).post('/api/ai/insight').set(authHeader).send({ type: 'inventado' });
    expect(res.status).toBe(400);
  });

  it('traduce el rate limit del proveedor a 429 con mensaje en español', async () => {
    ctx = createTestApp({
      groqReply: () => { const e = new Error('Too Many Requests'); e.status = 429; throw e; },
    });
    const res = await request(ctx.app).post('/api/ai/insight').set(authHeader).send({ type: 'recovery' });

    expect(res.status).toBe(429);
    expect(res.body.error).toMatch(/ocupado/i);
  }, 20000);

  it('traduce un fallo del proveedor a 502 sin filtrar el error interno', async () => {
    ctx = createTestApp({ groqReply: () => { throw new Error('ECONNRESET en groq.com'); } });
    const res = await request(ctx.app).post('/api/ai/insight').set(authHeader).send({ type: 'recovery' });

    expect(res.status).toBe(502);
    expect(res.body.error).not.toContain('ECONNRESET');
  });

  it('devuelve 502 si el modelo responde vacío', async () => {
    ctx = createTestApp({ groqReply: () => ({ choices: [{ message: { content: '   ' } }] }) });
    const res = await request(ctx.app).post('/api/ai/insight').set(authHeader).send({});
    expect(res.status).toBe(502);
  });
});

describe('POST /api/ai/generate-plan', () => {
  it('crea el plan, sus sesiones y sus ejercicios', async () => {
    ctx = createTestApp({ groqReply: JSON.stringify(VALID_PLAN), resolver: planResolver() });

    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader)
      .send({ goals: 'ganar músculo', days_per_week: 3, fitness_level: 'intermediate', equipment: 'gimnasio_completo' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ plan_id: 'plan-nuevo', sessions_created: 2 });

    const exerciseInsert = ctx.supabase.queriesFor('session_exercises')[0];
    expect(exerciseInsert.payload[0]).toMatchObject({ order_num: 1, exercise_type: 'warmup', duration_seconds: 45 });
  });

  it('programa la primera sesión hoy y respeta los offsets del split', async () => {
    ctx = createTestApp({ groqReply: JSON.stringify(VALID_PLAN), resolver: planResolver() });
    await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({ days_per_week: 3 });

    const inserts = ctx.supabase.queriesFor('workout_sessions').filter(q => q.op === 'insert');
    const dates = inserts.map(q => q.payload.scheduled_date).sort();
    expect(dates[0]).toBe(todayISO());
    expect(new Set(dates).size).toBe(2); // días distintos
  });

  it('archiva los planes anteriores DESPUÉS de crear el nuevo', async () => {
    // Regresión: se archivaba primero; si la inserción fallaba el usuario se
    // quedaba sin ningún plan activo.
    ctx = createTestApp({ groqReply: JSON.stringify(VALID_PLAN), resolver: planResolver() });
    await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});

    const planQueries = ctx.supabase.queriesFor('workout_plans');
    const insertIdx = planQueries.findIndex(q => q.op === 'insert');
    const archiveIdx = planQueries.findIndex(q => q.op === 'update' && q.payload?.status === 'archived');

    expect(insertIdx).toBeGreaterThanOrEqual(0);
    expect(archiveIdx).toBeGreaterThan(insertIdx);
    expect(hasFilter(planQueries[archiveIdx], 'neq', 'id', 'plan-nuevo')).toBe(true);
  });

  it('no archiva nada si la creación del plan falla', async () => {
    ctx = createTestApp({
      groqReply: JSON.stringify(VALID_PLAN),
      resolver: planResolver({
        workout_plans: q => (q.op === 'insert' ? { data: null, error: { message: 'insert falló' } } : undefined),
      }),
    });

    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});

    expect(res.status).toBe(400);
    const archived = ctx.supabase.queriesFor('workout_plans').filter(q => q.payload?.status === 'archived');
    expect(archived).toHaveLength(0);
  });

  it('rechaza con 400 si la IA devuelve un JSON incompleto', async () => {
    ctx = createTestApp({ groqReply: '{"description":"solo texto"}', resolver: planResolver() });
    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/nombre de plan/i);
    expect(ctx.supabase.queriesFor('workout_plans')).toHaveLength(0);
  });

  it('rechaza con 400 si la IA no devuelve JSON', async () => {
    ctx = createTestApp({ groqReply: 'Claro, aquí va tu rutina de ejercicios...', resolver: planResolver() });
    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});
    expect(res.status).toBe(400);
  });

  it('acepta JSON envuelto en markdown', async () => {
    ctx = createTestApp({
      groqReply: `Aquí tienes:\n\`\`\`json\n${JSON.stringify(VALID_PLAN)}\n\`\`\``,
      resolver: planResolver(),
    });
    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});
    expect(res.status).toBe(200);
  });

  it('omite el bloque de cardio cuando cardio_minutes es 0', async () => {
    ctx = createTestApp({ groqReply: JSON.stringify(VALID_PLAN), resolver: planResolver() });
    await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({ cardio_minutes: 0 });

    const prompt = ctx.groq.calls[0].messages[1].content;
    expect(prompt).toContain('NO incluir este bloque');
  });

  it('normaliza days_per_week fuera de rango sin fallar', async () => {
    ctx = createTestApp({ groqReply: JSON.stringify(VALID_PLAN), resolver: planResolver() });
    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({ days_per_week: 99 });

    expect(res.status).toBe(200);
    expect(ctx.groq.calls[0].messages[1].content).toContain('EXACTAMENTE 6 sesiones');
  });

  it('restringe la IA al catálogo y enlaza exercise_id', async () => {
    const catalog = [
      { id: 'cat-press', name: 'Press Banca con Barra', muscle_groups: ['pecho', 'tríceps'], equipment: ['barra', 'banco'], exercise_type: 'strength' },
      { id: 'cat-remo', name: 'Remo con Barra', muscle_groups: ['espalda', 'bíceps'], equipment: ['barra'], exercise_type: 'strength' },
    ];

    ctx = createTestApp({
      groqReply: JSON.stringify(VALID_PLAN),
      resolver: planResolver({ exercises: () => ({ data: catalog, error: null }) }),
    });

    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});
    expect(res.status).toBe(200);

    // El catálogo se lee público y viaja en el prompt.
    const catalogQuery = ctx.supabase.queriesFor('exercises')[0];
    expect(hasFilter(catalogQuery, 'eq', 'is_public', true)).toBe(true);

    const prompt = ctx.groq.calls[0].messages[1].content;
    expect(prompt).toContain('CATÁLOGO DE EJERCICIOS PERMITIDOS');
    expect(prompt).toContain('Press Banca con Barra');

    // Los nombres del catálogo quedan enlazados; los inventados, no.
    const rows = ctx.supabase.queriesFor('session_exercises').flatMap(q => q.payload);
    expect(rows.find(r => r.exercise_name === 'Press Banca con Barra').exercise_id).toBe('cat-press');
    expect(rows.find(r => r.exercise_name === 'Movilidad de hombro').exercise_id).toBeNull();
  });

  it('genera el plan igual si el catálogo no se puede cargar', async () => {
    // Un fallo leyendo el catálogo no puede dejar al usuario sin plan.
    ctx = createTestApp({
      groqReply: JSON.stringify(VALID_PLAN),
      resolver: planResolver({ exercises: () => ({ data: null, error: { message: 'catálogo caído' } }) }),
    });

    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});

    expect(res.status).toBe(200);
    expect(res.body.sessions_created).toBe(2);
  });

  it('cuenta sólo las sesiones realmente creadas', async () => {
    let inserts = 0;
    ctx = createTestApp({
      groqReply: JSON.stringify(VALID_PLAN),
      resolver: planResolver({
        workout_sessions: (q) => {
          if (q.op !== 'insert') return undefined;
          inserts += 1;
          return inserts === 1
            ? { data: { id: 'sess-1' }, error: null }
            : { data: null, error: { message: 'fallo puntual' } };
        },
      }),
    });

    const res = await request(ctx.app).post('/api/ai/generate-plan').set(authHeader).send({});
    expect(res.status).toBe(200);
    expect(res.body.sessions_created).toBe(1);
  });
});
