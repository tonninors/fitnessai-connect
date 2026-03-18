import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

export default function Plans({ onStartWorkout }) {
  const [plan,      setPlan]      = useState(null);
  const [upcoming,  setUpcoming]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exercises, setExercises] = useState({});   // { sessionId: Set<exerciseId> }

  useEffect(() => {
    Promise.all([
      api.get('/workouts/plan'),
      api.get('/workouts/upcoming'),
    ]).then(([p, u]) => {
      setPlan(p);
      setUpcoming(u || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24, color: 'var(--text-2)' }}>Cargando...</div>;

  // Sesión de hoy (primera del plan activo)
  const today = new Date().toISOString().split('T')[0];
  const todaySession    = plan?.workout_sessions?.find(s => s.scheduled_date === today && s.status !== 'skipped');
  const isCompleted     = todaySession?.status === 'completed';
  const nextSession     = plan?.workout_sessions?.find(s => s.scheduled_date > today && s.status === 'scheduled');
  const exList = todaySession?.session_exercises ?? [];
  const done   = isCompleted
    ? new Set(exList.map(e => e.id))
    : (exercises[todaySession?.id] ?? new Set());

  async function generatePlan() {
    setGenerating(true);
    try {
      await api.post('/ai/generate-plan', {
        goals:         'fitness general',
        days_per_week: 3,
        fitness_level: 'intermediate',
        equipment:     'gimnasio_completo',
        focus_areas:   'fitness general',
      });
      const [p, u] = await Promise.all([api.get('/workouts/plan'), api.get('/workouts/upcoming')]);
      setPlan(p);
      setUpcoming(u || []);
    } catch (e) {
      alert(e.message || 'Error al generar el plan');
    } finally {
      setGenerating(false);
    }
  }

  async function toggleExercise(ex) {
    const newDone = new Set(done);
    const isNowDone = !newDone.has(ex.id);
    isNowDone ? newDone.add(ex.id) : newDone.delete(ex.id);
    setExercises(prev => ({ ...prev, [todaySession.id]: newDone }));

    await api.patch(
      `/workouts/sessions/${todaySession.id}/exercises/${ex.id}/toggle`,
      { completed: isNowDone }
    ).catch(console.error);
  }

  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div>
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="section-title">Mis Planes</div>
      </div>

      {!plan ? (
        <div className="section">
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-2)', marginBottom: 16 }}>
              No tienes un plan activo todavía
            </p>
            <button className="btn btn-primary" onClick={generatePlan} disabled={generating}>
              {generating ? '⏳ Generando...' : '✦ Generar plan con IA'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Plan hero */}
          <div className="section">
            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>
                Esta semana · Semana {plan.current_week} de {plan.total_weeks}
              </div>
              <div className="workout-title">
                {todaySession?.name ?? plan.name}
              </div>
              <div className="workout-meta">
                {(todaySession?.focus_areas ?? plan.focus_areas)?.join(' · ')}
                {plan.ai_generated && ' · IA-adaptado'}
              </div>
              <div className="pills">
                {todaySession?.estimated_duration && (
                  <span className="pill pill-pink">{todaySession.estimated_duration} min</span>
                )}
                {exList.length > 0 && (
                  <span className="pill pill-blue">{exList.length} ejercicios</span>
                )}
                {todaySession?.rpe_target && (
                  <span className="pill pill-orange">RPE {todaySession.rpe_target}</span>
                )}
                {plan.ai_generated && (
                  <span className="pill pill-green">IA ✓</span>
                )}
              </div>
              {todaySession && !isCompleted && (
                <button className="btn btn-primary" onClick={() => onStartWorkout(todaySession)}>
                  ▶ Iniciar ahora
                </button>
              )}
              {isCompleted && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: 'var(--primary)', fontSize: 14, fontWeight: 600 }}>
                  ✓ Sesión completada hoy
                  {nextSession && <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>· Próxima: {nextSession.name}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Exercise list */}
          {exList.length > 0 && (
            <div className="section">
              <div className="card">
                {exList.map((ex, i) => (
                  <div
                    key={ex.id}
                    className={`exercise-item${done.has(ex.id) ? ' done' : ''}`}
                    onClick={() => !isCompleted && toggleExercise(ex)}
                  >
                    <div className="ex-num">{i + 1}</div>
                    <div className="ex-info">
                      <div className="ex-name">{ex.exercise_name}</div>
                      <div className="ex-detail">
                        {ex.sets} × {ex.reps ?? '?'} reps
                        {ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}
                        {ex.rest_seconds ? ` · Descanso ${ex.rest_seconds}s` : ''}
                      </div>
                    </div>
                    <div className="ex-check">
                      {done.has(ex.id) && <span style={{ color: '#0a0a0f', fontSize: 14 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Upcoming sessions */}
      {upcoming.length > 0 && (
        <div className="section">
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>Próximas sesiones</div>
          {upcoming.slice(0, 3).map(s => {
            const d   = new Date(s.scheduled_date);
            const day = dayLabels[d.getDay()];
            return (
              <div key={s.id} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--surface2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-2)',
                }}>
                  {day}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                    {s.estimated_duration} min · RPE {s.rpe_target}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
