import { useState } from 'react';
import { api } from '../api/client.js';

const GOALS = [
  { id: 'perder_grasa',        label: 'Perder grasa',    icon: '🔥' },
  { id: 'ganar_musculo',       label: 'Ganar músculo',   icon: '💪' },
  { id: 'mejorar_resistencia', label: 'Resistencia',     icon: '🏃' },
  { id: 'flexibilidad',        label: 'Flexibilidad',    icon: '🧘' },
  { id: 'rendimiento',         label: 'Rendimiento',     icon: '🏆' },
  { id: 'salud_general',       label: 'Salud general',   icon: '❤️' },
];

const DAYS      = [2, 3, 4, 5, 6];
const DURATIONS = [30, 45, 60, 90];
const LEVELS    = [
  { id: 'beginner',     label: 'Principiante', desc: 'Menos de 6 meses entrenando' },
  { id: 'intermediate', label: 'Intermedio',   desc: '6 meses – 2 años' },
  { id: 'advanced',     label: 'Avanzado',     desc: 'Más de 2 años de experiencia' },
];
const EQUIPMENT = [
  { id: 'ninguno',           label: 'Sin equipo', icon: '🏠' },
  { id: 'mancuernas',        label: 'Mancuernas', icon: '🏋️' },
  { id: 'gimnasio_completo', label: 'Gimnasio',   icon: '🏟️' },
  { id: 'calistenia',        label: 'Calistenia', icon: '🤸' },
];

export default function Onboarding({ user, onComplete }) {
  const [step,     setStep]     = useState(0);
  const [goals,    setGoals]    = useState([]);
  const [days,     setDays]     = useState(3);
  const [duration, setDuration] = useState(45);
  const [level,    setLevel]    = useState('');
  const [equip,    setEquip]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Atleta';

  const toggleList = (list, setList, id) =>
    setList(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);

  const canNext = [true, goals.length > 0, true, level !== ''][step];

  async function finish() {
    setLoading(true);
    setError('');
    try {
      const goalsStr = goals.join(', ') || 'fitness general';
      const equipStr = equip.join(', ')  || 'ninguno';

      await api.patch('/profile', {
        goals:                { primary: goals[0] || null, all: goals },
        availability:         { days_per_week: days, session_duration: duration },
        onboarding_completed: true,
      });

      await api.post('/ai/generate-plan', {
        goals:         goalsStr,
        days_per_week: days,
        fitness_level: level,
        equipment:     equipStr,
        focus_areas:   goalsStr,
      });

      onComplete();
    } catch (e) {
      setError(e.message || 'Error al crear el plan. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <div className="onboard-wrap">
      {/* Topbar: back + dots */}
      <div className="onboard-topbar">
        {step > 0
          ? <button className="onboard-back" onClick={() => setStep(s => s - 1)}>←</button>
          : <div style={{ width: 32 }} />
        }
        <div className="onboard-dots">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`onboard-dot${step === i ? ' active' : step > i ? ' done' : ''}`} />
          ))}
        </div>
        <div style={{ width: 32 }} />
      </div>

      <div className="onboard-body">

        {/* Step 0 — Bienvenida */}
        {step === 0 && (
          <div className="onboard-step">
            <div className="onboard-hero-icon">🚀</div>
            <h1 className="onboard-title">¡Hola, {name}!</h1>
            <p className="onboard-sub">
              Configura tu experiencia en 4 pasos para que la IA genere tu plan perfecto.
            </p>
            <div className="onboard-features">
              {[
                { icon: '✦', text: 'Plan generado por IA en segundos' },
                { icon: '📡', text: 'Sincronización con tu wearable' },
                { icon: '👨‍💼', text: 'Conexión directa con tu entrenador' },
              ].map(({ icon, text }) => (
                <div key={text} className="onboard-feature-row">
                  <span className="onboard-feature-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Objetivos */}
        {step === 1 && (
          <div className="onboard-step">
            <h2 className="onboard-title">¿Cuál es tu objetivo?</h2>
            <p className="onboard-sub">Selecciona uno o varios</p>
            <div className="onboard-chip-grid">
              {GOALS.map(({ id, label, icon }) => (
                <div
                  key={id}
                  className={`onboard-chip${goals.includes(id) ? ' selected' : ''}`}
                  onClick={() => toggleList(goals, setGoals, id)}
                >
                  <span className="chip-icon">{icon}</span>
                  <span className="chip-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Disponibilidad */}
        {step === 2 && (
          <div className="onboard-step">
            <h2 className="onboard-title">¿Cuánto puedes entrenar?</h2>
            <p className="onboard-sub">La IA adaptará la carga a tu disponibilidad</p>

            <div className="onboard-label">Días por semana</div>
            <div className="onboard-num-row">
              {DAYS.map(d => (
                <div
                  key={d}
                  className={`onboard-num-chip${days === d ? ' selected' : ''}`}
                  onClick={() => setDays(d)}
                >{d}</div>
              ))}
            </div>

            <div className="onboard-label" style={{ marginTop: 24 }}>Duración por sesión</div>
            <div className="onboard-num-row">
              {DURATIONS.map(d => (
                <div
                  key={d}
                  className={`onboard-num-chip${duration === d ? ' selected' : ''}`}
                  onClick={() => setDuration(d)}
                >{d}m</div>
              ))}
            </div>

            <div className="insight-card" style={{ marginTop: 20 }}>
              <span className="insight-icon">🧠</span>
              <p className="insight-text">
                Con {days} días × {duration} min la IA diseñará un plan de{' '}
                {days * duration >= 210 ? 'volumen progresivo' : 'eficiencia máxima'}.
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Nivel + Equipo */}
        {step === 3 && (
          <div className="onboard-step">
            <h2 className="onboard-title">Nivel y equipo</h2>
            <p className="onboard-sub">Para calibrar la intensidad exacta</p>

            <div className="onboard-label">Experiencia</div>
            <div className="onboard-level-list">
              {LEVELS.map(({ id, label, desc }) => (
                <div
                  key={id}
                  className={`onboard-level-card${level === id ? ' selected' : ''}`}
                  onClick={() => setLevel(id)}
                >
                  <div className="onboard-level-check">{level === id ? '●' : '○'}</div>
                  <div>
                    <div className="onboard-level-name">{label}</div>
                    <div className="onboard-level-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="onboard-label" style={{ marginTop: 20 }}>Equipo disponible</div>
            <div className="onboard-chip-grid">
              {EQUIPMENT.map(({ id, label, icon }) => (
                <div
                  key={id}
                  className={`onboard-chip${equip.includes(id) ? ' selected' : ''}`}
                  onClick={() => toggleList(equip, setEquip, id)}
                >
                  <span className="chip-icon">{icon}</span>
                  <span className="chip-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="error-msg" style={{ padding: '0 20px 8px', textAlign: 'center' }}>{error}</p>}

      <div className="onboard-footer">
        {step < 3 ? (
          <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext}>
            Continuar →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={finish} disabled={loading || !canNext}>
            {loading ? '⏳ Generando tu plan...' : '✦ Crear mi plan con IA'}
          </button>
        )}
      </div>
    </div>
  );
}
