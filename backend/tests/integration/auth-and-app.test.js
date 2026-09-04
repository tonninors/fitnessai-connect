import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createTestApp, authHeader, VALID_TOKEN } from '../helpers/test-app.js';
import { allowedOrigins } from '../../app.js';

let ctx;
afterEach(() => ctx?.restore());

describe('infraestructura de la app', () => {
  it('/health responde sin autenticación', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('devuelve 404 JSON en rutas desconocidas', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Ruta no encontrada');
  });

  it('no expone la cabecera x-powered-by', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('rechaza JSON malformado con 400 en lugar de caerse', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app)
      .post('/api/auth/check-email')
      .set('Content-Type', 'application/json')
      .send('{"email":');
    expect(res.status).toBe(400);
  });
});

describe('CORS', () => {
  it('usa la lista de FRONTEND_URL y admite varios orígenes', () => {
    expect(allowedOrigins({ FRONTEND_URL: 'https://app.com, https://admin.com' }))
      .toEqual(['https://app.com', 'https://admin.com']);
  });

  it('en desarrollo permite localhost por defecto', () => {
    expect(allowedOrigins({ NODE_ENV: 'development' })).toContain('http://localhost:5173');
  });

  it('en producción sin configuración no permite ningún origen (nunca "*")', () => {
    // Regresión: `origin: '*'` junto a `credentials: true` es inválido y abría
    // la API a cualquier sitio.
    expect(allowedOrigins({ NODE_ENV: 'production' })).toEqual([]);
  });

  it('no refleja un origen no autorizado', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).get('/health').set('Origin', 'https://malicioso.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('requireAuth', () => {
  it('rechaza peticiones sin token', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).get('/api/profile');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token requerido');
  });

  it('rechaza un esquema distinto de Bearer', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).get('/api/profile').set('Authorization', `Basic ${VALID_TOKEN}`);
    expect(res.status).toBe(401);
  });

  it('rechaza un token inválido', async () => {
    ctx = createTestApp();
    const res = await request(ctx.app).get('/api/profile').set('Authorization', 'Bearer caducado');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token inválido o expirado');
  });

  it('acepta un token válido', async () => {
    ctx = createTestApp({
      resolver: q => (q.table === 'profiles' ? { data: { id: 'u1', full_name: 'Carlos' } } : { data: [] }),
    });
    const res = await request(ctx.app).get('/api/profile').set(authHeader);
    expect(res.status).toBe(200);
  });
});

describe('POST /api/auth/check-email', () => {
  function withUsers(pages) {
    const c = createTestApp();
    c.supabase.auth.admin.listUsers = async ({ page }) => ({ data: { users: pages[page - 1] ?? [] }, error: null });
    return c;
  }

  it('devuelve exists=true si el correo está registrado', async () => {
    ctx = withUsers([[{ email: 'Carlos@Example.com' }]]);
    const res = await request(ctx.app).post('/api/auth/check-email').send({ email: 'carlos@example.com' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ exists: true });
  });

  it('compara ignorando mayúsculas', async () => {
    ctx = withUsers([[{ email: 'ana@example.com' }]]);
    const res = await request(ctx.app).post('/api/auth/check-email').send({ email: '  ANA@Example.com ' });
    expect(res.body).toEqual({ exists: true });
  });

  it('devuelve exists=false si no está', async () => {
    ctx = withUsers([[{ email: 'otro@example.com' }]]);
    const res = await request(ctx.app).post('/api/auth/check-email').send({ email: 'carlos@example.com' });
    expect(res.body).toEqual({ exists: false });
  });

  it('busca más allá de la primera página de 1000 usuarios', async () => {
    // Regresión: sólo se miraba la primera página, así que a partir del usuario
    // 1001 el login decía "este correo no está registrado".
    const firstPage = Array.from({ length: 1000 }, (_, i) => ({ email: `user${i}@example.com` }));
    ctx = withUsers([firstPage, [{ email: 'carlos@example.com' }]]);
    const res = await request(ctx.app).post('/api/auth/check-email').send({ email: 'carlos@example.com' });
    expect(res.body).toEqual({ exists: true });
  });

  it('valida el email de entrada', async () => {
    ctx = createTestApp();
    const sinEmail = await request(ctx.app).post('/api/auth/check-email').send({});
    expect(sinEmail.status).toBe(400);

    const malFormado = await request(ctx.app).post('/api/auth/check-email').send({ email: 'no-es-email' });
    expect(malFormado.status).toBe(400);
  });
});
