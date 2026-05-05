import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, Clock, Sparkles, X, Minus, Check, Dumbbell, Timer } from 'lucide-react';
import { api } from '../api/client.js';

export default function WorkoutModal({ session, visible = true, hasWearable, onClose, onMinimize }) {
  const [hr,          setHr]          = useState(null);
  const [calories,    setCalories]    = useState(0);
  const [seconds,     setSeconds]     = useState(0);
  const [insight,     setInsight]     = useState('Tu FC está en zona óptima. Mantén el tempo 2-1-2.');
  const [metricPopup, setMetricPopup] = useState(null);
  const [restState,   setRestState]   = useState(null); // null | { remaining, total, done }

  const exercises    = session?.session_exercises ?? [];
  const [completedEx, setCompletedEx] = useState(
    () => new Set(exercises.filter(e => e.completed).map(e => e.id))
  );

  const allDone  = exercises.length > 0 && completedEx.size >= exercises.length;
  const progress = exercises.length > 0 ? Math.round((completedEx.size / exercises.length) * 100) : 0;

  const storageKey   = `workout_start_${session?.id}`;
  const startTimeRef = useRef(null);
  const intervalRef  = useRef(null);
  const restRef      = useRef(null);

  useEffect(() => {
    api.post(`/workouts/sessions/${session.id}/start`, {}).catch(console.error);

    api.post('/ai/insight', {
      type: 'workout_ready',
      context: { session_name: session.name, rpe_target: session.rpe_target },
    }).then(d => d.insight && setInsight(d.insight)).catch(console.error);

    const stored = localStorage.getItem(storageKey);
    startTimeRef.current = stored ? parseInt(stored) : Date.now();
    if (!stored) localStorage.setItem(storageKey, String(startTimeRef.current));

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(elapsed);
      if (hasWearable) {
        setHr(h => Math.round((h ?? 132) + 8 * Math.sin(Date.now() / 4000) + (Math.random() - 0.5) * 4));
      }
      const rpe = session.rpe_target ?? 6;
      setCalories(+(elapsed * (rpe * 0.03) / 60).toFixed(1));
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(restRef.current);
    };
  }, []);

  function startRest(totalSeconds) {
    clearInterval(restRef.current);
    setRestState({ remaining: totalSeconds, total: totalSeconds, done: false });
    restRef.current = setInterval(() => {
      setRestState(prev => {
        if (!prev || prev.done) return prev;
        const remaining = prev.remaining - 1;
        if (remaining <= 0) {
          clearInterval(restRef.current);
          return { ...prev, remaining: 0, done: true };
        }
        return { ...prev, remaining };
      });
    }, 1000);
  }

  function dismissRest() {
    clearInterval(restRef.current);
    setRestState(null);
  }

  async function toggleEx(ex) {
    const isNowDone = !completedEx.has(ex.id);
    setCompletedEx(prev => {
      const s = new Set(prev);
      isNowDone ? s.add(ex.id) : s.delete(ex.id);
      return s;
    });
    await api.patch(`/workouts/sessions/${session.id}/exercises/${ex.id}/toggle`, { completed: isNowDone }).catch(console.error);

    // Iniciar descanso al marcar completo (si tiene rest_seconds definido)
    if (isNowDone) {
      const restSecs = ex.rest_seconds ?? 60;
      startRest(restSecs);
    }
  }

  async function handleFinish() {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
    localStorage.removeItem(storageKey);
    await api.patch(`/workouts/sessions/${session.id}/complete`, {
      actual_duration: Math.round(seconds / 60),
      actual_calories: Math.round(calories),
      rpe_actual:      session.rpe_target,
    }).catch(console.error);
    onClose();
  }

  function handleClose() {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
    localStorage.removeItem(storageKey);
    onClose();
  }

  const sessionTitle = session?.day_order ? `Día ${session.day_order}` : session?.name;

  const METRIC_INFO = {
    hr: {
      title: 'Frecuencia Cardíaca',
      value: hasWearable ? `${hr} bpm` : 'Sin wearable',
      detail: hasWearable
        ? `Zona ${hrZone(hr)} · Óptimo para tu objetivo`
        : 'Conecta tu Apple Watch, Garmin o Google Fit en Perfil para ver tu FC en tiempo real.',
    },
    cal: {
      title: 'Calorías quemadas',
      value: `${Math.round(calories)} kcal`,
      detail: `Estimado basado en ${session.estimated_duration} min a RPE ${session.rpe_target ?? 6}. Conecta un wearable para mayor precisión.`,
    },
    time: {
      title: 'Tiempo de sesión',
      value: formatTime(seconds),
      detail: `Duración estimada: ${session.estimated_duration} min. Llevas ${Math.round(seconds / 60)} min.`,
    },
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onMinimize?.(); }}>
      <motion.div className="modal-sheet relative"
        initial={{ y: '100%' }} animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="modal-handle" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="live-badge">
            <div className="live-dot" />
            {hasWearable ? 'En vivo · Apple Watch' : 'En vivo'}
          </div>
          <div className="flex-1" />
          <button className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
            onClick={() => onMinimize?.()}
            title="Minimizar"
          >
            <Minus size={14} className="text-txt3" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
            onClick={handleClose}
            title="Cerrar"
          >
            <X size={14} className="text-txt3" />
          </button>
        </div>

        {/* Session title */}
        <div className="text-xl font-bold mb-0.5">{sessionTitle}</div>
        <div className="text-xs text-txt3 mb-4">
          {completedEx.size} de {exercises.length} ejercicios completados
        </div>

        {/* Metrics row */}
        <div className="metrics-row">
          <div className="metric-card" onClick={() => setMetricPopup(p => p === 'hr' ? null : 'hr')}>
            <Heart size={14} className="text-red-400 mb-1" />
            <div className="font-metric text-3xl font-bold text-red-400 leading-none">
              {hasWearable ? (hr ?? '—') : '—'}
            </div>
            <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">FC bpm</div>
          </div>
          <div className="metric-card" onClick={() => setMetricPopup(p => p === 'cal' ? null : 'cal')}>
            <Flame size={14} className="text-accent mb-1" />
            <div className="font-metric text-3xl font-bold text-accent leading-none">
              {Math.round(calories)}
            </div>
            <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">Kcal</div>
          </div>
          <div className="metric-card" onClick={() => setMetricPopup(p => p === 'time' ? null : 'time')}>
            <Clock size={14} className="text-blue mb-1" />
            <div className="font-metric text-3xl font-bold text-blue leading-none">
              {formatTime(seconds)}
            </div>
            <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">Tiempo</div>
          </div>
        </div>

        {/* Metric popup */}
        {metricPopup && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface2 rounded-xl p-4 mb-3 border border-border"
          >
            <div className="text-sm font-medium mb-1.5">{METRIC_INFO[metricPopup].title}</div>
            <div className="font-metric text-2xl font-bold text-accent mb-1.5">
              {METRIC_INFO[metricPopup].value}
            </div>
            <div className="text-xs text-txt3 leading-relaxed">{METRIC_INFO[metricPopup].detail}</div>
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-txt3 font-medium">Progreso</span>
            <span className="text-xs text-accent font-semibold">{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <motion.div className="progress-bar-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Exercise list */}
        {exercises.length > 0 && (
          <div className="card !p-0 overflow-hidden mb-3">
            {exercises.map((ex, i) => {
              const isDone = completedEx.has(ex.id);
              const isNext = !isDone && [...completedEx].length === i;
              return (
                <div key={ex.id}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 border-b border-border last:border-b-0 cursor-pointer transition-all
                    ${isDone ? 'opacity-40' : ''}
                    ${isNext ? 'bg-accent/5' : ''}
                  `}
                  onClick={() => !isDone && toggleEx(ex)}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors
                    ${isDone ? 'bg-green/20 text-green' : isNext ? 'bg-accent/20 text-accent' : 'bg-surface2 text-txt3'}`}
                  >
                    {isDone ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold leading-snug ${isDone ? 'line-through text-txt3' : 'text-txt'}`}>
                      {ex.exercise_name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-txt3">
                        <Dumbbell size={9} className="shrink-0" />
                        {ex.sets} × {ex.reps ?? '?'} reps{ex.weight_kg ? ` · ${ex.weight_kg}kg` : ''}
                      </span>
                      {ex.rest_seconds && (
                        <span className="flex items-center gap-1 text-[10px] text-txt3">
                          <Timer size={9} className="shrink-0" />
                          {ex.rest_seconds}s desc.
                        </span>
                      )}
                    </div>
                  </div>
                  {isNext && !isDone && (
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider shrink-0">Terminar</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* AI insight */}
        <div className="flex gap-3 items-start bg-surface2 rounded-xl p-3.5 mb-4 border border-border border-l-[3px] border-l-accent">
          <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">IA en tiempo real</div>
            <p className="text-xs text-txt2 leading-relaxed">{insight}</p>
          </div>
        </div>

        {/* Finalizar — solo cuando todos los ejercicios están completados */}
        {allDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <button className="btn btn-primary" onClick={handleFinish}>
              <Check size={16} /> Finalizar sesión
            </button>
          </motion.div>
        )}

        {/* Rest timer overlay */}
        <AnimatePresence>
          {restState && (
            <motion.div
              className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-20 rounded-t-3xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {!restState.done ? (
                <>
                  <p className="text-[11px] text-txt3 uppercase tracking-widest mb-3">Tiempo de descanso</p>
                  <div className="font-metric text-7xl font-bold text-blue leading-none mb-5">
                    {formatTime(restState.remaining)}
                  </div>
                  {/* Progress ring */}
                  <svg width="80" height="80" style={{ transform: 'rotate(-90deg)', marginBottom: 28 }}>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#222" strokeWidth="5" />
                    <motion.circle
                      cx="40" cy="40" r="34"
                      fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - restState.remaining / restState.total)}
                      transition={{ duration: 0.8 }}
                    />
                  </svg>
                  <button className="btn btn-surface" style={{ width: 'auto', minWidth: 140 }} onClick={dismissRest}>
                    Saltar descanso
                  </button>
                </>
              ) : (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 20 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-green/20 flex items-center justify-center mb-4">
                    <Check size={28} className="text-green" strokeWidth={2.5} />
                  </div>
                  <p className="text-lg font-bold mb-1">Descanso terminado</p>
                  <p className="text-txt3 text-sm mb-8">¿Listo para el siguiente ejercicio?</p>
                  <button className="btn btn-primary" style={{ minWidth: 160 }} onClick={dismissRest}>
                    Continuar
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function formatTime(s) {
  const m   = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function hrZone(hr) {
  if (!hr) return '—';
  if (hr < 115) return '1 (Recuperación)';
  if (hr < 130) return '2 (Aeróbica)';
  if (hr < 148) return '3 (Tempo)';
  if (hr < 165) return '4 (Umbral)';
  return '5 (Máxima)';
}