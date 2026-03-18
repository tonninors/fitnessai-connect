import { useState, useEffect } from 'react';
import { supabase } from '../api/client.js';

export default function DashboardCoach({ userId }) {
  const [trainer, setTrainer] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('trainer_profiles').select('*').eq('id', userId).single(),
      supabase
        .from('profiles')
        .select('id, full_name, current_streak, longest_streak, level_name, updated_at, subscription_plan')
        .eq('trainer_id', userId),
    ]).then(([trainerRes, clientsRes]) => {
      setTrainer(trainerRes.data);
      setClients(clientsRes.data || []);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div style={{ padding: 24, color: 'var(--text-2)' }}>Cargando...</div>;

  const activeCount  = trainer?.active_clients ?? clients.length;
  const withStreak   = clients.filter(c => c.current_streak > 0).length;
  const proClients   = clients.filter(c => c.subscription_plan !== 'free').length;

  const stats = [
    { val: activeCount,              label: 'Clientes activos', color: 'var(--primary)' },
    { val: `⭐ ${trainer?.rating ?? '5.0'}`, label: 'Rating',          color: 'var(--orange)' },
    { val: withStreak,               label: 'Con racha activa', color: 'var(--blue)'   },
    { val: proClients,               label: 'Pro / Elite',      color: 'var(--accent)' },
  ];

  function lastSeen(ts) {
    if (!ts) return 'Sin actividad';
    const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
    if (diff < 60)   return `hace ${diff} min`;
    if (diff < 1440) return `hace ${Math.floor(diff / 60)}h`;
    return `hace ${Math.floor(diff / 1440)}d`;
  }

  return (
    <div>
      {/* Greeting */}
      <div className="section" style={{ paddingBottom: 0 }}>
        <p className="greeting-sub">Vista de entrenador 🏅</p>
        <p className="greeting-name">
          Hola, <span>{trainer?.full_name?.split(' ')[0] ?? 'Coach'}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="section">
        <div className="stats-grid">
          {stats.map(({ val, label, color }) => (
            <div key={label} className="stat-card">
              <div className="num" style={{ color }}>{val}</div>
              <div className="desc">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      {trainer?.specialties?.length > 0 && (
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="pills">
            {trainer.specialties.map(s => (
              <span key={s} className="pill pill-green">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Clients */}
      <div className="section">
        <div className="section-title">Mis clientes</div>

        {clients.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-2)' }}>
            <p style={{ marginBottom: 12 }}>Aún no tienes clientes asignados.</p>
            <button className="btn btn-surface btn-sm" style={{ width: 'auto', margin: '0 auto' }}>
              Compartir enlace de invitación
            </button>
          </div>
        ) : (
          clients.map(client => (
            <div key={client.id} className="card card-sm coach-client-card">
              <div className="coach-client-avatar">
                {client.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="coach-client-info">
                <div className="coach-client-name">{client.full_name}</div>
                <div className="coach-client-meta">
                  {client.level_name} · {lastSeen(client.updated_at)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                {client.current_streak > 0 && (
                  <span className="coach-streak">🔥 {client.current_streak}d</span>
                )}
                <button className="btn btn-surface btn-sm">Chat</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Plan info */}
      {trainer && (
        <div className="section">
          <div className="insight-card">
            <span className="insight-icon">💼</span>
            <p className="insight-text">
              Plan <strong style={{ color: 'var(--primary)' }}>{trainer.plan?.toUpperCase()}</strong> —{' '}
              {trainer.plan === 'elite'
                ? 'Sin comisiones, branded app activa.'
                : trainer.plan === 'pro'
                ? 'Clientes ilimitados, 15% comisión.'
                : 'Hasta 5 clientes. Upgrade para crecer sin límites.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
