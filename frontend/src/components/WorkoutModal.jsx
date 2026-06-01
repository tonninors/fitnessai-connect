import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, Clock, Sparkles, X, Minus, Check, Dumbbell, Timer, ChevronRight, Wind, Zap } from 'lucide-react';
import { api } from '../api/client.js';

const BLOCK_ORDER = ['warmup', 'strength', 'cardio', 'cooldown'];
const BLOCK_META  = {
  warmup:   { label: 'Calentamiento', colorClass: 'text-green',       bgClass: 'bg-green/10',       borderClass: 'border-l-green' },
  strength: { label: 'Entrenamiento', colorClass: 'text-accent',      bgClass: 'bg-accent/10',      borderClass: 'border-l-accent' },
  cardio:   { label: 'Cardio',        colorClass: 'text-orange-400',  bgClass: 'bg-orange-400/10',  borderClass: 'border-l-orange-400' },
  cooldown: { label: 'Estiramiento',  colorClass: 'text-blue',        bgClass: 'bg-blue/10',        borderClass: 'border-l-blue' },
};

export default function WorkoutModal({ session, visible = true, hasWearable, onClose, onMinimize, onExerciseDone, onActiveExChange }) {
  const [hr,           setHr]           = useState(null);
  const [calories,     setCalories]     = useState(0);
  const [seconds,      setSeconds]      = useState(0);
  const [insight,      setInsight]      = useState('Tu FC está en zona óptima. Mantén el tempo 2-1-2.');
  const [restState,    setRestState]    = useState(null); // null | { remaining, total, done }
  const [blockIdx,     setBlockIdx]     = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [activeExId,   setActiveExId]   = useState(null);
  const [activeSetNum, setActiveSetNum] = useState(1);

  const exercises    = session?.session_exercises ?? [];
  const [completedEx, setCompletedEx] = useState(
    () => new Set(exercises.filter(e => e.completed).map(e => e.id))
  );

  // Group exercises by type, keeping only blocks that have exercises
  const blocks = BLOCK_ORDER
    .map(type => ({ type, ...BLOCK_META[type], exercises: exercises.filter(e => e.exercise_type === type) }))
    .filter(b => b.exercises.length > 0);

  const currentBlock    = blocks[blockIdx] ?? blocks[0];
  const blockExercises  = currentBlock?.exercises ?? [];
  const blockAllDone    = blockExercises.length > 0 && blockExercises.every(e => completedEx.has(e.id));
  const isLastBlock     = blockIdx >= blocks.length - 1;

  const allDone  = exercises.length > 0 && completedEx.size >= exercises.length;
  const progress = exercises.length > 0 ? Math.round((completedEx.size / exercises.length) * 100) : 0;

  const storageKey   = `workout_start_${session?.id}`;
  const startTimeRef = useRef(null);
  const intervalRef  = useRef(null);
  const restRef      = useRef(null);

  // Fetch AI insight on mount (no timer yet)
  useEffect(() => {
    api.post('/ai/insight', {
      type: 'workout_ready',
      context: { session_name: session.name, rpe_target: session.rpe_target },
    }).then(d => d.insight && setInsight(d.insight)).catch(console.error);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(restRef.current);
    };
  }, []);

  function startTimer() {
    if (timerStarted) return;
    setTimerStarted(true);
    api.post(`/workouts/sessions/${session.id}/start`, {}).catch(console.error);

    const stored = localStorage.getItem(storageKey);
    startTimeRef.current = stored ? parseInt(stored) : Date.now();
    if (!stored) localStorage.setItem(storageKey, String(startTimeRef.current));

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(elapsed);
      if (hasWearable) {
        setHr(h => Math.round((h ?? 132) + 8 * Math.sin(Date.now() / 4000) + (Math.random() - 0.5) * 4));
      }
      const rpe = session.rpe_target ?? 6;
      setCalories(+(elapsed * (rpe * 0.03) / 60).toFixed(1));
    }, 1000);
  }

  function startRest(totalSeconds, nextSet = null, totalSets = null) {
    clearInterval(restRef.current);
    setRestState({ remaining: totalSeconds, total: totalSeconds, done: false, nextSet, totalSets });
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

  // Seleccionar ejercicio como "en curso" → reinicia contador de series
  function selectEx(ex) {
    if (completedEx.has(ex.id)) return;
    startTimer();
    setActiveExId(ex.id);
    setActiveSetNum(1);
    const totalSets = ex.sets ?? (ex.exercise_type === 'strength' ? 3 : 1);
    onActiveExChange?.({ id: ex.id, name: ex.exercise_name, setNum: 1, totalSets });
  }

  // Terminar una serie del ejercicio activo
  async function completeSerie(ex) {
    const isTimed   = !!ex.duration_seconds;
    const totalSets = ex.sets ?? (ex.exercise_type === 'strength' ? 3 : 1);

    if (isTimed || activeSetNum >= totalSets) {
      // Última serie (o ejercicio por tiempo) → marcar ejercicio completo
      setActiveExId(null);
      setActiveSetNum(1);
      setCompletedEx(prev => { const s = new Set(prev); s.add(ex.id); return s; });
      onExerciseDone?.(ex.id);
      onActiveExChange?.(null);
      await api.patch(`/workouts/sessions/${session.id}/exercises/${ex.id}/toggle`, { completed: true }).catch(console.error);
    } else {
      // Todavía quedan series → descanso y avanzar contador
      const next = activeSetNum + 1;
      setActiveSetNum(next);
      onActiveExChange?.({ id: ex.id, name: ex.exercise_name, setNum: next, totalSets });
      if (ex.rest_seconds > 0) startRest(ex.rest_seconds, next, totalSets);
    }
  }

  async function handleFinish() {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
    localStorage.removeItem(storageKey);
    await api.patch(`/workouts/sessions/${session.id}/complete`, {
      actual_duration: Math.round(seconds / 60),
      actual_calories: Math.round(calories),
      rpe_actual:      session.rpe_target,
    }).catch(console.error);
    onClose();
  }

  function handleClose() {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
    localStorage.removeItem(storageKey);
    onClose();
  }

  const sessionTitle = session?.day_order ? `Día ${session.day_order}` : session?.name;

  if (!visible) return null;

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onMinimize?.(); }}>
      <motion.div className="modal-sheet relative"
        initial={{ y: '100%' }} animate={{ y: 0 }}
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
          <button className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
            onClick={() => onMinimize?.()}
            title="Minimizar"
          >
            <Minus size={14} className="text-txt3" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer"
            onClick={handleClose}
            title="Cerrar"
          >
            <X size={14} className="text-txt3" />
          </button>
        </div>

        {/* Session title */}
        <div className="text-xl font-bold mb-0.5">{sessionTitle}</div>
        <div className="text-xs text-txt3 mb-4">
          {completedEx.size} de {exercises.length} ejercicios completados
        </div>

        {/* ── MÉTRICAS: compactas si hay ejercicio activo, completas si no ── */}
        <AnimatePresence mode="wait">
          {activeExId ? (
            <motion.div key="compact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-4 mb-3 px-0.5"
            >
              <span className="flex items-center gap-1.5 text-[11px] text-txt3">
                <Clock size={11} className="text-blue" />{formatTime(seconds)}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-txt3">
                <Flame size={11} className="text-accent" />{Math.round(calories)} kcal
              </span>
              {hasWearable && (
                <span className="flex items-center gap-1.5 text-[11px] text-txt3">
                  <Heart size={11} className="text-red-400" />{hr ?? '—'} bpm
                </span>
              )}
            </motion.div>
          ) : (
            <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="metrics-row mb-0"
            >
              <div className="metric-card">
                <Heart size={14} className="text-red-400 mb-1" />
                <div className="font-metric text-3xl font-bold text-red-400 leading-none">
                  {hasWearable ? (hr ?? '—') : '—'}
                </div>
                <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">FC bpm</div>
              </div>
              <div className="metric-card">
                <Flame size={14} className="text-accent mb-1" />
                <div className="font-metric text-3xl font-bold text-accent leading-none">
                  {Math.round(calories)}
                </div>
                <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">Kcal</div>
              </div>
              <div className="metric-card">
                <Clock size={14} className="text-blue mb-1" />
                <div className="font-metric text-3xl font-bold text-blue leading-none">
                  {formatTime(seconds)}
                </div>
                <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">Tiempo</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TARJETA DE EJERCICIO ACTIVO ── */}
        <AnimatePresence>
          {activeExId && (() => {
            const ex         = exercises.find(e => e.id === activeExId);
            if (!ex) return null;
            const isTimed    = !!ex.duration_seconds;
            const isCardio   = ex.exercise_type === 'cardio';
            const totalSets  = ex.sets ?? (ex.exercise_type === 'strength' ? 3 : 1);
            const weightLabel = ex.weight_kg > 0 ? `${ex.weight_kg} kg` : 'Peso corporal';
            const ExIcon     = ex.exercise_type === 'strength' ? Dumbbell
                             : ex.exercise_type === 'cardio'   ? Zap
                             : Wind;
            return (
              <motion.div key="focus-card"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-border overflow-hidden mb-3"
                style={{ background: 'var(--color-surface2)' }}
              >
                {/* Imagen / placeholder */}
                <div className="relative w-full h-28 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#222 100%)' }}
                >
                  {/* Placeholder — reemplazar con <img src={ex.image_url} /> cuando estén disponibles */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentBlock?.bgClass}`}>
                    <ExIcon size={28} className={currentBlock?.colorClass} />
                  </div>
                  <span className="absolute top-2 right-2 text-[10px] text-txt3 bg-black/40 rounded px-1.5 py-0.5">
                    sin imagen
                  </span>
                </div>

                <div className="p-4">
                  {/* Nombre y métricas clave */}
                  <div className="text-base font-bold mb-1">{ex.exercise_name}</div>
                  <div className="flex items-center gap-3 mb-4">
                    {isTimed ? (
                      <span className="text-sm font-semibold text-txt2">
                        {isCardio ? `${Math.round(ex.duration_seconds / 60)} min` : `${ex.duration_seconds}s`}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-txt2">
                          {ex.reps ?? '?'} reps
                        </span>
                        <span className="w-1 h-1 rounded-full bg-txt3" />
                        <span className={`text-sm font-bold ${ex.weight_kg > 0 ? currentBlock?.colorClass : 'text-txt2'}`}>
                          {weightLabel}
                        </span>
                        {ex.rest_seconds > 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-txt3" />
                            <span className="text-xs text-txt3">{ex.rest_seconds}s desc.</span>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Progreso de series */}
                  {!isTimed && totalSets > 1 && (
                    <div className="mb-3">
                      <div className="flex gap-1.5 mb-1">
                        {Array.from({ length: totalSets }, (_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                            i < activeSetNum - 1  ? 'bg-green'
                            : i === activeSetNum - 1 ? currentBlock?.colorClass?.replace('text-', 'bg-') || 'bg-accent'
                            : 'bg-surface'
                          }`} />
                        ))}
                      </div>
                      <div className="text-[10px] text-txt3">
                        Serie {activeSetNum} de {totalSets}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    className="btn btn-primary"
                    style={{ padding: '11px' }}
                    onClick={() => completeSerie(ex)}
                  >
                    {isTimed || activeSetNum >= totalSets
                      ? <><Check size={15} /> Terminar ejercicio</>
                      : <><ChevronRight size={15} /> Serie {activeSetNum} lista</>
                    }
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* ── PROGRESS BAR ── */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-txt3 font-medium">Progreso</span>
            <span className="text-xs text-accent font-semibold">{progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <motion.div className="progress-bar-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* ── BLOQUE HEADER ── */}
        {currentBlock && (
          <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 mb-3 border border-border border-l-[3px] ${currentBlock.borderClass} ${currentBlock.bgClass}`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${currentBlock.colorClass}`}>
              {currentBlock.label}
            </span>
            <span className="text-[10px] text-txt3 ml-auto">
              {blockIdx + 1} / {blocks.length}
            </span>
          </div>
        )}

        {/* Hint inicial */}
        {!timerStarted && (
          <div className="text-[11px] text-txt3 text-center mb-3">
            Toca un ejercicio para comenzar
          </div>
        )}

        {/* ── LISTA DE EJERCICIOS (contexto) ── */}
        {blockExercises.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={currentBlock?.type}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="card !p-0 overflow-hidden mb-3"
            >
              {blockExercises.map((ex, i) => {
                const isDone   = completedEx.has(ex.id);
                const isActive = activeExId === ex.id;
                const isTimed  = !!ex.duration_seconds;
                const isCardio = ex.exercise_type === 'cardio';
                return (
                  <div key={ex.id}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 border-b border-border last:border-b-0 transition-all
                      ${isDone   ? 'opacity-40' : 'cursor-pointer'}
                      ${isActive ? 'bg-accent/5' : ''}
                    `}
                    onClick={() => !isDone && !isActive && selectEx(ex)}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors
                      ${isDone   ? 'bg-green/20 text-green'
                      : isActive ? `${currentBlock?.bgClass} ${currentBlock?.colorClass}`
                      :            'bg-surface2 text-txt3'}`}
                    >
                      {isDone ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold leading-snug ${isDone ? 'line-through text-txt3' : isActive ? 'text-txt' : 'text-txt2'}`}>
                        {ex.exercise_name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isTimed ? (
                          <span className="text-[10px] text-txt3">
                            {isCardio ? `${Math.round(ex.duration_seconds / 60)} min` : `${ex.duration_seconds}s`}
                          </span>
                        ) : (
                          <span className="text-[10px] text-txt3">
                            {ex.sets} × {ex.reps ?? '?'} reps{ex.weight_kg > 0 ? ` · ${ex.weight_kg}kg` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${currentBlock?.colorClass}`}>
                        En curso
                      </span>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* AI insight */}
        <div className="flex gap-3 items-start bg-surface2 rounded-xl p-3.5 mb-4 border border-border border-l-[3px] border-l-accent">
          <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">IA en tiempo real</div>
            <p className="text-xs text-txt2 leading-relaxed">{insight}</p>
          </div>
        </div>

        {/* Siguiente bloque / Finalizar */}
        <AnimatePresence>
          {blockAllDone && !isLastBlock && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button className="btn btn-primary" onClick={() => setBlockIdx(i => i + 1)}>
                <ChevronRight size={16} />
                Siguiente fase: {blocks[blockIdx + 1]?.label}
              </button>
            </motion.div>
          )}
          {allDone && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button className="btn btn-primary" onClick={handleFinish}>
                <Check size={16} /> Finalizar sesión
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest timer overlay */}
        <AnimatePresence>
          {restState && (
            <motion.div
              className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-20 rounded-t-3xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {!restState.done ? (
                <>
                  <p className="text-[11px] text-txt3 uppercase tracking-widest mb-3">Tiempo de descanso</p>
                  <div className="font-metric text-7xl font-bold text-blue leading-none mb-5">
                    {formatTime(restState.remaining)}
                  </div>
                  {/* Progress ring */}
                  <svg width="80" height="80" style={{ transform: 'rotate(-90deg)', marginBottom: 28 }}>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#222" strokeWidth="5" />
                    <motion.circle
                      cx="40" cy="40" r="34"
                      fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - restState.remaining / restState.total)}
                      transition={{ duration: 0.8 }}
                    />
                  </svg>
                  <button className="btn btn-surface" style={{ width: 'auto', minWidth: 140 }} onClick={dismissRest}>
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
                    <Check size={28} className="text-green" strokeWidth={2.5} />
                  </div>
                  <p className="text-lg font-bold mb-1">Descansaste bien</p>
                  <p className="text-txt3 text-sm mb-8">
                    {restState.nextSet && restState.totalSets
                      ? `¡A por la serie ${restState.nextSet} de ${restState.totalSets}!`
                      : '¿Listo para el siguiente ejercicio?'}
                  </p>
                  <button className="btn btn-primary" style={{ minWidth: 160 }} onClick={dismissRest}>
                    Continuar
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function formatTime(s) {
  const m   = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function hrZone(hr) {
  if (!hr) return '—';
  if (hr < 115) return '1 (Recuperación)';
  if (hr < 130) return '2 (Aeróbica)';
  if (hr < 148) return '3 (Tempo)';
  if (hr < 165) return '4 (Umbral)';
  return '5 (Máxima)';
}