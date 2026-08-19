import { motion } from 'framer-motion';
import { Play, Check, Sparkles, ChevronRight, Calendar, ChevronUp } from 'lucide-react';
import { api } from '../api/client.js';
import { useApiData } from '../hooks/useApiData.js';
import ErrorState from '../components/ErrorState.jsx';
import { todayISO, weekDays, formatDate, WEEKDAY_INITIALS } from '../lib/dates.js';
import {
  BLOCK_META,
  exerciseType,
  isTimed,
  totalSets,
  nextPendingExercise,
  completionPercent,
  formatDuration,
} from '../lib/workout.js';

export default function Home({
  onStartWorkout,
  onNavigate,
  runningSession,
  onResumeWorkout,
  liveCompleted,
  liveActiveEx,
}) {
  const { data, loading, error, reload } = useApiData(() => api.get('/home'));

  if (loading) return <HomeSkeleton />;
  if (error) {
    return (
      <ErrorState
        title="No se pudo cargar tu inicio"
        message={error}
        onRetry={reload}
      />
    );
  }
  if (!data) return null;

  const { greeting, profile, today_session, next_session, ai_insight, activity_rings, hrv, week_sessions } = data;
  const today = todayISO();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuario';
  const rings = [
    { label: 'Movimiento', pct: activity_rings?.movement ?? 0, color: '#FF5733' },
    { label: 'Ejercicio',  pct: activity_rings?.exercise ?? 0, color: '#4CAF50' },
    { label: 'De pie',     pct: activity_rings?.standing ?? 0, color: '#60a5fa' },
  ];

  return (
    <div>
      {/* Saludo */}
      <div className="section pb-0">
        <p className="text-[11px] text-txt3 uppercase tracking-widest font-semibold mb-2">{greeting}</p>
        <h1 className="text-[34px] font-extrabold tracking-tighter leading-none mb-3">{firstName}</h1>
        <div className="w-10 h-[3px] bg-accent rounded-full" />
      </div>

      {/* Semana */}
      {week_sessions?.length > 0 && (
        <div className="section pt-3 pb-0">
          <WeekStrip sessions={week_sessions} today={today} />
        </div>
      )}

      {/* Entrenamiento en curso */}
      {runningSession && (
        <div className="section pb-0">
          <RunningSessionCard
            session={runningSession}
            completed={liveCompleted ?? new Set()}
            activeEx={liveActiveEx}
            onResume={onResumeWorkout}
          />
        </div>
      )}

      {/* Entrenamiento de hoy */}
      <div className="section">
        {today_session ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card border-l-[3px] border-l-accent"
          >
            <p className="flex items-center gap-1.5 text-[10px] text-accent font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={12} aria-hidden="true" /> Entrenamiento de hoy
            </p>
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onStartWorkout(today_session)}
              disabled={today_session.status === 'completed'}
            >
              {today_session.status === 'completed'
                ? <><Check size={16} aria-hidden="true" /> Completado</>
                : <><Play size={16} fill="white" aria-hidden="true" /> Iniciar entrenamiento</>}
            </button>
          </motion.div>
        ) : next_session ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card border-l-[3px] border-l-accent"
          >
            <p className="flex items-center gap-1.5 text-[10px] text-txt3 font-semibold uppercase tracking-wider mb-3">
              <Calendar size={12} aria-hidden="true" /> Próximo entrenamiento
            </p>
            <h2 className="text-xl font-bold mb-1">
              {next_session.day_order ? `Día ${next_session.day_order}` : next_session.name}
            </h2>
            <p className="text-xs text-txt3 mb-4">
              {formatDate(next_session.scheduled_date)}
              {next_session.estimated_duration ? ` · ${next_session.estimated_duration} min` : ''}
            </p>
            <button type="button" className="btn btn-surface btn-sm" onClick={() => onNavigate('plans')}>
              <ChevronRight size={14} aria-hidden="true" /> Ver plan completo
            </button>
          </motion.div>
        ) : (
          <div className="card flex items-center justify-between gap-4">
            <p className="text-sm text-txt3">Sin plan activo</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onNavigate('plans')}>
              <Sparkles size={14} aria-hidden="true" /> Generar plan
            </button>
          </div>
        )}
      </div>

      {/* Anillos de actividad */}
      <div className="section pt-0">
        <div className="card">
          <p className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-5">Actividad de hoy</p>
          <div className="flex justify-around">
            {rings.map(({ label, pct, color }) => (
              <div key={label} className="flex flex-col items-center gap-2.5">
                <Ring pct={pct} color={color} label={label} />
                <span className="text-[10px] text-txt3 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight de IA */}
      {(ai_insight || hrv) && (
        <div className="section pt-0">
          <div className="card border-l-[3px] border-l-accent flex gap-3 items-start">
            <Sparkles size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-txt2 leading-relaxed">
              {ai_insight ?? `Tu HRV hoy es ${hrv}. Mantén la intensidad moderada.`}
            </p>
          </div>
        </div>
      )}

      {/* Entrenador */}
      {profile?.trainer_profiles && (
        <div className="section pt-0">
          <button
            type="button"
            className="card w-full text-left flex items-center gap-3.5 cursor-pointer"
            onClick={() => onNavigate('chat')}
          >
            <span className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
              {profile.trainer_profiles.full_name?.[0]}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold truncate">{profile.trainer_profiles.full_name}</span>
              <span className="block text-xs text-txt3 mt-0.5">
                {profile.trainer_profiles.rating} · {profile.trainer_profiles.specialties?.[0]}
              </span>
            </span>
            <ChevronRight size={18} className="text-txt3" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="p-5 pt-2" aria-busy="true" aria-label="Cargando inicio">
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
}

function RunningSessionCard({ session, completed, activeEx, onResume }) {
  const all = session.session_exercises ?? [];
  const total = all.length;
  const doneCount = completed.size;
  const current = nextPendingExercise(all, completed);
  const blockLabel = current ? BLOCK_META[exerciseType(current)].label : null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onResume}
      className="w-full text-left card border border-accent/30 cursor-pointer hover:border-accent/50 transition-colors !py-3.5"
      aria-label="Volver al entrenamiento en curso"
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">En vivo</span>
          <span className="text-txt3 text-[10px] mx-1">·</span>
          <span className="text-txt3 text-[10px] truncate max-w-[140px]">{session.name}</span>
        </span>
        <span className="text-txt3 text-[10px] shrink-0">{doneCount}/{total}</span>
      </div>

      <div className="w-full h-[3px] bg-border rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${completionPercent(total, doneCount)}%` }}
        />
      </div>

      {activeEx ? (
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-accent/15 flex items-center justify-center shrink-0">
            <ChevronUp size={12} className="text-accent rotate-90" aria-hidden="true" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-xs font-semibold text-txt truncate">{activeEx.name}</span>
            <span className="block text-[10px] text-txt3 mt-0.5">
              Serie {activeEx.setNum} de {activeEx.totalSets}
            </span>
          </span>
          <span className="flex gap-1 shrink-0">
            {Array.from({ length: activeEx.totalSets }).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < activeEx.setNum - 1 ? 'bg-accent'
                    : i === activeEx.setNum - 1 ? 'bg-accent animate-pulse'
                    : 'bg-border'
                }`}
              />
            ))}
          </span>
        </div>
      ) : current ? (
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-accent/15 flex items-center justify-center shrink-0">
            <ChevronUp size={12} className="text-accent rotate-90" aria-hidden="true" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-xs font-semibold text-txt truncate">{current.exercise_name}</span>
            <span className="block text-[10px] text-txt3 mt-0.5">
              {blockLabel}
              {isTimed(current)
                ? ` · ${formatDuration(current.duration_seconds)}`
                : current.reps
                  ? ` · ${totalSets(current)}×${current.reps}${current.weight_kg ? ` · ${current.weight_kg}kg` : ''}`
                  : ''}
            </span>
          </span>
        </div>
      ) : (
        <p className="text-xs text-txt3">Todos los ejercicios completados</p>
      )}
    </motion.button>
  );
}

function WeekStrip({ sessions, today }) {
  // `weekDays` opera sobre strings YYYY-MM-DD: no hay desfase de zona horaria.
  const days = weekDays(today).map((dateStr, i) => ({
    dateStr,
    label: WEEKDAY_INITIALS[i],
    session: sessions.find(s => s.scheduled_date === dateStr),
  }));

  return (
    <ul className="flex justify-between items-end px-1 list-none">
      {days.map(({ dateStr, label, session }) => {
        const isToday = dateStr === today;
        const isCompleted = session?.status === 'completed';
        const isPast = dateStr < today;
        const hasSession = !!session;

        return (
          <li key={dateStr} className="flex flex-col items-center gap-1.5">
            <span className={`text-[10px] font-semibold uppercase ${isToday ? 'text-accent' : 'text-txt3'}`}>
              {label}
            </span>
            <span
              data-testid={`week-day-${dateStr}`}
              data-today={isToday ? 'true' : 'false'}
              data-status={isCompleted ? 'completed' : hasSession ? 'pending' : 'empty'}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all
                ${isCompleted ? 'bg-green/20 border border-green'
                  : isToday && hasSession ? 'border-2 border-accent'
                  : hasSession && !isPast ? 'border border-border'
                  : 'bg-transparent'}`}
            >
              {isCompleted
                ? <Check size={12} className="text-green" strokeWidth={2.5} aria-hidden="true" />
                : isToday && hasSession
                  ? <span className="w-2 h-2 rounded-full bg-accent" />
                  : hasSession
                    ? <span className="w-1.5 h-1.5 rounded-full bg-border" />
                    : <span className="w-1 h-1 rounded-full bg-surface2" />}
            </span>
          </li>
        );
      })}
    </ul>
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

function Ring({ pct, color, label }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div
      className="relative"
      style={{ width: 76, height: 76 }}
      role="img"
      aria-label={`${label}: ${pct}%`}
    >
      <svg width="76" height="76" style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }} aria-hidden="true">
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
