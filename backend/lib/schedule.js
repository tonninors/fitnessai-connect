/**
 * Reprogramación del plan cuando una sesión se completa fuera de fecha.
 * Lógica pura: no toca base de datos.
 *
 * Regla: el plan no descarta sesiones. Si el Día 2 estaba programado para el
 * sábado y se hace el domingo, todo lo que venía después se corre un día, de
 * modo que se conservan los descansos entre sesiones y nunca se amontonan dos
 * el mismo día. Hacer una sesión antes de tiempo no adelanta el resto.
 */

import { addDays, daysBetween, isISODate } from './dates.js';

/**
 * Calcula las nuevas fechas de las sesiones pendientes posteriores a la que
 * acaba de completarse.
 *
 * @param {object} input
 * @param {string} input.scheduledDate   Fecha original de la sesión completada.
 * @param {string} input.completedDate   Fecha real en que se completó.
 * @param {Array<{id: string, scheduled_date: string}>} input.pendingSessions
 *        Sesiones del mismo plan aún sin completar ni saltar.
 * @returns {Array<{id: string, scheduled_date: string}>} Sólo las que cambian.
 */
export function rescheduleAfterCompletion({ scheduledDate, completedDate, pendingSessions = [] }) {
  if (!isISODate(scheduledDate) || !isISODate(completedDate)) return [];

  const delay = daysBetween(scheduledDate, completedDate);
  if (delay <= 0) return [];

  return pendingSessions
    .filter(s => isISODate(s?.scheduled_date) && s.scheduled_date > scheduledDate)
    .map(s => ({ id: s.id, scheduled_date: addDays(s.scheduled_date, delay) }));
}
