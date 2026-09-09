import { describe, it, expect } from 'vitest';
import {
  exerciseType,
  isTimed,
  totalSets,
  sortByBlock,
  groupByBlock,
  nextPendingExercise,
  completionPercent,
  formatTimer,
  formatDuration,
  describeExercise,
  estimateCalories,
  kcalPerMinute,
  isExerciseDone,
  blockProgress,
  sessionFocusTitle,
  BLOCK_ORDER,
} from './workout.js';

const ex = (over = {}) => ({ id: 'x', exercise_name: 'Ejercicio', ...over });

describe('exerciseType', () => {
  it('devuelve el tipo cuando es conocido', () => {
    expect(exerciseType(ex({ exercise_type: 'warmup' }))).toBe('warmup');
    expect(exerciseType(ex({ exercise_type: 'cardio' }))).toBe('cardio');
  });

  it('cae a strength cuando falta o es desconocido', () => {
    // Regresión: los ejercicios sin `exercise_type` desaparecían de todos los
    // bloques del WorkoutModal y la sesión nunca se podía completar.
    expect(exerciseType(ex())).toBe('strength');
    expect(exerciseType(ex({ exercise_type: null }))).toBe('strength');
    expect(exerciseType(ex({ exercise_type: 'mobility' }))).toBe('strength');
    expect(exerciseType(undefined)).toBe('strength');
  });
});

describe('isTimed / totalSets', () => {
  it('detecta ejercicios por tiempo', () => {
    expect(isTimed(ex({ duration_seconds: 45 }))).toBe(true);
    expect(isTimed(ex({ duration_seconds: 0 }))).toBe(false);
    expect(isTimed(ex())).toBe(false);
  });

  it('usa las series declaradas', () => {
    expect(totalSets(ex({ sets: 4 }))).toBe(4);
  });

  it('los ejercicios por tiempo tienen una sola serie', () => {
    expect(totalSets(ex({ duration_seconds: 45, sets: 3 }))).toBe(1);
  });

  it('respalda a 3 series en fuerza y 1 en el resto cuando falta el dato', () => {
    expect(totalSets(ex({ exercise_type: 'strength' }))).toBe(3);
    expect(totalSets(ex({ exercise_type: 'cooldown' }))).toBe(1);
    expect(totalSets(ex({ sets: 0 }))).toBe(3);
  });
});

describe('sortByBlock', () => {
  it('ordena por bloque y luego por order_num', () => {
    const list = [
      ex({ id: 'c', exercise_type: 'cooldown', order_num: 9 }),
      ex({ id: 'b', exercise_type: 'strength', order_num: 5 }),
      ex({ id: 'a', exercise_type: 'warmup', order_num: 1 }),
      ex({ id: 'b2', exercise_type: 'strength', order_num: 4 }),
    ];
    expect(sortByBlock(list).map(e => e.id)).toEqual(['a', 'b2', 'b', 'c']);
  });

  it('no muta el array original', () => {
    const list = [ex({ id: '2', exercise_type: 'cooldown' }), ex({ id: '1', exercise_type: 'warmup' })];
    sortByBlock(list);
    expect(list[0].id).toBe('2');
  });

  it('coloca los ejercicios sin tipo en el bloque de fuerza', () => {
    const list = [ex({ id: 'sin-tipo' }), ex({ id: 'cal', exercise_type: 'warmup' })];
    expect(sortByBlock(list).map(e => e.id)).toEqual(['cal', 'sin-tipo']);
  });
});

describe('groupByBlock', () => {
  it('agrupa en el orden calentamiento → fuerza → cardio → estiramiento', () => {
    const blocks = groupByBlock([
      ex({ id: '1', exercise_type: 'cooldown' }),
      ex({ id: '2', exercise_type: 'warmup' }),
      ex({ id: '3', exercise_type: 'strength' }),
      ex({ id: '4', exercise_type: 'cardio' }),
    ]);
    expect(blocks.map(b => b.type)).toEqual(BLOCK_ORDER);
  });

  it('omite los bloques vacíos', () => {
    const blocks = groupByBlock([ex({ exercise_type: 'strength' })]);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].label).toBe('Entrenamiento');
  });

  it('no pierde ejercicios sin exercise_type', () => {
    const blocks = groupByBlock([ex({ id: 'huerfano' })]);
    const total = blocks.reduce((n, b) => n + b.exercises.length, 0);
    expect(total).toBe(1);
    expect(blocks[0].type).toBe('strength');
  });

  it('devuelve [] con lista vacía', () => {
    expect(groupByBlock([])).toEqual([]);
    expect(groupByBlock()).toEqual([]);
  });
});

describe('nextPendingExercise', () => {
  const list = [
    ex({ id: 'w', exercise_type: 'warmup', order_num: 1 }),
    ex({ id: 's1', exercise_type: 'strength', order_num: 2 }),
    ex({ id: 's2', exercise_type: 'strength', order_num: 3 }),
  ];

  it('devuelve el primer pendiente respetando el orden de bloques', () => {
    expect(nextPendingExercise(list, new Set()).id).toBe('w');
    expect(nextPendingExercise(list, new Set(['w'])).id).toBe('s1');
  });

  it('devuelve null cuando todo está completado', () => {
    expect(nextPendingExercise(list, new Set(['w', 's1', 's2']))).toBeNull();
  });

  it('funciona sin argumentos', () => {
    expect(nextPendingExercise()).toBeNull();
  });
});

describe('completionPercent', () => {
  it('calcula el porcentaje', () => {
    expect(completionPercent(10, 5)).toBe(50);
    expect(completionPercent(3, 3)).toBe(100);
  });

  it('devuelve 0 sin ejercicios y no se pasa de 100', () => {
    expect(completionPercent(0, 0)).toBe(0);
    expect(completionPercent(2, 5)).toBe(100);
  });
});

describe('formatTimer', () => {
  it('formatea mm:ss', () => {
    expect(formatTimer(0)).toBe('00:00');
    expect(formatTimer(65)).toBe('01:05');
    expect(formatTimer(599)).toBe('09:59');
  });

  it('añade horas cuando pasa de 60 minutos', () => {
    expect(formatTimer(3661)).toBe('01:01:01');
  });

  it('nunca muestra negativos', () => {
    expect(formatTimer(-30)).toBe('00:00');
    expect(formatTimer(undefined)).toBe('00:00');
  });
});

describe('formatDuration / describeExercise', () => {
  it('usa segundos por debajo del minuto y minutos por encima', () => {
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(1200)).toBe('20 min');
    expect(formatDuration(0)).toBe('');
  });

  it('describe ejercicios de fuerza y por tiempo', () => {
    expect(describeExercise(ex({ sets: 4, reps: 6, weight_kg: 60 }))).toBe('4 × 6 reps · 60kg');
    expect(describeExercise(ex({ sets: 3, reps: 10 }))).toBe('3 × 10 reps');
    expect(describeExercise(ex({ duration_seconds: 45 }))).toBe('45s');
    expect(describeExercise(null)).toBe('');
  });
});

describe('estimateCalories', () => {
  it('una hora a RPE 7 ronda las 580 kcal (rango fisiológico)', () => {
    // Regresión: la fórmula anterior daba ~13 kcal por una hora entera y ese
    // valor se guardaba en `actual_calories`.
    const kcal = estimateCalories(3600, 7);
    expect(kcal).toBeGreaterThan(400);
    expect(kcal).toBeLessThan(800);
  });

  it('crece con el RPE y con el tiempo', () => {
    expect(estimateCalories(1800, 9)).toBeGreaterThan(estimateCalories(1800, 4));
    expect(estimateCalories(3600, 7)).toBeGreaterThan(estimateCalories(1800, 7));
  });

  it('devuelve 0 al inicio de la sesión', () => {
    expect(estimateCalories(0, 7)).toBe(0);
    expect(estimateCalories(-100, 7)).toBe(0);
  });

  it('usa un RPE por defecto si el valor es inválido', () => {
    expect(kcalPerMinute(undefined)).toBe(kcalPerMinute(6));
    expect(kcalPerMinute(50)).toBe(kcalPerMinute(6));
    expect(kcalPerMinute('alto')).toBe(kcalPerMinute(6));
  });
});

describe('isExerciseDone', () => {
  it('se apoya en `completed` cuando no hay sesión en curso', () => {
    expect(isExerciseDone(ex({ completed: true }))).toBe(true);
    expect(isExerciseDone(ex({ completed: false }))).toBe(false);
  });

  it('da por hecho lo que marcó el modal aunque la fila siga sin actualizar', () => {
    expect(isExerciseDone(ex({ id: 'a', completed: false }), new Set(['a']))).toBe(true);
  });

  it('no descarta lo que ya venía completado de la base', () => {
    // `doneIds` arranca desde `completed`, pero un Set vacío no debe borrar
    // el progreso guardado.
    expect(isExerciseDone(ex({ id: 'a', completed: true }), new Set())).toBe(true);
  });
});

describe('blockProgress', () => {
  const sesion = [
    ex({ id: 'w1', exercise_type: 'warmup', order_num: 1 }),
    ex({ id: 'w2', exercise_type: 'warmup', order_num: 2 }),
    ex({ id: 's1', exercise_type: 'strength', order_num: 3 }),
    ex({ id: 's2', exercise_type: 'strength', order_num: 4 }),
    ex({ id: 'c1', exercise_type: 'cooldown', order_num: 5 }),
  ];

  it('devuelve una parte por bloque presente, en orden', () => {
    expect(blockProgress(sesion).map(b => b.type)).toEqual(['warmup', 'strength', 'cooldown']);
  });

  it('omite los bloques sin ejercicios', () => {
    // Con `cardio_minutes = 0` el generador no crea bloque de cardio: no debe
    // aparecer una parte vacía en la barra.
    expect(blockProgress(sesion).some(b => b.type === 'cardio')).toBe(false);
  });

  it('calcula el avance de cada bloque por separado', () => {
    const progreso = blockProgress(sesion, new Set(['w1', 'w2', 's1']));

    expect(progreso.find(b => b.type === 'warmup')).toMatchObject({ done: 2, total: 2, percent: 100 });
    expect(progreso.find(b => b.type === 'strength')).toMatchObject({ done: 1, total: 2, percent: 50 });
    expect(progreso.find(b => b.type === 'cooldown')).toMatchObject({ done: 0, total: 1, percent: 0 });
  });

  it('sin ejercicios no devuelve partes', () => {
    expect(blockProgress([])).toEqual([]);
    expect(blockProgress()).toEqual([]);
  });
});

describe('sessionFocusTitle', () => {
  it('resume un día de pierna en una palabra', () => {
    expect(sessionFocusTitle({ focus_areas: ['cuádriceps', 'glúteos', 'isquiotibiales'] })).toBe('Piernas');
  });

  it('ignora los acentos de `focus_areas`', () => {
    expect(sessionFocusTitle({ focus_areas: ['tríceps'] })).toBe('Brazos');
  });

  it('gana el primer músculo, que es el principal del día', () => {
    expect(sessionFocusTitle({ focus_areas: ['pectorales', 'deltoides', 'tríceps'] })).toBe('Pecho');
    expect(sessionFocusTitle({ focus_areas: ['dorsales', 'bíceps'] })).toBe('Espalda');
  });

  it('avisa cuando el día mezcla tren superior e inferior', () => {
    expect(sessionFocusTitle({ focus_areas: ['pecho', 'cuádriceps'] })).toBe('Cuerpo completo');
  });

  it('el core no convierte un día en cuerpo completo', () => {
    expect(sessionFocusTitle({ focus_areas: ['abdomen'] })).toBe('Core');
    expect(sessionFocusTitle({ focus_areas: ['glúteos', 'core'] })).toBe('Piernas');
  });

  it('cae al nombre original antes que inventar un título', () => {
    expect(sessionFocusTitle({ focus_areas: [], name: 'Lower A — Enfoque en Sentadilla' }))
      .toBe('Lower A — Enfoque en Sentadilla');
    expect(sessionFocusTitle({ focus_areas: ['movilidad'], name: 'Full Body B' })).toBe('Full Body B');
  });

  it('nunca devuelve vacío', () => {
    expect(sessionFocusTitle({})).toBe('Entrenamiento');
    expect(sessionFocusTitle(null)).toBe('Entrenamiento');
    expect(sessionFocusTitle({ focus_areas: null, name: '   ' })).toBe('Entrenamiento');
  });
});
