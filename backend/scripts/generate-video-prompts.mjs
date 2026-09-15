/**
 * Genera los prompts de vídeo del catálogo, uno por ejercicio, para producir
 * los clips de demostración con un modelo de vídeo (Veo en Gemini, etc.).
 *
 * Fuentes:
 *   · database/catalog/exercises_v2_science_based.csv — nombre en inglés,
 *     patrón de movimiento, equipo, posición del cuerpo, agarre, lateralidad.
 *   · database/catalog/exercises-media.json — id y slug reales de Supabase.
 *     El slug es el nombre de archivo del clip (`<slug>.mp4`), que es como el
 *     script de carga casará cada vídeo con su fila de `exercises`.
 *   Se casan por nombre normalizado (`normalizeExerciseName`).
 *
 * Salidas:
 *   · database/catalog/exercise-video-prompts.md   — para pegar a mano.
 *   · database/catalog/exercise-video-prompts.json — para automatizar por API.
 *
 * Cada prompt = bloque FIJO (misma persona, estudio, cámara y formato en todos,
 * para que los clips se vean como una serie dentro de la app) + bloque del
 * EJERCICIO, derivado de los datos del catálogo, nunca inventado. Va en inglés
 * porque los modelos de vídeo rinden claramente mejor; el nombre en español se
 * conserva entre paréntesis.
 *
 * Uso: node backend/scripts/generate-video-prompts.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { parseCsv } from './import-catalog-v2.mjs';
import { normalizeExerciseName } from '../lib/plan.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CSV_PATH = join(ROOT, 'database', 'catalog', 'exercises_v2_science_based.csv');
const MEDIA_PATH = join(ROOT, 'database', 'catalog', 'exercises-media.json');
const OUT_MD = join(ROOT, 'database', 'catalog', 'exercise-video-prompts.md');
const OUT_JSON = join(ROOT, 'database', 'catalog', 'exercise-video-prompts.json');

// ── Bloque fijo ──────────────────────────────────────────────────────────────

/**
 * Igual en los 151 prompts: es lo que hace que los clips parezcan una serie.
 *
 * Escrito para pasar el filtro de Gemini/Veo: la primera versión describía a
 * la persona (sexo, edad, "tank top, leggings"), pedía "same person in every
 * clip" y "no watermark", y el modelo la rechazaba de plano. Aquí no se
 * describe el cuerpo ni la ropa más allá de "sencilla", no se menciona la
 * marca de agua (Veo la incrusta siempre y trata el pedir que no como
 * evasión) y no se exige identidad entre clips.
 */
export const FIXED_BLOCK = [
  'Instructional fitness video for a workout app: a certified personal trainer',
  'demonstrates one exercise with correct technique, in plain dark training clothes.',
  'Minimalist gym studio, matte dark grey background, rubber floor, soft even lighting,',
  'nobody else in the scene. Fixed tripod camera, one continuous take, no cuts.',
  'Vertical 9:16 framing with the full body in frame. Real-time speed, calm tempo.',
  'Clean footage without on-screen text or music.',
].join('\n');

// ── Vocabulario del catálogo → inglés ────────────────────────────────────────

const EQUIPMENT = {
  ab_wheel: 'ab wheel',
  air_bike: 'air bike (fan bike)',
  back_extension_bench: '45-degree back extension bench',
  barbell: 'Olympic barbell',
  barbell_or_dumbbell: 'Olympic barbell (dumbbells are an alternative)',
  belt_squat_machine: 'belt squat machine',
  bench: 'flat bench',
  bodyweight: 'no equipment, bodyweight only',
  bodyweight_or_barbell: 'bodyweight (a barbell can be added)',
  bodyweight_or_dumbbell: 'bodyweight (a dumbbell can be added)',
  bodyweight_or_machine: 'bodyweight (or an assisted machine)',
  cable: 'cable machine',
  calf_machine: 'standing calf raise machine',
  dip_station: 'parallel dip bars',
  donkey_calf_machine: 'donkey calf raise machine',
  doorway: 'a doorway frame',
  dumbbell: 'dumbbells',
  dumbbell_or_trap_bar: 'dumbbells (or a trap bar)',
  elliptical: 'elliptical trainer',
  ez_bar: 'EZ curl bar',
  landmine: 'landmine (barbell anchored at one end)',
  leg_press_machine: 'leg press machine',
  plate_loaded_machine: 'plate-loaded machine',
  pullup_bar: 'pull-up bar',
  resistance_band: 'resistance band',
  reverse_hyper_machine: 'reverse hyperextension machine',
  rowing_ergometer: 'rowing ergometer',
  selectorized_machine: 'weight-stack machine',
  smith_machine: 'Smith machine',
  stair_climber: 'stair climber machine',
  stationary_bike: 'stationary bike',
  treadmill: 'treadmill',
  wall: 'a wall',
  weight_plates: 'weight plates',
  wrist_roller: 'wrist roller',
  // Valores que sólo aparecen en filas antiguas de la BD (fuera del CSV).
  banco: 'flat bench',
  mancuernas: 'dumbbells',
  machine: 'machine',
  trap_bar: 'trap bar',
};

const ATTACHMENT = {
  ankle_strap: 'ankle strap',
  barbell_sleeve: 'barbell sleeve',
  close_neutral_handle: 'close neutral-grip handle',
  neutral_handle: 'neutral-grip handle',
  neutral_handles: 'neutral-grip handles',
  rope: 'rope attachment',
  single_handle: 'single D-handle',
  single_handles: 'single D-handles',
  straight_bar: 'straight bar attachment',
  straight_bar_or_rope: 'straight bar (or rope) attachment',
  tbar_handle: 'T-bar row handle',
  wide_bar: 'wide lat bar',
};

const BODY_POSITION = {
  bent_over: 'standing, hinged forward at the hips',
  bent_supported: 'hinged forward with one hand braced for support',
  decline_supine: 'lying face up on a decline bench',
  dynamic_split_stance: 'moving split stance (stepping)',
  half_kneeling: 'half-kneeling, one knee down',
  incline_seated: 'seated on an incline bench',
  incline_supine: 'lying face up on an incline bench',
  inclined_prone: 'lying face down on an incline bench',
  inclined_supported: 'chest supported on an incline bench',
  kneeling: 'kneeling',
  lean_away_standing: 'standing, leaning away from the anchor point',
  prone: 'lying face down',
  prone_incline: 'chest down on an incline bench',
  prone_plank: 'prone plank position on the forearms',
  prone_supported: 'face down, supported on the pad',
  quadruped: 'on all fours (hands and knees)',
  reclined: 'reclined, upper back supported',
  running: 'running',
  seated: 'seated',
  seated_dynamic: 'seated, with a continuous rowing or pedalling motion',
  seated_or_standing: 'seated (standing is also valid)',
  seated_supported: 'seated with the back supported',
  side_plank: 'side plank position on the forearm',
  split_stance: 'split stance, one foot forward',
  split_stance_rear_elevated: 'split stance with the rear foot elevated on a bench',
  staggered_bent_over: 'staggered stance, hinged forward at the hips',
  standing: 'standing',
  standing_hinge: 'standing, hinged at the hips',
  standing_or_seated: 'standing (seated is also valid)',
  standing_supported: 'standing, holding a support for balance',
  step_stance: 'standing on a step or platform',
  supine: 'lying face up',
  supported_arc: 'upper back on a bench, hips free (bridge position)',
  suspended: 'hanging from the bar',
  tripod_supported: 'one knee and one hand on a bench, the other foot on the floor',
  upper_back_supported: 'upper back resting on a bench, feet flat on the floor',
  walking: 'walking',
};

/** Valores de `grip_orientation` que describen un apoyo, no un agarre: se omiten. */
const NOT_A_GRIP = new Set([
  'bar_support', 'floor_support', 'forearm_support', 'free', 'free_or_loaded',
  'hand_support', 'handles', 'handles_optional', 'support', 'two_hand',
]);

const GRIP = {
  front_rack: 'front-rack position',
  neutral: 'neutral grip (palms facing each other)',
  neutral_or_pronated: 'neutral (or overhand) grip',
  neutral_to_pronated: 'grip rotating from neutral to overhand',
  pinch: 'pinch grip (fingers and thumb only)',
  pronated: 'overhand grip',
  pronated_or_mixed: 'overhand (or mixed) grip',
  pronated_or_neutral: 'overhand (or neutral) grip',
  semi_pronated: 'semi-overhand grip',
  semi_supinated: 'semi-underhand grip',
  supinated: 'underhand grip',
  rotating: 'rotating grip (palms turn during the lift)',
};

const GRIP_WIDTH = {
  close: 'close',
  medium: 'medium-width',
  medium_wide: 'slightly wider than shoulder-width',
  shoulder_width: 'shoulder-width',
  wide: 'wide',
};

const LATERALITY = {
  unilateral: 'One side at a time: demonstrate with the right side.',
  alternating: 'Alternate sides, one repetition each.',
  independent_bilateral: 'Both sides at the same time, each with its own implement.',
  unilateral_direction: 'One direction at a time: demonstrate towards the right.',
};

// ── Patrón de movimiento → cámara, gesto y claves de técnica ─────────────────

const SIDE = 'side profile view';
const FRONT = 'front view';
const FRONT45 = 'front three-quarter view (45 degrees)';
const REAR45 = 'rear three-quarter view';
const SIDE_REAR = 'side three-quarter view from slightly behind';

const HIP = 'camera at hip height';
const CHEST = 'camera at chest height';
const SHOULDER = 'camera at shoulder height';
const FOREARM = 'camera close, at forearm height';

/**
 * `move` describe el gesto en una frase; `cues` son las tres claves de técnica
 * que el modelo debe respetar (y que revisa quien valida el clip).
 */
const PATTERNS = {
  squat: { view: SIDE, height: HIP, move: 'sit the hips down and back until the thighs are at least parallel to the floor, then drive back up to standing', cues: ['knees track over the toes', 'chest up, neutral spine', 'whole foot stays flat on the floor'] },
  hip_hinge: { view: SIDE, height: HIP, move: 'push the hips back with a slight knee bend and lower the load along the legs until the hamstrings are loaded, then drive the hips forward to stand tall', cues: ['neutral spine throughout, no rounding', 'shins stay vertical', 'load stays close to the body'] },
  hip_extension: { view: SIDE, height: HIP, move: 'drive the hips up and forward against the resistance until the body forms a straight line, squeeze the glutes at the top, then lower under control', cues: ['ribs down, no lower-back arching at the top', 'chin tucked, neutral neck', 'full glute squeeze at lockout'] },
  lunge: { view: SIDE, height: HIP, move: 'step into the lunge and lower until both knees are at about 90 degrees with the front thigh parallel to the floor, then push back up', cues: ['front knee tracks over the foot', 'torso upright', 'rear knee hovers just above the floor'] },
  knee_flexion: { view: SIDE, height: HIP, move: 'curl the heels towards the glutes by bending the knees, then return under control to the extended position', cues: ['hips stay pressed against the pad', 'full range without the hips lifting', 'slow, controlled lowering'] },
  knee_extension: { view: SIDE, height: HIP, move: 'extend the knees to lift the pad until the legs are straight, pause, then lower under control', cues: ['back against the seat', 'no swinging', 'pause at full extension'] },
  calf_raise: { view: SIDE, height: HIP, move: 'rise onto the balls of the feet as high as possible, pause at the top, then lower the heels below platform level for a full stretch', cues: ['knees fixed (straight or at a set bend)', 'pause at the top', 'full stretch at the bottom'] },
  hip_flexion: { view: SIDE, height: HIP, move: 'lift the knees towards the chest by flexing the hips, then lower under control', cues: ['no swinging', 'pelvis tilts slightly back at the top', 'controlled lowering'] },
  hip_flexion_extension: { view: SIDE, height: HIP, move: 'swing one straight leg forward and backward in a controlled arc, increasing the range gradually', cues: ['torso stays tall and still', 'movement comes from the hip', 'controlled, not ballistic'] },
  ankle_dorsiflexion: { view: SIDE, height: HIP, move: 'drive the knee forward over the toes as far as possible with the heel on the floor, then return', cues: ['heel stays down', 'knee tracks straight over the second toe', 'slow and controlled'] },
  posterior_pelvic_tilt: { view: SIDE, height: HIP, move: 'tilt the pelvis backwards to flatten the lower back, hold briefly, then release', cues: ['lower back presses towards the floor', 'ribs stay down', 'small, precise movement'] },
  spinal_flexion_extension: { view: SIDE, height: HIP, move: 'round the whole spine upwards segment by segment, then reverse into a gentle extension', cues: ['move one vertebra at a time', 'breathe out while rounding', 'neck follows the spine'] },
  trunk_flexion: { view: SIDE, height: HIP, move: 'curl the trunk forward by flexing the spine, bringing the ribs towards the pelvis, then return under control', cues: ['movement from the spine, not the hips', 'chin slightly tucked', 'controlled lowering'] },
  anti_extension: { view: SIDE, height: HIP, move: 'keep the trunk rigid and the lower back neutral against the pull into extension, moving only the limbs as the exercise requires', cues: ['ribs down, pelvis slightly tucked', 'lower back never arches', 'core braced throughout'] },
  anti_rotation: { view: FRONT, height: CHEST, move: 'hold the load in front of the chest and press it out to arm\'s length while resisting the pull to rotate, then bring it back', cues: ['hips and shoulders stay square', 'no leaning', 'slow press out and back'] },
  anti_lateral_flexion: { view: FRONT, height: HIP, move: 'keep the trunk straight and level against the sideways pull', cues: ['body in one straight line', 'hips stay high', 'no bending sideways'] },
  rotation: { view: FRONT, height: CHEST, move: 'rotate the trunk across the body through the hips and upper back, then return under control', cues: ['pivot the back foot', 'arms stay long', 'rotate from the hips, not the lower back'] },
  hip_rotation: { view: FRONT, height: HIP, move: 'move both knees from one side to the other keeping the feet on the floor, rotating at the hips', cues: ['torso stays tall', 'movement only at the hips', 'slow, controlled range'] },
  hip_abduction: { view: FRONT, height: HIP, move: 'move the legs apart against the resistance, then return under control', cues: ['torso still', 'pause at the widest point', 'controlled return'] },
  hip_adduction: { view: FRONT, height: HIP, move: 'bring the legs together against the resistance, then return under control', cues: ['torso still', 'squeeze at the closed position', 'controlled return'] },
  diagonal_adduction: { view: FRONT45, height: CHEST, move: 'sweep the limb across the body along a diagonal against the cable, then return', cues: ['torso stays square', 'controlled arc', 'squeeze at the end position'] },
  // Presses tumbados: de perfil. Es el encuadre canónico y el que menos
  // confunde al modelo; en tres cuartos llegó a poner la barra en el eje del cuerpo.
  horizontal_push: { view: SIDE, height: CHEST, move: 'start with the arms extended and the load directly above the chest; lower it to the mid-chest under control, pause briefly, and press back up to full extension', cues: ['elbows at about 45 degrees to the torso', 'shoulder blades retracted and down', 'wrists stacked over the elbows'] },
  diagonal_push: { view: SIDE, height: CHEST, move: 'start with the arms extended above the upper chest; lower the load under control, then press it up and slightly back to full extension', cues: ['elbows about 45 degrees from the torso', 'shoulder blades down and back', 'controlled lowering'] },
  vertical_push: { view: FRONT45, height: CHEST, move: 'press the load straight overhead to full extension, then lower under control to shoulder level', cues: ['ribs down, no lower-back arching', 'head moves slightly back to let the bar pass', 'biceps by the ears at lockout'] },
  dip_push: { view: SIDE, height: CHEST, move: 'lower the body by bending the elbows until the upper arms are about parallel to the floor, then press back up', cues: ['shoulders stay down, not shrugged', 'slight forward lean', 'controlled depth'] },
  horizontal_pull: { view: SIDE_REAR, height: HIP, move: 'pull the handle towards the torso leading with the elbows, squeeze the shoulder blades together, then extend the arms under control', cues: ['elbows drive back, not out', 'shoulder blades retract at the end', 'torso stays still, no jerking'] },
  diagonal_pull: { view: SIDE_REAR, height: HIP, move: 'pull along a diagonal line towards the hip or chest, then return under control', cues: ['lead with the elbow', 'shoulder blade moves with the arm', 'controlled return'] },
  vertical_pull: { view: REAR45, height: SHOULDER, move: 'pull until the chin clears the bar (or the bar reaches the upper chest), then return to a full hang with straight arms', cues: ['start from a full hang with the shoulders active', 'elbows drive down and back', 'full extension at the bottom'] },
  rear_delt_pull: { view: FRONT45, height: CHEST, move: 'pull the handles apart and back towards the face with the elbows high, then return', cues: ['elbows stay high', 'squeeze the rear shoulders', 'no torso swing'] },
  shoulder_extension: { view: SIDE, height: CHEST, move: 'pull the nearly straight arms down and back past the hips, then return under control', cues: ['arms stay nearly straight', 'chest up', 'controlled return'] },
  shoulder_flexion: { view: SIDE, height: CHEST, move: 'raise the load in front of the body to shoulder height with nearly straight arms, then lower under control', cues: ['no swinging', 'stop at shoulder height', 'controlled lowering'] },
  shoulder_abduction: { view: FRONT, height: CHEST, move: 'raise the arms out to the sides to shoulder height with a slight elbow bend, then lower under control', cues: ['lead with the elbows', 'stop at shoulder height', 'no shrugging'] },
  horizontal_abduction: { view: FRONT45, height: CHEST, move: 'open the arms out to the sides against the resistance with a slight elbow bend, then return under control', cues: ['squeeze the shoulder blades together', 'arms stay slightly bent', 'no torso movement'] },
  horizontal_adduction: { view: FRONT45, height: CHEST, move: 'bring the arms together in front of the chest in a wide arc, then open them under control', cues: ['slight, fixed elbow bend', 'stretch across the chest at the open position', 'squeeze at the closed position'] },
  external_rotation: { view: FRONT, height: CHEST, move: 'rotate the forearm outwards against the band keeping the elbow pinned to the side, then return', cues: ['elbow stays glued to the ribs', 'wrist neutral', 'slow, small range'] },
  shoulder_circumduction: { view: SIDE, height: CHEST, move: 'holding the band wide, raise it overhead and behind the body in a full arc, then bring it back to the front', cues: ['arms stay straight', 'grip wide enough that the shoulders do not pinch', 'slow and smooth'] },
  scapular_elevation: { view: FRONT, height: CHEST, move: 'shrug the shoulders straight up towards the ears, pause, then lower fully', cues: ['straight up, no rolling', 'pause at the top', 'full stretch at the bottom'] },
  elbow_flexion: { view: FRONT45, height: CHEST, move: 'curl the load up by bending the elbows until the forearms reach the biceps, then lower under control to full extension', cues: ['elbows pinned at the sides', 'no swinging from the hips', 'full extension at the bottom'] },
  elbow_extension: { view: FRONT45, height: CHEST, move: 'extend the elbows fully against the resistance, pause, then bend them under control back to the start', cues: ['upper arms fixed', 'full lockout at the end', 'controlled return'] },
  wrist_flexion: { view: FRONT, height: FOREARM, move: 'curl the wrists upwards, then lower under control', cues: ['forearms stay on the support', 'full range', 'slow'] },
  wrist_extension: { view: FRONT, height: FOREARM, move: 'extend the wrists upwards against the load, then lower under control', cues: ['forearms stay on the support', 'full range', 'slow'] },
  wrist_flexion_extension: { view: FRONT, height: FOREARM, move: 'roll the wrists to wind the rope up, then unwind under control', cues: ['arms stay still', 'full turns', 'steady rhythm'] },
  forearm_rotation: { view: FRONT, height: FOREARM, move: 'rotate the forearm from palm-down to palm-up and back with the elbow fixed', cues: ['elbow stays still', 'full rotation both ways', 'controlled'] },
  grip_isometric: { view: FRONT, height: CHEST, move: 'hold the load with a firm grip without moving', cues: ['shoulders active, not shrugged', 'body still', 'steady breathing'], mode: 'hold' },
  carry: { view: SIDE, height: HIP, move: 'walk with the load at a steady pace', cues: ['tall posture, ribs down', 'shoulders level', 'short, quick steps'], mode: 'continuous' },
  locomotion: { view: SIDE, height: HIP, move: 'perform the continuous locomotion at a steady, moderate pace', cues: ['relaxed shoulders', 'even rhythm', 'natural posture'], mode: 'continuous' },
  stretch: { view: SIDE, height: HIP, move: 'move slowly into the stretch position until a gentle stretch is felt', cues: ['no bouncing', 'relaxed breathing', 'stretch, never pain'], mode: 'hold' },
};

/** Patrón desconocido: el nombre en inglés lleva casi toda la información. */
const GENERIC_PATTERN = { view: FRONT45, height: CHEST, move: 'perform the exercise through its full range of motion', cues: ['neutral spine', 'controlled tempo', 'full range of motion'] };

/** Altura de cámara según la posición, cuando manda más que el patrón. */
const HEIGHT_BY_POSITION = {
  supine: 'camera low, at floor level',
  prone: 'camera low, at floor level',
  prone_plank: 'camera low, at floor level',
  side_plank: 'camera low, at floor level',
  quadruped: 'camera low, at floor level',
  kneeling: 'camera low, at knee height',
  half_kneeling: 'camera low, at knee height',
  incline_supine: 'camera at bench height',
  decline_supine: 'camera at bench height',
  inclined_prone: 'camera at bench height',
  inclined_supported: 'camera at bench height',
  prone_incline: 'camera at bench height',
  prone_supported: 'camera at bench height',
  upper_back_supported: 'camera at bench height',
  supported_arc: 'camera at bench height',
  tripod_supported: 'camera at bench height',
  suspended: 'camera at shoulder height',
};

/**
 * Cómo se sujeta el implemento respecto al cuerpo. Es lo que el modelo más
 * inventa si no se le dice: en la primera prueba puso la barra del press de
 * banca a lo largo del cuerpo en vez de cruzando el pecho.
 */
const HANDLING = {
  barbell: 'Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.',
  barbell_or_dumbbell: 'Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.',
  bodyweight_or_barbell: 'If a bar is used, both hands on it, horizontal and perpendicular to the body.',
  ez_bar: 'Both hands on the EZ bar; the bar stays horizontal and perpendicular to the body at all times.',
  smith_machine: 'Both hands on the Smith machine bar, which slides on its fixed vertical rails.',
  dumbbell: 'One dumbbell in each hand, wrists straight.',
  bodyweight_or_dumbbell: 'If dumbbells are used, one in each hand, wrists straight.',
  dumbbell_or_trap_bar: 'One dumbbell in each hand, arms hanging straight down at the sides.',
  trap_bar: 'Standing inside the trap bar, one handle in each hand.',
  landmine: 'One end of the barbell is anchored to the floor; the trainer holds the free end.',
  cable: 'The cable runs taut from the machine to the handle throughout the movement.',
  resistance_band: 'The band stays under tension throughout the movement.',
  pullup_bar: 'Hands on the bar overhead, body hanging freely.',
  dip_station: 'One hand on each parallel bar, body suspended between them.',
  selectorized_machine: 'Seated or positioned in the machine as designed, pads adjusted to the body, hands on its handles.',
  plate_loaded_machine: 'Positioned in the machine as designed, pads adjusted to the body, hands on its handles.',
  machine: 'Positioned in the machine as designed, hands on its handles.',
  leg_press_machine: 'Seated in the leg press with the back against the pad and both feet flat on the platform.',
  calf_machine: 'Shoulders under the pads, balls of the feet on the edge of the platform.',
  donkey_calf_machine: 'Hips under the pad, torso bent forward, balls of the feet on the edge of the platform.',
  belt_squat_machine: 'Belt around the hips attached to the machine, hands on the support handles.',
  back_extension_bench: 'Thighs on the pad, heels locked under the rollers.',
  reverse_hyper_machine: 'Torso on the pad, legs hanging, ankles in the straps.',
  ab_wheel: 'Both hands on the wheel handles.',
  wrist_roller: 'Both hands on the roller, arms extended in front.',
  weight_plates: 'Plates held with the fingers and thumb.',
};

const REPS_TEXT = {
  reps: 'Perform exactly 2 full repetitions at a controlled tempo (about 2 seconds lowering, 1 second lifting) and finish back in the start position so the clip loops seamlessly.',
  mobility: 'Perform 2 slow, smooth repetitions through the full comfortable range and finish in the start position so the clip loops seamlessly.',
  hold: 'Get into position within the first second, then hold it perfectly still, breathing calmly, for the rest of the clip.',
  continuous: 'Keep a steady, continuous rhythm for the whole clip, so that it loops seamlessly.',
};

// ── Construcción del prompt (puro, testeado en tests/unit/video-prompts.test.js) ──

const HOLD_BY_NAME = /plancha|plank|colgad|hang|pinza|pinch|hollow/i;

/**
 * Cómo se ejecuta el clip: repeticiones, movilidad lenta, posición mantenida
 * o ritmo continuo. Sale de la categoría y del patrón; el nombre desempata los
 * patrones que pueden ser dinámicos o isométricos (plancha vs. rueda abdominal).
 */
export function promptMode({ category, pattern, name_es = '', name_en = '' }) {
  const byPattern = PATTERNS[pattern]?.mode;
  if (byPattern) return byPattern;
  if (category === 'stretch') return 'hold';
  if (category === 'cardio') return 'continuous';
  if (HOLD_BY_NAME.test(`${name_es} ${name_en}`)) return 'hold';
  if (category === 'mobility') return 'mobility';
  return 'reps';
}

/** Equipos con los que "tumbado boca arriba" (`supine`) significa sobre un banco plano, no en el suelo. */
const BENCH_EQUIPMENT = new Set(['barbell', 'dumbbell', 'barbell_or_dumbbell', 'smith_machine', 'ez_bar', 'dumbbell_or_trap_bar']);

/** El CSV marca `supine` tanto para un press de banca como para un dead bug; el equipo desempata. */
export function onFlatBench({ body_position, equipment_type }) {
  return body_position === 'supine' && BENCH_EQUIPMENT.has(equipment_type);
}

/** Encuadre: vista según el patrón, altura según la posición si ésta manda. */
export function cameraFor({ pattern, body_position, equipment_type }) {
  const p = PATTERNS[pattern] ?? GENERIC_PATTERN;
  const height = onFlatBench({ body_position, equipment_type })
    ? 'camera at bench height'
    : (HEIGHT_BY_POSITION[body_position] ?? p.height);
  return `${p.view}, ${height}`;
}

function equipmentPhrase(equipment_type, attachment) {
  const base = EQUIPMENT[equipment_type] ?? String(equipment_type || '').replace(/_/g, ' ');
  const extra = ATTACHMENT[attachment];
  return extra ? `${base} with ${extra}` : base;
}

function positionPhrase({ body_position, torso_angle_deg, equipment_type }) {
  const parts = [];
  const base = onFlatBench({ body_position, equipment_type }) ? 'lying face up on a flat bench' : BODY_POSITION[body_position];
  if (base) parts.push(base);

  const angle = Number(torso_angle_deg);
  if (Number.isFinite(angle) && angle >= 5 && angle <= 85 && body_position) {
    if (/incline|decline|inclined|reclined/.test(body_position)) parts.push(`bench set to about ${angle} degrees`);
    else if (/bent|hinge/.test(body_position)) parts.push(`torso at about ${angle} degrees from horizontal`);
  }
  return parts.join(', ');
}

/** Categorías donde el "agarre" del CSV es un apoyo (sujetar el tobillo, la máquina de cardio): no aporta. */
const NO_GRIP_CATEGORIES = new Set(['stretch', 'mobility', 'cardio']);

function gripPhrase({ grip_orientation, grip_width, category }) {
  if (NO_GRIP_CATEGORIES.has(category)) return '';
  if (!grip_orientation || NOT_A_GRIP.has(grip_orientation)) return '';
  const grip = GRIP[grip_orientation];
  if (!grip) return '';
  const width = GRIP_WIDTH[grip_width];
  return width ? `${width} ${grip}` : grip;
}

/**
 * Prompt completo de un ejercicio. `record` mezcla la fila del CSV con la de
 * Supabase; todos los campos son opcionales salvo el nombre.
 */
export function buildPrompt(record) {
  const name_es = record.name_es ?? record.name ?? '';
  const name_en = record.name_en || name_es;
  const pattern = record.pattern ?? record.primary_pattern ?? record.movement_pattern ?? '';
  const p = PATTERNS[pattern] ?? GENERIC_PATTERN;
  const mode = promptMode({ category: record.category, pattern, name_es, name_en });

  const lines = [`Exercise: ${name_en}${name_en !== name_es ? ` (${name_es})` : ''}.`];

  const equipment = equipmentPhrase(record.equipment_type ?? record.equipment?.[0], record.attachment);
  if (equipment) lines.push(`Equipment: ${equipment}.`);

  const position = positionPhrase(record);
  const grip = gripPhrase(record);
  const posLine = [position, grip].filter(Boolean).join('; ');
  if (posLine) lines.push(`Position: ${posLine}.`);

  const handling = HANDLING[record.equipment_type ?? record.equipment?.[0]];
  if (handling) lines.push(`Handling: ${handling}`);

  const lat = LATERALITY[record.laterality];
  if (lat) lines.push(lat);

  lines.push(`Camera: ${cameraFor({ pattern, body_position: record.body_position, equipment_type: record.equipment_type })}.`);
  lines.push(`Movement: ${p.move}. ${REPS_TEXT[mode]}`);
  lines.push(`Key form cues: ${p.cues.join('; ')}.`);

  return { mode, prompt: `${FIXED_BLOCK}\n\n${lines.join('\n')}` };
}

// ── Casado CSV ↔ Supabase y escritura ────────────────────────────────────────

const BLOCK_ORDER = ['warmup', 'strength', 'cardio', 'cooldown'];
const BLOCK_LABEL = { warmup: 'Calentamiento', strength: 'Entrenamiento', cardio: 'Cardio', cooldown: 'Estiramiento' };

function main() {
  const csvRows = parseCsv(readFileSync(CSV_PATH, 'utf8'));
  const media = JSON.parse(readFileSync(MEDIA_PATH, 'utf8'));

  const byName = new Map(csvRows.map(r => [normalizeExerciseName(r.name_es), r]));
  const unmatched = [];

  const entries = media
    .slice()
    .sort((a, b) => BLOCK_ORDER.indexOf(a.exercise_type) - BLOCK_ORDER.indexOf(b.exercise_type) || a.name.localeCompare(b.name, 'es'))
    .map((row) => {
      const csv = byName.get(normalizeExerciseName(row.name));
      if (!csv) unmatched.push(row.name);
      const record = csv
        ? { ...csv, pattern: csv.primary_pattern }
        : { name_es: row.name, pattern: row.movement_pattern, equipment: row.equipment, category: row.exercise_type };
      const { mode, prompt } = buildPrompt(record);
      return {
        id: row.id,
        slug: row.slug,
        file: `${row.slug}.mp4`,
        name_es: row.name,
        name_en: csv?.name_en ?? row.name,
        exercise_type: row.exercise_type,
        mode,
        prompt,
      };
    });

  writeFileSync(OUT_JSON, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
  writeFileSync(OUT_MD, renderMarkdown(entries), 'utf8');

  const modes = entries.reduce((acc, e) => ({ ...acc, [e.mode]: (acc[e.mode] ?? 0) + 1 }), {});
  console.log(`prompts: ${entries.length} | modos: ${JSON.stringify(modes)}`);
  console.log(`sin fila en el CSV (prompt genérico): ${unmatched.length ? unmatched.join(', ') : 'ninguno'}`);
  console.log(`escrito: ${OUT_MD}\n         ${OUT_JSON}`);
}

function renderMarkdown(entries) {
  const out = [];
  out.push(`# Prompts de vídeo del catálogo (${entries.length} ejercicios)`);
  out.push('');
  out.push('Generado por `node backend/scripts/generate-video-prompts.mjs` a partir de');
  out.push('`exercises_v2_science_based.csv` (datos del gesto) y `exercises-media.json`');
  out.push('(ids y slugs reales de Supabase). No editar a mano: regenerar.');
  out.push('');
  out.push('## Cómo usarlos');
  out.push('');
  out.push('1. **Un prompt por generación.** Los modelos de vídeo producen un clip por');
  out.push('   petición; copia el bloque completo, incluida la parte fija (es la que hace');
  out.push('   que los 151 clips parezcan una misma serie).');
  out.push('2. En Gemini: modo *Vídeos*, formato **vertical (9:16)** si lo ofrece, 8 s.');
  out.push('3. **Genera 2 variantes y quédate con la de mejor técnica.** Revisa a mano:');
  out.push('   articulaciones (codos, rodillas), trayectoria, que haga las repeticiones');
  out.push('   pedidas y que termine en la posición inicial (así el bucle no salta).');
  out.push('4. Guarda cada clip con el **nombre de archivo indicado** (`<slug>.mp4`) y');
  out.push('   súbelo al bucket `exercise-media`. El script de carga casa el archivo con');
  out.push('   su ejercicio por ese nombre.');
  out.push('5. Misma persona en todos los clips no está garantizada entre generaciones.');
  out.push('   Si la consistencia importa, genera primero una imagen de referencia del');
  out.push('   instructor en el estudio y usa *imagen → vídeo* con ella.');
  out.push('6. **Si Gemini rechaza un prompt** ("I can\'t generate that video"), casi');
  out.push('   siempre es el filtro de personas, no el ejercicio. Por este orden: quita');
  out.push('   la frase del ángulo de cámara que menciona "behind"; quita "in plain dark');
  out.push('   training clothes"; y como último recurso pega sólo el bloque del ejercicio');
  out.push('   (desde "Exercise:") precedido de "Instructional fitness video, vertical".');
  out.push('');

  // Índice con enlace a cada ficha. Ancla propia (`ex-<slug>`) para no depender
  // de cómo cada visor convierte los títulos con acentos en ids.
  out.push('## Índice');
  out.push('');
  let n = 0;
  for (const type of BLOCK_ORDER) {
    const group = entries.filter(e => e.exercise_type === type);
    if (!group.length) continue;
    out.push(`**${BLOCK_LABEL[type]}** (${group.length})`);
    out.push('');
    for (const e of group) {
      n += 1;
      out.push(`- ${n}. [${e.name_es}](#ex-${e.slug}) · \`${e.file}\``);
    }
    out.push('');
  }

  n = 0;
  for (const type of BLOCK_ORDER) {
    const group = entries.filter(e => e.exercise_type === type);
    if (!group.length) continue;
    out.push(`## ${BLOCK_LABEL[type]} (${group.length})`);
    out.push('');
    for (const e of group) {
      n += 1;
      out.push(`<a id="ex-${e.slug}"></a>`);
      out.push('');
      out.push(`### ${n}. ${e.name_es}`);
      out.push('');
      out.push(`Archivo: \`${e.file}\` · id \`${e.id}\` · [↑ índice](#índice)`);
      out.push('');
      out.push('```text');
      out.push(e.prompt);
      out.push('```');
      out.push('');
    }
  }
  return `${out.join('\n')}\n`;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  main();
}
