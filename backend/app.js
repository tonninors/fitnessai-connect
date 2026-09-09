import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import homeRouter     from './routes/home.js';
import workoutsRouter from './routes/workouts.js';
import progressRouter from './routes/progress.js';
import profileRouter  from './routes/profile.js';
import aiRouter       from './routes/ai.js';
import authRouter     from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

/**
 * Carpeta con el build del frontend, o `null` si no hay ninguno.
 *
 * En un despliegue de un solo servicio el mismo proceso sirve la SPA y la API,
 * así que todo queda en el mismo origen y CORS deja de intervenir. En local no
 * existe `dist` y la app se comporta como una API pura.
 *
 * Bajo `NODE_ENV=test` solo se activa si `FRONTEND_DIST` viene explícita: un
 * build viejo en el disco no debe cambiar el resultado del resto de la suite.
 */
export function resolveFrontendDist(env = process.env) {
  const configured = (env.FRONTEND_DIST || '').trim();
  if (!configured && env.NODE_ENV === 'test') return null;

  const dir = configured
    ? path.resolve(configured)
    : path.resolve(__dirname, '../frontend/dist');

  return existsSync(path.join(dir, 'index.html')) ? dir : null;
}

/**
 * Orígenes permitidos por CORS.
 * `FRONTEND_URL` acepta una lista separada por comas.
 * Antes se caía a `'*'` junto con `credentials: true`, combinación que los
 * navegadores rechazan y que además abre la API a cualquier origen.
 */
export function allowedOrigins(env = process.env) {
  const configured = (env.FRONTEND_URL || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  if (configured.length > 0) return configured;
  return env.NODE_ENV === 'production' ? [] : DEFAULT_DEV_ORIGINS;
}

function corsOptions(env) {
  const origins = allowedOrigins(env);
  return {
    origin(origin, callback) {
      // Peticiones sin Origin (curl, health checks, apps nativas) se permiten.
      if (!origin) return callback(null, true);
      if (origins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  };
}

/**
 * Construye la app Express sin arrancar el servidor.
 * Separarlo de `server.js` permite montarla en tests con supertest.
 */
export function createApp({ env = process.env } = {}) {
  const app = express();
  const isProduction = env.NODE_ENV === 'production';

  app.disable('x-powered-by');
  app.use(cors(corsOptions(env)));
  app.use(express.json({ limit: '100kb' }));

  // Health check antes del rate limit: los probes de Railway/Render no deben
  // consumir cuota ni recibir 429.
  app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

  // La SPA se sirve antes del rate limit: una sola carga pide decenas de
  // assets y agotaría por sí sola la cuota de 100 peticiones por ventana.
  const distDir = resolveFrontendDist(env);
  if (distDir) {
    // Los assets de Vite llevan hash en el nombre, así que se cachean de forma
    // agresiva. `index.html` no: si el navegador lo cachea, tras un despliegue
    // seguiría pidiendo bundles que ya no existen.
    app.use(express.static(distDir, { index: false, maxAge: isProduction ? '1y' : 0 }));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.set('Cache-Control', 'no-cache');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' },
  }));

  // Límite extra en auth: `/auth/check-email` revela si un correo existe, así
  // que se restringe el número de intentos por IP para dificultar la
  // enumeración masiva de cuentas.
  app.use('/api/auth', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 20 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Espera unos minutos.' },
  }));

  app.use('/api/home',     homeRouter);
  app.use('/api/workouts', workoutsRouter);
  app.use('/api/progress', progressRouter);
  app.use('/api/profile',  profileRouter);
  app.use('/api/ai',       aiRouter);
  app.use('/api/auth',     authRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
  });

  app.use(errorHandler(isProduction));

  return app;
}

/**
 * Middleware de errores. Los 4xx conservan su mensaje (son de dominio y útiles
 * para el usuario); los 5xx se ocultan en producción para no filtrar detalles
 * internos ni mensajes crudos de Postgres.
 */
export function errorHandler(isProduction) {
  return (err, _req, res, _next) => {
    const status = Number.isInteger(err?.status) && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

    if (status >= 500) console.error('[api] error:', err);

    const message = status < 500
      ? (err?.message || 'Solicitud inválida')
      : (isProduction ? 'Error interno del servidor' : (err?.message || 'Error interno del servidor'));

    res.status(status).json({ error: message });
  };
}

export default createApp;
