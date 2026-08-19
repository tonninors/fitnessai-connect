import { describe, it, expect } from 'vitest';
import {
  normalizeDaysPerWeek,
  splitGuideFor,
  dayOffsetsFor,
  buildPlanPrompt,
  extractJsonObject,
  validatePlan,
  scheduledDateFor,
  toSessionRow,
  toExerciseRows,
  SPLIT_GUIDE,
} from '../../lib/plan.js';

describe('normalizeDaysPerWeek', () => {
  it('acepta números y strings dentro del rango', () => {
    expect(normalizeDaysPerWeek(4)).toBe(4);
    expect(normalizeDaysPerWeek('5')).toBe(5);
  });

  it('cae al valor por defecto ante entradas no numéricas', () => {
    expect(normalizeDaysPerWeek(undefined)).toBe(3);
    expect(normalizeDaysPerWeek('muchos')).toBe(3);
    expect(normalizeDaysPerWeek(null)).toBe(3);
  });

  it('recorta al rango soportado', () => {
    expect(normalizeDaysPerWeek(0)).toBe(1);
    expect(normalizeDaysPerWeek(14)).toBe(6);
  });
});

describe('splitGuideFor / dayOffsetsFor', () => {
  it('usa la guía correspondiente a la frecuencia', () => {
    expect(splitGuideFor(3)).toBe(SPLIT_GUIDE[3]);
    expect(splitGuideFor(6)).toBe(SPLIT_GUIDE[6]);
  });

  it('usa la de 3 días como respaldo', () => {
    expect(splitGuideFor(99)).toBe(SPLIT_GUIDE[3]);
  });

  it('devuelve tantos offsets como días', () => {
    expect(dayOffsetsFor(4)).toHaveLength(4);
    expect(dayOffsetsFor(3)).toEqual([0, 2, 4]);
  });
});

describe('buildPlanPrompt', () => {
  const base = {
    goals: 'ganar músculo',
    daysNum: 3,
    fitness_level: 'intermediate',
    equipment: 'gimnasio_completo',
    focus_areas: 'pecho',
  };

  it('incluye los parámetros del usuario y la guía de split', () => {
    const prompt = buildPlanPrompt(base);
    expect(prompt).toContain('ganar músculo');
    expect(prompt).toContain('gimnasio_completo');
    expect(prompt).toContain('EXACTAMENTE 3 sesiones');
    expect(prompt).toContain(SPLIT_GUIDE[3]);
  });

  it('convierte los minutos de cardio a segundos', () => {
    expect(buildPlanPrompt({ ...base, cardio_minutes: 20 })).toContain('duration_seconds: 1200');
  });

  it('omite el bloque de cardio cuando el usuario elige 0 minutos', () => {
    const prompt = buildPlanPrompt({ ...base, cardio_minutes: 0 });
    expect(prompt).toContain('NO incluir este bloque');
    expect(prompt).not.toContain('bicicleta estática');
  });
});

describe('extractJsonObject', () => {
  it('extrae JSON plano', () => {
    expect(extractJsonObject('{"name":"Plan"}')).toEqual({ name: 'Plan' });
  });

  it('extrae JSON envuelto en un bloque markdown', () => {
    const text = '```json\n{"name":"Plan","sessions":[]}\n```';
    expect(extractJsonObject(text)).toEqual({ name: 'Plan', sessions: [] });
  });

  it('ignora prosa antes y después', () => {
    const text = 'Aquí tienes tu plan:\n{"name":"Plan"}\n¡Mucho ánimo!';
    expect(extractJsonObject(text)).toEqual({ name: 'Plan' });
  });

  it('no se rompe con una llave suelta al final del texto', () => {
    // Regresión: el regex greedy `/\{[\s\S]*\}/` capturaba hasta esa llave y
    // el JSON.parse fallaba.
    const text = '{"name":"Plan"} — recuerda: usa la técnica correcta }';
    expect(extractJsonObject(text)).toEqual({ name: 'Plan' });
  });

  it('respeta las llaves dentro de strings', () => {
    expect(extractJsonObject('{"name":"Plan } raro"}')).toEqual({ name: 'Plan } raro' });
  });

  it('maneja objetos anidados', () => {
    expect(extractJsonObject('{"a":{"b":1},"c":2}')).toEqual({ a: { b: 1 }, c: 2 });
  });

  it('devuelve null si no hay JSON o está corrupto', () => {
    expect(extractJsonObject('sin json aquí')).toBeNull();
    expect(extractJsonObject('{"roto":')).toBeNull();
    expect(extractJsonObject(null)).toBeNull();
    expect(extractJsonObject(undefined)).toBeNull();
  });
});

describe('validatePlan', () => {
  const validPlan = {
    name: '  Plan Fuerza  ',
    description: 'Descripción',
    focus_areas: ['pecho', 42],
    sessions: [{ name: 'Push A', day_order: 1, exercises: [] }],
  };

  it('normaliza un plan válido', () => {
    const result = validatePlan(validPlan);
    expect(result.name).toBe('Plan Fuerza');
    expect(result.focus_areas).toEqual(['pecho']);
    expect(result.sessions).toHaveLength(1);
  });

  it('asigna day_order por posición si falta o es inválido', () => {
    const result = validatePlan({
      name: 'Plan',
      sessions: [{ name: 'A' }, { name: 'B', day_order: 0 }],
    });
    expect(result.sessions.map(s => s.day_order)).toEqual([1, 2]);
  });

  it('descarta sesiones sin nombre', () => {
    const result = validatePlan({
      name: 'Plan',
      sessions: [{ name: 'A' }, { day_order: 2 }, null],
    });
    expect(result.sessions).toHaveLength(1);
  });

  it('rechaza respuestas sin nombre de plan', () => {
    expect(() => validatePlan({ sessions: [{ name: 'A' }] })).toThrow(/nombre de plan/i);
    expect(() => validatePlan({ name: '   ', sessions: [{ name: 'A' }] })).toThrow(/nombre de plan/i);
  });

  it('rechaza respuestas sin sesiones', () => {
    expect(() => validatePlan({ name: 'Plan' })).toThrow(/sesiones/i);
    expect(() => validatePlan({ name: 'Plan', sessions: [] })).toThrow(/sesiones/i);
    expect(() => validatePlan({ name: 'Plan', sessions: [{ noName: true }] })).toThrow(/sesiones válidas/i);
  });

  it('rechaza null y valores no objeto', () => {
    expect(() => validatePlan(null)).toThrow(/formato inválido/i);
    expect(() => validatePlan('texto')).toThrow(/formato inválido/i);
  });

  it('los errores llevan status 400', () => {
    expect(() => validatePlan(null)).toThrow(expect.objectContaining({ status: 400 }));
  });
});

describe('scheduledDateFor', () => {
  it('distribuye las sesiones según la frecuencia semanal', () => {
    expect(scheduledDateFor('2026-08-17', 1, 3)).toBe('2026-08-17');
    expect(scheduledDateFor('2026-08-17', 2, 3)).toBe('2026-08-19');
    expect(scheduledDateFor('2026-08-17', 3, 3)).toBe('2026-08-21');
  });

  it('usa el orden natural si el day_order excede los offsets', () => {
    expect(scheduledDateFor('2026-08-17', 5, 3)).toBe('2026-08-21');
  });
});

describe('toSessionRow', () => {
  const opts = {
    planId: 'plan-1',
    userId: 'user-1',
    startDate: '2026-08-17',
    daysNum: 3,
  };

  it('mapea los campos de la sesión', () => {
    const row = toSessionRow(
      { name: 'Push A', day_order: 2, estimated_duration: 60, estimated_calories: 350, rpe_target: 7, focus_areas: ['pecho'] },
      opts,
    );
    expect(row).toMatchObject({
      plan_id: 'plan-1',
      user_id: 'user-1',
      name: 'Push A',
      scheduled_date: '2026-08-19',
      estimated_duration: 60,
      rpe_target: 7,
      week_number: 1,
      day_order: 2,
    });
    expect(row.ai_insight).toContain('Push A');
  });

  it('anula valores fuera de rango o ausentes', () => {
    const row = toSessionRow({ name: 'X', day_order: 1, rpe_target: 20, estimated_duration: 'mucho' }, opts);
    expect(row.rpe_target).toBeNull();
    expect(row.estimated_duration).toBeNull();
    expect(row.focus_areas).toEqual([]);
  });
});

describe('toExerciseRows', () => {
  it('numera los ejercicios y conserva el tipo', () => {
    const rows = toExerciseRows([
      { exercise_type: 'warmup', exercise_name: 'Movilidad de cadera', sets: 1, duration_seconds: 45 },
      { exercise_type: 'strength', exercise_name: 'Press Banca', sets: 4, reps: 6, weight_kg: 60, rest_seconds: 180 },
    ], 'sess-1');

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ order_num: 1, exercise_type: 'warmup', duration_seconds: 45, reps: null });
    expect(rows[1]).toMatchObject({ order_num: 2, exercise_type: 'strength', reps: 6, weight_kg: 60 });
  });

  it('descarta ejercicios sin nombre', () => {
    const rows = toExerciseRows([{ sets: 3 }, { exercise_name: '  ' }, null, { exercise_name: 'Sentadilla' }], 's');
    expect(rows).toHaveLength(1);
    expect(rows[0].exercise_name).toBe('Sentadilla');
  });

  it('nunca deja sets nulo (columna NOT NULL)', () => {
    const rows = toExerciseRows([{ exercise_name: 'Plancha' }, { exercise_name: 'Curl', sets: 0 }], 's');
    expect(rows.every(r => r.sets >= 1)).toBe(true);
  });

  it('normaliza un exercise_type desconocido a strength', () => {
    const rows = toExerciseRows([{ exercise_name: 'X', exercise_type: 'mobility' }], 's');
    expect(rows[0].exercise_type).toBe('strength');
  });

  it('devuelve [] ante entradas inválidas', () => {
    expect(toExerciseRows(null, 's')).toEqual([]);
    expect(toExerciseRows(undefined, 's')).toEqual([]);
  });
});
