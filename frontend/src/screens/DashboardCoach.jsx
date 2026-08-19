import { motion } from 'framer-motion';
import { Users, Star, Flame, Crown, MessageCircle, Link2, Sparkles } from 'lucide-react';
import { supabase } from '../api/client.js';
import { useApiData } from '../hooks/useApiData.js';
import ErrorState from '../components/ErrorState.jsx';
import { timeAgo } from '../lib/dates.js';

const PLAN_COPY = {
  elite: 'Sin comisiones, branded app activa.',
  pro: 'Clientes ilimitados, 15% comisión.',
  starter: 'Hasta 5 clientes. Upgrade para crecer sin límites.',
};

export function planCopy(plan) {
  return PLAN_COPY[plan] ?? PLAN_COPY.starter;
}

export default function DashboardCoach({ userId }) {
  // Antes este `Promise.all` no tenía `.catch`: cualquier fallo dejaba la
  // pantalla en "Cargando..." para siempre y provocaba un unhandled rejection.
  const { data, loading, error, reload } = useApiData(async () => {
    const [trainerRes, clientsRes] = await Promise.all([
      supabase.from('trainer_profiles').select('*').eq('id', userId).maybeSingle(),
      supabase
        .from('profiles')
        .select('id, full_name, current_streak, longest_streak, level_name, updated_at, subscription_plan')
        .eq('trainer_id', userId),
    ]);

    if (trainerRes.error) throw new Error(trainerRes.error.message);
    if (clientsRes.error) throw new Error(clientsRes.error.message);

    return { trainer: trainerRes.data, clients: clientsRes.data || [] };
  }, [userId]);

  if (loading) return <div className="p-10 text-txt3 text-sm" aria-busy="true">Cargando...</div>;
  if (error) return <ErrorState title="No se pudo cargar tu panel" message={error} onRetry={reload} />;

  const trainer = data?.trainer ?? null;
  const clients = data?.clients ?? [];

  const stats = [
    { val: trainer?.active_clients ?? clients.length, label: 'Clientes activos', color: 'text-accent', Icon: Users },
    { val: trainer?.rating ?? '5.0', label: 'Rating', color: 'text-[#fb923c]', Icon: Star },
    { val: clients.filter(c => c.current_streak > 0).length, label: 'Con racha', color: 'text-blue', Icon: Flame },
    { val: clients.filter(c => c.subscription_plan !== 'free').length, label: 'Pro / Elite', color: 'text-green', Icon: Crown },
  ];

  return (
    <div>
      <div className="section pb-0">
        <p className="text-[10px] text-txt3 uppercase tracking-wider mb-1">Vista de entrenador</p>
        <h1 className="text-[32px] font-extrabold tracking-tight leading-none">
          {trainer?.full_name?.split(' ')[0] ?? 'Coach'}
        </h1>
      </div>

      <div className="section">
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map(({ val, label, color, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="card"
            >
              <Icon size={16} className={`${color} mb-2`} aria-hidden="true" />
              <div className={`font-metric text-[40px] font-bold leading-none ${color}`}>{val}</div>
              <div className="text-[10px] text-txt3 uppercase tracking-wider mt-2">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {trainer?.specialties?.length > 0 && (
        <div className="section pt-0">
          <div className="flex gap-1.5 flex-wrap">
            {trainer.specialties.map(s => (
              <span key={s} className="pill bg-green/15 text-green">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="section pt-0">
        <p className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-3">Mis clientes</p>

        {clients.length === 0 ? (
          <div className="card text-center py-8">
            <Users size={32} className="text-txt3 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-txt3 mb-4">Aún no tienes clientes asignados.</p>
            <button type="button" className="btn btn-surface btn-sm inline-flex items-center gap-2 mx-auto" disabled>
              <Link2 size={14} aria-hidden="true" /> Compartir enlace de invitación
            </button>
            <p className="text-[11px] text-txt3 mt-3">Próximamente</p>
          </div>
        ) : (
          <ul className="card !p-0 overflow-hidden list-none">
            {clients.map(client => (
              <li key={client.id} className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border last:border-b-0">
                <span className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
                  {client.full_name?.[0]?.toUpperCase() ?? '?'}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium">{client.full_name}</span>
                  <span className="block text-xs text-txt3 mt-0.5">
                    {client.level_name} · {timeAgo(client.updated_at)}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1.5">
                  {client.current_streak > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#fb923c]">
                      <Flame size={12} aria-hidden="true" /> {client.current_streak}d
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn btn-surface btn-sm !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                    disabled
                    title="Chat con cliente — próximamente"
                  >
                    <MessageCircle size={12} aria-hidden="true" /> Chat
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {trainer && (
        <div className="section pt-0">
          <div className="card border-l-[3px] border-l-accent flex gap-3 items-start">
            <Sparkles size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-txt2 leading-relaxed">
              Plan <strong className="text-accent">{(trainer.plan ?? 'starter').toUpperCase()}</strong> — {planCopy(trainer.plan)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
