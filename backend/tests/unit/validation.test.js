import { describe, it, expect } from 'vitest';
import {
  isUuid,
  requireUuid,
  optionalInt,
  optionalNumber,
  optionalEnum,
  requireEnum,
  optionalText,
  requireEmail,
  pickAllowed,
} from '../../lib/validation.js';

const UUID = '11111111-1111-4111-8111-111111111111';

describe('isUuid / requireUuid', () => {
  it('acepta un UUID v4', () => {
    expect(isUuid(UUID)).toBe(true);
    expect(requireUuid(UUID, 'id')).toBe(UUID);
  });

  it('rechaza cadenas que no son UUID', () => {
    expect(isUuid('123')).toBe(false);
    expect(isUuid(null)).toBe(false);
    expect(() => requireUuid('../../etc/passwd', 'sessionId')).toThrow(/sessionId inválido/);
  });
});

describe('optionalInt', () => {
  it('convierte y valida enteros', () => {
    expect(optionalInt('30', 'days', { min: 1, max: 365 })).toBe(30);
  });

  it('devuelve el fallback ante valores ausentes', () => {
    expect(optionalInt(undefined, 'days', { fallback: 30 })).toBe(30);
    expect(optionalInt(null, 'days', { fallback: 30 })).toBe(30);
    expect(optionalInt('', 'days', { fallback: 30 })).toBe(30);
  });

  it('rechaza texto no numérico', () => {
    // Regresión: `Number('abc')` daba NaN y reventaba `new Date(NaN).toISOString()`.
    expect(() => optionalInt('abc', 'days')).toThrow(/days debe ser un número entero/);
  });

  it('rechaza decimales y valores fuera de rango', () => {
    expect(() => optionalInt('1.5', 'days')).toThrow(/entero/);
    expect(() => optionalInt(0, 'days', { min: 1 })).toThrow(/>= 1/);
    expect(() => optionalInt(1000, 'days', { max: 365 })).toThrow(/<= 365/);
  });

  it('los errores llevan status 400', () => {
    expect(() => optionalInt('abc', 'days')).toThrow(expect.objectContaining({ status: 400 }));
  });
});

describe('optionalNumber', () => {
  it('acepta decimales dentro de rango', () => {
    expect(optionalNumber('72.5', 'peso', { min: 20, max: 400 })).toBe(72.5);
  });

  it('rechaza valores no numéricos o fuera de rango', () => {
    expect(() => optionalNumber('pesado', 'peso')).toThrow(/número/);
    expect(() => optionalNumber(5, 'peso', { min: 20 })).toThrow(/>= 20/);
  });
});

describe('optionalEnum / requireEnum', () => {
  const allowed = ['manual', 'garmin'];

  it('acepta valores permitidos', () => {
    expect(optionalEnum('garmin', 'source', allowed)).toBe('garmin');
    expect(requireEnum('manual', 'source', allowed)).toBe('manual');
  });

  it('usa el fallback si no viene valor', () => {
    expect(optionalEnum(undefined, 'source', allowed, { fallback: 'manual' })).toBe('manual');
  });

  it('rechaza valores fuera del conjunto', () => {
    expect(() => optionalEnum('strava', 'source', allowed)).toThrow(/source debe ser uno de/);
    expect(() => requireEnum(undefined, 'platform', allowed)).toThrow(/platform debe ser uno de/);
  });
});

describe('optionalText', () => {
  it('recorta espacios', () => {
    expect(optionalText('  Carlos  ', 'nombre')).toBe('Carlos');
  });

  it('convierte cadenas vacías en el fallback', () => {
    expect(optionalText('   ', 'nombre')).toBeNull();
    expect(optionalText(undefined, 'nombre', { fallback: 'anon' })).toBe('anon');
  });

  it('rechaza tipos no string y textos demasiado largos', () => {
    expect(() => optionalText(42, 'nombre')).toThrow(/debe ser texto/);
    expect(() => optionalText('x'.repeat(50), 'nombre', { maxLength: 10 })).toThrow(/supera los 10/);
  });
});

describe('requireEmail', () => {
  it('normaliza a minúsculas y recorta', () => {
    expect(requireEmail('  Carlos@Example.COM ')).toBe('carlos@example.com');
  });

  it('rechaza emails vacíos o mal formados', () => {
    expect(() => requireEmail('')).toThrow(/Email requerido/);
    expect(() => requireEmail(undefined)).toThrow(/Email requerido/);
    expect(() => requireEmail('sin-arroba')).toThrow(/Email inválido/);
    expect(() => requireEmail('a@b')).toThrow(/Email inválido/);
  });

  it('rechaza emails absurdamente largos', () => {
    expect(() => requireEmail(`${'a'.repeat(250)}@x.com`)).toThrow(/Email inválido/);
  });
});

describe('pickAllowed', () => {
  it('conserva sólo las claves de la whitelist', () => {
    const result = pickAllowed(
      { full_name: 'Ana', level: 99, current_streak: 1000 },
      ['full_name', 'goals'],
    );
    expect(result).toEqual({ full_name: 'Ana' });
  });

  it('descarta valores undefined', () => {
    expect(pickAllowed({ full_name: undefined }, ['full_name'])).toEqual({});
  });

  it('devuelve {} ante entradas inválidas', () => {
    expect(pickAllowed(null, ['a'])).toEqual({});
    expect(pickAllowed('texto', ['a'])).toEqual({});
  });
});
