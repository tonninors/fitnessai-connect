import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Check, Calendar } from 'lucide-react';
import { api } from '../api/client.js';

export default function Plans({ onStartWorkout }) {
  const [plan,      setPlan]      = useState(null);
  const [upcoming,  setUpcoming]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exercises, setExercises] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/workouts/plan'),
      api.get('/workouts/upcoming'),
    ]).then(([p, u]) => {
      setPlan(p);
      setUpcoming(u || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-txt3 text-sm">Cargando...</div>;

  const today = new Date().toISOString().split('T')[0];
  const todaySession = plan?.workout_sessions?.find(s => s.scheduled_date === today && s.status !== 'skipped');
  const isCompleted  = todaySession?.status === 'completed';
  const nextSession  = plan?.workout_sessions?.find(s => s.scheduled_date > today && s.status === 'scheduled');
  const exList = todaySession?.session_exercises ?? [];
  const done   = isCompleted ? new Set(exList.map(e => e.id)) : (exercises[todaySession?.id] ?? new Set());

  async function generatePlan() {
    setGenerating(true);
    try {
      await api.post('/ai/generate-plan', {
        goals: 'fitness general', days_per_week: 3,
        fitness_level: 'intermediate', equipment: 'gimnasio_completo', focus_areas: 'fitness general',
      });
      const [p, u] = await Promise.all([api.get('/workouts/plan'), api.get('/workouts/upcoming')]);
      setPlan(p); setUpcoming(u || []);
    } catch (e) {
      alert(e.message || 'Error al generar el plan');
    } finally { setGenerating(false); }
  }

  async function toggleExercise(ex) {
    const newDone = new Set(done);
    const isNowDone = !newDone.has(ex.id);
    isNowDone ? newDone.add(ex.id) : newDone.delete(ex.id);
    setExercises(prev => ({ ...prev, [todaySession.id]: newDone }));
    await api.patch(`/workouts/sessions/${todaySession.id}/exercises/${ex.id}/toggle`, { completed: isNowDone }).catch(console.error);
  }

  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div>
      <div className="section pb-0">
        <h1 className="text-2xl font-bold tracking-tight">Mis Planes</h1>
      </div>

      {!plan ? (
        <div className="section">
          <div className="card text-center py-10">
            <Sparkles size={32} className="text-accent mx-auto mb-4" />
            <p className="text-txt3 mb-6 text-sm">No tienes un plan activo</p>
            <button className="btn btn-primary" onClick={generatePlan} disabled={generating}>
              {generating ? 'Generando...' : 'Generar plan con IA'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="section">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="card border-l-[3px] border-l-accent"
            >
              <span className="inline-block bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
                Semana {plan.current_week} de {plan.total_weeks}
              </span>
              <h2 className="text-xl font-bold mb-1">{todaySession?.name ?? plan.name}</h2>
              <p className="text-xs text-txt3 mb-4">
                {(todaySession?.focus_areas ?? plan.focus_areas)?.join(' · ')}
              </p>
              <div className="flex gap-1.5 flex-wrap mb-5">
                {todaySession?.estimated_duration && (
                  <span className="pill bg-accent-dim text-accent">{todaySession.estimated_duration} min</span>
                )}
                {exList.length > 0 && (
                  <span className="pill bg-blue-dim text-blue">{exList.length} ejercicios</span>
                )}
                {todaySession?.rpe_target && (
                  <span className="pill bg-[#2a1f00] text-[#fb923c]">RPE {todaySession.rpe_target}</span>
                )}
              </div>
              {todaySession && !isCompleted && (
                <button className="btn btn-primary" onClick={() => onStartWorkout(todaySession)}>
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
                  const isDone = done.has(ex.id);
                  return (
                    <div key={ex.id}
                      className={`flex items-center gap-3.5 px-5 py-3.5 border-b border-border last:border-b-0 cursor-pointer transition-opacity ${isDone ? 'opacity-40' : ''}`}
                      onClick={() => !isCompleted && toggleExercise(ex)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${isDone ? 'bg-accent text-white' : 'bg-surface2 text-txt3'}`}>
                        {isDone ? <Check size={14} /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isDone ? 'line-through' : ''}`}>{ex.exercise_name}</div>
                        <div className="text-xs text-txt3 mt-0.5">
                          {ex.sets} × {ex.reps ?? '?'} reps{ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}{ex.rest_seconds ? ` · ${ex.rest_seconds}s desc.` : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {upcoming.length > 0 && (
        <div className="section">
          <p className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-3">Próximas sesiones</p>
          {upcoming.slice(0, 3).map(s => {
            const d = new Date(s.scheduled_date);
            return (
              <div key={s.id} className="card flex items-center gap-3.5 mb-2 !py-3.5">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-txt3">{dayLabels[d.getDay()]} · {s.estimated_duration} min · RPE {s.rpe_target}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
