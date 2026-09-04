import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  parseCsv,
  emptyToNull,
  CATEGORY_TO_BLOCK,
  toExerciseType,
  splitEquipment,
  normalizeLengthBias,
  parseWeightMap,
  parseJointActions,
  parseProfile,
  deriveMuscleGroups,
  parseIntInRange,
  parseBool,
  toExerciseRow,
  readCheckValues,
  sqlText,
  sqlTextArray,
  sqlJson,
  buildSql,
  loadCatalog,
} from '../../scripts/import-catalog-v2.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const CSV_PATH = join(ROOT, 'database', 'catalog', 'exercises_v2_science_based.csv');
const SCHEMA_PATH = join(ROOT, 'database', 'schema.sql');

/** Fila mínima válida del CSV v2, para variar solo el campo bajo prueba. */
function csvRow(overrides = {}) {
  return {
    exercise_id: 'barbell_bench_press',
    name_es: 'Press Banca con Barra',
    name_en: 'Barbell Bench Press',
    category: 'strength',
    body_region: 'chest',
    exercise_family: 'bench_press',
    primary_pattern: 'horizontal_push',
    secondary_pattern: '',
    movement_angle_deg: '0',
    muscle_map: 'pectoralis_major:1.0|triceps_brachii:0.75|deltoid_anterior:0.60',
    region_bias: 'pectoralis_major.sternal:1.0|pectoralis_major.clavicular:0.55',
    joint_actions: 'shoulder:horizontal_adduction|elbow:extension|scapula:retraction_control',
    equipment_type: 'barbell',
    attachment: '',
    body_position: 'supine',
    torso_angle_deg: '',
    chest_supported: 'false',
    back_supported: 'true',
    grip_orientation: 'pronated',
    grip_width: 'medium',
    elbow_path: 'medium',
    laterality: 'bilateral',
    kinetic_chain: 'open',
    is_compound: 'true',
    rom_score: '2',
    muscle_length_bias: 'mid',
    resistance_profile: '0.5|1.0|0.7',
    stability_demand: '3',
    fatigue_systemic: '4',
    fatigue_lower_back: '1',
    fatigue_grip: '2',
    skill_demand: '3',
    variant_keys: 'grip_width|bar_path',
    notes: '',
    ...overrides,
  };
}

/** Cabecera + filas en el formato del CSV real (para `parseCsv` y `loadCatalog`). */
function toCsvText(rows) {
  const header = Object.keys(csvRow());
  const line = row => header.map((key) => {
    const value = String(row[key] ?? '');
    return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }).join(',');
  return [header.join(','), ...rows.map(line)].join('\n');
}

describe('parseCsv', () => {
  it('descarta el BOM de la cabecera para que la primera columna sea legible', () => {
    const text = `﻿exercise_id,name_es\nbarbell_bench_press,Press Banca con Barra\n`;
    expect(parseCsv(text)).toEqual([
      { exercise_id: 'barbell_bench_press', name_es: 'Press Banca con Barra' },
    ]);
  });

  it('respeta las comas dentro de campos entrecomillados', () => {
    const text = 'name_es,notes\n"Remo con Barra, Pendlay","tira, suelta"\n';
    expect(parseCsv(text)[0]).toEqual({ name_es: 'Remo con Barra, Pendlay', notes: 'tira, suelta' });
  });

  it('ignora líneas en blanco y rellena las columnas que faltan', () => {
    const text = 'name_es,name_en\nSentadilla con Barra\n\n';
    expect(parseCsv(text)).toEqual([{ name_es: 'Sentadilla con Barra', name_en: '' }]);
  });
});

describe('toExerciseType', () => {
  it('mapea las cinco categorías del CSV a los cuatro bloques del entrenamiento', () => {
    expect(toExerciseType('strength')).toBe('strength');
    // El core es trabajo de fuerza dentro de la sesión, no un bloque aparte.
    expect(toExerciseType('core')).toBe('strength');
    expect(toExerciseType('cardio')).toBe('cardio');
    expect(toExerciseType('mobility')).toBe('warmup');
    expect(toExerciseType('stretch')).toBe('cooldown');
  });

  it('cubre todas las categorías del mapa sin dejar ninguna fuera de los bloques', () => {
    const blocks = new Set(['warmup', 'strength', 'cardio', 'cooldown']);
    for (const category of Object.keys(CATEGORY_TO_BLOCK)) {
      expect(blocks.has(toExerciseType(category))).toBe(true);
    }
  });

  it('falla con la categoría concreta cuando no está mapeada', () => {
    expect(() => toExerciseType('plyometrics')).toThrow(/category desconocida: "plyometrics"/);
    expect(() => toExerciseType('')).toThrow(/category desconocida/);
  });
});

describe('splitEquipment', () => {
  it('parte los valores OR en dos equipos', () => {
    expect(splitEquipment('barbell_or_dumbbell')).toEqual(['barbell', 'dumbbell']);
    expect(splitEquipment('bodyweight_or_barbell')).toEqual(['bodyweight', 'barbell']);
    expect(splitEquipment('bodyweight_or_dumbbell')).toEqual(['bodyweight', 'dumbbell']);
    expect(splitEquipment('bodyweight_or_machine')).toEqual(['bodyweight', 'machine']);
  });

  it('corta por el primer _or_ para no romper el nombre del segundo equipo', () => {
    expect(splitEquipment('dumbbell_or_trap_bar')).toEqual(['dumbbell', 'trap_bar']);
  });

  it('deja intactos los equipos simples, incluidos los que llevan guion bajo', () => {
    expect(splitEquipment('cable')).toEqual(['cable']);
    expect(splitEquipment('selectorized_machine')).toEqual(['selectorized_machine']);
    expect(splitEquipment('rowing_ergometer')).toEqual(['rowing_ergometer']);
  });

  it('devuelve un array vacío cuando no hay equipo', () => {
    expect(splitEquipment('')).toEqual([]);
    expect(splitEquipment(null)).toEqual([]);
  });
});

describe('normalizeLengthBias', () => {
  it('traduce shortened_bias al valor que admite el CHECK', () => {
    expect(normalizeLengthBias('shortened_bias')).toBe('shortened');
  });

  it('conserva dynamic y el resto de valores del CSV', () => {
    expect(normalizeLengthBias('dynamic')).toBe('dynamic');
    expect(normalizeLengthBias('lengthened')).toBe('lengthened');
    expect(normalizeLengthBias('mid')).toBe('mid');
    expect(normalizeLengthBias('balanced')).toBe('balanced');
  });

  it('vacío → null y desconocido → error', () => {
    expect(normalizeLengthBias('')).toBeNull();
    expect(() => normalizeLengthBias('stretched')).toThrow(/muscle_length_bias desconocido/);
  });
});

describe('parseWeightMap', () => {
  it('convierte clave:peso|clave:peso en un objeto', () => {
    expect(parseWeightMap('pectoralis_major:1.0|triceps_brachii:0.75')).toEqual({
      pectoralis_major: 1,
      triceps_brachii: 0.75,
    });
  });

  it('admite claves con punto, como las porciones de region_bias', () => {
    expect(parseWeightMap('pectoralis_major.sternal:1.0|pectoralis_major.clavicular:0.55')).toEqual({
      'pectoralis_major.sternal': 1,
      'pectoralis_major.clavicular': 0.55,
    });
  });

  it('vacío → null', () => {
    expect(parseWeightMap('')).toBeNull();
    expect(parseWeightMap(null)).toBeNull();
  });

  it('rechaza pares mal formados y pesos fuera de (0,1]', () => {
    expect(() => parseWeightMap('pectoralis_major')).toThrow(/mal formado/);
    expect(() => parseWeightMap('pectoralis_major:mucho')).toThrow(/mal formado/);
    expect(() => parseWeightMap('pectoralis_major:1.4')).toThrow(/fuera de \(0,1\]/);
    expect(() => parseWeightMap('pectoralis_major:0')).toThrow(/fuera de \(0,1\]/);
  });
});

describe('parseJointActions', () => {
  it('convierte articulacion:accion+accion en un objeto de arrays', () => {
    expect(parseJointActions('hip:extension+abduction|knee:extension')).toEqual({
      hip: ['extension', 'abduction'],
      knee: ['extension'],
    });
  });

  it('vacío → null', () => {
    expect(parseJointActions('')).toBeNull();
  });

  it('rechaza articulaciones sin acciones', () => {
    expect(() => parseJointActions('hip')).toThrow(/mal formado/);
    expect(() => parseJointActions('hip:')).toThrow(/mal formado/);
  });
});

describe('parseProfile', () => {
  it('convierte 0.5|1.0|0.7 en un array de tres números', () => {
    expect(parseProfile('0.5|1.0|0.7')).toEqual([0.5, 1, 0.7]);
  });

  it('vacío → null: 18 filas del catálogo no tienen curva de resistencia', () => {
    expect(parseProfile('')).toBeNull();
    expect(parseProfile('   ')).toBeNull();
    expect(parseProfile(null)).toBeNull();
  });

  it('exige exactamente tres números', () => {
    expect(() => parseProfile('0.5|1.0')).toThrow(/3 números/);
    expect(() => parseProfile('0.5|1.0|alto')).toThrow(/3 números/);
  });
});

describe('deriveMuscleGroups', () => {
  it('ordena las claves de muscle_map por peso descendente', () => {
    const map = parseWeightMap('deltoid_anterior:0.60|pectoralis_major:1.0|triceps_brachii:0.75');
    expect(deriveMuscleGroups(map)).toEqual(['pectoralis_major', 'triceps_brachii', 'deltoid_anterior']);
  });

  it('desempata alfabéticamente para que el SQL sea estable entre ejecuciones', () => {
    const map = parseWeightMap('quadriceps:1.0|adductors:1.0|gluteus_maximus:0.75');
    expect(deriveMuscleGroups(map)).toEqual(['adductors', 'quadriceps', 'gluteus_maximus']);
  });

  it('falla si no hay muscle_map: la columna es NOT NULL', () => {
    expect(() => deriveMuscleGroups(null)).toThrow(/NOT NULL/);
    expect(() => deriveMuscleGroups({})).toThrow(/NOT NULL/);
  });
});

describe('emptyToNull / parseIntInRange / parseBool', () => {
  it('nunca deja cadenas vacías en columnas de texto', () => {
    expect(emptyToNull('')).toBeNull();
    expect(emptyToNull('   ')).toBeNull();
    expect(emptyToNull(undefined)).toBeNull();
    expect(emptyToNull(' rope ')).toBe('rope');
  });

  it('acepta enteros dentro del rango y admite los ángulos declinados', () => {
    expect(parseIntInRange('3', 1, 5, 'rom')).toBe(3);
    expect(parseIntInRange('', 1, 5, 'rom')).toBeNull();
    expect(parseIntInRange('-15', -90, 90, 'movement_angle_deg')).toBe(-15);
  });

  it('rechaza valores fuera de rango nombrando el campo', () => {
    expect(() => parseIntInRange('6', 1, 5, 'skill_demand')).toThrow(/skill_demand debe ser un entero entre 1 y 5/);
    expect(() => parseIntInRange('2.5', 1, 5, 'rom_score')).toThrow(/rom_score/);
  });

  it('exige true/false explícito en los booleanos', () => {
    expect(parseBool('true', 'is_compound')).toBe(true);
    expect(parseBool('false', 'is_compound')).toBe(false);
    expect(() => parseBool('', 'is_compound')).toThrow(/se esperaba true\/false/);
    expect(() => parseBool('sí', 'chest_supported')).toThrow(/chest_supported/);
  });
});

describe('toExerciseRow', () => {
  it('normaliza una fila completa del CSV', () => {
    const exercise = toExerciseRow(csvRow());
    expect(exercise).toMatchObject({
      name: 'Press Banca con Barra',
      slug: 'barbell_bench_press',
      name_en: 'Barbell Bench Press',
      exercise_type: 'strength',
      equipment: ['barbell'],
      muscle_groups: ['pectoralis_major', 'triceps_brachii', 'deltoid_anterior'],
      movement_pattern: 'horizontal_push',
      secondary_pattern: null,
      attachment: null,
      resistance_profile: [0.5, 1, 0.7],
      skill_demand: 3,
    });
    expect(exercise.fatigue).toEqual({ systemic: 4, lower_back: 1, grip: 2 });
  });

  it('agrupa el agarre y los apoyos en sus JSONB', () => {
    const exercise = toExerciseRow(csvRow({ torso_angle_deg: '30', body_position: 'incline_supine' }));
    expect(exercise.grip).toEqual({ orientation: 'pronated', width: 'medium', elbow_path: 'medium' });
    expect(exercise.body_support).toEqual({
      position: 'incline_supine',
      torso_angle: 30,
      chest_supported: false,
      back_supported: true,
    });
  });

  it('omite torso_angle del body_support cuando el CSV no lo trae', () => {
    expect(toExerciseRow(csvRow()).body_support).not.toHaveProperty('torso_angle');
  });

  it('exige nombre y slug', () => {
    expect(() => toExerciseRow(csvRow({ name_es: '' }))).toThrow(/name_es vacío/);
    expect(() => toExerciseRow(csvRow({ exercise_id: '' }))).toThrow(/exercise_id vacío/);
  });
});

describe('escapado SQL', () => {
  it('duplica las comillas simples en textos y JSON', () => {
    expect(sqlText("Press d'Arnold")).toBe("'Press d''Arnold'");
    expect(sqlJson({ nota: "d'oh" })).toBe(`'{"nota":"d''oh"}'::jsonb`);
  });

  it('vacíos y nulos van como NULL', () => {
    expect(sqlText(null)).toBe('NULL');
    expect(sqlText('')).toBe('NULL');
    expect(sqlJson(null)).toBe('NULL');
  });

  it('escribe arrays de texto tipados', () => {
    expect(sqlTextArray([])).toBe('ARRAY[]::TEXT[]');
    expect(sqlTextArray(['barbell', 'dumbbell'])).toBe("ARRAY['barbell','dumbbell']::TEXT[]");
  });
});

describe('readCheckValues', () => {
  it('lee los valores admitidos por un CHECK del bloque MIGRACIONES', () => {
    const schema = `
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_demo_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_demo_check
  CHECK (demo IS NULL OR demo IN ('uno','dos','tres'));
`;
    expect(readCheckValues(schema, 'exercises_demo_check')).toEqual(['uno', 'dos', 'tres']);
  });

  it('devuelve null si la restricción no está', () => {
    expect(readCheckValues('-- nada', 'exercises_demo_check')).toBeNull();
  });
});

describe('buildSql', () => {
  const sql = buildSql([toExerciseRow(csvRow())]);

  it('borra el catálogo viejo sin tocar lo que referencian las sesiones', () => {
    expect(sql).toContain('DELETE FROM exercises');
    expect(sql).toContain('WHERE is_public = TRUE');
    expect(sql).toContain('id NOT IN (SELECT DISTINCT exercise_id FROM session_exercises WHERE exercise_id IS NOT NULL)');
  });

  it('es idempotente por nombre', () => {
    expect(sql).toContain('ON CONFLICT (name) DO UPDATE SET');
    expect(sql).toContain('muscle_groups      = EXCLUDED.muscle_groups');
  });

  it('no toca la media: image_url y video_url se pueblan aparte', () => {
    expect(sql).not.toContain('image_url');
    expect(sql).not.toContain('video_url');
  });
});

describe('loadCatalog', () => {
  it('acumula los problemas en vez de cortar en el primero', () => {
    const csv = toCsvText([
      csvRow({ category: 'plyometrics' }),
      csvRow({ exercise_id: 'otro', name_es: 'Otro', resistance_profile: '0.5|1.0' }),
    ]);
    const { exercises, problems } = loadCatalog(csv, null);
    expect(exercises).toHaveLength(0);
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/línea 2 \("Press Banca con Barra"\): category desconocida/);
    expect(problems[1]).toMatch(/línea 3 \("Otro"\): resistance_profile/);
  });

  it('detecta nombres y slugs repetidos indicando la línea original', () => {
    const csv = toCsvText([csvRow(), csvRow()]);
    const { problems } = loadCatalog(csv, null);
    expect(problems.some(p => /nombre duplicado \(ya en la línea 2\)/.test(p))).toBe(true);
    expect(problems.some(p => /exercise_id "barbell_bench_press" duplicado/.test(p))).toBe(true);
  });

  it('avisa cuando el CSV trae un valor que el CHECK de schema.sql no admite', () => {
    const schema = `
ALTER TABLE exercises ADD CONSTRAINT exercises_movement_pattern_check
  CHECK (movement_pattern IS NULL OR movement_pattern IN ('vertical_push'));
`;
    const { problems } = loadCatalog(toCsvText([csvRow()]), schema);
    expect(problems.some(p => /movement_pattern "horizontal_push".*no está en el CHECK/.test(p))).toBe(true);
  });

  it('cuenta los ejercicios por bloque', () => {
    const csv = toCsvText([
      csvRow(),
      csvRow({ exercise_id: 'cat_camel', name_es: 'Gato-Camello', category: 'mobility' }),
      csvRow({ exercise_id: 'plank', name_es: 'Plancha', category: 'core' }),
    ]);
    const { byBlock, problems } = loadCatalog(csv, null);
    expect(problems).toEqual([]);
    expect(byBlock).toEqual({ strength: 2, warmup: 1 });
  });
});

// Los tres siguientes son de caracterización: fijan el estado real del catálogo
// v2 para que una edición del CSV que rompa el contrato salte en la suite.
describe('catálogo v2 real', () => {
  const csv = readFileSync(CSV_PATH, 'utf8');
  const schema = readFileSync(SCHEMA_PATH, 'utf8');
  const { exercises, problems, byBlock } = loadCatalog(csv, schema);

  it('importa los 150 ejercicios sin un solo problema', () => {
    expect(problems).toEqual([]);
    expect(exercises).toHaveLength(150);
  });

  it('reparte los ejercicios entre los cuatro bloques', () => {
    expect(byBlock).toEqual({ warmup: 6, strength: 130, cardio: 8, cooldown: 6 });
  });

  it('deja todas las filas con muscle_groups y equipment utilizables', () => {
    for (const ex of exercises) {
      expect(ex.muscle_groups.length).toBeGreaterThan(0);
      expect(ex.equipment.length).toBeGreaterThan(0);
      expect(ex.equipment.every(item => !item.includes('_or_'))).toBe(true);
    }
  });
});
