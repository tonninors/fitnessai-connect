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
  const { goals, days_per_week, fitness_level, equipment, focus_areas } = req.body;
  const userId = req.user.id;

  const planPrompt = `Crea un plan de entrenamiento de 4 semanas (muestra solo semana 1 con 3 sesiones de ejemplo):
- Objetivo: ${goals}
- Días por semana: ${days_per_week}
- Nivel: ${fitness_level}
- Equipo: ${equipment}
- Áreas de enfoque: ${focus_areas}

Responde SOLO con JSON válido, sin texto extra, sin markdown:
{
  "name": "...",
  "description": "...",
  "focus_areas": [...],
  "sessions": [
    {
      "name": "...",
      "day_order": 1,
      "estimated_duration": 50,
      "estimated_calories": 300,
      "rpe_target": 7,
      "focus_areas": [...],
      "exercises": [
        { "exercise_name": "...", "sets": 4, "reps": 8, "weight_kg": 60, "rest_seconds": 90 }
      ]
    }
  ]
}`;

  let text;
  try {
    text = await chat([
      { role: 'system', content: 'Eres un entrenador personal certificado. Crea planes de entrenamiento en JSON estructurado y válido. Responde SOLO con JSON, sin texto extra, sin bloques de código markdown.' },
      { role: 'user',   content: planPrompt },
    ], 1500);
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

  for (const session of parsed.sessions || []) {
    const scheduledDate = new Date();
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

    if (savedSession && session.exercises) {
      await supabase.from('session_exercises').insert(
        session.exercises.map((ex, idx) => ({
          session_id:    savedSession.id,
          exercise_name: ex.exercise_name,
          order_num:     idx + 1,
          sets:          ex.sets,
          reps:          ex.reps,
          weight_kg:     ex.weight_kg,
          rest_seconds:  ex.rest_seconds,
        }))
      );
    }
  }

  res.json({ plan_id: plan.id, name: plan.name, sessions_created: parsed.sessions?.length || 0 });
});

export default router;
