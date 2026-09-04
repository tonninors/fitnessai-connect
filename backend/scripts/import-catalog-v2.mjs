#!/usr/bin/env node
/**
 * Genera el seed SQL del catálogo v2 a partir de
 * `database/catalog/exercises_v2_science_based.csv` (150 ejercicios × 34 columnas).
 *
 * Este catálogo REEMPLAZA al de 56 ejercicios que vivía embebido en el seed de
 * `schema.sql`. El CSV es la fuente de verdad revisable —una huella biomecánica
 * de 34 columnas es inviable de mantener escrita a mano en SQL— y este script
 * produce el `DELETE` + `INSERT ... ON CONFLICT` idempotente.
 *
 * Los datos del CSV no encajan tal cual en el esquema, así que aquí se
 * normalizan (ver las funciones exportadas, todas puras y con test):
 *   · `category` (5 valores) → `exercise_type` (los 4 bloques del entrenamiento).
 *   · `equipment_type` con valores OR (`barbell_or_dumbbell`) → array de dos
 *     equipos, para que la similitud de equipo no dé 0 donde debería dar 1.
 *   · `muscle_length_bias`: `shortened_bias` → `shortened`.
 *   · `muscle_map` / `region_bias`: `clave:peso|…` → objeto JSON.
 *   · `joint_actions`: `articulacion:accion+accion|…` → objeto JSON de arrays.
 *   · `resistance_profile`: `0.5|1.0|0.7` → array de 3 números (vacío → NULL).
 *   · `muscle_groups` (NOT NULL, la usa la UI y el prompt del plan) se deriva de
 *     las claves de `muscle_map` ordenadas por peso descendente.
 *
 * AVISO SOBRE LA PROCEDENCIA DE ESTOS DATOS: los campos cuantitativos
 * (`resistance_profile`, `muscle_length_bias`, `rom`, `stability_demand`,
 * `fatigue`, `skill_demand`) son ESTIMACIONES HEURÍSTICAS revisadas a mano, no
 * mediciones de laboratorio.
 *
 * Uso:
 *   node backend/scripts/import-catalog-v2.mjs            # valida y escribe el SQL
 *   node backend/scripts/import-catalog-v2.mjs --check    # solo valida e informa
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CSV_PATH = join(ROOT, 'database', 'catalog', 'exercises_v2_science_based.csv');
const SCHEMA_PATH = join(ROOT, 'database', 'schema.sql');
const OUT_PATH = join(ROOT, 'database', 'migrations', '2026-09-05-catalogo-v2.sql');

// ── Parseo del CSV ──────────────────────────────────────────────────────────

/** CSV mínimo con soporte de comillas dobles. Descarta el BOM de la cabecera. */
export function parseCsv(text) {
  const clean = String(text).replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    if (quoted) {
      if (char === '"') {
        if (clean[i + 1] === '"') { field += '"'; i += 1; } else { quoted = false; }
      } else { field += char; }
      continue;
    }
    if (char === '"') { quoted = true; continue; }
    if (char === ',') { row.push(field); field = ''; continue; }
    if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    if (char !== '\r') field += char;
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }

  const [header, ...body] = rows.filter(r => r.some(cell => cell.trim() !== ''));
  if (!header) return [];
  return body.map((cells) => {
    const record = {};
    header.forEach((key, idx) => { record[key.trim()] = (cells[idx] ?? '').trim(); });
    return record;
  });
}

// ── Normalizaciones (puras, testeadas en tests/unit/catalog-import.test.js) ──

/** Cadena vacía → NULL. Nunca se guarda `''` en una columna de texto. */
export function emptyToNull(value) {
  const text = String(value ?? '').trim();
  return text === '' ? null : text;
}

/**
 * `category` del CSV → bloque del entrenamiento.
 *
 * `exercise_type` solo admite los cuatro bloques del WorkoutModal, así que
 * `core` cae en fuerza (es trabajo de fuerza dentro de la sesión), `mobility`
 * en el calentamiento y `stretch` en la vuelta a la calma.
 */
export const CATEGORY_TO_BLOCK = {
  strength: 'strength',
  core: 'strength',
  cardio: 'cardio',
  mobility: 'warmup',
  stretch: 'cooldown',
};

export function toExerciseType(category) {
  const key = String(category ?? '').trim().toLowerCase();
  const block = CATEGORY_TO_BLOCK[key];
  if (!block) throw new Error(`category desconocida: "${category}"`);
  return block;
}

/**
 * `equipment_type` → array de equipos.
 *
 * Los valores OR (`barbell_or_dumbbell`) describen dos equipos alternativos.
 * Como cadena literal no casan con nada y `equipmentSimilarity` devolvía 0
 * entre un press con barra y su versión "barra o mancuerna".
 */
export function splitEquipment(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (text === '') return [];
  const match = /^(.+?)_or_(.+)$/.exec(text);
  if (!match) return [text];
  const parts = [match[1], match[2]];
  if (parts.some(part => part === '')) throw new Error(`equipment_type mal formado: "${value}"`);
  return parts;
}

/** `shortened_bias` es el mismo sesgo que `shortened`; `dynamic` se conserva. */
export const LENGTH_BIAS_VALUES = ['lengthened', 'mid', 'shortened', 'balanced', 'dynamic'];

export function normalizeLengthBias(value) {
  const text = String(value ?? '').trim().toLowerCase();
  if (text === '') return null;
  const normalized = text === 'shortened_bias' ? 'shortened' : text;
  if (!LENGTH_BIAS_VALUES.includes(normalized)) {
    throw new Error(`muscle_length_bias desconocido: "${value}"`);
  }
  return normalized;
}

/** `dorsal:1.0|biceps:0.55` → objeto de pesos. Vacío → null. */
export function parseWeightMap(value) {
  const text = String(value ?? '').trim();
  if (text === '') return null;
  const map = {};
  for (const part of text.split('|')) {
    if (part.trim() === '') continue;
    const idx = part.lastIndexOf(':');
    if (idx < 0) throw new Error(`Par clave:peso mal formado: "${part}"`);
    const name = part.slice(0, idx).trim();
    const weight = Number(part.slice(idx + 1));
    if (name === '' || !Number.isFinite(weight)) throw new Error(`Par clave:peso mal formado: "${part}"`);
    if (weight <= 0 || weight > 1) throw new Error(`Peso fuera de (0,1]: "${part}"`);
    map[name] = weight;
  }
  return Object.keys(map).length > 0 ? map : null;
}

/** `hombro:extension+flexion|codo:flexion` → objeto de arrays. Vacío → null. */
export function parseJointActions(value) {
  const text = String(value ?? '').trim();
  if (text === '') return null;
  const map = {};
  for (const part of text.split('|')) {
    if (part.trim() === '') continue;
    const idx = part.indexOf(':');
    if (idx < 0) throw new Error(`Par articulación:acciones mal formado: "${part}"`);
    const joint = part.slice(0, idx).trim();
    const actions = part.slice(idx + 1).split('+').map(a => a.trim()).filter(Boolean);
    if (joint === '' || actions.length === 0) throw new Error(`Par articulación:acciones mal formado: "${part}"`);
    map[joint] = actions;
  }
  return Object.keys(map).length > 0 ? map : null;
}

/** `0.5|1.0|0.7` → array de 3 números. Vacío → null (18 filas no lo traen). */
export function parseProfile(value) {
  const text = String(value ?? '').trim();
  if (text === '') return null;
  const parts = text.split('|').map(v => Number(v.trim()));
  if (parts.length !== 3 || parts.some(n => !Number.isFinite(n))) {
    throw new Error(`resistance_profile debe tener 3 números separados por "|": "${value}"`);
  }
  return parts;
}

/**
 * `muscle_groups` (columna NOT NULL) a partir de las claves de `muscle_map`,
 * de mayor a menor contribución. El desempate alfabético mantiene el SQL
 * estable entre ejecuciones.
 */
export function deriveMuscleGroups(muscleMap) {
  if (!muscleMap || Object.keys(muscleMap).length === 0) {
    throw new Error('muscle_map vacío: no se puede derivar muscle_groups (columna NOT NULL)');
  }
  return Object.entries(muscleMap)
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

/** Entero dentro de rango. Vacío → null. */
export function parseIntInRange(value, min, max, field) {
  const text = String(value ?? '').trim();
  if (text === '') return null;
  const num = Number(text);
  if (!Number.isInteger(num) || num < min || num > max) {
    throw new Error(`${field} debe ser un entero entre ${min} y ${max}: "${value}"`);
  }
  return num;
}

export function parseBool(value, field) {
  const text = String(value ?? '').trim().toLowerCase();
  if (text !== 'true' && text !== 'false') {
    throw new Error(`${field}: se esperaba true/false, llegó "${value}"`);
  }
  return text === 'true';
}

/** Objeto JSON sin las claves nulas: el JSONB no guarda huecos. */
function compact(object) {
  const out = {};
  for (const [key, value] of Object.entries(object)) {
    if (value !== null && value !== undefined) out[key] = value;
  }
  return out;
}

/**
 * Fila del CSV → fila de `exercises`. Lanza con el motivo concreto si algo no
 * cuadra, para que el informe de errores diga qué corregir en la hoja.
 */
export function toExerciseRow(row) {
  const muscleMap = parseWeightMap(row.muscle_map);
  const name = emptyToNull(row.name_es);
  if (!name) throw new Error('name_es vacío');
  const slug = emptyToNull(row.exercise_id);
  if (!slug) throw new Error('exercise_id vacío');

  return {
    name,
    slug,
    name_en: emptyToNull(row.name_en),
    muscle_groups: deriveMuscleGroups(muscleMap),
    equipment: splitEquipment(row.equipment_type),
    exercise_type: toExerciseType(row.category),
    body_region: emptyToNull(row.body_region),
    exercise_family: emptyToNull(row.exercise_family),
    movement_pattern: emptyToNull(row.primary_pattern),
    secondary_pattern: emptyToNull(row.secondary_pattern),
    // Negativo = declinado (press declinado, fondos con sesgo a pecho).
    movement_angle: parseIntInRange(row.movement_angle_deg, -90, 90, 'movement_angle_deg'),
    muscle_map: muscleMap,
    region_bias: parseWeightMap(row.region_bias),
    joint_actions: parseJointActions(row.joint_actions),
    attachment: emptyToNull(row.attachment),
    body_support: compact({
      position: emptyToNull(row.body_position),
      torso_angle: parseIntInRange(row.torso_angle_deg, -90, 90, 'torso_angle_deg'),
      chest_supported: parseBool(row.chest_supported, 'chest_supported'),
      back_supported: parseBool(row.back_supported, 'back_supported'),
    }),
    grip: compact({
      orientation: emptyToNull(row.grip_orientation),
      width: emptyToNull(row.grip_width),
      elbow_path: emptyToNull(row.elbow_path),
    }),
    laterality: emptyToNull(row.laterality),
    kinetic_chain: emptyToNull(row.kinetic_chain),
    is_compound: parseBool(row.is_compound, 'is_compound'),
    rom: parseIntInRange(row.rom_score, 1, 3, 'rom_score'),
    muscle_length_bias: normalizeLengthBias(row.muscle_length_bias),
    resistance_profile: parseProfile(row.resistance_profile),
    stability_demand: parseIntInRange(row.stability_demand, 1, 5, 'stability_demand'),
    fatigue: {
      systemic: parseIntInRange(row.fatigue_systemic, 1, 5, 'fatigue_systemic'),
      lower_back: parseIntInRange(row.fatigue_lower_back, 1, 5, 'fatigue_lower_back'),
      grip: parseIntInRange(row.fatigue_grip, 1, 5, 'fatigue_grip'),
    },
    skill_demand: parseIntInRange(row.skill_demand, 1, 5, 'skill_demand'),
  };
}

// ── Escapado SQL ────────────────────────────────────────────────────────────

export const sqlText = value => (value === null || value === '' ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`);
export const sqlInt = value => (value === null || value === undefined ? 'NULL' : String(Number(value)));
export const sqlBool = value => (value === null || value === undefined ? 'NULL' : String(Boolean(value)));
export const sqlJson = value => (value === null || value === undefined ? 'NULL' : `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`);
export const sqlTextArray = (values) => {
  if (!values || values.length === 0) return "ARRAY[]::TEXT[]";
  return `ARRAY[${values.map(sqlText).join(',')}]::TEXT[]`;
};

// ── Validación contra los CHECK de schema.sql ───────────────────────────────

/**
 * Valores admitidos por un CHECK del bloque MIGRACIONES.
 *
 * Sirve para que el script falle aquí y no en Postgres: si alguien añade un
 * patrón nuevo al CSV sin ampliar el CHECK, el INSERT reventaría a mitad.
 */
export function readCheckValues(schema, constraint) {
  // `lastIndexOf`: el bloque MIGRACIONES se aplica en orden, así que la última
  // definición de la restricción es la que queda viva en la base.
  const idx = schema.lastIndexOf(`ADD CONSTRAINT ${constraint}`);
  if (idx < 0) return null;
  const end = schema.indexOf(';', idx);
  if (end < 0) return null;
  const values = [...schema.slice(idx, end).matchAll(/'([^']+)'/g)].map(m => m[1]);
  return values.length > 0 ? values : null;
}

/** Columnas del INSERT, en el mismo orden que los valores. */
const COLUMNS = [
  'name', 'slug', 'name_en', 'muscle_groups', 'equipment', 'exercise_type',
  'body_region', 'exercise_family', 'movement_pattern', 'secondary_pattern',
  'movement_angle', 'muscle_map', 'region_bias', 'joint_actions', 'attachment',
  'body_support', 'grip', 'laterality', 'kinetic_chain', 'is_compound', 'rom',
  'muscle_length_bias', 'resistance_profile', 'stability_demand', 'fatigue',
  'skill_demand',
];

function toValuesTuple(ex) {
  return [
    sqlText(ex.name),
    sqlText(ex.slug),
    sqlText(ex.name_en),
    sqlTextArray(ex.muscle_groups),
    sqlTextArray(ex.equipment),
    sqlText(ex.exercise_type),
    sqlText(ex.body_region),
    sqlText(ex.exercise_family),
    sqlText(ex.movement_pattern),
    sqlText(ex.secondary_pattern),
    sqlInt(ex.movement_angle),
    sqlJson(ex.muscle_map),
    sqlJson(ex.region_bias),
    sqlJson(ex.joint_actions),
    sqlText(ex.attachment),
    sqlJson(ex.body_support),
    sqlJson(ex.grip),
    sqlText(ex.laterality),
    sqlText(ex.kinetic_chain),
    sqlBool(ex.is_compound),
    sqlInt(ex.rom),
    sqlText(ex.muscle_length_bias),
    sqlJson(ex.resistance_profile),
    sqlInt(ex.stability_demand),
    sqlJson(ex.fatigue),
    sqlInt(ex.skill_demand),
  ].join(', ');
}

/** SQL completo: limpieza del catálogo viejo + INSERT idempotente. */
export function buildSql(exercises) {
  const tuples = exercises
    .map(ex => `  -- ${ex.name}\n  (${toValuesTuple(ex)})`)
    .join(',\n');

  // `image_url` y `video_url` quedan FUERA del ON CONFLICT a propósito: se
  // poblarán con assets reales y una nueva ejecución del seed no debe borrarlos
  // (mismo criterio que el seed original de schema.sql). `description` y
  // `difficulty` tampoco viajan en el INSERT porque el CSV v2 no los trae.
  const updates = COLUMNS
    .filter(column => column !== 'name')
    .map(column => `  ${column.padEnd(18)} = EXCLUDED.${column}`)
    .join(',\n');

  return `-- ═══════════════════════════════════════════════════════════
-- Catálogo de ejercicios v2 — ${exercises.length} ejercicios con huella biomecánica
--
-- GENERADO AUTOMÁTICAMENTE — no editar a mano.
-- Fuente: database/catalog/exercises_v2_science_based.csv
-- Regenerar: node backend/scripts/import-catalog-v2.mjs
--
-- Requisito previo: el punto 6 del bloque MIGRACIONES de schema.sql, que crea
-- las columnas nuevas (slug, name_en, body_region, exercise_family,
-- secondary_pattern, region_bias, attachment, grip, skill_demand) y amplía los
-- CHECK de movement_pattern, laterality y muscle_length_bias.
--
-- Este catálogo SUSTITUYE al de 56 ejercicios del seed de schema.sql. Los
-- planes ya generados apuntan a ejercicios del catálogo viejo: hay que
-- regenerarlos después de aplicar esta migración.
--
-- Los campos cuantitativos (resistance_profile, muscle_length_bias, rom,
-- stability_demand, fatigue, skill_demand) son ESTIMACIONES HEURÍSTICAS
-- revisadas a mano, no mediciones de laboratorio.
--
-- Idempotente: el DELETE solo toca lo que no referencia nadie y el INSERT usa
-- ON CONFLICT (name). Se puede correr las veces que haga falta.
-- ═══════════════════════════════════════════════════════════

-- 1. Fuera el catálogo viejo.
--    Se respetan los ejercicios referenciados por alguna sesión ya creada:
--    \`session_exercises.exercise_id\` es una FK sin ON DELETE, así que borrarlos
--    reventaría la migración (o dejaría sesiones huérfanas). Esas filas
--    sobreviven; las que comparten nombre con el catálogo nuevo se actualizan
--    en el paso 2 vía ON CONFLICT (name).
DELETE FROM exercises
  WHERE is_public = TRUE
    AND id NOT IN (SELECT DISTINCT exercise_id FROM session_exercises WHERE exercise_id IS NOT NULL);

-- 2. Catálogo v2.
INSERT INTO exercises (
  ${COLUMNS.join(', ')}
) VALUES
${tuples}
ON CONFLICT (name) DO UPDATE SET
${updates};
`;
}

// ── CLI ─────────────────────────────────────────────────────────────────────

/**
 * Valida el CSV entero y devuelve `{ exercises, problems, byBlock }`.
 * Nunca corta en el primer error: acumula todos los problemas para poder
 * arreglar la hoja de una pasada.
 */
export function loadCatalog(csvText, schemaText) {
  const rows = parseCsv(csvText);
  const problems = [];
  const exercises = [];
  const seenNames = new Map();
  const seenSlugs = new Map();

  rows.forEach((row, i) => {
    const line = i + 2; // +1 cabecera, +1 base 1
    let exercise;
    try {
      exercise = toExerciseRow(row);
    } catch (err) {
      problems.push(`línea ${line} ("${row.name_es || row.exercise_id || '?'}"): ${err.message}`);
      return;
    }
    const dupName = seenNames.get(exercise.name);
    if (dupName) problems.push(`línea ${line} ("${exercise.name}"): nombre duplicado (ya en la línea ${dupName})`);
    else seenNames.set(exercise.name, line);

    const dupSlug = seenSlugs.get(exercise.slug);
    if (dupSlug) problems.push(`línea ${line} ("${exercise.name}"): exercise_id "${exercise.slug}" duplicado (ya en la línea ${dupSlug})`);
    else seenSlugs.set(exercise.slug, line);

    exercises.push(exercise);
  });

  // Los CHECK de schema.sql son el contrato real: si el CSV trae un valor que
  // la restricción no admite, el INSERT fallaría en Postgres a mitad de camino.
  if (schemaText) {
    const checks = [
      ['movement_pattern', 'exercises_movement_pattern_check'],
      ['laterality', 'exercises_laterality_check'],
      ['muscle_length_bias', 'exercises_muscle_length_bias_check'],
      ['exercise_type', 'exercises_exercise_type_check'],
      ['kinetic_chain', 'exercises_kinetic_chain_check'],
    ];
    for (const [field, constraint] of checks) {
      const allowed = readCheckValues(schemaText, constraint);
      if (!allowed) {
        problems.push(`no se pudo leer el CHECK ${constraint} en schema.sql`);
        continue;
      }
      const missing = new Map();
      for (const ex of exercises) {
        const value = ex[field];
        if (value !== null && !allowed.includes(value) && !missing.has(value)) missing.set(value, ex.name);
      }
      for (const [value, name] of missing) {
        problems.push(`${field} "${value}" (p. ej. "${name}") no está en el CHECK ${constraint} de schema.sql`);
      }
    }
  }

  const byBlock = {};
  for (const ex of exercises) byBlock[ex.exercise_type] = (byBlock[ex.exercise_type] ?? 0) + 1;

  return { exercises, problems, byBlock };
}

function main() {
  const { exercises, problems, byBlock } = loadCatalog(
    readFileSync(CSV_PATH, 'utf8'),
    readFileSync(SCHEMA_PATH, 'utf8'),
  );

  if (problems.length > 0) {
    console.error(`\n${problems.length} problema(s) en el catálogo:\n`);
    for (const problem of problems) console.error(`  · ${problem}`);
    process.exit(1);
  }

  console.log(`✓ ${exercises.length} ejercicios validados`);
  const blocks = ['warmup', 'strength', 'cardio', 'cooldown'];
  console.log(`  por bloque: ${blocks.map(b => `${b} ${byBlock[b] ?? 0}`).join(' · ')}`);

  if (process.argv.includes('--check')) return;

  writeFileSync(OUT_PATH, buildSql(exercises), 'utf8');
  console.log(`✓ SQL escrito en database/migrations/${OUT_PATH.split(/[\\/]/).pop()}`);
}

// Solo como CLI: el fichero también se importa desde los tests.
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  main();
}
