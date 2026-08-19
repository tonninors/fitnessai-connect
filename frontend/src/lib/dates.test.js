import { describe, it, expect } from 'vitest';
import {
  isISODate,
  parseISODate,
  toISODate,
  todayISO,
  addDays,
  dayOfWeek,
  weekDays,
  formatDate,
  weekdayShort,
  formatClock,
  formatHour,
  timeAgo,
} from './dates.js';

describe('parseISODate', () => {
  it('interpreta la fecha en hora local, no en UTC', () => {
    // Regresión: `new Date('2026-08-18')` es medianoche UTC; en México eso es
    // el 17 por la tarde, así que getDay() devolvía el día anterior.
    const date = parseISODate('2026-08-18');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(7);
    expect(date.getDate()).toBe(18);
  });

  it('devuelve null ante entradas inválidas', () => {
    expect(parseISODate('18/08/2026')).toBeNull();
    expect(parseISODate(null)).toBeNull();
    expect(parseISODate(undefined)).toBeNull();
  });
});

describe('isISODate', () => {
  it('distingue el formato ISO', () => {
    expect(isISODate('2026-08-18')).toBe(true);
    expect(isISODate('2026-8-18')).toBe(false);
    expect(isISODate(20260818)).toBe(false);
  });
});

describe('toISODate / todayISO', () => {
  it('formatea un Date local sin desplazamiento', () => {
    expect(toISODate(new Date(2026, 7, 18, 23, 30))).toBe('2026-08-18');
    expect(toISODate(new Date(2026, 0, 5, 0, 5))).toBe('2026-01-05');
  });

  it('todayISO devuelve el día del dispositivo', () => {
    const now = new Date(2026, 7, 18, 22, 0);
    expect(todayISO(now)).toBe('2026-08-18');
  });
});

describe('addDays', () => {
  it('suma y resta cruzando meses y años', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('devuelve la entrada si no es una fecha válida', () => {
    expect(addDays('mañana', 1)).toBe('mañana');
  });
});

describe('dayOfWeek / weekDays', () => {
  it('devuelve el día correcto de la semana', () => {
    expect(dayOfWeek('2026-08-17')).toBe(1); // lunes
    expect(dayOfWeek('2026-08-23')).toBe(0); // domingo
  });

  it('construye la semana lunes→domingo', () => {
    const days = weekDays('2026-08-18');
    expect(days).toHaveLength(7);
    expect(days[0]).toBe('2026-08-17');
    expect(days[6]).toBe('2026-08-23');
  });

  it('el domingo cierra su propia semana, no abre la siguiente', () => {
    expect(weekDays('2026-08-23')[0]).toBe('2026-08-17');
  });

  it('devuelve [] ante una fecha inválida', () => {
    expect(weekDays('no-fecha')).toEqual([]);
  });
});

describe('formatDate / weekdayShort', () => {
  it('formatea la fecha en español', () => {
    const formatted = formatDate('2026-08-18');
    expect(formatted).toMatch(/18/);
    expect(formatted.toLowerCase()).toMatch(/ago/);
  });

  it('el día de la semana coincide con la fecha real', () => {
    // 2026-08-18 fue martes.
    expect(weekdayShort('2026-08-18')).toBe('Mar');
    expect(weekdayShort('2026-08-17')).toBe('Lun');
  });

  it('devuelve cadena vacía si la fecha no es válida', () => {
    expect(formatDate(null)).toBe('');
    expect(weekdayShort('x')).toBe('');
  });
});

describe('formatClock / formatHour', () => {
  it('formatea en 24 h', () => {
    expect(formatClock(new Date(2026, 7, 18, 9, 5))).toMatch(/^09:05$/);
    expect(formatHour('2026-08-18T21:07:00')).toMatch(/^21:07$/);
  });

  it('devuelve cadena vacía con un timestamp inválido', () => {
    expect(formatHour('no-es-fecha')).toBe('');
  });
});

describe('timeAgo', () => {
  const now = Date.parse('2026-08-18T12:00:00Z');

  it('resume el tiempo transcurrido', () => {
    expect(timeAgo('2026-08-18T11:59:40Z', { now })).toBe('ahora');
    expect(timeAgo('2026-08-18T11:45:00Z', { now })).toBe('15 min');
    expect(timeAgo('2026-08-18T09:00:00Z', { now })).toBe('3h');
    expect(timeAgo('2026-08-15T12:00:00Z', { now })).toBe('3d');
  });

  it('devuelve la etiqueta vacía si no hay timestamp', () => {
    expect(timeAgo(null, { now })).toBe('Sin actividad');
    expect(timeAgo(undefined, { now, emptyLabel: '—' })).toBe('—');
    expect(timeAgo('basura', { now })).toBe('Sin actividad');
  });
});
