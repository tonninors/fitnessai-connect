import { describe, it, expect } from 'vitest';
import { computeStreak, levelForStreak, levelNameForLevel, LEVEL_NAMES } from '../../lib/streak.js';

describe('levelForStreak', () => {
  it('sube un nivel cada 10 días', () => {
    expect(levelForStreak(0)).toBe(1);
    expect(levelForStreak(9)).toBe(1);
    expect(levelForStreak(10)).toBe(2);
    expect(levelForStreak(29)).toBe(3);
    expect(levelForStreak(40)).toBe(5);
  });

  it('tolera valores inválidos', () => {
    expect(levelForStreak(undefined)).toBe(1);
    expect(levelForStreak(-5)).toBe(1);
    expect(levelForStreak(NaN)).toBe(1);
  });
});

describe('levelNameForLevel', () => {
  it('mapea cada nivel a su nombre', () => {
    expect(levelNameForLevel(1)).toBe('Principiante');
    expect(levelNameForLevel(3)).toBe('Atleta');
  });

  it('satura en el último nombre disponible', () => {
    expect(levelNameForLevel(99)).toBe(LEVEL_NAMES.at(-1));
    expect(levelNameForLevel(0)).toBe('Principiante');
  });
});

describe('computeStreak', () => {
  it('incrementa la racha si ayer también entrenó', () => {
    const result = computeStreak({ currentStreak: 4, longestStreak: 9, completedYesterday: true });
    expect(result.current_streak).toBe(5);
    expect(result.longest_streak).toBe(9);
    expect(result.level).toBe(1);
    expect(result.level_name).toBe('Principiante');
  });

  it('reinicia a 1 si ayer no entrenó', () => {
    const result = computeStreak({ currentStreak: 12, longestStreak: 12, completedYesterday: false });
    expect(result.current_streak).toBe(1);
    // El récord histórico se conserva.
    expect(result.longest_streak).toBe(12);
  });

  it('actualiza el récord cuando se supera', () => {
    const result = computeStreak({ currentStreak: 9, longestStreak: 9, completedYesterday: true });
    expect(result.current_streak).toBe(10);
    expect(result.longest_streak).toBe(10);
    expect(result.level).toBe(2);
    expect(result.level_name).toBe('En forma');
  });

  it('no suma dos veces si hoy ya se completó otra sesión', () => {
    // Regresión: entrenar dos veces el mismo día sumaba dos días de racha.
    const result = computeStreak({
      currentStreak: 5,
      longestStreak: 8,
      completedYesterday: true,
      alreadyCountedToday: true,
    });
    expect(result.current_streak).toBe(5);
    expect(result.longest_streak).toBe(8);
  });

  it('deja la racha en 1 como mínimo si ya se contó hoy y venía en 0', () => {
    const result = computeStreak({ currentStreak: 0, alreadyCountedToday: true });
    expect(result.current_streak).toBe(1);
  });

  it('funciona sin argumentos (usuario nuevo)', () => {
    expect(computeStreak()).toEqual({
      current_streak: 1,
      longest_streak: 1,
      level: 1,
      level_name: 'Principiante',
    });
  });

  it('normaliza valores corruptos del perfil', () => {
    const result = computeStreak({ currentStreak: null, longestStreak: undefined, completedYesterday: true });
    expect(result.current_streak).toBe(1);
    expect(result.longest_streak).toBe(1);
  });
});
