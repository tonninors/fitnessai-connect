/**
 * Motor de similitud entre ejercicios: la "huella biomecánica".
 *
 * Dos ejercicios pueden entrenar casi los mismos músculos y no ser
 * intercambiables (cambia la estabilidad, la trayectoria, el rango o la
 * fatiga). Por eso no hay un único número de "parecido": se calculan varias
 * similitudes por dimensión y de ahí salen los scores compuestos.
 *
 * Todo aquí es lógica pura y determinista. El ranking NO depende de la IA: la
 * IA solo redacta la razón, así que si Groq falla se pierde la prosa, nunca la
 * calidad del emparejamiento.
 *
 * Aviso sobre los datos: los campos cuantitativos del catálogo
 * (`resistance_profile`, `muscle_length_bias`, `rom`, `stability_demand`,
 * `fatigue`) son estimaciones heurísticas revisadas a mano, no mediciones. En
 * particular NO derivan de amplitudes de EMG, que no están validadas como
 * predictor de hipertrofia.
 */
import { normalizeExerciseName } from './plan.js';

/**
 * Familia del patrón: sirve para penalizar sustituciones entre familias.
 *
 * Cubre TODOS los patrones del catálogo. Es deliberado: un patrón sin mapear
 * cae en la penalización suave en vez de la de antagonista, y el fallo es
 * silencioso. `assertPatternsMapped()` lo verifica en los tests.
 */
const PATTERN_FAMILY = {
  // Empuje
  horizontal_push: 'push',
  vertical_push: 'push',
  diagonal_push: 'push',
  dip_push: 'push',
  horizontal_adduction: 'push',
  diagonal_adduction: 'push',
  elbow_extension: 'push',
  shoulder_flexion: 'push',
  shoulder_abduction: 'push',
  wrist_extension: 'push',
  // Tracción
  horizontal_pull: 'pull',
  vertical_pull: 'pull',
  diagonal_pull: 'pull',
  horizontal_abduction: 'pull',
  rear_delt_pull: 'pull',
  shoulder_extension: 'pull',
  scapular_elevation: 'pull',
  external_rotation: 'pull',
  elbow_flexion: 'pull',
  wrist_flexion: 'pull',
  forearm_rotation: 'pull',
  grip_isometric: 'pull',
  // Dominante de rodilla
  squat: 'knee',
  lunge: 'knee',
  knee_extension: 'knee',
  // Dominante de cadera
  hip_hinge: 'hip',
  hip_extension: 'hip',
  hip_flexion: 'hip',
  hip_flexion_extension: 'hip',
  hip_abduction: 'hip',
  hip_adduction: 'hip',
  hip_rotation: 'hip',
  knee_flexion: 'hip',
  posterior_pelvic_tilt: 'hip',
  // Tobillo
  calf_raise: 'calf',
  ankle_dorsiflexion: 'calf',
  // Core
  core: 'core',
  anti_extension: 'core',
  anti_rotation: 'core',
  anti_lateral_flexion: 'core',
  trunk_flexion: 'core',
  rotation: 'core',
  spinal_flexion_extension: 'core',
  carry: 'core',
  // Otros bloques
  locomotion: 'cardio',
  cardio: 'cardio',
  mobility: 'mobility',
  shoulder_circumduction: 'mobility',
  wrist_flexion_extension: 'mobility',
  stretch: 'stretch',
};

/**
 * Campos de la ficha del catálogo que lee este motor.
 *
 * `routes/workouts.js` deriva de aquí las columnas que pide a Supabase: si se
 * añade una dimensión nueva y no se selecciona su columna, la dimensión queda
 * muda en producción y los dobles de test no lo detectan (devuelven el fixture
 * entero, ignorando el `select`).
 */
export const SIMILARITY_FIELDS = [
  'exercise_family',
  'movement_pattern',
  'movement_angle',
  'muscle_map',
  'joint_actions',
  'rom',
  'muscle_length_bias',
  'resistance_profile',
  'body_support',
  'stability_demand',
  'equipment',
  'is_compound',
  'kinetic_chain',
  'laterality',
  'fatigue',
];

/** Patrones conocidos, para que los tests detecten cualquiera sin mapear. */
export const KNOWN_PATTERNS = Object.keys(PATTERN_FAMILY);

/** Familias que son antagonistas entre sí: sustituir una por otra es absurdo. */
const ANTAGONIST_FAMILIES = { pull: 'push', push: 'pull', knee: 'hip', hip: 'knee' };

/** Penalizaciones multiplicativas. Sin ellas, un curl acaba sustituyendo a un remo. */
export const PENALTY_DIFFERENT_FAMILY_PATTERN = 0.75;
export const PENALTY_ANTAGONIST_PATTERN = 0.30;
export const PENALTY_LOW_PRIMARY_OVERLAP = 0.70;

/** Umbral de solape del músculo objetivo por debajo del cual se penaliza. */
export const MIN_PRIMARY_OVERLAP = 0.5;

/**
 * Pesos del score de sustitución (perfil hipertrofia).
 * Suman 1; las dimensiones sin datos se descartan y el resto se renormaliza,
 * de modo que un catálogo incompleto degrada en vez de romper.
 */
export const SUBSTITUTION_WEIGHTS = {
  // La familia es la señal más fuerte de todas: dos variantes del mismo
  // ejercicio (press de banca con barra y con mancuernas) comparten familia,
  // mientras que las flexiones, con una huella casi idéntica, no.
  family: 0.12,
  muscle: 0.24,
  joint_actions: 0.12,
  muscle_length: 0.10,
  rom: 0.08,
  resistance_profile: 0.08,
  angle: 0.06,
  mechanics: 0.05,
  body_position: 0.05,
  stability: 0.04,
  equipment: 0.03,
  laterality: 0.02,
  kinetic_chain: 0.01,
};

/** Pesos de la similitud puramente mecánica (trayectoria y postura). */
export const MECHANICAL_WEIGHTS = {
  pattern: 0.40,
  angle: 0.25,
  joint_actions: 0.20,
  body_position: 0.15,
};

const isFiniteNumber = value => typeof value === 'number' && Number.isFinite(value);
const clamp01 = value => Math.max(0, Math.min(1, value));

/**
 * Normaliza un token de enumeración (`horizontal_pull`, `bent_over`).
 *
 * No sirve `normalizeExerciseName`: convierte el guion bajo en espacio, con lo
 * que `horizontal_pull` no encontraba su familia y la penalización antagonista
 * nunca llegaba a aplicarse.
 */
function normalizeToken(value) {
  if (typeof value !== 'string') return '';
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Número solo si el valor existe: `Number(null)` es 0 y falseaba las comparaciones. */
function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

/** Objeto plano, venga como objeto o como JSON en texto (Supabase devuelve ambos). */
function asObject(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch { return null; }
  }
  return null;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
}

/** Claves normalizadas (sin acentos ni mayúsculas) → peso numérico. */
function normalizeWeightMap(value) {
  const source = asObject(value);
  if (!source) return null;
  const map = new Map();
  for (const [key, weight] of Object.entries(source)) {
    const name = normalizeExerciseName(key);
    const num = Number(weight);
    if (name === '' || !Number.isFinite(num) || num <= 0) continue;
    map.set(name, Math.max(map.get(name) ?? 0, clamp01(num)));
  }
  return map.size > 0 ? map : null;
}

function normalizeNameSet(values) {
  const set = new Set();
  for (const value of asArray(values)) {
    const name = normalizeExerciseName(value);
    if (name !== '') set.add(name);
  }
  return set;
}

/**
 * Jaccard ponderado: Σmin / Σmax.
 *
 * Frente al conteo crudo de solape, esto no premia a los ejercicios que
 * declaran listas de músculos más largas: comparar 2 de 2 vale más que 2 de 8.
 */
export function weightedJaccard(a, b) {
  if (!a || !b || a.size === 0 || b.size === 0) return null;
  let minSum = 0;
  let maxSum = 0;
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    const x = a.get(key) ?? 0;
    const y = b.get(key) ?? 0;
    minSum += Math.min(x, y);
    maxSum += Math.max(x, y);
  }
  return maxSum > 0 ? minSum / maxSum : null;
}

/** Jaccard clásico sobre conjuntos de nombres. */
export function setJaccard(a, b) {
  if (a.size === 0 && b.size === 0) return null;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : null;
}

/** Músculo objetivo: la clave de mayor peso del mapa. */
export function primaryMuscle(muscleMap) {
  if (!muscleMap || muscleMap.size === 0) return null;
  let best = null;
  let bestWeight = -Infinity;
  for (const [name, weight] of muscleMap) {
    // El desempate por nombre mantiene el resultado estable ante pesos iguales.
    if (weight > bestWeight || (weight === bestWeight && best !== null && name < best)) {
      best = name;
      bestWeight = weight;
    }
  }
  return best;
}

// ── Similitudes por dimensión (0-1, o null si faltan datos) ─────────────────

export function muscleSimilarity(a, b) {
  return weightedJaccard(normalizeWeightMap(a?.muscle_map), normalizeWeightMap(b?.muscle_map));
}

/** Media de los Jaccard por articulación, sobre la unión de articulaciones. */
export function jointActionSimilarity(a, b) {
  const mapA = asObject(a?.joint_actions);
  const mapB = asObject(b?.joint_actions);
  if (!mapA || !mapB) return null;

  const joints = new Set([...Object.keys(mapA), ...Object.keys(mapB)].map(normalizeExerciseName).filter(Boolean));
  if (joints.size === 0) return null;

  const byJoint = source => {
    const out = new Map();
    for (const [joint, actions] of Object.entries(source)) {
      const key = normalizeExerciseName(joint);
      if (key !== '') out.set(key, normalizeNameSet(actions));
    }
    return out;
  };

  const jointsA = byJoint(mapA);
  const jointsB = byJoint(mapB);

  let total = 0;
  for (const joint of joints) {
    // Una articulación que solo aparece en uno de los dos cuenta como 0: el
    // ejercicio implica algo que el otro no.
    total += setJaccard(jointsA.get(joint) ?? new Set(), jointsB.get(joint) ?? new Set()) ?? 0;
  }
  return total / joints.size;
}

/** 0° horizontal, 90° vertical. Un remo alto a 30° queda a medio camino. */
export function angleSimilarity(a, b) {
  const x = optionalNumber(a?.movement_angle);
  const y = optionalNumber(b?.movement_angle);
  if (x === null || y === null) return null;
  return 1 - Math.min(Math.abs(x - y) / 90, 1);
}

/** `rom` va de 1 (corto) a 3 (largo). */
export function romSimilarity(a, b) {
  const x = optionalNumber(a?.rom);
  const y = optionalNumber(b?.rom);
  if (x === null || y === null) return null;
  return 1 - Math.min(Math.abs(x - y) / 2, 1);
}

/** Zona del recorrido donde el músculo recibe tensión. */
export function lengthBiasSimilarity(a, b) {
  const x = normalizeToken(a?.muscle_length_bias);
  const y = normalizeToken(b?.muscle_length_bias);
  if (x === '' || y === '') return null;
  if (x === y) return 1;
  // "balanced" cubre parcialmente cualquier sesgo.
  if (x === 'balanced' || y === 'balanced') return 0.5;
  // Extremos opuestos del recorrido: es el caso menos intercambiable.
  const opposite = (x === 'lengthened' && y === 'shortened') || (x === 'shortened' && y === 'lengthened');
  return opposite ? 0 : 0.5;
}

/** Curva de resistencia [largo, medio, corto]. */
export function resistanceProfileSimilarity(a, b) {
  const x = asArray(a?.resistance_profile).map(Number);
  const y = asArray(b?.resistance_profile).map(Number);
  const len = Math.min(x.length, y.length);
  if (len === 0) return null;

  let diff = 0;
  let counted = 0;
  for (let i = 0; i < len; i += 1) {
    if (!isFiniteNumber(x[i]) || !isFiniteNumber(y[i])) continue;
    diff += Math.abs(clamp01(x[i]) - clamp01(y[i]));
    counted += 1;
  }
  return counted > 0 ? 1 - diff / counted : null;
}

/** Postura y apoyos: separa el estímulo del coste de estabilización. */
export function bodyPositionSimilarity(a, b) {
  const x = asObject(a?.body_support);
  const y = asObject(b?.body_support);
  if (!x || !y) return null;

  let score = 0;
  score += normalizeToken(x.position) === normalizeToken(y.position) ? 0.5 : 0;
  score += Boolean(x.chest_supported) === Boolean(y.chest_supported) ? 0.25 : 0;
  score += Boolean(x.back_supported) === Boolean(y.back_supported) ? 0.25 : 0;
  return score;
}

/** `stability_demand` va de 1 (máquina con apoyo) a 5 (unilateral de pie). */
export function stabilitySimilarity(a, b) {
  const x = optionalNumber(a?.stability_demand);
  const y = optionalNumber(b?.stability_demand);
  if (x === null || y === null) return null;
  return 1 - Math.min(Math.abs(x - y) / 4, 1);
}

export function equipmentSimilarity(a, b) {
  return setJaccard(normalizeNameSet(a?.equipment), normalizeNameSet(b?.equipment));
}

/** Coste: fatiga sistémica, lumbar, agarre y estabilización. */
export function fatigueSimilarity(a, b) {
  const x = asObject(a?.fatigue);
  const y = asObject(b?.fatigue);
  if (!x || !y) return null;

  const keys = new Set([...Object.keys(x), ...Object.keys(y)].map(normalizeExerciseName).filter(Boolean));
  if (keys.size === 0) return null;

  const read = (source, key) => {
    for (const [rawKey, value] of Object.entries(source)) {
      if (normalizeExerciseName(rawKey) === key) return Number(value);
    }
    return 0;
  };

  let diff = 0;
  for (const key of keys) {
    const vx = read(x, key);
    const vy = read(y, key);
    diff += Math.abs((isFiniteNumber(vx) ? vx : 0) - (isFiniteNumber(vy) ? vy : 0));
  }
  return 1 - Math.min(diff / (keys.size * 4), 1);
}

/**
 * Familia de ejercicio (`bench_press`, `barbell_row`…).
 *
 * Es lo que distingue una variante del mismo ejercicio de otro ejercicio con
 * huella parecida: press de banca con barra y con mancuernas comparten familia;
 * las flexiones, no, aunque casi todo lo demás coincida.
 */
export function familySimilarity(a, b) {
  const x = normalizeToken(a?.exercise_family);
  const y = normalizeToken(b?.exercise_family);
  if (x === '' || y === '') return null;
  return x === y ? 1 : 0;
}

/** Compuesto vs aislamiento (`mechanics` de ExRx). */
export function mechanicsSimilarity(a, b) {
  if (typeof a?.is_compound !== 'boolean' || typeof b?.is_compound !== 'boolean') return null;
  return a.is_compound === b.is_compound ? 1 : 0;
}

/** Bilateral / unilateral / alternante: cambia la carga y la demanda de core. */
export function lateralitySimilarity(a, b) {
  const x = normalizeToken(a?.laterality);
  const y = normalizeToken(b?.laterality);
  if (x === '' || y === '') return null;
  if (x === y) return 1;
  // "alternating" está a medio camino entre bilateral y unilateral.
  return x === 'alternating' || y === 'alternating' ? 0.5 : 0;
}

/** Cadena abierta vs cerrada: separa la prensa de la extensión de cuádriceps. */
export function kineticChainSimilarity(a, b) {
  const x = normalizeToken(a?.kinetic_chain);
  const y = normalizeToken(b?.kinetic_chain);
  if (x === '' || y === '') return null;
  if (x === y) return 1;
  return x === 'mixed' || y === 'mixed' ? 0.5 : 0;
}

/** 1 mismo patrón; 0,5 misma familia; 0 familias distintas. */
export function patternSimilarity(a, b) {
  const x = normalizeToken(a?.movement_pattern);
  const y = normalizeToken(b?.movement_pattern);
  if (x === '' || y === '') return null;
  if (x === y) return 1;
  const familyA = PATTERN_FAMILY[x];
  const familyB = PATTERN_FAMILY[y];
  if (familyA && familyA === familyB) return 0.5;
  return 0;
}

// ── Scores compuestos ───────────────────────────────────────────────────────

/**
 * Media ponderada que ignora las dimensiones sin datos y renormaliza los pesos
 * restantes. Devuelve `null` si no había ninguna dimensión utilizable.
 */
function weightedAverage(values, weights) {
  let total = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    const value = values[key];
    if (value === null || value === undefined) continue;
    total += clamp01(value) * weight;
    weightSum += weight;
  }
  return weightSum > 0 ? total / weightSum : null;
}

/**
 * Penalización multiplicativa. Es lo que impide que coincidencias en variables
 * secundarias cuelen un sustituto absurdo: sin esto, un curl de bíceps puede
 * ganarle a un remo por compartir equipo y rango.
 */
export function penaltyFactor(current, candidate) {
  let factor = 1;

  const x = normalizeToken(current?.movement_pattern);
  const y = normalizeToken(candidate?.movement_pattern);
  if (x !== '' && y !== '' && x !== y) {
    const familyA = PATTERN_FAMILY[x];
    const familyB = PATTERN_FAMILY[y];
    if (familyA && familyB && ANTAGONIST_FAMILIES[familyA] === familyB) {
      factor *= PENALTY_ANTAGONIST_PATTERN;
    } else {
      factor *= PENALTY_DIFFERENT_FAMILY_PATTERN;
    }
  }

  // ¿El candidato trabaja de verdad el músculo objetivo del original?
  const currentMap = normalizeWeightMap(current?.muscle_map);
  const candidateMap = normalizeWeightMap(candidate?.muscle_map);
  const target = primaryMuscle(currentMap);
  if (target && candidateMap && (candidateMap.get(target) ?? 0) < MIN_PRIMARY_OVERLAP) {
    factor *= PENALTY_LOW_PRIMARY_OVERLAP;
  }

  return factor;
}

/**
 * Similitud completa entre el ejercicio actual y un candidato.
 *
 * @returns {{ substitution: number, muscular: number|null, mechanical: number|null,
 *             fatigue: number|null, penalty: number, dimensions: Record<string, number|null> }}
 */
export function compareExercises(current, candidate) {
  const dimensions = {
    family: familySimilarity(current, candidate),
    muscle: muscleSimilarity(current, candidate),
    joint_actions: jointActionSimilarity(current, candidate),
    muscle_length: lengthBiasSimilarity(current, candidate),
    rom: romSimilarity(current, candidate),
    resistance_profile: resistanceProfileSimilarity(current, candidate),
    angle: angleSimilarity(current, candidate),
    mechanics: mechanicsSimilarity(current, candidate),
    body_position: bodyPositionSimilarity(current, candidate),
    stability: stabilitySimilarity(current, candidate),
    equipment: equipmentSimilarity(current, candidate),
    laterality: lateralitySimilarity(current, candidate),
    kinetic_chain: kineticChainSimilarity(current, candidate),
    pattern: patternSimilarity(current, candidate),
  };

  const penalty = penaltyFactor(current, candidate);
  const base = weightedAverage(dimensions, SUBSTITUTION_WEIGHTS);

  return {
    // Sin ninguna dimensión utilizable el score es 0: no se inventa parecido.
    substitution: clamp01((base ?? 0) * penalty),
    muscular: dimensions.muscle,
    mechanical: weightedAverage(dimensions, MECHANICAL_WEIGHTS),
    fatigue: fatigueSimilarity(current, candidate),
    penalty,
    dimensions,
  };
}

/** Porcentaje entero 0-100 para la UI. */
export function toPercent(value) {
  return value === null || value === undefined ? null : Math.round(clamp01(value) * 100);
}
