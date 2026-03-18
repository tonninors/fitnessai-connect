import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

export default function Home({ onStartWorkout }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/home').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24, color: 'var(--text-2)' }}>Cargando...</div>;
  if (!data)   return null;

  const { greeting, profile, today_session, ai_insight, activity_rings, hrv } = data;
  const rings = [
    { label: 'Movimiento', pct: activity_rings?.movement ?? 72, color: 'var(--primary)' },
    { label: 'Ejercicio',  pct: activity_rings?.exercise ?? 40, color: 'var(--accent)' },
    { label: 'De pie',     pct: activity_rings?.standing ?? 80, color: 'var(--blue)' },
  ];

  return (
    <div>
      {/* Greeting */}
      <div className="section" style={{ paddingBottom: 0 }}>
        <p className="greeting-sub">{greeting} ☀</p>
        <p className="greeting-name">Hola, <span>{profile?.full_name?.split(' ')[0] ?? 'Usuario'}</span></p>
      </div>

      {/* Today's workout */}
      {today_session ? (
        <div className="section">
          <div className="card">
            <div className="ai-badge">
              <span>✦</span>
              <span>Entrenamiento de hoy · IA Generado</span>
            </div>
            <div className="workout-title">{today_session.name}</div>
            <div className="workout-meta">
              {profile?.trainer_profiles && `con ${profile.trainer_profiles.full_name} · `}
              {today_session.estimated_duration} min estimado
            </div>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-val">{today_session.session_exercises?.length ?? 0}</span>
                <span className="stat-lbl">Ejercicios</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">{today_session.estimated_calories ?? '—'}</span>
                <span className="stat-lbl">kcal est.</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">RPE {today_session.rpe_target ?? '—'}</span>
                <span className="stat-lbl">Intensidad</span>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => onStartWorkout(today_session)}
              disabled={today_session.status === 'completed'}
            >
              {today_session.status === 'completed' ? '✓ Completado' : '▶ Iniciar Entrenamiento'}
            </button>
          </div>
        </div>
      ) : (
        <div className="section">
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-2)' }}>
            <p style={{ marginBottom: 12 }}>No tienes entrenamiento programado para hoy</p>
            <button className="btn btn-surface btn-sm" style={{ width: 'auto', margin: '0 auto' }}>
              Generar con IA
            </button>
          </div>
        </div>
      )}

      {/* Activity rings */}
      <div className="section">
        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>Actividad de hoy</div>
          <div className="rings-row">
            {rings.map(({ label, pct, color }) => (
              <div className="ring-wrap" key={label}>
                <Ring pct={pct} color={color} />
                <span className="ring-label">{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI insight / HRV */}
      {(ai_insight || hrv) && (
        <div className="section">
          <div className="insight-card">
            <span className="insight-icon">🧠</span>
            <p className="insight-text">
              {ai_insight ?? `Tu HRV hoy es ${hrv}. Mantén la intensidad moderada.`}
            </p>
          </div>
        </div>
      )}

      {/* Trainer card */}
      {profile?.trainer_profiles && (
        <div className="section">
          <div className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>💪</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{profile.trainer_profiles.full_name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                ⭐ {profile.trainer_profiles.rating} · {profile.trainer_profiles.active_clients} clientes · {profile.trainer_profiles.specialties?.[0]}
              </div>
            </div>
            <button className="btn btn-surface btn-sm">Chat</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Ring({ pct, color }) {
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="70" height="70" className="ring-svg">
      <circle className="ring-bg" cx="35" cy="35" r={r} />
      <circle
        className="ring-fg"
        cx="35" cy="35" r={r}
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
