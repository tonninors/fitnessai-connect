import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createTestApp, authHeader } from '../helpers/test-app.js';
import { hasFilter, TEST_USER } from '../helpers/supabase-mock.js';
import { todayISO, getWeekRange } from '../../lib/dates.js';

let ctx;
afterEach(() => ctx?.restore());

describe('GET /api/home', () => {
  function homeResolver(overrides = {}) {
    return (q) => {
      if (overrides[q.table]) {
        const result = overrides[q.table](q);
        if (result !== undefined) return result;
      }
      if (q.table === 'profiles') return { data: { full_name: 'Carlos Mendoza', current_streak: 3 }, error: null };
      if (q.table === 'workout_sessions') return { data: q.maybeSingle ? null : [], error: null };
      return { data: null, error: null };
    };
  }

  it('devuelve el esqueleto completo del dashboard', async () => {
    ctx = createTestApp({ resolver: homeResolver() });
    const res = await request(ctx.app).get('/api/home').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('greeting');
    expect(res.body).toHaveProperty('profile');
    expect(res.body).toHaveProperty('today_session');
    expect(res.body).toHaveProperty('next_session');
    expect(res.body).toHaveProperty('activity_rings');
    expect(res.body).toHaveProperty('week_sessions');
    expect(['Buenos días', 'Buenas tardes', 'Buenas noches']).toContain(res.body.greeting);
  });

  it('devuelve la sesión de hoy cuando existe y está pendiente', async () => {
    ctx = createTestApp({
      resolver: homeResolver({
        workout_sessions: (q) => {
          if (hasFilter(q, 'eq', 'scheduled_date', todayISO()) && q.maybeSingle) {
            return { data: { id: 's-hoy', name: 'Push A', status: 'scheduled' }, error: null };
          }
          return undefined;
        },
      }),
    });

    const res = await request(ctx.app).get('/api/home').set(authHeader);
    expect(res.body.today_session.name).toBe('Push A');
    expect(res.body.next_session).toBeNull();
  });

  it('oculta la sesión de hoy si ya está completada y ofrece la siguiente', async () => {
    ctx = createTestApp({
      resolver: homeResolver({
        workout_sessions: (q) => {
          if (!q.maybeSingle) return undefined;
          if (hasFilter(q, 'eq', 'scheduled_date', todayISO())) {
            return { data: { id: 's-hoy', status: 'completed' }, error: null };
          }
          return { data: { id: 's-siguiente', name: 'Pull A' }, error: null };
        },
      }),
    });

    const res = await request(ctx.app).get('/api/home').set(authHeader);
    expect(res.body.today_session).toBeNull();
    expect(res.body.next_session.name).toBe('Pull A');
  });

  it('incluye exercise_type y duration_seconds en los ejercicios de hoy', async () => {
    // Regresión: sin estas columnas el WorkoutModal no podía agrupar por
    // bloques y la sesión iniciada desde Inicio salía vacía.
    ctx = createTestApp({ resolver: homeResolver() });
    await request(ctx.app).get('/api/home').set(authHeader);

    const todayQuery = ctx.supabase
      .queriesFor('workout_sessions')
      .find(q => hasFilter(q, 'eq', 'scheduled_date', todayISO()) && q.maybeSingle);

    expect(todayQuery.columns).toContain('exercise_type');
    expect(todayQuery.columns).toContain('duration_seconds');
    expect(todayQuery.columns).toContain('order_num');
    // El modal reanuda el cronómetro desde aquí.
    expect(todayQuery.columns).toContain('elapsed_seconds');
  });

  it('consulta la semana lunes→domingo que contiene hoy', async () => {
    ctx = createTestApp({ resolver: homeResolver() });
    await request(ctx.app).get('/api/home').set(authHeader);

    const { monday, sunday } = getWeekRange(todayISO());
    const weekQuery = ctx.supabase
      .queriesFor('workout_sessions')
      .find(q => hasFilter(q, 'gte', 'scheduled_date', monday));

    expect(weekQuery).toBeDefined();
    expect(hasFilter(weekQuery, 'lte', 'scheduled_date', sunday)).toBe(true);
  });

  it('calcula los anillos a partir de los minutos completados hoy', async () => {
    ctx = createTestApp({
      resolver: homeResolver({
        workout_sessions: (q) => {
          if (q.columns === 'actual_duration') return { data: [{ actual_duration: 15 }], error: null };
          return undefined;
        },
      }),
    });

    const res = await request(ctx.app).get('/api/home').set(authHeader);
    expect(res.body.activity_rings.movement).toBe(50); // 15 / 30 min
    expect(res.body.activity_rings.exercise).toBe(75); // 15 / 20 min
  });

  it('filtra siempre por el usuario autenticado', async () => {
    ctx = createTestApp({ resolver: homeResolver() });
    await request(ctx.app).get('/api/home').set(authHeader);
    const userScoped = ctx.supabase.queries.filter(q => hasFilter(q, 'eq', 'user_id', TEST_USER.id));
    expect(userScoped.length).toBeGreaterThan(0);
    expect(ctx.supabase.queries.every(q => q.table === 'profiles' || hasFilter(q, 'eq', 'user_id', TEST_USER.id))).toBe(true);
  });
});

describe('GET /api/progress/stats', () => {
  it('agrega las sesiones completadas del mes', async () => {
    ctx = createTestApp({
      resolver: (q) => {
        if (q.table === 'profiles') {
          return { data: { current_streak: 6, longest_streak: 11, level: 1, level_name: 'Principiante' }, error: null };
        }
        return {
          data: [
            { actual_calories: 300, actual_duration: 45, completed_at: new Date().toISOString() },
            { actual_calories: 250, actual_duration: 50, completed_at: new Date().toISOString() },
          ],
          error: null,
        };
      },
    });

    const res = await request(ctx.app).get('/api/progress/stats').set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      streak: 6,
      longest_streak: 11,
      total_workouts: 2,
      total_calories: 550,
      total_hours: 2,
    });
    expect(res.body.weekly_volume).toHaveLength(4);
  });

  it('devuelve valores por defecto para un usuario sin actividad', async () => {
    ctx = createTestApp({ resolver: q => ({ data: q.table === 'profiles' ? null : [], error: null }) });
    const res = await request(ctx.app).get('/api/progress/stats').set(authHeader);
    expect(res.body).toMatchObject({ streak: 0, level: 1, level_name: 'Principiante', total_workouts: 0 });
  });
});

describe('GET /api/progress/chart', () => {
  it('usa 12 semanas para el periodo 3m', async () => {
    ctx = createTestApp({ resolver: () => ({ data: [], error: null }) });
    const res = await request(ctx.app).get('/api/progress/chart?period=3m').set(authHeader);
    expect(res.body).toHaveLength(12);
  });

  it('cae a 4 semanas si el periodo no viene', async () => {
    ctx = createTestApp({ resolver: () => ({ data: [], error: null }) });
    const res = await request(ctx.app).get('/api/progress/chart').set(authHeader);
    expect(res.body).toHaveLength(4);
  });

  it('rechaza un periodo desconocido con 400', async () => {
    ctx = createTestApp({ resolver: () => ({ data: [], error: null }) });
    const res = await request(ctx.app).get('/api/progress/chart?period=99y').set(authHeader);
    expect(res.status).toBe(400);
  });
});

describe('/api/progress/metrics', () => {
  it('guarda las métricas del día con upsert idempotente', async () => {
    ctx = createTestApp({ resolver: () => ({ data: { id: 'm1' }, error: null }) });

    const res = await request(ctx.app).post('/api/progress/metrics').set(authHeader)
      .send({ body_weight_kg: 78.4, hrv_score: 62, sleep_hours: 7.5, source: 'garmin' });

    expect(res.status).toBe(200);
    const upsert = ctx.supabase.queriesFor('progress_metrics')[0];
    expect(upsert.options.onConflict).toBe('user_id,metric_date');
    expect(upsert.payload).toMatchObject({
      user_id: TEST_USER.id,
      metric_date: todayISO(),
      body_weight_kg: 78.4,
      hrv_score: 62,
      source: 'garmin',
    });
  });

  it('rechaza una fuente no permitida', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).post('/api/progress/metrics').set(authHeader).send({ source: 'strava' });
    expect(res.status).toBe(400);
  });

  it('rechaza valores biométricos absurdos', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).post('/api/progress/metrics').set(authHeader).send({ body_weight_kg: 900 });
    expect(res.status).toBe(400);
  });

  it('no revienta con ?days no numérico: responde 400', async () => {
    // Regresión: `Number('abc')` → NaN → `new Date(NaN).toISOString()` lanzaba
    // RangeError y la petición moría con un 500 sin explicación.
    ctx = createTestApp({ resolver: () => ({ data: [], error: null }) });
    const res = await request(ctx.app).get('/api/progress/metrics?days=abc').set(authHeader);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/days/);
  });

  it('usa 30 días por defecto', async () => {
    ctx = createTestApp({ resolver: () => ({ data: [], error: null }) });
    const res = await request(ctx.app).get('/api/progress/metrics').set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('/api/profile', () => {
  function profileResolver(profile = { id: TEST_USER.id, full_name: 'Carlos Mendoza' }) {
    return (q) => {
      if (q.table === 'profiles') return { data: profile, error: null };
      if (q.table === 'wearable_connections') return { data: [{ platform: 'garmin', connected: true }], error: null };
      if (q.table === 'workout_sessions') return { data: [{ id: 'a' }, { id: 'b' }], error: null };
      return { data: null, error: null };
    };
  }

  it('devuelve el perfil con email, wearables y total de sesiones', async () => {
    ctx = createTestApp({ resolver: profileResolver() });
    const res = await request(ctx.app).get('/api/profile').set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(TEST_USER.email);
    expect(res.body.wearables).toHaveLength(1);
    expect(res.body.total_sessions).toBe(2);
  });

  it('nunca expone los tokens OAuth de los wearables', async () => {
    ctx = createTestApp({ resolver: profileResolver() });
    await request(ctx.app).get('/api/profile').set(authHeader);
    const query = ctx.supabase.queriesFor('wearable_connections')[0];
    expect(query.columns).not.toContain('access_token');
    expect(query.columns).not.toContain('refresh_token');
  });

  it('PATCH sólo aplica los campos de la whitelist', async () => {
    ctx = createTestApp({ resolver: profileResolver() });

    const res = await request(ctx.app).patch('/api/profile').set(authHeader).send({
      full_name: 'Carlos M.',
      onboarding_completed: true,
      // Campos sensibles que un cliente no debe poder tocar:
      current_streak: 9999,
      level: 99,
      subscription_plan: 'elite',
      trainer_id: 'otro',
    });

    expect(res.status).toBe(200);
    const update = ctx.supabase.queriesFor('profiles').find(q => q.op === 'update');
    expect(Object.keys(update.payload).sort()).toEqual(['full_name', 'onboarding_completed', 'updated_at']);
  });

  it('PATCH rechaza un cuerpo sin campos permitidos', async () => {
    ctx = createTestApp({ resolver: profileResolver() });
    const res = await request(ctx.app).patch('/api/profile').set(authHeader).send({ level: 42 });
    expect(res.status).toBe(400);
  });

  it('PATCH rechaza un nombre vacío', async () => {
    ctx = createTestApp({ resolver: profileResolver() });
    const res = await request(ctx.app).patch('/api/profile').set(authHeader).send({ full_name: '   ' });
    expect(res.status).toBe(400);
  });

  it('conecta un wearable de plataforma válida', async () => {
    ctx = createTestApp({ resolver: () => ({ data: { platform: 'garmin', connected: true }, error: null }) });
    const res = await request(ctx.app).post('/api/profile/wearables').set(authHeader)
      .send({ platform: 'garmin', device_name: 'Forerunner 265' });

    expect(res.status).toBe(200);
    const upsert = ctx.supabase.queriesFor('wearable_connections')[0];
    expect(upsert.payload).toMatchObject({ user_id: TEST_USER.id, platform: 'garmin', connected: true });
  });

  it('rechaza una plataforma desconocida antes de llegar a la base de datos', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).post('/api/profile/wearables').set(authHeader).send({ platform: 'strava' });
    expect(res.status).toBe(400);
    expect(ctx.supabase.queriesFor('wearable_connections')).toHaveLength(0);
  });

  it('al desconectar un wearable borra los tokens almacenados', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).delete('/api/profile/wearables/garmin').set(authHeader);

    expect(res.status).toBe(200);
    const update = ctx.supabase.queriesFor('wearable_connections')[0];
    expect(update.payload).toMatchObject({ connected: false, access_token: null, refresh_token: null });
  });

  it('rechaza desconectar una plataforma inválida', async () => {
    ctx = createTestApp({ resolver: () => ({ data: null, error: null }) });
    const res = await request(ctx.app).delete('/api/profile/wearables/../../etc').set(authHeader);
    expect([400, 404]).toContain(res.status);
  });
});
