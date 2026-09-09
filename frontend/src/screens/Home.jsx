import { motion } from 'framer-motion';
import { Play, Check, Sparkles, ChevronRight, Calendar } from 'lucide-react';
import { api } from '../api/client.js';
import { useApiData } from '../hooks/useApiData.js';
import ErrorState from '../components/ErrorState.jsx';
import { todayISO, weekDays, formatDate, WEEKDAY_INITIALS } from '../lib/dates.js';
import { blockProgress, sessionFocusTitle } from '../lib/workout.js';

export default function Home({
  onStartWorkout,
  onNavigate,
  runningSession,
  onResumeWorkout,
  liveCompleted,
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

  const { greeting, profile, today_session, next_session, activity_rings, week_sessions } = data;
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

      {/* Entrenamiento de hoy: una sola tarjeta con un solo botón. Antes, con
          una sesión en curso, Inicio mostraba además una tarjeta "en vivo" con
          su propio botón: dos formas distintas de entrar al mismo
          entrenamiento. */}
      <div className="section">
        {today_session ? (
          <TodayWorkoutCard
            session={today_session}
            isRunning={runningSession?.id === today_session.id}
            liveCompleted={liveCompleted}
            onStart={() => onStartWorkout(today_session)}
            onResume={onResumeWorkout}
          />
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

function TodayWorkoutCard({ session, isRunning, liveCompleted, onStart, onResume }) {
  const exercises = session.session_exercises ?? [];
  // El progreso en vivo sólo cuenta si el entrenamiento que corre es éste.
  const segments = blockProgress(exercises, isRunning ? liveCompleted : null);
  const isCompleted = session.status === 'completed';

  const meta = [
    session.estimated_duration ? `${session.estimated_duration} min` : null,
    exercises.length ? `${exercises.length} ejercicios` : null,
  ].filter(Boolean).join(' · ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="card border-l-[3px] border-l-accent"
    >
      <p className="flex items-center gap-1.5 text-[10px] text-accent font-semibold uppercase tracking-wider mb-3">
        {isRunning ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            En vivo
          </>
        ) : (
          <>
            <Sparkles size={12} aria-hidden="true" />
            Entrenamiento de hoy
          </>
        )}
      </p>

      <h2 className="text-2xl font-bold tracking-tight mb-1">{sessionFocusTitle(session)}</h2>
      {meta && <p className="text-xs text-txt3 mb-5">{meta}</p>}

      <BlockProgress segments={segments} />

      <button
        type="button"
        className="btn btn-primary"
        onClick={isRunning ? onResume : onStart}
        disabled={isCompleted}
      >
        {isCompleted ? (
          <><Check size={16} aria-hidden="true" /> Completado</>
        ) : (
          <>
            <Play size={16} fill="white" aria-hidden="true" />
            {isRunning ? 'Continuar entrenamiento' : 'Iniciar entrenamiento'}
          </>
        )}
      </button>
    </motion.div>
  );
}

/**
 * Barra de progreso partida en los bloques que toca ese día: una parte por
 * bloque, del ancho proporcional a sus ejercicios. Al ser proporcional, lo que
 * se ve lleno coincide con el avance real de la sesión; con partes iguales, un
 * calentamiento de 3 ejercicios pesaría lo mismo que 6 de fuerza.
 */
function BlockProgress({ segments }) {
  if (segments.length === 0) return null;

  const total = segments.reduce((sum, seg) => sum + seg.total, 0);
  const done = segments.reduce((sum, seg) => sum + seg.done, 0);
  const detail = segments.map(seg => `${seg.label}, ${seg.done} de ${seg.total}`).join('. ');

  return (
    <div
      className="mb-5"
      role="img"
      aria-label={`Progreso del entrenamiento: ${done} de ${total} ejercicios. ${detail}.`}
    >
      <div className="flex gap-1.5" aria-hidden="true">
        {segments.map(seg => (
          <span
            key={seg.type}
            data-testid={`block-bar-${seg.type}`}
            className="h-2 rounded-full bg-surface2 overflow-hidden"
            style={{ flex: `${seg.total} 1 0%` }}
          >
            <span
              className={`block h-full rounded-full ${seg.dotClass} transition-[width] duration-500`}
              style={{ width: `${seg.percent}%` }}
            />
          </span>
        ))}
      </div>

      <div className="flex gap-1.5 mt-2" aria-hidden="true">
        {segments.map(seg => (
          <span
            key={seg.type}
            className={`text-[9px] uppercase tracking-wider truncate ${seg.percent === 100 ? seg.colorClass : 'text-txt3'}`}
            style={{ flex: `${seg.total} 1 0%` }}
          >
            {seg.label}
          </span>
        ))}
      </div>
    </div>
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
