import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
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
    api.get(`/progress/chart?period=${period}`).then(setChart).catch(console.error);
  }, [period]);

  if (loading) return (
    <div className="p-5 pt-2">
      <div className="mb-5">
        <div className="skeleton h-2.5 w-24 mb-2" />
        <div className="skeleton h-9 w-36" />
      </div>
      <div className="skeleton h-24 rounded-2xl mb-2.5" />
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-28 rounded-2xl" />
      </div>
      <div className="skeleton h-48 rounded-2xl" />
    </div>
  );
  if (!stats)  return null;

  const gridStats = [
    { num: stats.total_workouts, desc: 'Este mes',       color: 'text-accent' },
    { num: stats.total_calories > 999 ? `${(stats.total_calories/1000).toFixed(1)}k` : stats.total_calories, desc: 'Calorías', color: 'text-green' },
    { num: `${stats.total_hours}h`, desc: 'Tiempo',      color: 'text-blue' },
    { num: stats.streak,            desc: 'Racha (días)', color: 'text-[#fb923c]' },
  ];

  return (
    <div>
      <div className="section pb-0">
        <p className="text-[10px] text-txt3 uppercase tracking-wider mb-1">Tu progreso</p>
        <h1 className="text-[32px] font-extrabold tracking-tight leading-none">Resumen</h1>
      </div>

      {/* Streak card — fondo naranja sólido */}
      <div className="section">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 flex items-center justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF5733 0%, #D94522 55%, #B83518 100%)' }}
        >
          <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(ellipse at 85% 25%, rgba(255,255,255,0.45) 0%, transparent 65%)' }} />
          <div className="flex items-center gap-3.5 relative">
            <Flame size={32} className="text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(255,200,80,0.7))' }} />
            <div>
              <div className="font-metric text-4xl font-bold text-white leading-none">{stats.streak}</div>
              <div className="text-white/70 text-xs mt-1">Días de racha</div>
            </div>
          </div>
          <div className="text-right relative">
            <div className="text-white/70 text-xs">Nivel {stats.level}</div>
            <div className="text-white font-semibold text-sm">{stats.level_name}</div>
          </div>
        </motion.div>
      </div>

      {/* Stats grid — números grandes */}
      <div className="section pt-0">
        <div className="grid grid-cols-2 gap-2.5">
          {gridStats.map(({ num, desc, color }, i) => (
            <motion.div key={desc} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="card"
            >
              <div className={`font-metric text-[48px] font-bold leading-none ${color}`}>{num}</div>
              <div className="text-[10px] text-txt3 uppercase tracking-wider mt-2">{desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chart — recharts */}
      <div className="section pt-0">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-txt3 uppercase tracking-wider font-semibold">Volumen semanal</span>
            <div className="flex gap-1">
              {PERIODS.map(p => (
                <button key={p.key} onClick={() => setPeriod(p.key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border-none cursor-pointer transition-all ${
                    period === p.key ? 'bg-accent text-white' : 'bg-surface2 text-txt3'
                  }`}
                >{p.label}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chart.map(c => ({ name: c.label, val: c.val }))}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5733" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FF5733" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 12, color: '#fff' }}
                itemStyle={{ color: '#FF5733' }}
              />
              <Area type="monotone" dataKey="val" stroke="#FF5733" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI insight */}
      <div className="section pt-0">
        <div className="card border-l-[3px] border-l-accent flex gap-3 items-start">
          <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-txt2 leading-relaxed">
            Llevas {stats.streak} días consecutivos entrenando. Nivel {stats.level_name} desbloqueado.
            {stats.total_workouts >= 10 && ' Este mes superaste los 10 entrenamientos.'}
          </p>
        </div>
      </div>
    </div>
  );
}
