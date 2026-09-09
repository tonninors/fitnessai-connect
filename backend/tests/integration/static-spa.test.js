import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { createApp, resolveFrontendDist } from '../../app.js';

/**
 * Build falso del frontend: con un `index.html` y un asset con hash alcanza
 * para ejercitar el modo "un solo servicio" sin depender de `vite build`.
 */
let distDir;

beforeAll(() => {
  distDir = mkdtempSync(path.join(tmpdir(), 'fitnessai-dist-'));
  writeFileSync(
    path.join(distDir, 'index.html'),
    '<!doctype html><html lang="es"><head><title>FitnessAI Connect</title></head>'
    + '<body><div id="root"></div></body></html>',
  );
  mkdirSync(path.join(distDir, 'assets'));
  writeFileSync(path.join(distDir, 'assets', 'index-a1b2c3.js'), 'console.log("bundle");');
});

afterAll(() => rmSync(distDir, { recursive: true, force: true }));

const appConDist = () => createApp({
  env: { ...process.env, NODE_ENV: 'production', FRONTEND_DIST: distDir },
});

describe('resolveFrontendDist', () => {
  it('devuelve null si la carpeta existe pero no tiene index.html', () => {
    expect(resolveFrontendDist({ FRONTEND_DIST: path.join(distDir, 'assets') })).toBeNull();
  });

  it('devuelve null si la carpeta no existe', () => {
    expect(resolveFrontendDist({ FRONTEND_DIST: path.join(distDir, 'no-existe') })).toBeNull();
  });

  it('bajo NODE_ENV=test ignora el dist del disco salvo que se pida explícitamente', () => {
    // Si no fuera así, un `vite build` viejo en la máquina del desarrollador
    // cambiaría el resultado del resto de la suite.
    expect(resolveFrontendDist({ NODE_ENV: 'test' })).toBeNull();
    expect(resolveFrontendDist({ NODE_ENV: 'test', FRONTEND_DIST: distDir }))
      .toBe(path.resolve(distDir));
  });
});

describe('SPA servida por el mismo Express', () => {
  it('sirve index.html en la raíz', async () => {
    const res = await request(appConDist()).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('FitnessAI Connect');
  });

  it('sirve index.html en rutas internas de la SPA (deep links)', async () => {
    const res = await request(appConDist()).get('/progreso');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<div id="root">');
  });

  it('no cachea index.html: tras un deploy pediría bundles que ya no existen', async () => {
    const res = await request(appConDist()).get('/');
    expect(res.headers['cache-control']).toBe('no-cache');
  });

  it('cachea de forma agresiva los assets con hash', async () => {
    const res = await request(appConDist()).get('/assets/index-a1b2c3.js');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toContain('max-age=31536000');
  });

  it('las rutas /api desconocidas devuelven 404 JSON, no el index', async () => {
    const res = await request(appConDist()).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Ruta no encontrada');
  });

  it('/health sigue respondiendo JSON y no el index', async () => {
    const res = await request(appConDist()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('sin build del frontend', () => {
  it('las rutas desconocidas caen en el 404 JSON de la API', async () => {
    const app = createApp({ env: { ...process.env, NODE_ENV: 'test', FRONTEND_DIST: '' } });
    const res = await request(app).get('/progreso');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Ruta no encontrada');
  });
});
