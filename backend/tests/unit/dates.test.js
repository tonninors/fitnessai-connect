import { describe, it, expect, afterEach } from 'vitest';
import {
  todayISO,
  formatInTimeZone,
  isISODate,
  parseISODate,
  addDays,
  dayOfWeek,
  getWeekRange,
  weekDays,
  greetingFor,
  currentHour,
} from '../../lib/dates.js';

const ORIGINAL_TZ = process.env.APP_TIMEZONE;

afterEach(() => {
  process.env.APP_TIMEZONE = ORIGINAL_TZ;
});

describe('isISODate', () => {
  it('acepta fechas ISO válidas', () => {
    expect(isISODate('2026-08-18')).toBe(true);
  });

  it('rechaza formatos y valores inválidos', () => {
    expect(isISODate('18-08-2026')).toBe(false);
    expect(isISODate('2026-13-01')).toBe(false);
    expect(isISODate('')).toBe(false);
    expect(isISODate(null)).toBe(false);
    expect(isISODate(20260818)).toBe(false);
  });
});

describe('parseISODate', () => {
  it('interpreta la fecha en UTC, no en la zona local', () => {
    // Regresión: `new Date('2026-08-18')` seguido de getDay() local devuelve el
    // día anterior en husos negativos (América). Aquí siempre es el 18.
    expect(parseISODate('2026-08-18').getUTCDate()).toBe(18);
  });

  it('lanza ante una fecha inválida', () => {
    expect(() => parseISODate('no-es-fecha')).toThrow(TypeError);
  });
});

describe('addDays', () => {
  it('suma y resta días', () => {
    expect(addDays('2026-08-18', 1)).toBe('2026-08-19');
    expect(addDays('2026-08-18', -1)).toBe('2026-08-17');
  });

  it('cruza fin de mes y de año', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('respeta los años bisiestos', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
  });
});

describe('dayOfWeek / getWeekRange / weekDays', () => {
  it('devuelve el día de la semana correcto', () => {
    expect(dayOfWeek('2026-08-17')).toBe(1); // lunes
    expect(dayOfWeek('2026-08-23')).toBe(0); // domingo
  });

  it('calcula la semana lunes→domingo desde cualquier día', () => {
    expect(getWeekRange('2026-08-18')).toEqual({ monday: '2026-08-17', sunday: '2026-08-23' });
    expect(getWeekRange('2026-08-17')).toEqual({ monday: '2026-08-17', sunday: '2026-08-23' });
  });

  it('el domingo pertenece a la semana que empieza el lunes anterior', () => {
    expect(getWeekRange('2026-08-23')).toEqual({ monday: '2026-08-17', sunday: '2026-08-23' });
  });

  it('devuelve exactamente 7 días consecutivos', () => {
    const days = weekDays('2026-08-20');
    expect(days).toHaveLength(7);
    expect(days[0]).toBe('2026-08-17');
    expect(days[6]).toBe('2026-08-23');
  });
});

describe('todayISO / formatInTimeZone', () => {
  it('formatea en la zona indicada', () => {
    // 2026-08-19T02:30Z es todavía 18 de agosto en Ciudad de México.
    const instant = new Date('2026-08-19T02:30:00Z');
    expect(formatInTimeZone(instant, 'UTC')).toBe('2026-08-19');
    expect(formatInTimeZone(instant, 'America/Mexico_City')).toBe('2026-08-18');
  });

  it('todayISO usa APP_TIMEZONE', () => {
    process.env.APP_TIMEZONE = 'America/Mexico_City';
    expect(todayISO(new Date('2026-08-19T02:30:00Z'))).toBe('2026-08-18');
    process.env.APP_TIMEZONE = 'UTC';
    expect(todayISO(new Date('2026-08-19T02:30:00Z'))).toBe('2026-08-19');
  });
});

describe('currentHour / greetingFor', () => {
  it('saluda según la franja horaria', () => {
    expect(greetingFor(0)).toBe('Buenos días');
    expect(greetingFor(11)).toBe('Buenos días');
    expect(greetingFor(12)).toBe('Buenas tardes');
    expect(greetingFor(17)).toBe('Buenas tardes');
    expect(greetingFor(18)).toBe('Buenas noches');
    expect(greetingFor(23)).toBe('Buenas noches');
  });

  it('convierte medianoche a 0 y no a 24', () => {
    expect(currentHour(new Date('2026-08-18T00:15:00Z'), 'UTC')).toBe(0);
  });
});
