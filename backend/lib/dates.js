/**
 * Utilidades de fecha.
 *
 * Todas las operaciones trabajan sobre strings `YYYY-MM-DD` y usan aritmética
 * en UTC internamente para que el resultado sea determinista e independiente
 * del huso horario del proceso (Railway/Vercel corren en UTC, la máquina de
 * desarrollo normalmente no).
 *
 * `APP_TIMEZONE` controla qué se considera "hoy". Por defecto `UTC`, que es el
 * comportamiento histórico del proyecto. En producción conviene fijarlo a la
 * zona del mercado objetivo (p. ej. `America/Mexico_City`) para que un usuario
 * que entrena a las 19:00 no vea la sesión del día siguiente.
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function appTimeZone() {
  return process.env.APP_TIMEZONE || 'UTC';
}

/** Fecha actual como `YYYY-MM-DD` en la zona horaria de la aplicación. */
export function todayISO(now = new Date(), timeZone = appTimeZone()) {
  return formatInTimeZone(now, timeZone);
}

/** Formatea un `Date` como `YYYY-MM-DD` en la zona indicada. */
export function formatInTimeZone(date, timeZone = appTimeZone()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const get = type => parts.find(p => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function isISODate(value) {
  return typeof value === 'string' && ISO_DATE_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** Convierte `YYYY-MM-DD` a un `Date` en UTC (mediodía, para evitar bordes DST). */
export function parseISODate(dateStr) {
  if (!isISODate(dateStr)) throw new TypeError(`Fecha ISO inválida: ${dateStr}`);
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Suma (o resta) días a una fecha `YYYY-MM-DD` y devuelve `YYYY-MM-DD`. */
export function addDays(dateStr, days) {
  const date = parseISODate(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Día de la semana (0=domingo … 6=sábado) de una fecha `YYYY-MM-DD`. */
export function dayOfWeek(dateStr) {
  return parseISODate(dateStr).getUTCDay();
}

/** Rango lunes→domingo que contiene a `dateStr`. */
export function getWeekRange(dateStr) {
  const dow = dayOfWeek(dateStr);
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = addDays(dateStr, diffToMonday);
  return { monday, sunday: addDays(monday, 6) };
}

/** Los 7 días (lunes→domingo) de la semana que contiene a `dateStr`. */
export function weekDays(dateStr) {
  const { monday } = getWeekRange(dateStr);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Saludo según la hora local del usuario/servidor. */
export function greetingFor(hour) {
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

/** Hora (0-23) en la zona horaria de la aplicación. */
export function currentHour(now = new Date(), timeZone = appTimeZone()) {
  const hour = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', hour12: false }).format(now);
  return Number(hour) % 24;
}
