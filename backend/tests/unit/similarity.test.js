import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  weightedJaccard,
  setJaccard,
  primaryMuscle,
  muscleSimilarity,
  jointActionSimilarity,
  angleSimilarity,
  romSimilarity,
  lengthBiasSimilarity,
  resistanceProfileSimilarity,
  bodyPositionSimilarity,
  stabilitySimilarity,
  equipmentSimilarity,
  fatigueSimilarity,
  patternSimilarity,
  familySimilarity,
  penaltyFactor,
  compareExercises,
  toPercent,
  KNOWN_PATTERNS,
  SIMILARITY_FIELDS,
  PENALTY_ANTAGONIST_PATTERN,
  PENALTY_DIFFERENT_FAMILY_PATTERN,
  PENALTY_LOW_PRIMARY_OVERLAP,
} from '../../lib/similarity.js';

/** Fichas con la forma exacta que devuelve el catálogo de Supabase. */
const REMO_BARRA = {
  name: 'Remo con Barra',
  movement_pattern: 'horizontal_pull',
  movement_angle: 0,
  muscle_map: { dorsal: 1.0, romboides: 0.85, 'trapecio medio': 0.85, 'deltoides posterior': 0.65, bíceps: 0.55, 'erectores espinales': 0.5 },
  joint_actions: { hombro: ['extension', 'abduccion_horizontal'], codo: ['flexion'], escapula: ['retraccion'] },
  rom: 2,
  muscle_length_bias: 'mid',
  resistance_profile: [0.5, 1.0, 0.7],
  body_support: { position: 'bent_over', chest_supported: false, back_supported: false },
  stability_demand: 4,
  equipment: ['barra'],
  fatigue: { systemic: 4, lower_back: 5, grip: 3, stability: 4 },
};

const REMO_POLEA = {
  name: 'Remo en Polea Sentado',
  movement_pattern: 'horizontal_pull',
  movement_angle: 0,
  muscle_map: { dorsal: 1.0, romboides: 0.85, 'trapecio medio': 0.85, 'deltoides posterior': 0.6, bíceps: 0.55 },
  joint_actions: { hombro: ['extension', 'abduccion_horizontal'], codo: ['flexion'], escapula: ['retraccion'] },
  rom: 2,
  muscle_length_bias: 'mid',
  resistance_profile: [0.8, 0.9, 0.8],
  body_support: { position: 'seated', chest_supported: false, back_supported: false },
  stability_demand: 2,
  equipment: ['polea'],
  fatigue: { systemic: 2, lower_back: 2, grip: 3, stability: 2 },
};

const JALON_PECHO = {
  name: 'Jalón al Pecho',
  movement_pattern: 'vertical_pull',
  movement_angle: 90,
  muscle_map: { dorsal: 1.0, 'redondo mayor': 0.8, bíceps: 0.6, romboides: 0.5 },
  joint_actions: { hombro: ['aduccion', 'extension'], codo: ['flexion'], escapula: ['depresion'] },
  rom: 3,
  muscle_length_bias: 'lengthened',
  resistance_profile: [0.9, 0.9, 0.7],
  body_support: { position: 'seated', chest_supported: false, back_supported: false },
  stability_demand: 2,
  equipment: ['polea'],
  fatigue: { systemic: 2, lower_back: 1, grip: 3, stability: 2 },
};

const PRESS_BANCA = {
  name: 'Press Banca con Barra',
  movement_pattern: 'horizontal_push',
  movement_angle: 0,
  muscle_map: { pecho: 1.0, tríceps: 0.75, 'deltoides anterior': 0.65 },
  joint_actions: { hombro: ['aduccion_horizontal'], codo: ['extension'], escapula: ['retraccion'] },
  rom: 2,
  muscle_length_bias: 'mid',
  resistance_profile: [0.5, 1.0, 0.7],
  body_support: { position: 'supine', chest_supported: false, back_supported: true },
  stability_demand: 3,
  equipment: ['barra', 'banco'],
  fatigue: { systemic: 4, lower_back: 1, grip: 2, stability: 3 },
};

const CURL_BICEPS = {
  name: 'Curl de Bíceps',
  movement_pattern: 'elbow_flexion',
  movement_angle: null,
  muscle_map: { bíceps: 1.0, braquial: 0.7, antebrazo: 0.4 },
  joint_actions: { codo: ['flexion'] },
  rom: 2,
  muscle_length_bias: 'mid',
  resistance_profile: [0.5, 1.0, 0.6],
  body_support: { position: 'standing', chest_supported: false, back_supported: false },
  stability_demand: 2,
  equipment: ['mancuernas'],
  fatigue: { systemic: 1, lower_back: 1, grip: 2, stability: 1 },
};

describe('weightedJaccard', () => {
  it('no premia a quien declara más músculos: 2 de 2 supera a 2 de 8', () => {
    const objetivo = new Map([['dorsal', 1], ['bíceps', 0.5]]);
    const ajustado = new Map([['dorsal', 1], ['bíceps', 0.5]]);
    const inflado = new Map([
      ['dorsal', 1], ['bíceps', 0.5], ['pecho', 0.5], ['cuádriceps', 0.5],
      ['gemelo', 0.5], ['core', 0.5], ['glúteo', 0.5], ['tríceps', 0.5],
    ]);

    expect(weightedJaccard(objetivo, ajustado)).toBe(1);
    expect(weightedJaccard(objetivo, inflado)).toBeLessThan(0.5);
  });

  it('usa Σmin/Σmax y no el simple conteo de solape', () => {
    const a = new Map([['dorsal', 1]]);
    const b = new Map([['dorsal', 0.5]]);
    expect(weightedJaccard(a, b)).toBe(0.5);
  });

  it('devuelve null si falta alguno de los dos mapas', () => {
    expect(weightedJaccard(null, new Map([['dorsal', 1]]))).toBeNull();
    expect(weightedJaccard(new Map(), new Map([['dorsal', 1]]))).toBeNull();
  });
});

describe('setJaccard', () => {
  it('calcula intersección sobre unión', () => {
    expect(setJaccard(new Set(['a', 'b']), new Set(['a', 'b']))).toBe(1);
    expect(setJaccard(new Set(['a', 'b']), new Set(['a', 'c']))).toBeCloseTo(1 / 3);
    expect(setJaccard(new Set(['a']), new Set(['b']))).toBe(0);
  });
});

describe('primaryMuscle', () => {
  it('devuelve el músculo de mayor peso, normalizado', () => {
    expect(primaryMuscle(new Map([['biceps', 0.5], ['dorsal', 1]]))).toBe('dorsal');
  });

  it('es estable ante pesos empatados', () => {
    const map = new Map([['zeta', 1], ['alfa', 1]]);
    expect(primaryMuscle(map)).toBe('alfa');
  });
});

describe('similitudes por dimensión', () => {
  it('muscleSimilarity: dos remos comparten casi toda la huella muscular', () => {
    expect(muscleSimilarity(REMO_BARRA, REMO_POLEA)).toBeGreaterThan(0.85);
  });

  it('muscleSimilarity: un remo y un curl comparten poco', () => {
    expect(muscleSimilarity(REMO_BARRA, CURL_BICEPS)).toBeLessThan(0.25);
  });

  it('jointActionSimilarity: mismas acciones dan 1; un jalón baja', () => {
    expect(jointActionSimilarity(REMO_BARRA, REMO_POLEA)).toBe(1);
    expect(jointActionSimilarity(REMO_BARRA, JALON_PECHO)).toBeLessThan(0.6);
  });

  it('angleSimilarity: 0° vs 0° = 1, 0° vs 90° = 0, 0° vs 30° intermedio', () => {
    expect(angleSimilarity({ movement_angle: 0 }, { movement_angle: 0 })).toBe(1);
    expect(angleSimilarity({ movement_angle: 0 }, { movement_angle: 90 })).toBe(0);
    expect(angleSimilarity({ movement_angle: 0 }, { movement_angle: 30 })).toBeCloseTo(2 / 3);
  });

  it('angleSimilarity: null si algún ejercicio no tiene ángulo aplicable', () => {
    expect(angleSimilarity(REMO_BARRA, CURL_BICEPS)).toBeNull();
  });

  it('romSimilarity compara recorridos 1-3', () => {
    expect(romSimilarity({ rom: 2 }, { rom: 2 })).toBe(1);
    expect(romSimilarity({ rom: 1 }, { rom: 3 })).toBe(0);
  });

  it('lengthBiasSimilarity: extremos opuestos puntúan 0 y "balanced" media', () => {
    expect(lengthBiasSimilarity({ muscle_length_bias: 'mid' }, { muscle_length_bias: 'mid' })).toBe(1);
    expect(lengthBiasSimilarity({ muscle_length_bias: 'lengthened' }, { muscle_length_bias: 'shortened' })).toBe(0);
    expect(lengthBiasSimilarity({ muscle_length_bias: 'balanced' }, { muscle_length_bias: 'shortened' })).toBe(0.5);
  });

  it('resistanceProfileSimilarity: peso libre vs polea no son idénticos', () => {
    expect(resistanceProfileSimilarity(REMO_BARRA, REMO_BARRA)).toBe(1);
    const libreVsPolea = resistanceProfileSimilarity(REMO_BARRA, REMO_POLEA);
    expect(libreVsPolea).toBeGreaterThan(0.5);
    expect(libreVsPolea).toBeLessThan(1);
  });

  it('bodyPositionSimilarity distingue el apoyo del torso', () => {
    expect(bodyPositionSimilarity(REMO_BARRA, REMO_BARRA)).toBe(1);
    // Mismo apoyo (ninguno) pero distinta posición.
    expect(bodyPositionSimilarity(REMO_BARRA, REMO_POLEA)).toBe(0.5);
  });

  it('stabilitySimilarity separa el remo con barra del remo en polea', () => {
    expect(stabilitySimilarity(REMO_BARRA, REMO_POLEA)).toBe(0.5);
    expect(stabilitySimilarity(REMO_BARRA, REMO_BARRA)).toBe(1);
  });

  it('equipmentSimilarity usa Jaccard sobre el equipo', () => {
    expect(equipmentSimilarity(REMO_POLEA, JALON_PECHO)).toBe(1);
    expect(equipmentSimilarity(REMO_BARRA, REMO_POLEA)).toBe(0);
  });

  it('fatigueSimilarity refleja que el remo con barra cuesta mucho más', () => {
    const remos = fatigueSimilarity(REMO_BARRA, REMO_POLEA);
    expect(remos).toBeLessThan(0.8);
    expect(fatigueSimilarity(REMO_BARRA, REMO_BARRA)).toBe(1);
  });

  it('patternSimilarity: mismo 1, misma familia 0,5, familias distintas 0', () => {
    expect(patternSimilarity(REMO_BARRA, REMO_POLEA)).toBe(1);
    expect(patternSimilarity(REMO_BARRA, JALON_PECHO)).toBe(0.5);
    expect(patternSimilarity(REMO_BARRA, { movement_pattern: 'squat' })).toBe(0);
  });
});

describe('penaltyFactor', () => {
  it('no penaliza el mismo patrón', () => {
    expect(penaltyFactor(REMO_BARRA, REMO_POLEA)).toBe(1);
  });

  it('penaliza moderadamente dentro de la misma familia', () => {
    expect(penaltyFactor(REMO_BARRA, JALON_PECHO)).toBeCloseTo(PENALTY_DIFFERENT_FAMILY_PATTERN);
  });

  it('penaliza con dureza el patrón antagonista', () => {
    // Tracción vs empuje: además cae el solape del músculo objetivo.
    expect(penaltyFactor(REMO_BARRA, PRESS_BANCA))
      .toBeCloseTo(PENALTY_ANTAGONIST_PATTERN * PENALTY_LOW_PRIMARY_OVERLAP);
  });

  it('penaliza cuando el candidato apenas trabaja el músculo objetivo', () => {
    const sinDorsal = { ...REMO_POLEA, muscle_map: { bíceps: 1, antebrazo: 0.5 } };
    expect(penaltyFactor(REMO_BARRA, sinDorsal)).toBeCloseTo(PENALTY_LOW_PRIMARY_OVERLAP);
  });
});

describe('compareExercises', () => {
  it('REGRESIÓN: un curl jamás gana a un remo como sustituto de un remo', () => {
    // El caso real reportado: para "Remo en polea sentado" la app proponía
    // curls y aperturas porque ordenaba alfabéticamente.
    const remo = compareExercises(REMO_POLEA, REMO_BARRA).substitution;
    const curl = compareExercises(REMO_POLEA, CURL_BICEPS).substitution;
    const press = compareExercises(REMO_POLEA, PRESS_BANCA).substitution;

    expect(remo).toBeGreaterThan(curl);
    expect(remo).toBeGreaterThan(press);
    expect(curl).toBeLessThan(0.4);
  });

  it('ordena remo > jalón > curl para un remo', () => {
    const orden = [REMO_BARRA, JALON_PECHO, CURL_BICEPS]
      .map(c => compareExercises(REMO_POLEA, c).substitution);
    expect(orden[0]).toBeGreaterThan(orden[1]);
    expect(orden[1]).toBeGreaterThan(orden[2]);
  });

  it('expone los scores por separado, no un único número', () => {
    const res = compareExercises(REMO_BARRA, REMO_POLEA);

    expect(res.muscular).toBeGreaterThan(0.85);
    expect(res.mechanical).toBeGreaterThan(0.7);
    // Misma espalda, coste muy distinto: es justo lo que el desglose debe mostrar.
    expect(res.fatigue).toBeLessThan(res.muscular);
  });

  it('renormaliza cuando faltan dimensiones en vez de hundir el score', () => {
    const minimo = { movement_pattern: 'horizontal_pull', muscle_map: { dorsal: 1 } };
    const otro = { movement_pattern: 'horizontal_pull', muscle_map: { dorsal: 1 } };
    expect(compareExercises(minimo, otro).substitution).toBe(1);
  });

  it('sin ningún dato utilizable no inventa parecido', () => {
    expect(compareExercises({}, {}).substitution).toBe(0);
  });

  it('acepta JSON en texto, como puede devolverlo PostgREST', () => {
    const comoTexto = {
      ...REMO_POLEA,
      muscle_map: JSON.stringify(REMO_POLEA.muscle_map),
      joint_actions: JSON.stringify(REMO_POLEA.joint_actions),
      resistance_profile: JSON.stringify(REMO_POLEA.resistance_profile),
      body_support: JSON.stringify(REMO_POLEA.body_support),
      fatigue: JSON.stringify(REMO_POLEA.fatigue),
    };
    expect(compareExercises(REMO_BARRA, comoTexto).substitution)
      .toBeCloseTo(compareExercises(REMO_BARRA, REMO_POLEA).substitution);
  });

  it('ignora acentos y mayúsculas en los nombres de músculo', () => {
    const conAcentos = { ...REMO_POLEA, muscle_map: { DORSAL: 1.0, Romboides: 0.85, 'TRAPECIO MEDIO': 0.85, 'Deltoides Posterior': 0.6, BÍCEPS: 0.55 } };
    expect(muscleSimilarity(REMO_POLEA, conAcentos)).toBe(1);
  });
});

describe('familias de patrón', () => {
  it('todos los patrones del catálogo están mapeados a una familia', () => {
    // Un patrón sin mapear cae en la penalización suave (0,75) en vez de la de
    // antagonista (0,30), y el fallo es silencioso. Este test es la red.
    const enCatalogo = [
      'horizontal_pull', 'vertical_pull', 'horizontal_push', 'vertical_push', 'diagonal_push',
      'diagonal_pull', 'dip_push', 'elbow_flexion', 'elbow_extension', 'shoulder_abduction',
      'shoulder_extension', 'shoulder_flexion', 'horizontal_abduction', 'horizontal_adduction',
      'diagonal_adduction', 'rear_delt_pull', 'scapular_elevation', 'external_rotation',
      'forearm_rotation', 'grip_isometric', 'wrist_flexion', 'wrist_extension',
      'wrist_flexion_extension', 'squat', 'lunge', 'knee_extension', 'knee_flexion',
      'hip_hinge', 'hip_extension', 'hip_flexion', 'hip_flexion_extension', 'hip_abduction',
      'hip_adduction', 'hip_rotation', 'posterior_pelvic_tilt', 'calf_raise',
      'ankle_dorsiflexion', 'anti_extension', 'anti_rotation', 'anti_lateral_flexion',
      'trunk_flexion', 'rotation', 'spinal_flexion_extension', 'carry', 'locomotion',
      'shoulder_circumduction', 'stretch',
    ];
    const sinMapear = enCatalogo.filter(p => !KNOWN_PATTERNS.includes(p));
    expect(sinMapear).toEqual([]);
  });

  it('empuje y tracción se reconocen como antagonistas', () => {
    expect(penaltyFactor({ movement_pattern: 'horizontal_adduction' }, { movement_pattern: 'horizontal_abduction' }))
      .toBeCloseTo(PENALTY_ANTAGONIST_PATTERN);
  });

  it('dentro de la misma familia la penalización es suave', () => {
    expect(penaltyFactor({ movement_pattern: 'squat' }, { movement_pattern: 'lunge' }))
      .toBeCloseTo(PENALTY_DIFFERENT_FAMILY_PATTERN);
  });
});

describe('familySimilarity', () => {
  it('distingue una variante del mismo ejercicio de otro parecido', () => {
    const barra = { exercise_family: 'bench_press' };
    const mancuernas = { exercise_family: 'bench_press' };
    const flexiones = { exercise_family: 'push_up' };

    expect(familySimilarity(barra, mancuernas)).toBe(1);
    expect(familySimilarity(barra, flexiones)).toBe(0);
    expect(familySimilarity(barra, {})).toBeNull();
  });

  it('la familia hace ganar a la variante frente a un ejercicio de huella similar', () => {
    // Caso real: las flexiones tienen casi la misma huella que el press de
    // banca con barra, pero el press con mancuernas es la misma familia.
    const conFamilia = f => ({ ...REMO_BARRA, exercise_family: f });
    const original = conFamilia('barbell_row');
    const mismaFamilia = { ...conFamilia('barbell_row'), name: 'Remo Pendlay', stability_demand: 5 };
    const otraFamilia = { ...conFamilia('cable_row'), name: 'Remo en Polea', stability_demand: 5 };

    expect(compareExercises(original, mismaFamilia).substitution)
      .toBeGreaterThan(compareExercises(original, otraFamilia).substitution);
  });
});

describe('toPercent', () => {
  it('convierte a entero 0-100 y respeta el null', () => {
    expect(toPercent(0.876)).toBe(88);
    expect(toPercent(null)).toBeNull();
  });
});

describe('contrato con el endpoint', () => {
  it('cada campo que lee el motor se pide en el SELECT del catálogo', async () => {
    // Regresión: `exercise_family` se añadió al motor pero no a CATALOG_COLUMNS,
    // así que en producción la dimensión de mayor peso venía siempre vacía. Los
    // dobles de Supabase no lo detectan: devuelven el fixture entero ignorando
    // el `select`.
    const source = readFileSync(new URL('../../routes/workouts.js', import.meta.url), 'utf8');
    const declaration = source.slice(source.indexOf('const CATALOG_COLUMNS'));

    expect(declaration).toContain('SIMILARITY_FIELDS');
    for (const field of SIMILARITY_FIELDS) {
      expect(compareExercises({ [field]: null }, { [field]: null })).toBeDefined();
    }
  });

  it('SIMILARITY_FIELDS no lista campos que el motor ya no usa', () => {
    const source = readFileSync(new URL('../../lib/similarity.js', import.meta.url), 'utf8');
    for (const field of SIMILARITY_FIELDS) {
      // Cada campo debe leerse en alguna función del motor (`a?.campo`).
      expect(source).toContain(`?.${field}`);
    }
  });
});
