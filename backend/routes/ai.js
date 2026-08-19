import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../config/supabase.js';
import { asyncHandler, throwOnSupabaseError, badRequest } from '../lib/http.js';
import { chat } from '../lib/groq.js';
import { optionalEnum, optionalText, optionalInt } from '../lib/validation.js';
import { todayISO } from '../lib/dates.js';
import {
  INSIGHT_SYSTEM_PROMPT,
  INSIGHT_TYPES,
  DEFAULT_INSIGHT_TYPE,
  buildInsightPrompt,
  toDbInsightType,
} from '../lib/insights.js';
import {
  PLAN_SYSTEM_PROMPT,
  buildPlanPrompt,
  extractJsonObject,
  validatePlan,
  normalizeDaysPerWeek,
  toSessionRow,
  toExerciseRows,
} from '../lib/plan.js';

const router = Router();

const PLAN_TOTAL_WEEKS = 4;
const PLAN_MAX_TOKENS = 6000;

// POST generar insight contextual
router.post('/insight', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const userId = req.user.id;
  const type = optionalEnum(req.body?.type, 'type', INSIGHT_TYPES, { fallback: DEFAULT_INSIGHT_TYPE });
  const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, goals, current_streak')
    .eq('id', userId)
    .maybeSingle();

  const content = await chat([
    { role: 'system', content: INSIGHT_SYSTEM_PROMPT },
    { role: 'user', content: buildInsightPrompt(type, context, profile) },
  ]);

  // Persistencia best-effort: no debe retrasar ni romper la respuesta, pero
  // ahora los fallos se registran en lugar de desaparecer.
  supabase.from('ai_insights').insert({
    user_id: userId,
    type: toDbInsightType(type),
    content,
    context,
    session_id: typeof context.session_id === 'string' ? context.session_id : null,
  }).then(({ error }) => {
    if (error) console.error('[ai] no se pudo guardar el insight:', error.message);
  }, err => console.error('[ai] no se pudo guardar el insight:', err));

  res.json({ insight: content });
}));

// POST generar plan de entrenamiento con IA
router.post('/generate-plan', requireAuth, asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const userId = req.user.id;
  const body = req.body ?? {};

  const daysNum = normalizeDaysPerWeek(body.days_per_week);
  const cardioMinutes = optionalInt(body.cardio_minutes, 'cardio_minutes', { min: 0, max: 90, fallback: 15 });
  const goals = optionalText(body.goals, 'goals', { maxLength: 300 }) ?? 'fitness general';
  const fitnessLevel = optionalText(body.fitness_level, 'fitness_level', { maxLength: 60 }) ?? 'intermediate';
  const equipment = optionalText(body.equipment, 'equipment', { maxLength: 300 }) ?? 'ninguno';
  const focusAreas = optionalText(body.focus_areas, 'focus_areas', { maxLength: 300 }) ?? goals;

  const text = await chat([
    { role: 'system', content: PLAN_SYSTEM_PROMPT },
    {
      role: 'user',
      content: buildPlanPrompt({
        goals,
        daysNum,
        fitness_level: fitnessLevel,
        equipment,
        focus_areas: focusAreas,
        cardio_minutes: cardioMinutes,
      }),
    },
  ], { maxTokens: PLAN_MAX_TOKENS });

  // Valida antes de tocar la base de datos: así un JSON incompleto de la IA no
  // deja al usuario sin plan activo ni provoca errores de NOT NULL.
  const plan = validatePlan(extractJsonObject(text));

  const { data: created, error: planErr } = await supabase
    .from('workout_plans')
    .insert({
      user_id: userId,
      name: plan.name,
      description: plan.description,
      total_weeks: PLAN_TOTAL_WEEKS,
      focus_areas: plan.focus_areas.length > 0 ? plan.focus_areas : focusAreas.split(',').map(s => s.trim()),
      ai_generated: true,
      status: 'active',
    })
    .select()
    .maybeSingle();

  throwOnSupabaseError(planErr);
  if (!created) throw badRequest('No se pudo crear el plan. Intenta de nuevo.');

  // El archivado va DESPUÉS de crear el nuevo plan: antes se archivaba primero
  // y, si la inserción fallaba, el usuario se quedaba sin ningún plan activo.
  const { error: archiveErr } = await supabase.from('workout_plans')
    .update({ status: 'archived' })
    .eq('user_id', userId)
    .eq('status', 'active')
    .neq('id', created.id);

  if (archiveErr) console.error('[ai] no se pudieron archivar los planes anteriores:', archiveErr.message);

  const startDate = todayISO();
  const results = await Promise.all(plan.sessions.map(async (session) => {
    const { data: savedSession, error: sessionErr } = await supabase
      .from('workout_sessions')
      .insert(toSessionRow(session, { planId: created.id, userId, startDate, daysNum }))
      .select()
      .maybeSingle();

    if (sessionErr || !savedSession) {
      console.error('[ai] no se pudo crear la sesión:', sessionErr?.message ?? 'sin datos');
      return false;
    }

    const exerciseRows = toExerciseRows(session.exercises, savedSession.id);
    if (exerciseRows.length > 0) {
      const { error: exErr } = await supabase.from('session_exercises').insert(exerciseRows);
      if (exErr) console.error('[ai] no se pudieron crear los ejercicios:', exErr.message);
    }
    return true;
  }));

  res.json({
    plan_id: created.id,
    name: created.name,
    sessions_created: results.filter(Boolean).length,
  });
}));

export default router;
