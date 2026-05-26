import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { requireAuth } from '../middleware/auth.js';

const router   = Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const groq     = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = 'Eres un entrenador personal certificado experto. Responde siempre en español, de forma concisa (máximo 2 frases), motivadora y accionable.';
const MODEL  = 'meta-llama/llama-4-scout-17b-16e-instruct';

async function chat(messages, maxTokens = 120, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await groq.chat.completions.create({
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      });
      return res.choices[0].message.content;
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes('Too Many Requests') || err?.message?.includes('rate_limit');
      if (is429 && attempt < retries) {
        // Esperar antes de reintentar (2s, luego 5s)
        await new Promise(r => setTimeout(r, attempt === 0 ? 2000 : 5000));
        continue;
      }
      if (is429) {
        const e = new Error('El servicio de IA está muy ocupado. Espera unos segundos e inténtalo de nuevo.');
        e.status = 429;
        throw e;
      }
      throw err;
    }
  }
}

// POST generar insight contextual
router.post('/insight', requireAuth, async (req, res) => {
  const { type, context } = req.body;
  const userId = req.user.id;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, goals, current_streak')
    .eq('id', userId)
    .single();

  const prompts = {
    recovery:             `${profile?.full_name} tiene racha de ${profile?.current_streak} días. Datos biométricos: ${JSON.stringify(context)}. Da un consejo de recuperación.`,
    workout_ready:        `Datos de hoy: ${JSON.stringify(context)}. Genera un mensaje motivador y útil antes del entrenamiento.`,
    strength_progression: `Progreso de fuerza: ${JSON.stringify(context)}. Analiza la tendencia y sugiere ajuste de carga.`,
    live_feedback:        `FC: ${context?.hr_bpm} bpm, zona objetivo: ${context?.target_zone}. Da feedback breve en tiempo real.`,
    volume_adjustment:    `HRV bajó ${context?.hrv_drop_pct}% vs ayer. Recomienda ajuste de volumen para hoy.`,
  };

  const userPrompt = prompts[type] || prompts.workout_ready;
  let content;
  try {
    content = await chat([
      { role: 'system', content: SYSTEM },
      { role: 'user',   content: userPrompt },
    ]);
  } catch (aiErr) {
    const statusCode = aiErr.status === 429 ? 429 : 502;
    return res.status(statusCode).json({ error: aiErr.message });
  }

  supabase.from('ai_insights').insert({
    user_id: userId, type, content, context,
    session_id: context?.session_id || null,
  }).then(() => {});

  res.json({ insight: content });
});

// POST generar plan de entrenamiento con IA
router.post('/generate-plan', requireAuth, async (req, res) => {
  const { goals, days_per_week, fitness_level, equipment, focus_areas, cardio_minutes = 15 } = req.body;
  const userId = req.user.id;

  const planPrompt = `Crea un plan de entrenamiento de 4 semanas (genera solo semana 1 con ${days_per_week} sesiones):
- Objetivo: ${goals}
- Días por semana: ${days_per_week}
- Nivel: ${fitness_level}
- Equipo: ${equipment}
- Áreas de enfoque: ${focus_areas}

REGLAS OBLIGATORIAS:
1. Cada sesión debe tener exactamente 4 bloques en este orden:
   a) CALENTAMIENTO (exercise_type: "warmup"): 3 ejercicios de movilidad articular con duration_seconds (30-60s cada uno), sets: 1, sin reps ni weight_kg
   b) BLOQUE PRINCIPAL (exercise_type: "strength"): 5-7 ejercicios en orden correcto — primero compuestos multiarticulares (más pesados), luego compuestos secundarios, al final aislamientos. Descansos: compuestos pesados (sentadilla, peso muerto, press banca, remo) → rest_seconds: 150-180; compuestos secundarios → rest_seconds: 90-120; aislamientos → rest_seconds: 60
   c) CARDIO (exercise_type: "cardio"): ${cardio_minutes === 0 ? 'NO incluir bloque de cardio' : `1 ejercicio cardiovascular (correr, escaladora, bicicleta estática) con duration_seconds: ${cardio_minutes * 60}, sets: 1, sin reps ni weight_kg. Ajusta la intensidad según el objetivo: si el objetivo incluye ganar músculo, cardio ligero; si incluye perder grasa, cardio moderado-intenso`}
   d) ESTIRAMIENTO (exercise_type: "cooldown"): 3 estiramientos estáticos enfocados en los músculos trabajados, con duration_seconds (30-45s cada uno), sets: 1, sin reps ni weight_kg
2. Los ejercicios de fuerza deben progresar en dificultad acorde al nivel: ${fitness_level}
3. Si hay varios días, no repetir los mismos grupos musculares en días consecutivos

Responde SOLO con JSON válido, sin texto extra, sin markdown:
{
  "name": "...",
  "description": "...",
  "focus_areas": [...],
  "sessions": [
    {
      "name": "...",
      "day_order": 1,
      "estimated_duration": 60,
      "estimated_calories": 350,
      "rpe_target": 7,
      "focus_areas": [...],
      "exercises": [
        { "exercise_type": "warmup",   "exercise_name": "Círculos de hombros",      "sets": 1, "duration_seconds": 45 },
        { "exercise_type": "warmup",   "exercise_name": "Movilidad de cadera",       "sets": 1, "duration_seconds": 45 },
        { "exercise_type": "warmup",   "exercise_name": "Rotación de tobillos",      "sets": 1, "duration_seconds": 30 },
        { "exercise_type": "strength", "exercise_name": "Press de Banca con Barra",  "sets": 4, "reps": 6,  "weight_kg": 80, "rest_seconds": 180 },
        { "exercise_type": "strength", "exercise_name": "Press Inclinado Mancuernas","sets": 3, "reps": 10, "weight_kg": 30, "rest_seconds": 120 },
        { "exercise_type": "strength", "exercise_name": "Fondos en Paralelas",       "sets": 3, "reps": 12, "weight_kg": 0,  "rest_seconds": 90 },
        { "exercise_type": "strength", "exercise_name": "Extensión de Tríceps",      "sets": 3, "reps": 12, "weight_kg": 15, "rest_seconds": 60 },
        { "exercise_type": "strength", "exercise_name": "Elevaciones Laterales",     "sets": 3, "reps": 15, "weight_kg": 10, "rest_seconds": 60 },
        { "exercise_type": "cooldown", "exercise_name": "Estiramiento de pecho",     "sets": 1, "duration_seconds": 40 },
        { "exercise_type": "cooldown", "exercise_name": "Estiramiento de tríceps",   "sets": 1, "duration_seconds": 40 },
        { "exercise_type": "cooldown", "exercise_name": "Estiramiento de hombros",   "sets": 1, "duration_seconds": 30 }
      ]
    }
  ]
}`;

  let text;
  try {
    text = await chat([
      { role: 'system', content: 'Eres un entrenador personal certificado. Crea planes de entrenamiento en JSON estructurado y válido. Responde SOLO con JSON, sin texto extra, sin bloques de código markdown.' },
      { role: 'user',   content: planPrompt },
    ], 3000);
  } catch (aiErr) {
    const statusCode = aiErr.status === 429 ? 429 : 502;
    return res.status(statusCode).json({ error: aiErr.message });
  }

  let parsed;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    parsed = match ? JSON.parse(match[0]) : null;
  } catch {
    return res.status(500).json({ error: 'IA devolvió un formato inválido. Intenta de nuevo.' });
  }

  if (!parsed) return res.status(500).json({ error: 'Sin respuesta de IA' });

  // Archivar planes activos anteriores
  await supabase.from('workout_plans')
    .update({ status: 'archived' })
    .eq('user_id', userId)
    .eq('status', 'active');

  const { data: plan, error: planErr } = await supabase
    .from('workout_plans')
    .insert({
      user_id:      userId,
      name:         parsed.name,
      description:  parsed.description,
      total_weeks:  4,
      focus_areas:  parsed.focus_areas || focus_areas?.split(',') || [],
      ai_generated: true,
      status:       'active',
    })
    .select()
    .single();

  if (planErr) return res.status(400).json({ error: planErr.message });

  const today = new Date();
  await Promise.all((parsed.sessions || []).map(async (session) => {
    const scheduledDate = new Date(today);
    scheduledDate.setDate(scheduledDate.getDate() + (session.day_order - 1) * 2);

    const { data: savedSession } = await supabase
      .from('workout_sessions')
      .insert({
        plan_id:            plan.id,
        user_id:            userId,
        name:               session.name,
        scheduled_date:     scheduledDate.toISOString().split('T')[0],
        estimated_duration: session.estimated_duration,
        estimated_calories: session.estimated_calories,
        rpe_target:         session.rpe_target,
        focus_areas:        session.focus_areas || [],
        week_number:        1,
        day_order:          session.day_order,
        ai_insight:         `Sesión generada por IA · ${session.name}`,
      })
      .select()
      .single();

    if (savedSession && session.exercises?.length) {
      await supabase.from('session_exercises').insert(
        session.exercises.map((ex, idx) => ({
          session_id:       savedSession.id,
          exercise_name:    ex.exercise_name,
          order_num:        idx + 1,
          sets:             ex.sets,
          reps:             ex.reps             ?? null,
          weight_kg:        ex.weight_kg        ?? null,
          rest_seconds:     ex.rest_seconds     ?? null,
          duration_seconds: ex.duration_seconds ?? null,
          exercise_type:    ex.exercise_type    ?? 'strength',
        }))
      );
    }
  }));

  res.json({ plan_id: plan.id, name: plan.name, sessions_created: parsed.sessions?.length || 0 });
});

export default router;
