import { describe, it, expect } from 'vitest';
import {
  MAX_ALTERNATIVES,
  FALLBACK_REASON,
  filterCandidates,
  rankCandidates,
  buildAlternativesPrompt,
  toAlternative,
  fallbackAlternatives,
  parseAlternatives,
} from '../../lib/alternatives.js';

/**
 * Catálogo con la forma que devuelve Supabase, huella biomecánica incluida.
 * El ranking ya no depende de `muscle_groups` sino de estos atributos.
 */
const CATALOG = [
  {
    id: 'ex-press-barra',
    name: 'Press Banca con Barra',
    muscle_groups: ['pecho', 'tríceps', 'hombros'],
    equipment: ['barra', 'banco'],
    description: 'Baja al esternón y empuja.',
    image_url: null,
    video_url: null,
    exercise_type: 'strength',
    movement_pattern: 'horizontal_push',
    movement_angle: 0,
    muscle_map: { pecho: 1.0, tríceps: 0.75, 'deltoides anterior': 0.65 },
    joint_actions: { hombro: ['aduccion_horizontal'], codo: ['extension'] },
    rom: 2,
    muscle_length_bias: 'mid',
    resistance_profile: [0.5, 1.0, 0.7],
    body_support: { position: 'supine', chest_supported: false, back_supported: true },
    stability_demand: 3,
    laterality: 'bilateral',
    is_compound: true,
    kinetic_chain: 'open',
    fatigue: { systemic: 4, lower_back: 1, grip: 2, stability: 3 },
  },
  {
    id: 'ex-press-mancuernas',
    name: 'Press Banca con Mancuernas',
    muscle_groups: ['pecho', 'tríceps', 'hombros'],
    equipment: ['mancuernas', 'banco'],
    description: 'Baja controlando y empuja.',
    image_url: null,
    video_url: null,
    exercise_type: 'strength',
    movement_pattern: 'horizontal_push',
    movement_angle: 0,
    muscle_map: { pecho: 1.0, tríceps: 0.7, 'deltoides anterior': 0.65 },
    joint_actions: { hombro: ['aduccion_horizontal'], codo: ['extension'] },
    rom: 3,
    muscle_length_bias: 'lengthened',
    resistance_profile: [0.6, 1.0, 0.6],
    body_support: { position: 'supine', chest_supported: false, back_supported: true },
    stability_demand: 3,
    laterality: 'bilateral',
    is_compound: true,
    kinetic_chain: 'open',
    fatigue: { systemic: 4, lower_back: 1, grip: 2, stability: 3 },
  },
  {
    id: 'ex-flexiones',
    name: 'Flexiones de Pecho',
    muscle_groups: ['pecho', 'tríceps', 'core'],
    equipment: [],
    description: 'Cuerpo en línea recta.',
    image_url: null,
    video_url: null,
    exercise_type: 'strength',
    movement_pattern: 'horizontal_push',
    movement_angle: 0,
    muscle_map: { pecho: 1.0, tríceps: 0.75, 'deltoides anterior': 0.6, core: 0.5 },
    joint_actions: { hombro: ['aduccion_horizontal'], codo: ['extension'] },
    rom: 2,
    muscle_length_bias: 'mid',
    resistance_profile: [0.5, 1.0, 0.7],
    body_support: { position: 'prone', chest_supported: false, back_supported: false },
    stability_demand: 3,
    laterality: 'bilateral',
    is_compound: true,
    kinetic_chain: 'closed',
    fatigue: { systemic: 3, lower_back: 2, grip: 1, stability: 3 },
  },
  {
    id: 'ex-aperturas',
    name: 'Aperturas con Mancuernas',
    muscle_groups: ['pecho'],
    equipment: ['mancuernas', 'banco'],
    description: 'Abre en arco.',
    image_url: null,
    video_url: null,
    exercise_type: 'strength',
    movement_pattern: 'horizontal_push',
    movement_angle: 0,
    muscle_map: { pecho: 1.0, 'deltoides anterior': 0.4 },
    joint_actions: { hombro: ['aduccion_horizontal'] },
    rom: 3,
    muscle_length_bias: 'lengthened',
    resistance_profile: [1.0, 0.8, 0.3],
    body_support: { position: 'supine', chest_supported: false, back_supported: true },
    stability_demand: 3,
    laterality: 'bilateral',
    is_compound: false,
    kinetic_chain: 'open',
    fatigue: { systemic: 2, lower_back: 1, grip: 2, stability: 3 },
  },
  {
    id: 'ex-curl',
    name: 'Curl de Bíceps',
    muscle_groups: ['bíceps'],
    equipment: ['mancuernas'],
    description: 'Codos pegados al torso.',
    image_url: null,
    video_url: null,
    exercise_type: 'strength',
    movement_pattern: 'elbow_flexion',
    movement_angle: null,
    muscle_map: { bíceps: 1.0, braquial: 0.7, antebrazo: 0.4 },
    joint_actions: { codo: ['flexion'] },
    rom: 2,
    muscle_length_bias: 'mid',
    resistance_profile: [0.5, 1.0, 0.6],
    body_support: { position: 'standing', chest_supported: false, back_supported: false },
    stability_demand: 2,
    laterality: 'bilateral',
    is_compound: false,
    kinetic_chain: 'open',
    fatigue: { systemic: 1, lower_back: 1, grip: 2, stability: 2 },
  },
  {
    id: 'ex-nino',
    name: 'Postura del Niño',
    muscle_groups: ['espalda baja'],
    equipment: [],
    description: 'Siéntate sobre los talones.',
    image_url: null,
    video_url: null,
    exercise_type: 'cooldown',
    movement_pattern: 'stretch',
    muscle_map: { 'espalda baja': 1.0 },
    joint_actions: { columna: ['flexion'] },
  },
  {
    id: 'ex-gato',
    name: 'Gato-Camello',
    muscle_groups: ['columna', 'core'],
    equipment: [],
    description: 'Arquea y redondea.',
    image_url: null,
    video_url: null,
    exercise_type: 'warmup',
    movement_pattern: 'mobility',
    muscle_map: { columna: 1.0, core: 0.5 },
    joint_actions: { columna: ['flexion', 'extension'] },
  },
];

/** Ejercicio actual: press de banca ya enlazado al catálogo. */
const CURRENT = { ...CATALOG[0], exercise_id: 'ex-press-barra', exercise_name: 'Press Banca con Barra' };

describe('rankCandidates', () => {
  it('sólo propone ejercicios del mismo bloque', () => {
    const candidates = filterCandidates(CATALOG, CURRENT);
    expect(candidates.every(c => c.exercise_type === 'strength')).toBe(true);
    expect(candidates.map(c => c.id)).not.toContain('ex-nino');
    expect(candidates.map(c => c.id)).not.toContain('ex-gato');
  });

  it('excluye el propio ejercicio', () => {
    expect(filterCandidates(CATALOG, CURRENT).map(c => c.id)).not.toContain('ex-press-barra');
  });

  it('excluye también por nombre cuando el ejercicio no está enlazado', () => {
    const suelto = { exercise_id: null, exercise_name: 'press banca con BARRA', exercise_type: 'strength' };
    expect(filterCandidates(CATALOG, suelto).map(c => c.id)).not.toContain('ex-press-barra');
  });

  it('ordena por huella biomecánica: empujes horizontales arriba, el curl último', () => {
    const ids = filterCandidates(CATALOG, CURRENT).map(c => c.id);
    // Los dos compuestos del mismo patrón encabezan; cuál de ellos gana depende
    // de los datos y ambos son sustitutos legítimos, así que no se fija uno.
    expect(ids.slice(0, 2).sort()).toEqual(['ex-flexiones', 'ex-press-mancuernas']);
    expect(ids.at(-1)).toBe('ex-curl');
  });

  it('coloca el aislamiento por detrás de los compuestos del mismo patrón', () => {
    const ids = filterCandidates(CATALOG, CURRENT).map(c => c.id);
    expect(ids.indexOf('ex-flexiones')).toBeLessThan(ids.indexOf('ex-aperturas'));
    expect(ids.indexOf('ex-press-mancuernas')).toBeLessThan(ids.indexOf('ex-aperturas'));
  });

  it('adjunta la similitud a cada candidato', () => {
    const [mejor] = rankCandidates(CATALOG, CURRENT);
    expect(mejor.similarity.substitution).toBeGreaterThan(0.7);
    expect(mejor.similarity.muscular).toBeGreaterThan(0.8);
  });

  it('sin datos del ejercicio actual ordena por nombre (determinista)', () => {
    const suelto = { exercise_id: null, exercise_name: 'Ejercicio raro', exercise_type: 'strength' };
    const names = filterCandidates(CATALOG, suelto).map(c => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'es')));
  });

  it('respeta el límite de candidatos', () => {
    expect(filterCandidates(CATALOG, CURRENT, { limit: 2 })).toHaveLength(2);
  });

  it('devuelve [] si el catálogo no tiene ese bloque', () => {
    expect(filterCandidates(CATALOG, { ...CURRENT, exercise_type: 'cardio' })).toEqual([]);
    expect(filterCandidates(null, CURRENT)).toEqual([]);
  });
});

describe('buildAlternativesPrompt', () => {
  it('describe el ejercicio actual con su patrón y lista los candidatos', () => {
    const prompt = buildAlternativesPrompt(CURRENT, filterCandidates(CATALOG, CURRENT));

    expect(prompt).toContain('Press Banca con Barra');
    expect(prompt).toContain('Patrón de movimiento: horizontal_push');
    expect(prompt).toContain('Press Banca con Mancuernas | horizontal_push | pecho/tríceps/hombros | mancuernas/banco');
    expect(prompt).toContain(`entre 2 y ${MAX_ALTERNATIVES} alternativas`);
  });

  it('marca "sin equipo" cuando el candidato no necesita material', () => {
    const prompt = buildAlternativesPrompt(CURRENT, [CATALOG[2]]);
    expect(prompt).toContain('Flexiones de Pecho | horizontal_push | pecho/tríceps/core | sin equipo');
  });
});

describe('toAlternative', () => {
  it('devuelve la forma exacta que consume el cliente', () => {
    const entry = rankCandidates(CATALOG, CURRENT).find(e => e.row.id === 'ex-press-mancuernas');
    const alt = toAlternative(entry.row, 'Mismo patrón con mancuernas.', entry.similarity);

    expect(alt).toMatchObject({
      id: 'ex-press-mancuernas',
      name: 'Press Banca con Mancuernas',
      muscle_groups: ['pecho', 'tríceps', 'hombros'],
      equipment: ['mancuernas', 'banco'],
      image_url: null,
      video_url: null,
      description: 'Baja controlando y empuja.',
      reason: 'Mismo patrón con mancuernas.',
    });
    expect(alt.score).toBeGreaterThan(70);
    expect(alt.breakdown.muscular).toBeGreaterThan(90);
    expect(alt.breakdown).toHaveProperty('biomecanica');
    expect(alt.breakdown).toHaveProperty('fatiga');
  });

  it('sin similitud deja el score a null en vez de inventarlo', () => {
    const alt = toAlternative(CATALOG[1], 'Razón.');
    expect(alt.score).toBeNull();
    expect(alt.breakdown).toBeNull();
  });

  it('usa la razón genérica si la IA no dio una utilizable', () => {
    expect(toAlternative(CATALOG[1], '   ').reason).toBe(FALLBACK_REASON);
    expect(toAlternative(CATALOG[1], null).reason).toBe(FALLBACK_REASON);
  });
});

describe('fallbackAlternatives', () => {
  it('toma los primeros del ranking con la razón genérica', () => {
    const alternatives = fallbackAlternatives(rankCandidates(CATALOG, CURRENT));

    expect(alternatives).toHaveLength(MAX_ALTERNATIVES);
    expect(['ex-press-mancuernas', 'ex-flexiones']).toContain(alternatives[0].id);
    expect(alternatives.every(a => a.reason === FALLBACK_REASON)).toBe(true);
    // El respaldo conserva el score: si Groq falla solo se pierde la prosa.
    expect(alternatives[0].score).toBeGreaterThan(70);
  });

  it('devuelve [] sin candidatos', () => {
    expect(fallbackAlternatives([])).toEqual([]);
    expect(fallbackAlternatives(null)).toEqual([]);
  });
});

describe('parseAlternatives', () => {
  const ranked = rankCandidates(CATALOG, CURRENT);

  it('resuelve los nombres devueltos por la IA contra los candidatos', () => {
    const text = JSON.stringify({
      alternatives: [
        { name: 'Flexiones de Pecho', reason: 'Mismo empuje horizontal sin material.' },
        { name: 'Press Banca con Mancuernas', reason: 'Mayor recorrido y estabilidad exigida.' },
      ],
    });

    const result = parseAlternatives(text, ranked);
    expect(result.map(a => a.id)).toContain('ex-flexiones');
    expect(result.map(a => a.id)).toContain('ex-press-mancuernas');
    expect(result.find(a => a.id === 'ex-flexiones').reason).toBe('Mismo empuje horizontal sin material.');
  });

  it('manda el score del motor aunque la IA devuelva otro orden', () => {
    const text = JSON.stringify({
      alternatives: [
        { name: 'Aperturas con Mancuernas', reason: 'a' },
        { name: 'Press Banca con Mancuernas', reason: 'b' },
      ],
    });
    // La IA puso las aperturas primero; el ranking determinista las relega.
    expect(parseAlternatives(text, ranked)[0].id).toBe('ex-press-mancuernas');
    expect(parseAlternatives(text, ranked)[1].id).toBe('ex-aperturas');
  });

  it('acepta JSON envuelto en markdown', () => {
    const text = '```json\n{"alternatives":[{"name":"Aperturas con Mancuernas","reason":"Aísla el pectoral."}]}\n```';
    expect(parseAlternatives(text, ranked)).toHaveLength(1);
  });

  it('tolera acentos y mayúsculas distintas', () => {
    const text = '{"alternatives":[{"name":"aperturas con mancuernas","reason":"Aísla el pectoral."}]}';
    expect(parseAlternatives(text, ranked)[0].id).toBe('ex-aperturas');
  });

  it('descarta ejercicios que no estaban entre los candidatos', () => {
    // La IA no puede colar un ejercicio inexistente ni uno de otro bloque.
    const text = '{"alternatives":[{"name":"Máquina Inventada","reason":"..."},{"name":"Postura del Niño","reason":"..."}]}';
    expect(parseAlternatives(text, ranked)).toEqual([]);
  });

  it('elimina duplicados y corta en el máximo', () => {
    const text = JSON.stringify({
      alternatives: [
        { name: 'Flexiones de Pecho', reason: 'a' },
        { name: 'Flexiones de Pecho', reason: 'b' },
        { name: 'Press Banca con Mancuernas', reason: 'c' },
        { name: 'Aperturas con Mancuernas', reason: 'd' },
        { name: 'Curl de Bíceps', reason: 'e' },
      ],
    });
    expect(parseAlternatives(text, ranked)).toHaveLength(MAX_ALTERNATIVES);
  });

  it('devuelve [] si la respuesta no es utilizable', () => {
    expect(parseAlternatives('lo siento, no puedo', ranked)).toEqual([]);
    expect(parseAlternatives('{"alternatives":[]}', ranked)).toEqual([]);
  });
});
