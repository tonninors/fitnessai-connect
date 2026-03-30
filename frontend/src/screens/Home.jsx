import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { api } from '../api/client.js';

export default function Home({ onStartWorkout, onNavigate }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/home').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-5 pt-2">
      <div className="mb-5">
        <div className="skeleton h-2.5 w-20 mb-2.5" />
        <div className="skeleton h-9 w-40 mb-3" />
        <div className="skeleton h-[3px] w-10" />
      </div>
      <div className="skeleton h-48 rounded-2xl mb-2.5" />
      <div className="skeleton h-36 rounded-2xl mb-2.5" />
      <div className="skeleton h-14 rounded-2xl" />
    </div>
  );
  if (!data)   return null;

  const { greeting, profile, today_session, next_session, ai_insight, activity_rings, hrv } = data;
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuario';
  const rings = [
    { label: 'Movimiento', pct: activity_rings?.movement ?? 0, color: '#FF5733' },
    { label: 'Ejercicio',  pct: activity_rings?.exercise ?? 0, color: '#4CAF50' },
    { label: 'De pie',     pct: activity_rings?.standing ?? 0, color: '#60a5fa' },
  ];

  return (
    <div>
      {/* Greeting */}
      <div className="section pb-0">
        <p className="text-[11px] text-txt3 uppercase tracking-widest font-semibold mb-2">{greeting}</p>
        <h1 className="text-[34px] font-extrabold tracking-tighter leading-none mb-3">{firstName}</h1>
        <div className="w-10 h-[3px] bg-accent rounded-full" />
      </div>

      {/* Today's workout */}
      <div className="section">
        {today_session ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card border-l-[3px] border-l-accent"
          >
            <div className="flex items-center gap-1.5 text-[10px] text-accent font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={12} /> Entrenamiento de hoy
            </div>
            <h2 className="text-xl font-bold mb-1">{today_session.name}</h2>
            <p className="text-xs text-txt3 mb-5">
              {profile?.trainer_profiles ? `${profile.trainer_profiles.full_name} · ` : ''}
              {today_session.estimated_duration} min
            </p>
            <div className="flex gap-0 mb-5 bg-surface2 rounded-xl overflow-hidden border border-border">
              <Stat val={today_session.session_exercises?.length ?? 0} label="Ejercicios" />
              <Stat val={today_session.estimated_calories ?? '—'} label="Kcal" />
              <Stat val={today_session.rpe_target ?? '—'} label="RPE" />
            </div>
            <button className="btn btn-primary" onClick={() => onStartWorkout(today_session)}
              disabled={today_session.status === 'completed'}
            >
              {today_session.status === 'completed'
                ? <><Check size={16} /> Completado</>
                : <><Play size={16} fill="white" /> Iniciar entrenamiento</>
              }
            </button>
          </motion.div>
        ) : next_session ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card border-l-[3px] border-l-accent cursor-pointer hover:border-accent/40 transition-colors"
            onClick={() => onNavigate('plans')}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-txt3 font-semibold uppercase tracking-wider mb-3">
              <Calendar size={12} /> Próximo entrenamiento
            </div>
            <h2 className="text-xl font-bold mb-1">{next_session.name}</h2>
            <p className="text-xs text-txt3 mb-4">
              {new Date(next_session.scheduled_date + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
              {next_session.estimated_duration ? ` · ${next_session.estimated_duration} min` : ''}
            </p>
            <button className="btn btn-surface btn-sm" onClick={() => onNavigate('plans')}>
              <ChevronRight size={14} /> Ver plan completo
            </button>
          </motion.div>
        ) : (
          <div className="card flex items-center justify-between gap-4">
            <p className="text-sm text-txt3">Sin plan activo</p>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('plans')}>
              <Sparkles size={14} /> Generar plan
            </button>
          </div>
        )}
      </div>

      {/* Activity rings */}
      <div className="section pt-0">
        <div className="card">
          <p className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-5">Actividad de hoy</p>
          <div className="flex justify-around">
            {rings.map(({ label, pct, color }) => (
              <div key={label} className="flex flex-col items-center gap-2.5">
                <Ring pct={pct} color={color} />
                <span className="text-[10px] text-txt3 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI insight */}
      {(ai_insight || hrv) && (
        <div className="section pt-0">
          <div className="card border-l-[3px] border-l-accent flex gap-3 items-start">
            <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-txt2 leading-relaxed">
              {ai_insight ?? `Tu HRV hoy es ${hrv}. Mantén la intensidad moderada.`}
            </p>
          </div>
        </div>
      )}

      {/* Trainer card */}
      {profile?.trainer_profiles && (
        <div className="section pt-0">
          <div className="card flex items-center gap-3.5 cursor-pointer" onClick={() => onNavigate('chat')}>
            <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
              {profile.trainer_profiles.full_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{profile.trainer_profiles.full_name}</div>
              <div className="text-xs text-txt3 mt-0.5">
                {profile.trainer_profiles.rating} · {profile.trainer_profiles.specialties?.[0]}
              </div>
            </div>
            <ChevronRight size={18} className="text-txt3" />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ val, label }) {
  return (
    <div className="flex-1 text-center py-3 border-r border-border last:border-r-0">
      <div className="font-metric text-2xl font-bold">{val}</div>
      <div className="text-[10px] text-txt3 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}

function Ring({ pct, color }) {
  const r = 30, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative" style={{ width: 76, height: 76 }}>
      <svg width="76" height="76" style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        <circle cx="38" cy="38" r={r} fill="none" stroke="#222" strokeWidth="7" />
        <motion.circle
          cx="38" cy="38" r={r}
          fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-metric text-[15px] font-bold leading-none" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
}
