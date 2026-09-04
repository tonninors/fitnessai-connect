import { describe, it, expect } from 'vitest';
import {
  buildWeeklyChart,
  summarizeSessions,
  weeksForPeriod,
  ringPercent,
} from '../../lib/progress.js';

const NOW = Date.parse('2026-08-18T12:00:00Z');
const DAY = 24 * 60 * 60 * 1000;

describe('weeksForPeriod', () => {
  it('mapea cada periodo a su número de semanas', () => {
    expect(weeksForPeriod('4w')).toBe(4);
    expect(weeksForPeriod('3m')).toBe(12);
    expect(weeksForPeriod('1y')).toBe(52);
  });

  it('cae a 4 semanas ante un periodo desconocido', () => {
    expect(weeksForPeriod('abc')).toBe(4);
    expect(weeksForPeriod(undefined)).toBe(4);
  });
});

describe('buildWeeklyChart', () => {
  it('devuelve tantos cubos como semanas pedidas y en orden', () => {
    const chart = buildWeeklyChart([], 4, NOW);
    expect(chart).toHaveLength(4);
    expect(chart.map(c => c.label)).toEqual(['S1', 'S2', 'S3', 'S4']);
    expect(chart.every(c => c.val === 0)).toBe(true);
  });

  it('asigna la sesión de hoy a la última semana', () => {
    const chart = buildWeeklyChart(
      [{ completed_at: new Date(NOW - DAY).toISOString(), actual_duration: 45 }],
      4,
      NOW,
    );
    expect(chart.at(-1)).toEqual({ label: 'S4', val: 45 });
    expect(chart.slice(0, 3).every(c => c.val === 0)).toBe(true);
  });

  it('suma varias sesiones dentro del mismo cubo', () => {
    const chart = buildWeeklyChart([
      { completed_at: new Date(NOW - DAY).toISOString(), actual_duration: 45 },
      { completed_at: new Date(NOW - 2 * DAY).toISOString(), actual_duration: 30 },
    ], 4, NOW);
    expect(chart.at(-1).val).toBe(75);
  });

  it('reparte sesiones en semanas distintas', () => {
    const chart = buildWeeklyChart([
      { completed_at: new Date(NOW - 2 * DAY).toISOString(), actual_duration: 60 },
      { completed_at: new Date(NOW - 9 * DAY).toISOString(), actual_duration: 20 },
    ], 4, NOW);
    expect(chart.at(-1).val).toBe(60);
    expect(chart.at(-2).val).toBe(20);
  });

  it('ignora sesiones fuera del rango y fechas inválidas', () => {
    const chart = buildWeeklyChart([
      { completed_at: new Date(NOW - 100 * DAY).toISOString(), actual_duration: 90 },
      { completed_at: null, actual_duration: 90 },
      { completed_at: 'sin-fecha', actual_duration: 90 },
    ], 4, NOW);
    expect(chart.every(c => c.val === 0)).toBe(true);
  });

  it('trata la duración ausente como cero', () => {
    const chart = buildWeeklyChart(
      [{ completed_at: new Date(NOW - DAY).toISOString(), actual_duration: null }],
      4,
      NOW,
    );
    expect(chart.at(-1).val).toBe(0);
  });

  it('tolera entradas no-array o semanas inválidas', () => {
    expect(buildWeeklyChart(null, 4, NOW)).toHaveLength(4);
    expect(buildWeeklyChart([], 0, NOW)).toHaveLength(4);
    expect(buildWeeklyChart([], -3, NOW)).toHaveLength(4);
  });
});

describe('summarizeSessions', () => {
  it('agrega calorías, minutos y horas', () => {
    const totals = summarizeSessions([
      { actual_calories: 300, actual_duration: 45 },
      { actual_calories: 250, actual_duration: 50 },
    ]);
    expect(totals).toEqual({
      total_workouts: 2,
      total_calories: 550,
      total_minutes: 95,
      total_hours: 2,
    });
  });

  it('devuelve ceros con lista vacía o inválida', () => {
    expect(summarizeSessions([]).total_workouts).toBe(0);
    expect(summarizeSessions(undefined).total_calories).toBe(0);
  });

  it('ignora valores nulos en las sesiones', () => {
    const totals = summarizeSessions([{ actual_calories: null, actual_duration: undefined }]);
    expect(totals.total_calories).toBe(0);
    expect(totals.total_minutes).toBe(0);
  });
});

describe('ringPercent', () => {
  it('calcula el porcentaje respecto al objetivo', () => {
    expect(ringPercent(15, 30)).toBe(50);
    expect(ringPercent(30, 30)).toBe(100);
  });

  it('satura en 100 y nunca baja de 0', () => {
    expect(ringPercent(90, 30)).toBe(100);
    expect(ringPercent(-10, 30)).toBe(0);
  });

  it('devuelve 0 con objetivo inválido', () => {
    expect(ringPercent(10, 0)).toBe(0);
    expect(ringPercent(10, null)).toBe(0);
  });
});
