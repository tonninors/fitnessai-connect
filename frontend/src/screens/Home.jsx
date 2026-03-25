import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Check, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '../api/client.js';

export default function Home({ onStartWorkout, onNavigate }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/home').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-txt3 text-sm">Cargando...</div>;
  if (!data)   return null;

  const { greeting, profile, today_session, ai_insight, activity_rings, hrv } = data;
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
        <p className="text-xs text-txt3 uppercase tracking-wider mb-1">{greeting}</p>
        <h1 className="text-[32px] font-extrabold tracking-tight leading-none">{firstName}</h1>
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
        ) : (
          <div className="card flex items-center justify-between gap-4">
            <p className="text-sm text-txt3">Sin entrenamiento hoy</p>
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
                <span className="font-metric text-lg font-bold text-txt">{pct}%</span>
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
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="68" height="68" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="34" cy="34" r={r} fill="none" stroke="#222" strokeWidth="5" />
      <motion.circle
        cx="34" cy="34" r={r}
        fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}
