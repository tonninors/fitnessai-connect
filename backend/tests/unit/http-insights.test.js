import { describe, it, expect, vi } from 'vitest';
import { HttpError, asyncHandler, fromSupabaseError, throwOnSupabaseError, notFound } from '../../lib/http.js';
import {
  buildInsightPrompt,
  toDbInsightType,
  INSIGHT_TYPES,
  DEFAULT_INSIGHT_TYPE,
} from '../../lib/insights.js';

describe('HttpError', () => {
  it('guarda status y mensaje', () => {
    const err = new HttpError(403, 'Sin acceso');
    expect(err.status).toBe(403);
    expect(err.message).toBe('Sin acceso');
    expect(err).toBeInstanceOf(Error);
  });

  it('los helpers producen el status esperado', () => {
    expect(notFound().status).toBe(404);
  });
});

describe('asyncHandler', () => {
  it('propaga el rechazo a next() en lugar de dejar un unhandled rejection', async () => {
    const next = vi.fn();
    const boom = new Error('boom');
    await asyncHandler(async () => { throw boom; })({}, {}, next);
    expect(next).toHaveBeenCalledWith(boom);
  });

  it('no llama a next si el handler resuelve', async () => {
    const next = vi.fn();
    await asyncHandler(async (_req, res) => res.ok())({}, { ok: () => true }, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('funciona con handlers síncronos', async () => {
    const next = vi.fn();
    await asyncHandler(() => 'listo')({}, {}, next);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('fromSupabaseError', () => {
  it('devuelve null cuando no hay error', () => {
    expect(fromSupabaseError(null)).toBeNull();
  });

  it('convierte PGRST116 (sin filas) en 404', () => {
    const err = fromSupabaseError({ code: 'PGRST116', message: 'no rows' }, { notFoundMessage: 'Sesión no encontrada' });
    expect(err.status).toBe(404);
    expect(err.message).toBe('Sesión no encontrada');
  });

  it('convierte el resto en 400 conservando el mensaje', () => {
    expect(fromSupabaseError({ message: 'violación de constraint' }).status).toBe(400);
  });

  it('throwOnSupabaseError sólo lanza si hay error', () => {
    expect(() => throwOnSupabaseError(null)).not.toThrow();
    expect(() => throwOnSupabaseError({ message: 'x' })).toThrow(HttpError);
  });
});

describe('toDbInsightType', () => {
  it('mapea los tipos que no existen en el CHECK de la base de datos', () => {
    // Regresión: `workout_ready` y `live_feedback` violaban el CHECK y el
    // INSERT fire-and-forget fallaba en silencio.
    expect(toDbInsightType('workout_ready')).toBe('general');
    expect(toDbInsightType('live_feedback')).toBe('hr_zone');
  });

  it('conserva los tipos que sí existen', () => {
    expect(toDbInsightType('recovery')).toBe('recovery');
    expect(toDbInsightType('volume_adjustment')).toBe('volume_adjustment');
    expect(toDbInsightType('strength_progression')).toBe('strength_progression');
  });

  it('cae a general ante un tipo desconocido', () => {
    expect(toDbInsightType('inventado')).toBe('general');
    expect(toDbInsightType(undefined)).toBe('general');
  });

  it('todos los tipos soportados mapean a un valor válido del CHECK', () => {
    const allowedByDb = ['recovery', 'volume_adjustment', 'strength_progression', 'hr_zone', 'form_tip', 'general'];
    for (const type of INSIGHT_TYPES) {
      expect(allowedByDb).toContain(toDbInsightType(type));
    }
  });
});

describe('buildInsightPrompt', () => {
  const profile = { full_name: 'Carlos Mendoza', current_streak: 7 };

  it('incluye nombre y racha en el prompt de recuperación', () => {
    const prompt = buildInsightPrompt('recovery', { hrv: 62 }, profile);
    expect(prompt).toContain('Carlos Mendoza');
    expect(prompt).toContain('7 días');
    expect(prompt).toContain('62');
  });

  it('usa el prompt por defecto ante un tipo desconocido', () => {
    expect(buildInsightPrompt('inventado', {}, profile))
      .toBe(buildInsightPrompt(DEFAULT_INSIGHT_TYPE, {}, profile));
  });

  it('funciona sin perfil cargado', () => {
    expect(buildInsightPrompt('recovery', {}, null)).toContain('El usuario');
  });

  it('trunca contextos enormes para no inflar el prompt', () => {
    const huge = { notas: 'x'.repeat(5000) };
    expect(buildInsightPrompt('workout_ready', huge, profile).length).toBeLessThan(2000);
  });

  it('sobrevive a un contexto con referencias circulares', () => {
    const circular = {};
    circular.self = circular;
    expect(() => buildInsightPrompt('workout_ready', circular, profile)).not.toThrow();
  });
});
