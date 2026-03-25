import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Flame, Crown, MessageCircle, Link2, Sparkles } from 'lucide-react';
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

  if (loading) return <div className="p-10 text-txt3 text-sm">Cargando...</div>;

  const activeCount  = trainer?.active_clients ?? clients.length;
  const withStreak   = clients.filter(c => c.current_streak > 0).length;
  const proClients   = clients.filter(c => c.subscription_plan !== 'free').length;

  const stats = [
    { val: activeCount,       label: 'Clientes activos', color: 'text-accent', Icon: Users },
    { val: trainer?.rating ?? '5.0', label: 'Rating',    color: 'text-[#fb923c]', Icon: Star },
    { val: withStreak,        label: 'Con racha',        color: 'text-blue', Icon: Flame },
    { val: proClients,        label: 'Pro / Elite',      color: 'text-green', Icon: Crown },
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
      <div className="section pb-0">
        <p className="text-[10px] text-txt3 uppercase tracking-wider mb-1">Vista de entrenador</p>
        <h1 className="text-[32px] font-extrabold tracking-tight leading-none">
          {trainer?.full_name?.split(' ')[0] ?? 'Coach'}
        </h1>
      </div>

      {/* Stats grid */}
      <div className="section">
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map(({ val, label, color, Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="card"
            >
              <Icon size={16} className={`${color} mb-2`} />
              <div className={`font-metric text-[40px] font-bold leading-none ${color}`}>{val}</div>
              <div className="text-[10px] text-txt3 uppercase tracking-wider mt-2">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      {trainer?.specialties?.length > 0 && (
        <div className="section pt-0">
          <div className="flex gap-1.5 flex-wrap">
            {trainer.specialties.map(s => (
              <span key={s} className="pill bg-green/15 text-green">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Clients */}
      <div className="section pt-0">
        <p className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-3">Mis clientes</p>

        {clients.length === 0 ? (
          <div className="card text-center py-8">
            <Users size={32} className="text-txt3 mx-auto mb-3" />
            <p className="text-sm text-txt3 mb-4">Aún no tienes clientes asignados.</p>
            <button className="btn btn-surface btn-sm inline-flex items-center gap-2 mx-auto">
              <Link2 size={14} /> Compartir enlace de invitación
            </button>
          </div>
        ) : (
          <div className="card !p-0 overflow-hidden">
            {clients.map(client => (
              <div key={client.id} className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border last:border-b-0">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
                  {client.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{client.full_name}</div>
                  <div className="text-xs text-txt3 mt-0.5">
                    {client.level_name} · {lastSeen(client.updated_at)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {client.current_streak > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#fb923c]">
                      <Flame size={12} /> {client.current_streak}d
                    </span>
                  )}
                  <button className="btn btn-surface btn-sm !py-1.5 !px-3 text-xs flex items-center gap-1.5">
                    <MessageCircle size={12} /> Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan info */}
      {trainer && (
        <div className="section pt-0">
          <div className="card border-l-[3px] border-l-accent flex gap-3 items-start">
            <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-txt2 leading-relaxed">
              Plan <strong className="text-accent">{trainer.plan?.toUpperCase()}</strong> —{' '}
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
