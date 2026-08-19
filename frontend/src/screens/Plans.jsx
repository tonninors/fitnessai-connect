import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Check, Calendar, Trophy, CheckCircle2, X, Clock, Zap, Dumbbell, Timer } from 'lucide-react';
import { api } from '../api/client.js';
import { useApiData } from '../hooks/useApiData.js';
import ErrorState from '../components/ErrorState.jsx';
import { todayISO, formatDate, weekdayShort } from '../lib/dates.js';
import { groupByBlock, isTimed, totalSets, formatDuration, nextPendingExercise } from '../lib/workout.js';

/** Parámetros por defecto cuando el perfil aún no tiene onboarding guardado. */
const PLAN_DEFAULTS = {
  goals: 'fitness general',
  days_per_week: 3,
  fitness_level: 'intermediate',
  equipment: 'gimnasio_completo',
  cardio_minutes: 15,
};

/**
 * Traduce el perfil guardado en el onboarding a los parámetros del generador.
 * Antes se enviaban valores fijos, así que regenerar el plan descartaba las
 * preferencias que el usuario había configurado.
 */
export function planRequestFromProfile(profile) {
  const goalsList = profile?.goals?.all;
  const goals = Array.isArray(goalsList) && goalsList.length > 0
    ? goalsList.join(', ')
    : (profile?.goals?.primary || PLAN_DEFAULTS.goals);

  const availability = profile?.availability ?? {};

  return {
    goals,
    days_per_week: availability.days_per_week ?? PLAN_DEFAULTS.days_per_week,
    fitness_level: profile?.fitness_level || PLAN_DEFAULTS.fitness_level,
    equipment: profile?.equipment || PLAN_DEFAULTS.equipment,
    focus_areas: goals,
    cardio_minutes: availability.cardio_minutes ?? PLAN_DEFAULTS.cardio_minutes,
  };
}

/** Mapa `{sessionId: Set<exerciseId>}` con lo ya completado según el backend. */
export function completedBySession(plan) {
  const result = {};
  for (const session of plan?.workout_sessions ?? []) {
    const ids = (session.session_exercises ?? []).filter(e => e.completed).map(e => e.id);
    if (ids.length > 0) result[session.id] = new Set(ids);
  }
  return result;
}

export default function Plans({ onStartWorkout, runningSession, onResumeWorkout, liveCompleted }) {
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const { data, loading, error, reload, setData } = useApiData(async () => {
    const [plan, upcoming] = await Promise.all([
      api.get('/workouts/plan'),
      api.get('/workouts/upcoming'),
    ]);
    return { plan, upcoming: upcoming || [] };
  });

  if (loading) return <PlansSkeleton />;
  if (error) return <ErrorState title="No se pudieron cargar tus planes" message={error} onRetry={reload} />;

  const plan = data?.plan ?? null;
  const upcoming = data?.upcoming ?? [];
  const today = todayISO();
  const pending = (plan?.workout_sessions ?? [])
    .filter(s => !['completed', 'skipped'].includes(s.status))
    .sort((a, b) => (a.scheduled_date ?? '').localeCompare(b.scheduled_date ?? ''));

  const activeSession = pending.find(s => s.scheduled_date === today) ?? pending[0] ?? null;
  const nextSession = pending.find(s => s.id !== activeSession?.id) ?? null;
  const allDone = !!plan && !activeSession;
  const isCompleted = activeSession?.status === 'completed';

  const exList = activeSession?.session_exercises ?? [];
  const done = runningSession?.id === activeSession?.id && liveCompleted != null
    ? liveCompleted
    : (completedBySession(plan)[activeSession?.id] ?? new Set());
  const allExercisesDone = exList.length > 0 && done.size >= exList.length;
  const nextExercise = nextPendingExercise(exList, done);

  async function refresh() {
    const [p, u] = await Promise.all([api.get('/workouts/plan'), api.get('/workouts/upcoming')]);
    setData({ plan: p, upcoming: u || [] });
  }

  async function generatePlan() {
    setGenerating(true);
    setGenError(null);
    try {
      const profile = await api.get('/profile').catch(() => null);
      await api.post('/ai/generate-plan', planRequestFromProfile(profile));
      await refresh();
    } catch (e) {
      setGenError(e.message || 'Error al generar el plan');
    } finally {
      setGenerating(false);
    }
  }

  async function finishSession() {
    setFinishing(true);
    setGenError(null);
    try {
      await api.patch(`/workouts/sessions/${activeSession.id}/complete`, {});
      await refresh();
    } catch (e) {
      setGenError(e.message || 'No se pudo finalizar la sesión');
    } finally {
      setFinishing(false);
    }
  }

  return (
    <div>
      <div className="section pb-0">
        <h1 className="text-2xl font-bold tracking-tight">Mis Planes</h1>
      </div>

      {allDone ? (
        <div className="section">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-10"
          >
            <Trophy size={36} className="text-accent mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-lg font-bold mb-1">¡Plan completado!</h2>
            <p className="text-txt3 mb-6 text-sm">
              Terminaste las {plan.workout_sessions?.length} sesiones del plan. ¿Listo para el siguiente?
            </p>
            <button type="button" className="btn btn-primary" onClick={generatePlan} disabled={generating}>
              {generating ? 'Generando...' : <><Sparkles size={14} aria-hidden="true" /> Generar nuevo plan</>}
            </button>
            {genError && <p className="text-[12px] text-red-400 mt-4 leading-snug" role="alert">{genError}</p>}
          </motion.div>
        </div>
      ) : !plan ? (
        <div className="section">
          <div className="card text-center py-10">
            <Sparkles size={32} className="text-accent mx-auto mb-4" aria-hidden="true" />
            <p className="text-txt3 mb-6 text-sm">No tienes un plan activo</p>
            <button type="button" className="btn btn-primary" onClick={generatePlan} disabled={generating}>
              {generating ? 'Generando...' : 'Generar plan con IA'}
            </button>
            {genError && <p className="text-[12px] text-red-400 mt-4 leading-snug" role="alert">{genError}</p>}
          </div>
        </div>
      ) : (
        <>
          <div className="section">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card border-l-[3px] border-l-accent"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-block bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Semana {plan.current_week} de {plan.total_weeks}
                  {activeSession?.day_order ? ` · Día ${activeSession.day_order}` : ''}
                </span>
                {activeSession && activeSession.scheduled_date !== today && (
                  <span className="inline-block bg-surface2 text-txt3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {formatDate(activeSession.scheduled_date, { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold mb-1">
                {activeSession?.day_order ? `Día ${activeSession.day_order}` : (activeSession?.name ?? plan.name)}
              </h2>
              <p className="text-xs text-txt3 mb-4">
                {(activeSession?.focus_areas ?? plan.focus_areas)?.join(' · ')}
              </p>

              <div className="flex gap-1.5 flex-wrap mb-5">
                {activeSession?.estimated_duration && (
                  <span className="pill bg-accent-dim text-accent">{activeSession.estimated_duration} min</span>
                )}
                {exList.length > 0 && <span className="pill bg-blue-dim text-blue">{exList.length} ejercicios</span>}
                {activeSession?.rpe_target && (
                  <span className="pill bg-[#2a1f00] text-[#fb923c]">RPE {activeSession.rpe_target}</span>
                )}
              </div>

              {activeSession && !isCompleted && (
                runningSession?.id === activeSession.id ? (
                  <button
                    type="button"
                    className="mt-5 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-accent/25 text-accent text-xs font-semibold hover:border-accent/50 transition-colors bg-transparent cursor-pointer"
                    onClick={onResumeWorkout}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                    Ver entrenamiento en curso
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => onStartWorkout(activeSession)}>
                    <Play size={16} fill="white" aria-hidden="true" /> Iniciar ahora
                  </button>
                )
              )}

              {isCompleted && (
                <p className="flex items-center gap-2 mt-2 text-green text-sm font-medium">
                  <Check size={16} aria-hidden="true" /> Sesión completada
                  {nextSession && <span className="text-txt3 font-normal">· Próxima: {nextSession.name}</span>}
                </p>
              )}
            </motion.div>
          </div>

          {exList.length > 0 && (
            <div className="section pt-0">
              {groupByBlock(exList).map(({ type, label, colorClass, dotClass, exercises }) => (
                <section key={type} className="mb-3" aria-label={label}>
                  <div className="flex items-center gap-2 px-1 mb-2">
                    <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>{label}</span>
                  </div>
                  <ul className="card !p-0 overflow-hidden list-none">
                    {exercises.map((ex, i) => (
                      <ExerciseRow
                        key={ex.id}
                        exercise={ex}
                        index={i + 1}
                        type={type}
                        isDone={done.has(ex.id)}
                        isNext={!isCompleted && nextExercise?.id === ex.id}
                      />
                    ))}
                  </ul>
                </section>
              ))}

              {allExercisesDone && !isCompleted && !runningSession && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <button type="button" className="btn btn-primary" onClick={finishSession} disabled={finishing}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    {finishing ? 'Finalizando...' : 'Finalizar sesión'}
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </>
      )}

      {plan && (
        <div className="px-5 pb-1">
          <button
            type="button"
            className="w-full text-xs text-txt3 py-2 bg-transparent border-none cursor-pointer hover:text-accent transition-colors"
            onClick={generatePlan}
            disabled={generating}
          >
            {generating ? 'Generando nuevo plan...' : '↻ Regenerar plan con IA'}
          </button>
          {genError && <p className="text-[12px] text-red-400 text-center pb-2" role="alert">{genError}</p>}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="section">
          <p className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-3">Próximas sesiones</p>
          {upcoming.filter(s => s.id !== activeSession?.id).slice(0, 3).map(s => (
            <button
              key={s.id}
              type="button"
              className="card w-full text-left flex items-center gap-3.5 mb-2 !py-3.5 cursor-pointer hover:border-accent/40 transition-colors"
              onClick={() => setSelectedSession(plan?.workout_sessions?.find(ws => ws.id === s.id) ?? s)}
            >
              <span className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar size={16} className="text-accent" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium">{s.day_order ? `Día ${s.day_order}` : s.name}</span>
                <span className="block text-xs text-txt3">
                  {weekdayShort(s.scheduled_date)} · {s.estimated_duration} min · RPE {s.rpe_target}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedSession && (
          <SessionSheet
            session={selectedSession}
            onClose={() => setSelectedSession(null)}
            onStart={() => { onStartWorkout(selectedSession); setSelectedSession(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlansSkeleton() {
  return (
    <div className="p-5 pt-2" aria-busy="true" aria-label="Cargando planes">
      <div className="skeleton h-7 w-32 mb-5" />
      <div className="skeleton h-52 rounded-2xl mb-2.5" />
      <div className="skeleton h-36 rounded-2xl mb-2.5" />
      <div className="skeleton h-14 rounded-2xl mb-2" />
      <div className="skeleton h-14 rounded-2xl mb-2" />
      <div className="skeleton h-14 rounded-2xl" />
    </div>
  );
}

function ExerciseRow({ exercise, index, type, isDone, isNext }) {
  const timed = isTimed(exercise);

  return (
    <li
      data-testid={`exercise-${exercise.id}`}
      data-next={isNext ? 'true' : 'false'}
      className={`flex items-center gap-3.5 px-4 py-3.5 border-b border-border last:border-b-0 transition-all
        ${isDone ? 'opacity-40' : ''} ${isNext ? 'bg-accent/5' : ''}`}
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors
        ${isDone ? 'bg-accent text-white'
          : type === 'warmup' ? 'bg-green-dim text-green'
          : type === 'cooldown' ? 'bg-blue-dim text-blue'
          : type === 'cardio' ? 'bg-orange-500/15 text-[#f97316]'
          : isNext ? 'bg-accent/20 text-accent'
          : 'bg-surface2 text-txt3'}`}
      >
        {isDone ? <Check size={14} aria-hidden="true" /> : index}
      </span>

      <span className="flex-1 min-w-0">
        <span className={`block text-sm font-semibold leading-snug ${isDone ? 'line-through text-txt3' : 'text-txt'}`}>
          {exercise.exercise_name}
        </span>
        <span className="flex items-center gap-2.5 mt-1 flex-wrap">
          {timed ? (
            <span className="flex items-center gap-1 text-[11px] text-txt3">
              <Timer size={10} className="shrink-0" aria-hidden="true" />
              {formatDuration(exercise.duration_seconds)}
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1 text-[11px] text-txt3">
                <Dumbbell size={10} className="shrink-0" aria-hidden="true" />
                {totalSets(exercise)} × {exercise.reps ?? '?'} reps
                {exercise.weight_kg ? ` · ${exercise.weight_kg}kg` : ''}
              </span>
              {exercise.rest_seconds && (
                <span className="flex items-center gap-1 text-[11px] text-txt3">
                  <Timer size={10} className="shrink-0" aria-hidden="true" />
                  {exercise.rest_seconds}s descanso
                </span>
              )}
            </>
          )}
        </span>
      </span>

      {isNext && !isDone && (
        <span className="text-[10px] font-bold text-accent uppercase tracking-wider shrink-0">Siguiente</span>
      )}
    </li>
  );
}

function SessionSheet({ session, onClose, onStart }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/60 z-[80]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[90] bg-surface rounded-t-3xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${session.name}`}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pt-3 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-3">
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">
                {session.scheduled_date ? formatDate(session.scheduled_date) : 'Próxima sesión'}
              </p>
              <h2 className="text-lg font-bold leading-snug">{session.name}</h2>
              <p className="text-xs text-txt3 mt-0.5">{session.focus_areas?.join(' · ')}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalle"
              className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center shrink-0 border-none cursor-pointer"
            >
              <X size={14} className="text-txt2" aria-hidden="true" />
            </button>
          </div>

          <div className="flex gap-2 mb-5">
            {session.estimated_duration && (
              <span className="pill bg-accent-dim text-accent flex items-center gap-1">
                <Clock size={10} aria-hidden="true" /> {session.estimated_duration} min
              </span>
            )}
            {session.rpe_target && (
              <span className="pill bg-[#2a1f00] text-[#fb923c] flex items-center gap-1">
                <Zap size={10} aria-hidden="true" /> RPE {session.rpe_target}
              </span>
            )}
          </div>

          {session.session_exercises?.length > 0 && (
            <ul className="card !p-0 overflow-hidden mb-5 list-none">
              {session.session_exercises.map((ex, i) => (
                <li key={ex.id} className="flex items-center gap-3.5 px-4 py-3 border-b border-border last:border-b-0">
                  <span className="w-7 h-7 rounded-lg bg-surface2 flex items-center justify-center text-xs font-bold text-txt3 shrink-0">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{ex.exercise_name}</span>
                    <span className="block text-xs text-txt3 mt-0.5">
                      {isTimed(ex)
                        ? formatDuration(ex.duration_seconds)
                        : `${totalSets(ex)} × ${ex.reps ?? '?'} reps${ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}${ex.rest_seconds ? ` · ${ex.rest_seconds}s desc.` : ''}`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <button type="button" className="btn btn-primary" onClick={onStart}>
            <Play size={16} fill="white" aria-hidden="true" /> Iniciar sesión
          </button>
        </div>
      </motion.div>
    </>
  );
}
