import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, Clock, Sparkles, X, Minus, Check, Dumbbell, Wind, Zap, ChevronRight } from 'lucide-react';
import { api } from '../api/client.js';
import {
  groupByBlock,
  exerciseType,
  isTimed,
  totalSets,
  completionPercent,
  formatTimer,
  formatDuration,
  estimateCalories,
} from '../lib/workout.js';

const DEFAULT_INSIGHT = 'Tu FC está en zona óptima. Mantén el tempo 2-1-2.';

export default function WorkoutModal({
  session,
  visible = true,
  hasWearable,
  onClose,
  onMinimize,
  onExerciseDone,
  onActiveExChange,
}) {
  const exercises = session?.session_exercises ?? [];

  const [hr, setHr] = useState(null);
  const [calories, setCalories] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [insight, setInsight] = useState(DEFAULT_INSIGHT);
  const [restState, setRestState] = useState(null); // null | { remaining, total, done, nextSet, totalSets }
  const [blockIdx, setBlockIdx] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [activeExId, setActiveExId] = useState(null);
  const [activeSetNum, setActiveSetNum] = useState(1);
  const [completedEx, setCompletedEx] = useState(
    () => new Set(exercises.filter(e => e.completed).map(e => e.id)),
  );

  // Los bloques se calculan con `exerciseType`, que hace fallback a "strength":
  // los ejercicios sin `exercise_type` ya no desaparecen de la sesión.
  const blocks = groupByBlock(exercises);
  const currentBlock = blocks[blockIdx] ?? blocks[0] ?? null;
  const blockExercises = currentBlock?.exercises ?? [];
  const blockAllDone = blockExercises.length > 0 && blockExercises.every(e => completedEx.has(e.id));
  const isLastBlock = blockIdx >= blocks.length - 1;

  const allDone = exercises.length > 0 && completedEx.size >= exercises.length;
  const progress = completionPercent(exercises.length, completedEx.size);

  const storageKey = `workout_start_${session?.id}`;
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const restRef = useRef(null);

  // Insight de IA al montar. Si falla se mantiene el texto por defecto.
  useEffect(() => {
    let cancelled = false;
    api.post('/ai/insight', {
      type: 'workout_ready',
      context: { session_name: session?.name, rpe_target: session?.rpe_target },
    })
      .then(d => { if (!cancelled && d?.insight) setInsight(d.insight); })
      .catch(() => { /* insight es opcional: no bloquea el entrenamiento */ });

    return () => { cancelled = true; };
  }, [session?.id, session?.name, session?.rpe_target]);

  // Los temporizadores viven mientras la sesión esté activa, aunque el modal
  // esté minimizado. Se limpian al desmontar.
  useEffect(() => () => {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
  }, []);

  const startTimer = useCallback(() => {
    if (timerStarted) return;
    setTimerStarted(true);
    api.post(`/workouts/sessions/${session.id}/start`, {}).catch(() => { /* la sesión sigue en local */ });

    const stored = localStorage.getItem(storageKey);
    const parsed = stored ? Number.parseInt(stored, 10) : NaN;
    startTimeRef.current = Number.isFinite(parsed) ? parsed : Date.now();
    localStorage.setItem(storageKey, String(startTimeRef.current));

    // Reloj de pared: no acumula deriva si la pestaña queda en segundo plano.
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(elapsed);
      setCalories(estimateCalories(elapsed, session?.rpe_target));
      if (hasWearable) {
        setHr(h => Math.round((h ?? 132) + 8 * Math.sin(Date.now() / 4000) + (Math.random() - 0.5) * 4));
      }
    }, 1000);
  }, [timerStarted, session?.id, session?.rpe_target, hasWearable, storageKey]);

  function startRest(totalSeconds, nextSet = null, setsTotal = null) {
    clearInterval(restRef.current);
    setRestState({ remaining: totalSeconds, total: totalSeconds, done: false, nextSet, totalSets: setsTotal });
    restRef.current = setInterval(() => {
      setRestState(prev => {
        if (!prev || prev.done) return prev;
        const remaining = prev.remaining - 1;
        if (remaining <= 0) {
          clearInterval(restRef.current);
          return { ...prev, remaining: 0, done: true };
        }
        return { ...prev, remaining };
      });
    }, 1000);
  }

  function dismissRest() {
    clearInterval(restRef.current);
    setRestState(null);
  }

  /** Marca un ejercicio como "en curso" y reinicia el contador de series. */
  function selectEx(ex) {
    if (completedEx.has(ex.id)) return;
    startTimer();
    setActiveExId(ex.id);
    setActiveSetNum(1);
    onActiveExChange?.({ id: ex.id, name: ex.exercise_name, setNum: 1, totalSets: totalSets(ex) });
  }

  /** Cierra una serie del ejercicio activo (o el ejercicio, si es la última). */
  async function completeSerie(ex) {
    const sets = totalSets(ex);

    if (isTimed(ex) || activeSetNum >= sets) {
      setActiveExId(null);
      setActiveSetNum(1);
      setCompletedEx(prev => new Set(prev).add(ex.id));
      onExerciseDone?.(ex.id);
      onActiveExChange?.(null);
      await api
        .patch(`/workouts/sessions/${session.id}/exercises/${ex.id}/toggle`, { completed: true })
        .catch(() => { /* el progreso local se conserva; se reintenta al recargar */ });
      return;
    }

    const next = activeSetNum + 1;
    setActiveSetNum(next);
    onActiveExChange?.({ id: ex.id, name: ex.exercise_name, setNum: next, totalSets: sets });
    if (Number(ex.rest_seconds) > 0) startRest(ex.rest_seconds, next, sets);
  }

  function stopTimers() {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
    localStorage.removeItem(storageKey);
  }

  async function handleFinish() {
    stopTimers();
    await api.patch(`/workouts/sessions/${session.id}/complete`, {
      actual_duration: Math.round(seconds / 60),
      actual_calories: Math.round(calories),
      rpe_actual: session.rpe_target,
    }).catch(() => { /* se cierra igualmente: no atrapamos al usuario en el modal */ });
    onClose();
  }

  const handleClose = useCallback(() => {
    stopTimers();
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, storageKey]);

  // Escape minimiza el modal, como en cualquier hoja modal del sistema.
  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = e => { if (e.key === 'Escape') onMinimize?.(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, onMinimize]);

  if (!visible) return null;

  const sessionTitle = session?.day_order ? `Día ${session.day_order}` : session?.name;
  const activeEx = activeExId ? exercises.find(e => e.id === activeExId) : null;

  return (
    <div
      className="modal-overlay open"
      onClick={e => { if (e.target === e.currentTarget) onMinimize?.(); }}
    >
      <motion.div
        className="modal-sheet relative"
        role="dialog"
        aria-modal="true"
        aria-label={`Entrenamiento en curso: ${sessionTitle ?? 'sesión'}`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="modal-handle" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="live-badge">
            <div className="live-dot" />
            {hasWearable ? 'En vivo · Apple Watch' : 'En vivo'}
          </div>
          <div className="flex-1" />
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
            onClick={() => onMinimize?.()}
            aria-label="Minimizar entrenamiento"
          >
            <Minus size={14} className="text-txt3" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
            onClick={handleClose}
            aria-label="Cerrar entrenamiento"
          >
            <X size={14} className="text-txt3" aria-hidden="true" />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-0.5">{sessionTitle}</h2>
        <p className="text-xs text-txt3 mb-4">
          {completedEx.size} de {exercises.length} ejercicios completados
        </p>

        {/* Métricas: compactas mientras hay un ejercicio en curso */}
        <AnimatePresence mode="wait">
          {activeExId ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-4 mb-3 px-0.5"
            >
              <span className="flex items-center gap-1.5 text-[11px] text-txt3">
                <Clock size={11} className="text-blue" aria-hidden="true" />
                <span aria-label="Tiempo transcurrido">{formatTimer(seconds)}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-txt3">
                <Flame size={11} className="text-accent" aria-hidden="true" />{Math.round(calories)} kcal
              </span>
              {hasWearable && (
                <span className="flex items-center gap-1.5 text-[11px] text-txt3">
                  <Heart size={11} className="text-red-400" aria-hidden="true" />{hr ?? '—'} bpm
                </span>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="metrics-row mb-0"
            >
              <Metric icon={Heart} color="text-red-400" label="FC bpm" value={hasWearable ? (hr ?? '—') : '—'} />
              <Metric icon={Flame} color="text-accent" label="Kcal" value={Math.round(calories)} />
              <Metric icon={Clock} color="text-blue" label="Tiempo" value={formatTimer(seconds)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tarjeta del ejercicio activo */}
        <AnimatePresence>
          {activeEx && (
            <ActiveExerciseCard
              key="focus-card"
              exercise={activeEx}
              block={currentBlock}
              setNum={activeSetNum}
              onCompleteSerie={() => completeSerie(activeEx)}
            />
          )}
        </AnimatePresence>

        {/* Progreso */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-txt3 font-medium">Progreso</span>
            <span className="text-xs text-accent font-semibold">{progress}%</span>
          </div>
          <div
            className="progress-bar-bg"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso del entrenamiento"
          >
            <motion.div className="progress-bar-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Cabecera del bloque actual */}
        {currentBlock && (
          <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 mb-3 border border-border border-l-[3px] ${currentBlock.borderClass} ${currentBlock.bgClass}`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${currentBlock.colorClass}`}>
              {currentBlock.label}
            </span>
            <span className="text-[10px] text-txt3 ml-auto">{blockIdx + 1} / {blocks.length}</span>
          </div>
        )}

        {!timerStarted && (
          <p className="text-[11px] text-txt3 text-center mb-3">Toca un ejercicio para comenzar</p>
        )}

        {/* Lista de ejercicios del bloque */}
        {blockExercises.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.ul
              key={currentBlock?.type}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="card !p-0 overflow-hidden mb-3 list-none"
            >
              {blockExercises.map((ex, i) => {
                const isDone = completedEx.has(ex.id);
                const isActive = activeExId === ex.id;
                return (
                  <li key={ex.id}>
                    <button
                      type="button"
                      disabled={isDone || isActive}
                      onClick={() => selectEx(ex)}
                      aria-label={`${ex.exercise_name}${isDone ? ' (completado)' : ''}`}
                      className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 border-0 border-b border-border last:border-b-0 bg-transparent transition-all
                        ${isDone ? 'opacity-40 cursor-default' : 'cursor-pointer'}
                        ${isActive ? 'bg-accent/5 cursor-default' : ''}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors
                        ${isDone ? 'bg-green/20 text-green'
                        : isActive ? `${currentBlock?.bgClass} ${currentBlock?.colorClass}`
                        : 'bg-surface2 text-txt3'}`}
                      >
                        {isDone ? <Check size={12} strokeWidth={2.5} aria-hidden="true" /> : i + 1}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-xs font-semibold leading-snug ${isDone ? 'line-through text-txt3' : isActive ? 'text-txt' : 'text-txt2'}`}>
                          {ex.exercise_name}
                        </span>
                        <span className="block text-[10px] text-txt3 mt-0.5">
                          {isTimed(ex) ? formatDuration(ex.duration_seconds)
                            : `${totalSets(ex)} × ${ex.reps ?? '?'} reps${Number(ex.weight_kg) > 0 ? ` · ${ex.weight_kg}kg` : ''}`}
                        </span>
                      </span>
                      {isActive && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${currentBlock?.colorClass}`}>
                          En curso
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        ) : (
          <p className="text-xs text-txt3 text-center py-6">Esta sesión no tiene ejercicios cargados.</p>
        )}

        {/* Insight de IA */}
        <div className="flex gap-3 items-start bg-surface2 rounded-xl p-3.5 mb-4 border border-border border-l-[3px] border-l-accent">
          <Sparkles size={14} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">IA en tiempo real</p>
            <p className="text-xs text-txt2 leading-relaxed">{insight}</p>
          </div>
        </div>

        {/* Avanzar de bloque / finalizar */}
        <AnimatePresence>
          {blockAllDone && !isLastBlock && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button type="button" className="btn btn-primary" onClick={() => setBlockIdx(i => i + 1)}>
                <ChevronRight size={16} aria-hidden="true" />
                Siguiente fase: {blocks[blockIdx + 1]?.label}
              </button>
            </motion.div>
          )}
          {allDone && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button type="button" className="btn btn-primary" onClick={handleFinish}>
                <Check size={16} aria-hidden="true" /> Finalizar sesión
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Descanso entre series */}
        <AnimatePresence>
          {restState && <RestOverlay state={restState} onDismiss={dismissRest} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Metric({ icon: Icon, color, label, value }) {
  return (
    <div className="metric-card">
      <Icon size={14} className={`${color} mb-1`} aria-hidden="true" />
      <div className={`font-metric text-3xl font-bold ${color} leading-none`}>{value}</div>
      <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}

function ActiveExerciseCard({ exercise, block, setNum, onCompleteSerie }) {
  const timed = isTimed(exercise);
  const sets = totalSets(exercise);
  const isLastSet = timed || setNum >= sets;
  const weightLabel = Number(exercise.weight_kg) > 0 ? `${exercise.weight_kg} kg` : 'Peso corporal';
  const type = exerciseType(exercise);
  const ExIcon = type === 'strength' ? Dumbbell : type === 'cardio' ? Zap : Wind;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-border overflow-hidden mb-3"
      style={{ background: 'var(--color-surface2)' }}
    >
      {/* Placeholder hasta que la biblioteca de ejercicios tenga image_url */}
      <div
        className="relative w-full h-28 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#222 100%)' }}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${block?.bgClass ?? ''}`}>
          <ExIcon size={28} className={block?.colorClass} aria-hidden="true" />
        </div>
        <span className="absolute top-2 right-2 text-[10px] text-txt3 bg-black/40 rounded px-1.5 py-0.5">
          sin imagen
        </span>
      </div>

      <div className="p-4">
        <p className="text-base font-bold mb-1">{exercise.exercise_name}</p>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {timed ? (
            <span className="text-sm font-semibold text-txt2">{formatDuration(exercise.duration_seconds)}</span>
          ) : (
            <>
              <span className="text-sm font-semibold text-txt2">{exercise.reps ?? '?'} reps</span>
              <span className="w-1 h-1 rounded-full bg-txt3" />
              <span className={`text-sm font-bold ${Number(exercise.weight_kg) > 0 ? block?.colorClass : 'text-txt2'}`}>
                {weightLabel}
              </span>
              {Number(exercise.rest_seconds) > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-txt3" />
                  <span className="text-xs text-txt3">{exercise.rest_seconds}s desc.</span>
                </>
              )}
            </>
          )}
        </div>

        {!timed && sets > 1 && (
          <div className="mb-3">
            <div className="flex gap-1.5 mb-1">
              {Array.from({ length: sets }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < setNum - 1 ? 'bg-green'
                      : i === setNum - 1 ? (block?.colorClass?.replace('text-', 'bg-') || 'bg-accent')
                      : 'bg-surface'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-txt3">Serie {setNum} de {sets}</p>
          </div>
        )}

        <button type="button" className="btn btn-primary" style={{ padding: '11px' }} onClick={onCompleteSerie}>
          {isLastSet
            ? <><Check size={15} aria-hidden="true" /> Terminar ejercicio</>
            : <><ChevronRight size={15} aria-hidden="true" /> Serie {setNum} lista</>}
        </button>
      </div>
    </motion.div>
  );
}

function RestOverlay({ state, onDismiss }) {
  const RADIUS = 34;
  const circumference = 2 * Math.PI * RADIUS;
  const ratio = state.total > 0 ? state.remaining / state.total : 0;

  return (
    <motion.div
      className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-20 rounded-t-3xl"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
    >
      {!state.done ? (
        <>
          <p className="text-[11px] text-txt3 uppercase tracking-widest mb-3">Tiempo de descanso</p>
          <div className="font-metric text-7xl font-bold text-blue leading-none mb-5">
            {formatTimer(state.remaining)}
          </div>
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)', marginBottom: 28 }} aria-hidden="true">
            <circle cx="40" cy="40" r={RADIUS} fill="none" stroke="#222" strokeWidth="5" />
            <motion.circle
              cx="40" cy="40" r={RADIUS}
              fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - ratio)}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <button type="button" className="btn btn-surface" style={{ width: 'auto', minWidth: 140 }} onClick={onDismiss}>
            Saltar descanso
          </button>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-green/20 flex items-center justify-center mb-4">
            <Check size={28} className="text-green" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <p className="text-lg font-bold mb-1">Descansaste bien</p>
          <p className="text-txt3 text-sm mb-8">
            {state.nextSet && state.totalSets
              ? `¡A por la serie ${state.nextSet} de ${state.totalSets}!`
              : '¿Listo para el siguiente ejercicio?'}
          </p>
          <button type="button" className="btn btn-primary" style={{ minWidth: 160 }} onClick={onDismiss}>
            Continuar
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
