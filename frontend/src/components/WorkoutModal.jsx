import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flame, Clock, Sparkles, X, Minus } from 'lucide-react';
import { api } from '../api/client.js';

export default function WorkoutModal({ session, hasWearable, onClose, onMinimize }) {
  const [hr,          setHr]          = useState(null);
  const [calories,    setCalories]    = useState(0);
  const [seconds,     setSeconds]     = useState(0);
  const [progress,    setProgress]    = useState(0);
  const [insight,     setInsight]     = useState('Tu FC está en zona óptima. Mantén el tempo 2-1-2.');
  const [metricPopup, setMetricPopup] = useState(null);

  // Wall-clock start time → el timer no se desincroniza aunque el tab quede en background
  const startTimeRef = useRef(Date.now());
  const intervalRef  = useRef(null);
  const exercises    = session?.session_exercises ?? [];

  useEffect(() => {
    api.post(`/workouts/sessions/${session.id}/start`, {}).catch(console.error);

    api.post('/ai/insight', {
      type: 'workout_ready',
      context: { session_name: session.name, rpe_target: session.rpe_target },
    }).then(d => d.insight && setInsight(d.insight)).catch(console.error);

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(elapsed);
      if (hasWearable) {
        setHr(h => Math.round((h ?? 132) + 8 * Math.sin(Date.now() / 4000) + (Math.random() - 0.5) * 4));
      }
      const rpe = session.rpe_target ?? 6;
      setCalories(+(elapsed * (rpe * 0.03) / 60).toFixed(1));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (exercises.length > 0) {
      setProgress(Math.min(100, Math.round((seconds / (session.estimated_duration * 60)) * 100)));
    }
  }, [seconds]);

  const currentExIdx = Math.min(Math.floor(progress / 100 * exercises.length), exercises.length - 1);
  const currentEx    = exercises[currentExIdx];

  async function handleFinish() {
    clearInterval(intervalRef.current);
    await api.patch(`/workouts/sessions/${session.id}/complete`, {
      actual_duration: Math.round(seconds / 60),
      actual_calories: Math.round(calories),
      rpe_actual:      session.rpe_target,
    }).catch(console.error);
    onClose();
  }

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

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onMinimize?.(); }}>
      <motion.div className="modal-sheet"
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
          {/* Minimizar — sigue corriendo en background */}
          <button className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
            onClick={() => onMinimize?.()}
            title="Minimizar"
          >
            <Minus size={14} className="text-txt3" />
          </button>
          {/* Cerrar overlay de popup */}
          {metricPopup && (
            <button className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
              onClick={() => setMetricPopup(null)}
            >
              <X size={14} className="text-txt3" />
            </button>
          )}
        </div>

        {/* Session name */}
        <div className="text-xl font-bold mb-1">{session.name}</div>
        {currentEx && (
          <div className="text-xs text-txt3 mb-4">
            {currentEx.exercise_name}
            {currentEx.sets && ` · Serie 1 de ${currentEx.sets}`}
          </div>
        )}

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
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-txt3 font-medium">Progreso</span>
            <span className="text-xs text-accent font-semibold">{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <motion.div className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-xs text-txt3 mt-1.5">
            {currentExIdx + 1} de {exercises.length} ejercicios
          </div>
        </div>

        {/* AI insight */}
        <div className="flex gap-3 items-start bg-surface2 rounded-xl p-4 mb-4 border border-border border-l-[3px] border-l-accent">
          <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">IA en tiempo real</div>
            <p className="text-sm text-txt2 leading-relaxed">{insight}</p>
          </div>
        </div>

        <button className="btn btn-surface" onClick={handleFinish}>
          Finalizar entrenamiento
        </button>
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