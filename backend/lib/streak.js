/**
 * Cálculo de racha y nivel. Lógica pura: no toca base de datos.
 */

export const LEVEL_NAMES = ['Principiante', 'En forma', 'Atleta', 'Avanzado', 'Elite'];

/** Un nivel cada 10 días de racha, empezando en 1. */
export function levelForStreak(streak) {
  const safe = Number.isFinite(streak) && streak > 0 ? streak : 0;
  return Math.floor(safe / 10) + 1;
}

export function levelNameForLevel(level) {
  const index = Math.min(Math.max(level, 1) - 1, LEVEL_NAMES.length - 1);
  return LEVEL_NAMES[index];
}

/**
 * Estado de racha tras completar una sesión.
 *
 * @param {object}  input
 * @param {number}  input.currentStreak      Racha almacenada en el perfil.
 * @param {number}  input.longestStreak      Récord almacenado en el perfil.
 * @param {boolean} input.completedYesterday ¿Hubo sesión completada ayer?
 * @param {boolean} input.alreadyCountedToday ¿Ya se había completado otra sesión hoy?
 *                  Evita que dos sesiones en el mismo día sumen dos días de racha.
 */
export function computeStreak({
  currentStreak = 0,
  longestStreak = 0,
  completedYesterday = false,
  alreadyCountedToday = false,
} = {}) {
  const current = Number.isFinite(currentStreak) && currentStreak > 0 ? currentStreak : 0;
  const longest = Number.isFinite(longestStreak) && longestStreak > 0 ? longestStreak : 0;

  let streak;
  if (alreadyCountedToday) {
    // La racha de hoy ya se contabilizó: se mantiene (mínimo 1).
    streak = Math.max(current, 1);
  } else if (completedYesterday) {
    streak = current + 1;
  } else {
    streak = 1;
  }

  const level = levelForStreak(streak);
  return {
    current_streak: streak,
    longest_streak: Math.max(streak, longest),
    level,
    level_name: levelNameForLevel(level),
  };
}
