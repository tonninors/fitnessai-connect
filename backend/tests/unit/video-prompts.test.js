import { describe, it, expect } from 'vitest';
import { buildPrompt, promptMode, cameraFor, FIXED_BLOCK } from '../../scripts/generate-video-prompts.mjs';

/** Fila del CSV tal como la devuelve `parseCsv`, con el patrón ya copiado. */
const pressBanca = {
  name_es: 'Press Banca con Barra',
  name_en: 'Barbell Bench Press',
  category: 'strength',
  pattern: 'horizontal_push',
  equipment_type: 'barbell',
  attachment: '',
  body_position: 'supine',
  torso_angle_deg: '0',
  grip_orientation: 'pronated',
  grip_width: 'medium_wide',
  laterality: 'bilateral',
};

describe('buildPrompt', () => {
  it('lleva el bloque fijo y describe el ejercicio con los datos del catálogo', () => {
    const { mode, prompt } = buildPrompt(pressBanca);

    expect(mode).toBe('reps');
    expect(prompt.startsWith(FIXED_BLOCK)).toBe(true);
    expect(prompt).toContain('Exercise: Barbell Bench Press (Press Banca con Barra).');
    expect(prompt).toContain('Equipment: Olympic barbell.');
    // `supine` con barra es un banco plano, no el suelo: cambia la frase y la cámara.
    expect(prompt).toContain('Position: lying face up on a flat bench; slightly wider than shoulder-width overhand grip.');
    // La barra cruza el pecho: sin decirlo, el modelo la puso a lo largo del cuerpo.
    expect(prompt).toContain('Handling: Both hands on the bar; the bar stays horizontal and perpendicular to the body at all times.');
    expect(prompt).toContain('Camera: side profile view, camera at bench height.');
    expect(prompt).toContain('Movement: start with the arms extended and the load directly above the chest;');
    expect(prompt).toContain('Perform exactly 2 full repetitions');
    expect(prompt).toContain('Key form cues: elbows at about 45 degrees to the torso;');
  });

  it('tumbada sin banco (peso corporal) la cámara baja al suelo', () => {
    const { prompt } = buildPrompt({
      name_es: 'Dead Bug', name_en: 'Dead Bug', category: 'core', pattern: 'anti_extension',
      equipment_type: 'bodyweight', body_position: 'supine', grip_orientation: 'free', laterality: 'alternating',
    });
    expect(prompt).toContain('Position: lying face up.');
    expect(prompt).toContain('camera low, at floor level.');
    expect(prompt).toContain('Alternate sides, one repetition each.');
  });

  it('en estiramientos, movilidad y cardio no describe el agarre', () => {
    // El CSV marca "neutral" para sujetar el tobillo en un estiramiento de
    // cuádriceps: es un apoyo, y "neutral grip" confunde al modelo.
    const { prompt } = buildPrompt({
      name_es: 'Estiramiento de Cuádriceps', name_en: 'Standing Quadriceps Stretch', category: 'stretch',
      pattern: 'stretch', equipment_type: 'bodyweight', body_position: 'standing_supported',
      grip_orientation: 'neutral', grip_width: 'single', laterality: 'unilateral',
    });
    expect(prompt).toContain('Position: standing, holding a support for balance.');
    expect(prompt).not.toMatch(/grip/i);
  });

  it('añade el accesorio del cable y el ángulo del banco cuando existen', () => {
    const { prompt } = buildPrompt({
      name_es: 'Press Inclinado con Mancuernas', name_en: 'Incline Dumbbell Press', category: 'strength',
      pattern: 'diagonal_push', equipment_type: 'dumbbell', body_position: 'incline_supine', torso_angle_deg: '30',
      grip_orientation: 'neutral_or_pronated', grip_width: 'free', laterality: 'bilateral',
    });
    expect(prompt).toContain('Position: lying face up on an incline bench, bench set to about 30 degrees; neutral (or overhand) grip.');

    const cable = buildPrompt({
      name_es: 'Extensión de Tríceps en Polea', name_en: 'Cable Triceps Pushdown', category: 'strength',
      pattern: 'elbow_extension', equipment_type: 'cable', attachment: 'rope', body_position: 'standing',
      grip_orientation: 'neutral', grip_width: 'neutral', laterality: 'bilateral',
    }).prompt;
    expect(cable).toContain('Equipment: cable machine with rope attachment.');
    expect(cable).toContain('Position: standing; neutral grip (palms facing each other).');
    expect(cable).toContain('Handling: The cable runs taut from the machine to the handle throughout the movement.');
  });

  it('sin implemento no añade línea de manejo', () => {
    const { prompt } = buildPrompt({
      name_es: 'Sentadilla con Peso Corporal', name_en: 'Bodyweight Squat', category: 'strength',
      pattern: 'squat', equipment_type: 'bodyweight', body_position: 'standing', laterality: 'bilateral',
    });
    expect(prompt).not.toContain('Handling:');
  });

  it('omite el agarre cuando el campo describe un apoyo, no un agarre', () => {
    const { prompt } = buildPrompt({
      name_es: 'Sentadilla Búlgara', name_en: 'Bulgarian Split Squat', category: 'strength',
      pattern: 'lunge', equipment_type: 'bodyweight_or_dumbbell', body_position: 'split_stance_rear_elevated',
      grip_orientation: 'free', grip_width: 'free', laterality: 'unilateral',
    });
    expect(prompt).toContain('Position: split stance with the rear foot elevated on a bench.');
    expect(prompt).not.toMatch(/grip/i);
    expect(prompt).toContain('One side at a time: demonstrate with the right side.');
  });

  it('un patrón desconocido no rompe y se apoya en el nombre en inglés', () => {
    const { prompt } = buildPrompt({ name_es: 'Ejercicio Raro', name_en: 'Odd Exercise', pattern: 'no_existe' });
    expect(prompt).toContain('Exercise: Odd Exercise (Ejercicio Raro).');
    expect(prompt).toContain('Movement: perform the exercise through its full range of motion.');
  });

  it('sin nombre en inglés no duplica el nombre entre paréntesis', () => {
    const { prompt } = buildPrompt({ name_es: 'Remo Invertido', pattern: 'horizontal_pull', equipment: ['bodyweight'] });
    expect(prompt).toContain('Exercise: Remo Invertido.');
    expect(prompt).toContain('Equipment: no equipment, bodyweight only.');
  });
});

describe('promptMode', () => {
  it('los estiramientos se mantienen y el cardio es continuo', () => {
    expect(promptMode({ category: 'stretch', pattern: 'stretch' })).toBe('hold');
    expect(promptMode({ category: 'cardio', pattern: 'locomotion' })).toBe('continuous');
    expect(buildPrompt({ name_es: 'Cinta', name_en: 'Treadmill Walk', category: 'cardio', pattern: 'locomotion' }).prompt)
      .not.toMatch(/repetitions/);
  });

  it('la plancha se mantiene aunque su patrón admita versiones dinámicas', () => {
    // Mismo patrón (anti_extension): la rueda abdominal hace repeticiones,
    // la plancha no.
    expect(promptMode({ category: 'core', pattern: 'anti_extension', name_es: 'Plancha Frontal' })).toBe('hold');
    expect(promptMode({ category: 'core', pattern: 'anti_extension', name_es: 'Rueda Abdominal' })).toBe('reps');
    expect(promptMode({ category: 'core', pattern: 'anti_lateral_flexion', name_es: 'Plancha Lateral' })).toBe('hold');
  });

  it('la movilidad pide repeticiones lentas y la fuerza repeticiones con tempo', () => {
    expect(promptMode({ category: 'mobility', pattern: 'hip_flexion_extension' })).toBe('mobility');
    expect(promptMode({ category: 'strength', pattern: 'squat' })).toBe('reps');
    expect(promptMode({ category: 'strength', pattern: 'grip_isometric', name_es: 'Colgado en Barra' })).toBe('hold');
  });
});

describe('cameraFor', () => {
  it('la vista la decide el patrón; la altura, la posición cuando manda', () => {
    expect(cameraFor({ pattern: 'squat', body_position: 'standing' })).toBe('side profile view, camera at hip height');
    expect(cameraFor({ pattern: 'vertical_pull', body_position: 'suspended' })).toBe('rear three-quarter view, camera at shoulder height');
    expect(cameraFor({ pattern: 'anti_extension', body_position: 'prone_plank' })).toBe('side profile view, camera low, at floor level');
  });
});
