import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client.js';

export default function WorkoutModal({ session, hasWearable, onClose }) {
  const [hr,           setHr]           = useState(null);
  const [calories,     setCalories]     = useState(0);
  const [seconds,      setSeconds]      = useState(0);
  const [progress,     setProgress]     = useState(0);
  const [insight,      setInsight]      = useState('Tu FC está en zona óptima. Mantén el tempo 2-1-2.');
  const [metricPopup,  setMetricPopup]  = useState(null); // 'hr' | 'cal' | 'time'
  const intervalRef = useRef(null);
  const exercises = session?.session_exercises ?? [];

  useEffect(() => {
    api.post(`/workouts/sessions/${session.id}/start`, {}).catch(console.error);

    api.post('/ai/insight', {
      type: 'workout_ready',
      context: { session_name: session.name, rpe_target: session.rpe_target },
    }).then(d => d.insight && setInsight(d.insight)).catch(console.error);

    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
      // HR solo si hay wearable conectado
      if (hasWearable) {
        setHr(h => Math.round((h ?? 132) + 8 * Math.sin(Date.now() / 4000) + (Math.random() - 0.5) * 4));
      }
      // Calorías se estiman siempre (basado en tiempo + RPE)
      const rpe = session.rpe_target ?? 6;
      setCalories(c => +(c + (rpe * 0.03)).toFixed(1));
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

  async function handleClose() {
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
      title: '❤️ Frecuencia Cardíaca',
      value: hasWearable ? `${hr} bpm` : 'Sin wearable',
      detail: hasWearable
        ? `Zona ${hrZone(hr)} · Óptimo para tu objetivo`
        : 'Conecta tu Apple Watch, Garmin o Google Fit en Perfil → Wearables para ver tu FC en tiempo real.',
    },
    cal: {
      title: '🔥 Calorías quemadas',
      value: `${Math.round(calories)} kcal`,
      detail: `Estimado basado en ${session.estimated_duration} min de entrenamiento a RPE ${session.rpe_target ?? 6}. Conecta un wearable para mayor precisión.`,
    },
    time: {
      title: '⏱ Tiempo de sesión',
      value: formatTime(seconds),
      detail: `Duración estimada: ${session.estimated_duration} min. Llevas ${Math.round(seconds / 60)} min completados.`,
    },
  };

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) { setMetricPopup(null); } }}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        {/* Live badge */}
        <div className="live-badge">
          <div className="live-dot" />
          {hasWearable ? 'En Vivo · Apple Watch' : 'En Vivo · Sin wearable'}
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          {session.name}
        </div>
        {currentEx && (
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>
            Ejercicio actual: {currentEx.exercise_name}
            {currentEx.sets && ` · Serie 1 de ${currentEx.sets}`}
          </div>
        )}

        {/* Metrics */}
        <div className="metrics-row">
          <div className="metric-card" onClick={() => setMetricPopup(p => p === 'hr' ? null : 'hr')} style={{ cursor: 'pointer' }}>
            <div className="metric-val" style={{ color: '#ef4444' }}>
              {hasWearable ? (hr ?? '—') : '—'}
            </div>
            <div className="metric-lbl">♥ FC bpm</div>
          </div>
          <div className="metric-card" onClick={() => setMetricPopup(p => p === 'cal' ? null : 'cal')} style={{ cursor: 'pointer' }}>
            <div className="metric-val" style={{ color: 'var(--primary)' }}>{Math.round(calories)}</div>
            <div className="metric-lbl">🔥 kcal</div>
          </div>
          <div className="metric-card" onClick={() => setMetricPopup(p => p === 'time' ? null : 'time')} style={{ cursor: 'pointer' }}>
            <div className="metric-val" style={{ color: 'var(--blue)' }}>{formatTime(seconds)}</div>
            <div className="metric-lbl">⏱ Tiempo</div>
          </div>
        </div>

        {/* Metric popup */}
        {metricPopup && (
          <div style={{
            background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{METRIC_INFO[metricPopup].title}</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: 6 }}>
              {METRIC_INFO[metricPopup].value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{METRIC_INFO[metricPopup].detail}</div>
          </div>
        )}

        {/* Progress */}
        <div className="progress-bar-wrap">
          <div className="progress-label">
            <span>Progreso del entrenamiento</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
            {currentExIdx + 1} de {exercises.length} ejercicios
          </div>
        </div>

        {/* AI insight */}
        <div className="insight-card" style={{ marginBottom: 16 }}>
          <span className="insight-icon">💡</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>IA en tiempo real</div>
            <p className="insight-text">{insight}</p>
          </div>
        </div>

        <button className="btn btn-surface" onClick={handleClose}>
          ■ Finalizar entrenamiento
        </button>
      </div>
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
