import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Check, Calendar, Trophy, CheckCircle2, X, Clock, Zap, Dumbbell, Timer } from 'lucide-react';
import { api } from '../api/client.js';

export default function Plans({ onStartWorkout }) {
  const [plan,           setPlan]           = useState(null);
  const [upcoming,       setUpcoming]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [generating,     setGenerating]     = useState(false);
  const [genError,       setGenError]       = useState(null);
  const [exercises,      setExercises]      = useState({});
  const [finishing,      setFinishing]      = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/workouts/plan'),
      api.get('/workouts/upcoming'),
    ]).then(([p, u]) => {
      setPlan(p);
      setUpcoming(u || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-5 pt-2">
      <div className="skeleton h-7 w-32 mb-5" />
      <div className="skeleton h-52 rounded-2xl mb-2.5" />
      <div className="skeleton h-36 rounded-2xl mb-2.5" />
      <div className="skeleton h-14 rounded-2xl mb-2" />
      <div className="skeleton h-14 rounded-2xl mb-2" />
      <div className="skeleton h-14 rounded-2xl" />
    </div>
  );

  const today = new Date().toISOString().split('T')[0];
  const todaySession = plan?.workout_sessions?.find(s => s.scheduled_date === today && !['completed', 'skipped'].includes(s.status));

  // Si no hay sesión hoy, usar la primera sesión pendiente (por fecha, pasada o futura)
  const activeSession = todaySession ?? plan?.workout_sessions
    ?.filter(s => !['completed', 'skipped'].includes(s.status))
    ?.sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
    ?.[0];

  const allDone      = plan && !activeSession;
  const isCompleted  = activeSession?.status === 'completed';
  const nextSession  = plan?.workout_sessions
    ?.filter(s => !['completed', 'skipped'].includes(s.status) && s.id !== activeSession?.id)
    ?.sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))[0];
  const exList           = activeSession?.session_exercises ?? [];
  const done             = isCompleted ? new Set(exList.map(e => e.id)) : (exercises[activeSession?.id] ?? new Set());
  const allExercisesDone = exList.length > 0 && done.size >= exList.length;

  async function generatePlan() {
    setGenerating(true);
    setGenError(null);
    try {
      await api.post('/ai/generate-plan', {
        goals: 'fitness general', days_per_week: 3,
        fitness_level: 'intermediate', equipment: 'gimnasio_completo', focus_areas: 'fitness general',
      });
      const [p, u] = await Promise.all([api.get('/workouts/plan'), api.get('/workouts/upcoming')]);
      setPlan(p); setUpcoming(u || []);
    } catch (e) {
      setGenError(e.message || 'Error al generar el plan');
    } finally { setGenerating(false); }
  }

  async function finishSession() {
    setFinishing(true);
    try {
      await api.patch(`/workouts/sessions/${activeSession.id}/complete`, {});
      const [p, u] = await Promise.all([api.get('/workouts/plan'), api.get('/workouts/upcoming')]);
      setPlan(p); setUpcoming(u || []);
    } catch (e) {
      console.error(e);
    } finally { setFinishing(false); }
  }

  async function toggleExercise(ex) {
    const newDone = new Set(done);
    const isNowDone = !newDone.has(ex.id);
    isNowDone ? newDone.add(ex.id) : newDone.delete(ex.id);
    setExercises(prev => ({ ...prev, [activeSession.id]: newDone }));
    await api.patch(`/workouts/sessions/${activeSession.id}/exercises/${ex.id}/toggle`, { completed: isNowDone }).catch(console.error);
  }

  function openSession(s) {
    // Buscar la sesión completa (con ejercicios) en el plan
    const full = plan?.workout_sessions?.find(ws => ws.id === s.id) ?? s;
    setSelectedSession(full);
  }

  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div>
      <div className="section pb-0">
        <h1 className="text-2xl font-bold tracking-tight">Mis Planes</h1>
      </div>

      {allDone ? (
        <div className="section">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-10"
          >
            <Trophy size={36} className="text-accent mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-1">¡Plan completado!</h2>
            <p className="text-txt3 mb-6 text-sm">Terminaste las {plan.workout_sessions?.length} sesiones del plan. ¿Listo para el siguiente?</p>
            <button className="btn btn-primary" onClick={generatePlan} disabled={generating}>
              {generating ? 'Generando...' : <><Sparkles size={14} /> Generar nuevo plan</>}
            </button>
            {genError && <p className="text-[12px] text-red-400 mt-4 leading-snug">{genError}</p>}
          </motion.div>
        </div>
      ) : !plan ? (
        <div className="section">
          <div className="card text-center py-10">
            <Sparkles size={32} className="text-accent mx-auto mb-4" />
            <p className="text-txt3 mb-6 text-sm">No tienes un plan activo</p>
            <button className="btn btn-primary" onClick={generatePlan} disabled={generating}>
              {generating ? 'Generando...' : 'Generar plan con IA'}
            </button>
            {genError && (
              <p className="text-[12px] text-red-400 mt-4 leading-snug">{genError}</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="section">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card border-l-[3px] border-l-accent"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-block bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Semana {plan.current_week} de {plan.total_weeks}
                  {activeSession?.day_order ? ` · Día ${activeSession.day_order}` : ''}
                </span>
                {activeSession && activeSession.scheduled_date !== today && (
                  <span className="inline-block bg-surface2 text-txt3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {new Date(activeSession.scheduled_date + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1">{activeSession?.day_order ? `Día ${activeSession.day_order}` : (activeSession?.name ?? plan.name)}</h2>
              <p className="text-xs text-txt3 mb-4">
                {(activeSession?.focus_areas ?? plan.focus_areas)?.join(' · ')}
              </p>
              <div className="flex gap-1.5 flex-wrap mb-5">
                {activeSession?.estimated_duration && (
                  <span className="pill bg-accent-dim text-accent">{activeSession.estimated_duration} min</span>
                )}
                {exList.length > 0 && (
                  <span className="pill bg-blue-dim text-blue">{exList.length} ejercicios</span>
                )}
                {activeSession?.rpe_target && (
                  <span className="pill bg-[#2a1f00] text-[#fb923c]">RPE {activeSession.rpe_target}</span>
                )}
              </div>
              {activeSession && !isCompleted && (
                <button className="btn btn-primary" onClick={() => onStartWorkout(activeSession)}>
                  <Play size={16} fill="white" /> Iniciar ahora
                </button>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 mt-2 text-green text-sm font-medium">
                  <Check size={16} /> Sesión completada
                  {nextSession && <span className="text-txt3 font-normal">· Próxima: {nextSession.name}</span>}
                </div>
              )}
            </motion.div>
          </div>

          {exList.length > 0 && (
            <div className="section pt-0">
              <div className="card !p-0 overflow-hidden">
                {exList.map((ex, i) => {
                  const isDone    = done.has(ex.id);
                  const isNext    = !isDone && !isCompleted && [...done].length === i;
                  return (
                    <div key={ex.id}
                      className={`flex items-center gap-3.5 px-4 py-3.5 border-b border-border last:border-b-0 cursor-pointer transition-all
                        ${isDone ? 'opacity-40' : ''}
                        ${isNext ? 'bg-accent/5' : ''}
                      `}
                      onClick={() => !isCompleted && toggleExercise(ex)}
                    >
                      {/* Número / check */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                        ${isDone ? 'bg-accent text-white' : isNext ? 'bg-accent/20 text-accent' : 'bg-surface2 text-txt3'}`}
                      >
                        {isDone ? <Check size={14} /> : i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-txt3' : 'text-txt'}`}>
                          {ex.exercise_name}
                        </div>
                        <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-[11px] text-txt3">
                            <Dumbbell size={10} className="shrink-0" />
                            {ex.sets} × {ex.reps ?? '?'} reps{ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}
                          </span>
                          {ex.rest_seconds && (
                            <span className="flex items-center gap-1 text-[11px] text-txt3">
                              <Timer size={10} className="shrink-0" />
                              {ex.rest_seconds}s descanso
                            </span>
                          )}
                        </div>
                      </div>

                      {isNext && !isDone && (
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider shrink-0">Siguiente</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {allExercisesDone && !isCompleted && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <button className="btn btn-primary" onClick={finishSession} disabled={finishing}>
                    <CheckCircle2 size={16} />
                    {finishing ? 'Finalizando...' : 'Finalizar sesión'}
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </>
      )}

      {upcoming.length > 0 && (
        <div className="section">
          <p className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-3">Próximas sesiones</p>
          {upcoming.filter(s => s.id !== activeSession?.id).slice(0, 3).map(s => {
            const d = new Date(s.scheduled_date);
            return (
              <div key={s.id} className="card flex items-center gap-3.5 mb-2 !py-3.5 cursor-pointer hover:border-accent/40 transition-colors" onClick={() => openSession(s)}>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.day_order ? `Día ${s.day_order}` : s.name}</div>
                  <div className="text-xs text-txt3">{dayLabels[d.getDay()]} · {s.estimated_duration} min · RPE {s.rpe_target}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal detalle de sesión próxima */}
      <AnimatePresence>
        {selectedSession && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/60 z-[80]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-[90] bg-surface rounded-t-3xl"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              <div className="px-5 pt-3 pb-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <p className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">
                      {selectedSession.scheduled_date
                        ? new Date(selectedSession.scheduled_date + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })
                        : 'Próxima sesión'}
                    </p>
                    <h2 className="text-lg font-bold leading-snug">{selectedSession.name}</h2>
                    <p className="text-xs text-txt3 mt-0.5">{selectedSession.focus_areas?.join(' · ')}</p>
                  </div>
                  <button onClick={() => setSelectedSession(null)}
                    className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center shrink-0 border-none cursor-pointer"
                  >
                    <X size={14} className="text-txt2" />
                  </button>
                </div>

                {/* Pills */}
                <div className="flex gap-2 mb-5">
                  {selectedSession.estimated_duration && (
                    <span className="pill bg-accent-dim text-accent flex items-center gap-1">
                      <Clock size={10} /> {selectedSession.estimated_duration} min
                    </span>
                  )}
                  {selectedSession.rpe_target && (
                    <span className="pill bg-[#2a1f00] text-[#fb923c] flex items-center gap-1">
                      <Zap size={10} /> RPE {selectedSession.rpe_target}
                    </span>
                  )}
                </div>

                {/* Ejercicios */}
                {selectedSession.session_exercises?.length > 0 && (
                  <div className="card !p-0 overflow-hidden mb-5">
                    {selectedSession.session_exercises.map((ex, i) => (
                      <div key={ex.id} className="flex items-center gap-3.5 px-4 py-3 border-b border-border last:border-b-0">
                        <div className="w-7 h-7 rounded-lg bg-surface2 flex items-center justify-center text-xs font-bold text-txt3 shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{ex.exercise_name}</div>
                          <div className="text-xs text-txt3 mt-0.5">
                            {ex.sets} × {ex.reps ?? '?'} reps{ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}{ex.rest_seconds ? ` · ${ex.rest_seconds}s desc.` : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button className="btn btn-primary" onClick={() => { onStartWorkout(selectedSession); setSelectedSession(null); }}>
                  <Play size={16} fill="white" /> Iniciar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
