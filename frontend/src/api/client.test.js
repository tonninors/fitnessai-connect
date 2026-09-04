import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSession = vi.fn();
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ auth: { getSession } }),
}));

const { api } = await import('./client.js');

function jsonResponse(body, { status = 200, ok = true, statusText = 'OK' } = {}) {
  return {
    ok,
    status,
    statusText,
    json: async () => body,
  };
}

beforeEach(() => {
  getSession.mockResolvedValue({ data: { session: { access_token: 'jwt-123' } } });
  global.fetch = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
});

describe('api — cabeceras', () => {
  it('adjunta el token de la sesión en cada petición', async () => {
    await api.get('/home');
    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/home$/);
    expect(init.headers.Authorization).toBe('Bearer jwt-123');
  });

  it('pide una sesión fresca en cada llamada (el token caduca)', async () => {
    await api.get('/home');
    await api.get('/profile');
    expect(getSession).toHaveBeenCalledTimes(2);
  });

  it('funciona sin sesión (endpoints públicos)', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    await api.post('/auth/check-email', { email: 'a@b.com' });
    const [, init] = global.fetch.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });
});

describe('api — verbos y cuerpo', () => {
  it('serializa el cuerpo en POST y PATCH', async () => {
    await api.post('/ai/insight', { type: 'recovery' });
    expect(global.fetch.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: JSON.stringify({ type: 'recovery' }),
    });

    await api.patch('/profile', { full_name: 'Ana' });
    expect(global.fetch.mock.calls[1][1].method).toBe('PATCH');
  });

  it('POST sin cuerpo envía un objeto vacío', async () => {
    await api.post('/workouts/sessions/1/start');
    expect(global.fetch.mock.calls[0][1].body).toBe('{}');
  });

  it('GET y DELETE no llevan cuerpo', async () => {
    await api.get('/home');
    expect(global.fetch.mock.calls[0][1].body).toBeUndefined();

    await api.delete('/profile/wearables/garmin');
    expect(global.fetch.mock.calls[1][1]).toMatchObject({ method: 'DELETE', body: undefined });
  });
});

describe('api — errores', () => {
  it('propaga el mensaje del backend y el status', async () => {
    global.fetch.mockResolvedValue(jsonResponse({ error: 'Sin acceso a esta sesión' }, { ok: false, status: 403 }));
    await expect(api.get('/workouts/plan')).rejects.toMatchObject({
      message: 'Sin acceso a esta sesión',
      status: 403,
    });
  });

  it('no revienta si la respuesta de error no es JSON', async () => {
    // Un 502 de un proxy suele devolver HTML.
    global.fetch.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: async () => { throw new SyntaxError('Unexpected token <'); },
    });
    await expect(api.get('/home')).rejects.toThrow('Bad Gateway');
  });

  it('traduce un fallo de red a un mensaje en español', async () => {
    global.fetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(api.get('/home')).rejects.toThrow('No se pudo conectar con el servidor.');
  });

  it('traduce un timeout a un mensaje accionable', async () => {
    const timeout = new Error('timed out');
    timeout.name = 'TimeoutError';
    global.fetch.mockRejectedValue(timeout);
    await expect(api.get('/home')).rejects.toThrow(/tardó demasiado/);
  });
});

describe('api — respuestas', () => {
  it('devuelve el JSON del backend', async () => {
    global.fetch.mockResolvedValue(jsonResponse({ streak: 5 }));
    await expect(api.get('/progress/stats')).resolves.toEqual({ streak: 5 });
  });

  it('devuelve null ante un 204 sin cuerpo', async () => {
    global.fetch.mockResolvedValue({ ok: true, status: 204, json: async () => { throw new Error('no body'); } });
    await expect(api.delete('/profile/wearables/garmin')).resolves.toBeNull();
  });
});
