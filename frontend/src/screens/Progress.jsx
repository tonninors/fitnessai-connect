import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

const PERIODS = [
  { key: '4w', label: '4S' },
  { key: '3m', label: '3M' },
  { key: '1y', label: '1A' },
];

export default function Progress() {
  const [stats,   setStats]   = useState(null);
  const [period,  setPeriod]  = useState('4w');
  const [chart,   setChart]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress/stats')
      .then(s => { setStats(s); setChart(s.weekly_volume || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!stats) return;
    api.get(`/progress/chart?period=${period}`)
      .then(setChart)
      .catch(console.error);
  }, [period]);

  if (loading) return <div style={{ padding: 24, color: 'var(--text-2)' }}>Cargando...</div>;
  if (!stats)  return null;

  const maxVal = Math.max(...chart.map(c => c.val), 1);

  const gridStats = [
    { num: stats.total_workouts, desc: 'Total este mes',       color: 'var(--primary)' },
    { num: stats.total_calories > 999 ? `${(stats.total_calories/1000).toFixed(1)}k` : stats.total_calories, desc: 'Calorías quemadas', color: 'var(--accent)' },
    { num: `${stats.total_hours}h`, desc: 'Tiempo este mes',   color: 'var(--blue)' },
    { num: stats.streak,            desc: 'Racha actual (días)', color: 'var(--orange)' },
  ];

  return (
    <div>
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="section-title">
          Progreso
          <span style={{
            fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500,
            color: 'var(--primary)', background: 'var(--primary-dim)',
            padding: '3px 8px', borderRadius: 20,
          }}>
            ↑ este mes
          </span>
        </div>
      </div>

      {/* Streak banner */}
      <div className="section">
        <div className="streak-banner">
          <div className="streak-left">
            <span className="streak-fire">🔥</span>
            <div>
              <div className="streak-days">{stats.streak} días de racha</div>
              <div className="streak-label">¡Sigue así!</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Nivel {stats.level}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{stats.level_name}</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="section">
        <div className="stats-grid">
          {gridStats.map(({ num, desc, color }) => (
            <div className="stat-card" key={desc}>
              <div className="num" style={{ color }}>{num}</div>
              <div className="desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="section">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Volumen semanal (min)</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {PERIODS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  style={{
                    background:  period === p.key ? 'var(--primary-dim)' : 'var(--surface2)',
                    color:       period === p.key ? 'var(--primary)' : 'var(--text-2)',
                    border:      period === p.key ? '1px solid rgba(110,231,183,0.3)' : '1px solid var(--border)',
                    borderRadius: 8, padding: '4px 8px', fontSize: 12, cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-wrap">
            <div className="bars">
              {chart.map((bar, i) => {
                const isLast = i === chart.length - 1;
                const height = Math.round((bar.val / maxVal) * 80);
                return (
                  <div className="bar-col" key={bar.label}>
                    <div
                      className="bar"
                      style={{
                        height: Math.max(height, 4),
                        background: isLast ? 'var(--primary)' : 'rgba(96,165,250,0.6)',
                      }}
                    />
                    <span className="bar-lbl">{bar.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI insight */}
      <div className="section">
        <div className="insight-card">
          <span className="insight-icon">📈</span>
          <p className="insight-text">
            Llevas {stats.streak} días consecutivos entrenando. Nivel {stats.level_name} desbloqueado.
            {stats.total_workouts >= 10 && ' ¡Este mes superaste los 10 entrenamientos!'}
          </p>
        </div>
      </div>
    </div>
  );
}
