/**
 * Agregaciones de progreso. Lógica pura: no toca base de datos.
 */

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Semanas cubiertas por cada periodo de la gráfica. */
export const CHART_PERIODS = { '4w': 4, '3m': 12, '1y': 52 };

export function weeksForPeriod(period) {
  return CHART_PERIODS[period] ?? CHART_PERIODS['4w'];
}

/**
 * Volumen (minutos entrenados) agrupado en `weeks` cubos semanales terminando
 * en `now`. El último elemento del array es la semana en curso.
 */
export function buildWeeklyChart(sessions, weeks, now = Date.now()) {
  const list = Array.isArray(sessions) ? sessions : [];
  const total = Number.isInteger(weeks) && weeks > 0 ? weeks : 4;

  return Array.from({ length: total }, (_, i) => {
    const weekIdx = total - 1 - i;
    const start = now - (weekIdx + 1) * WEEK_MS;
    const end = now - weekIdx * WEEK_MS;

    const minutes = list.reduce((sum, session) => {
      const ts = Date.parse(session?.completed_at);
      if (Number.isNaN(ts) || ts < start || ts >= end) return sum;
      return sum + (Number(session.actual_duration) || 0);
    }, 0);

    return { label: `S${i + 1}`, val: minutes };
  });
}

/** Totales mensuales a partir de las sesiones completadas del mes. */
export function summarizeSessions(sessions) {
  const list = Array.isArray(sessions) ? sessions : [];
  const totalCalories = list.reduce((sum, s) => sum + (Number(s?.actual_calories) || 0), 0);
  const totalMinutes = list.reduce((sum, s) => sum + (Number(s?.actual_duration) || 0), 0);

  return {
    total_workouts: list.length,
    total_calories: totalCalories,
    total_minutes: totalMinutes,
    total_hours: Math.round(totalMinutes / 60),
  };
}

/** Porcentaje 0-100 de un valor respecto a un objetivo. */
export function ringPercent(value, goal) {
  const v = Number(value) || 0;
  const g = Number(goal);
  if (!Number.isFinite(g) || g <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((v / g) * 100)));
}
