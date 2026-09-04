/**
 * Utilidades de fecha del cliente.
 *
 * Regla: las fechas `YYYY-MM-DD` que llegan del backend NUNCA se pasan a
 * `new Date(str)` directamente. Ese constructor las interpreta como medianoche
 * UTC y, en husos negativos (todo LATAM), `getDay()` devuelve el día anterior:
 * el día de la semana y el resaltado de "hoy" salían desplazados.
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const WEEKDAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export const WEEKDAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function isISODate(value) {
  return typeof value === 'string' && ISO_DATE_RE.test(value);
}

/** `Date` local a partir de `YYYY-MM-DD` (medianoche en la zona del usuario). */
export function parseISODate(dateStr) {
  if (!isISODate(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Formatea un `Date` local como `YYYY-MM-DD`. */
export function toISODate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Fecha de hoy en la zona horaria del dispositivo. */
export function todayISO(now = new Date()) {
  return toISODate(now);
}

/** Suma días a una fecha `YYYY-MM-DD` sin salirse de la zona local. */
export function addDays(dateStr, days) {
  const date = parseISODate(dateStr);
  if (!date) return dateStr;
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Día de la semana (0=domingo) de una fecha `YYYY-MM-DD`. */
export function dayOfWeek(dateStr) {
  return parseISODate(dateStr)?.getDay() ?? null;
}

/** Los 7 días (lunes→domingo) de la semana que contiene a `dateStr`. */
export function weekDays(dateStr) {
  const dow = dayOfWeek(dateStr);
  if (dow === null) return [];
  const monday = addDays(dateStr, dow === 0 ? -6 : 1 - dow);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** "lun, 18 ago" / "lunes, 18 de agosto" según el formato pedido. */
export function formatDate(dateStr, options = { weekday: 'long', day: 'numeric', month: 'short' }) {
  const date = parseISODate(dateStr);
  if (!date) return '';
  return date.toLocaleDateString('es-MX', options);
}

/** Abreviatura del día ("Lun", "Mar"…) de una fecha `YYYY-MM-DD`. */
export function weekdayShort(dateStr) {
  const dow = dayOfWeek(dateStr);
  return dow === null ? '' : WEEKDAY_SHORT[dow];
}

/** Hora del dispositivo en formato 24h, para la barra de estado. */
export function formatClock(now = new Date()) {
  return now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Hora corta de un timestamp ISO, para los mensajes del chat. */
export function formatHour(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** "ahora" / "12 min" / "3h" / "2d" a partir de un timestamp. */
export function timeAgo(timestamp, { now = Date.now(), emptyLabel = 'Sin actividad' } = {}) {
  if (!timestamp) return emptyLabel;
  const parsed = new Date(timestamp).getTime();
  if (Number.isNaN(parsed)) return emptyLabel;

  const minutes = Math.floor((now - parsed) / 60000);
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}
