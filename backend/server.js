import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import homeRouter     from './routes/home.js';
import workoutsRouter from './routes/workouts.js';
import progressRouter from './routes/progress.js';
import profileRouter  from './routes/profile.js';
import aiRouter       from './routes/ai.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' },
}));

app.use('/api/home',      homeRouter);
app.use('/api/workouts',  workoutsRouter);
app.use('/api/progress',  progressRouter);
app.use('/api/profile',   profileRouter);
app.use('/api/ai',        aiRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FitnessAI API → http://localhost:${PORT}`));
