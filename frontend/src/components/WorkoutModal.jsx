import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Flame, Clock, X, Minus, Check, Dumbbell, Wind, Zap,
  ChevronRight, ChevronDown, Play, RefreshCw, Loader2, AlertCircle,
} from 'lucide-react';
import { api } from '../api/client.js';
import {
  groupByBlock,
  sortByBlock,
  exerciseType,
  isTimed,
  totalSets,
  formatTimer,
  formatDuration,
  estimateCalories,
} from '../lib/workout.js';

/**
 * Une la fila original de la sesión con la que devuelve el backend tras
 * sustituir un ejercicio. El `id` de la fila de sesión nunca cambia: de él
 * cuelgan el progreso de series, `completedEx` y los callbacks hacia App.
 */
function mergeExercise(base, patch) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(patch ?? {})) {
    if (value !== undefined) merged[key] = value;
  }
  merged.id = base.id;
  return merged;
}

/** Primer ejercicio pendiente de un bloque, en el orden planificado. */
function firstPendingIn(block, doneIds) {
  return block?.exercises.find(ex => !doneIds.has(ex.id)) ?? null;
}

export default function WorkoutModal({
  session,
  visible = true,
  hasWearable,
  onClose,
  onMinimize,
  onExerciseDone,
  onActiveExChange,
}) {
  const rawExercises = session?.session_exercises;

  const [hr, setHr] = useState(null);
  const [calories, setCalories] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [restState, setRestState] = useState(null); // null | { remaining, total, done, nextSet, totalSets }
  const [blockIdx, setBlockIdx] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [activeExId, setActiveExId] = useState(null);
  const [activeSetNum, setActiveSetNum] = useState(1);
  // false = vista previa del ejercicio (aún se puede cambiar por otro);
  // true = series en curso (ya no se ofrece sustituirlo).
  const [exStarted, setExStarted] = useState(false);
  // ¿Se está ejecutando la serie actual? Es lo que mueve el cronómetro: entre
  // el final de un descanso y el "Empezar serie N" siguiente no se entrena.
  const [serieRunning, setSerieRunning] = useState(false);
  const [replacements, setReplacements] = useState({}); // id de la fila → ejercicio sustituto
  const [altPanel, setAltPanel] = useState(null);       // null | { status, options, error }
  const [completedEx, setCompletedEx] = useState(
    () => new Set((rawExercises ?? []).filter(e => e.completed).map(e => e.id)),
  );

  // Un ejercicio sustituido conserva su fila (y por tanto su progreso).
  const exercises = useMemo(
    () => (rawExercises ?? []).map(ex => (replacements[ex.id] ? mergeExercise(ex, replacements[ex.id]) : ex)),
    [rawExercises, replacements],
  );

  // Los bloques se calculan con `exerciseType`, que hace fallback a "strength":
  // los ejercicios sin `exercise_type` ya no desaparecen de la sesión.
  // `sortByBlock` garantiza que dentro del bloque manden `order_num`: es el
  // orden en el que la app va activando los ejercicios, uno a uno.
  const blocks = useMemo(() => groupByBlock(sortByBlock(exercises)), [exercises]);
  const currentBlock = blocks[blockIdx] ?? blocks[0] ?? null;
  const blockExercises = currentBlock?.exercises ?? [];
  const blockAllDone = blockExercises.length > 0 && blockExercises.every(e => completedEx.has(e.id));
  const isLastBlock = blockIdx >= blocks.length - 1;

  const allDone = exercises.length > 0 && completedEx.size >= exercises.length;

  // El cronómetro mide tiempo entrenado, no tiempo con el modal abierto: corre
  // mientras se ejecuta una serie y durante el descanso entre series, y se
  // detiene en cuanto el descanso termina o se salta, hasta que se empieza la
  // serie siguiente. Antes arrancaba en "Comenzar entrenamiento" y ya no
  // paraba, así que contaba también el rato de leer la vista previa.
  const restRunning = restState != null && !restState.done;
  const clockRunning = serieRunning || restRunning;

  const storageKey = `workout_elapsed_${session?.id}`;
  const accumulatedRef = useRef(0);     // ms ya consolidados
  const runningSinceRef = useRef(null); // inicio del tramo en curso, o null en pausa
  const intervalRef = useRef(null);
  const restRef = useRef(null);

  // Los temporizadores viven mientras la sesión esté activa, aunque el modal
  // esté minimizado. Se limpian al desmontar.
  useEffect(() => () => {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
  }, []);

  /** Reloj de pared: no acumula deriva si la pestaña queda en segundo plano. */
  const elapsedMs = useCallback(() => (
    accumulatedRef.current + (runningSinceRef.current == null ? 0 : Date.now() - runningSinceRef.current)
  ), []);

  const showElapsed = useCallback((ms) => {
    const elapsed = Math.floor(ms / 1000);
    setSeconds(elapsed);
    setCalories(estimateCalories(elapsed, session?.rpe_target));
  }, [session?.rpe_target]);

  const startTimer = useCallback(() => {
    if (timerStarted) return;
    setTimerStarted(true);
    api.post(`/workouts/sessions/${session.id}/start`, {}).catch(() => { /* la sesión sigue en local */ });

    // Se recupera lo acumulado por si la pestaña se recargó a media sesión. El
    // tramo en curso no se guarda: el tiempo con la app cerrada no se entrenó.
    const stored = Number.parseInt(localStorage.getItem(storageKey) ?? '', 10);
    accumulatedRef.current = Number.isFinite(stored) && stored > 0 ? stored : 0;
    runningSinceRef.current = null;
    showElapsed(accumulatedRef.current);

    intervalRef.current = setInterval(() => {
      if (runningSinceRef.current == null) return; // en pausa: no hay nada que sumar
      showElapsed(elapsedMs());
      if (hasWearable) {
        setHr(h => Math.round((h ?? 132) + 8 * Math.sin(Date.now() / 4000) + (Math.random() - 0.5) * 4));
      }
    }, 1000);
  }, [timerStarted, session?.id, hasWearable, storageKey, elapsedMs, showElapsed]);

  // Arranca y pausa el cronómetro siguiendo a `clockRunning`.
  useEffect(() => {
    if (!timerStarted) return;

    if (clockRunning) {
      runningSinceRef.current ??= Date.now();
      return;
    }
    if (runningSinceRef.current != null) {
      accumulatedRef.current += Date.now() - runningSinceRef.current;
      runningSinceRef.current = null;
      localStorage.setItem(storageKey, String(accumulatedRef.current));
      showElapsed(accumulatedRef.current);
    }
  }, [clockRunning, timerStarted, storageKey, showElapsed]);

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

  /**
   * Propone el ejercicio que toca, en vista previa. Es la única vía de
   * activación: el usuario nunca elige cuál, la app decide según el orden del
   * plan. Sólo puede aceptarlo ("Empezar ejercicio") o pedir un sustituto.
   */
  function activate(ex) {
    setAltPanel(null);
    setActiveSetNum(1);
    setExStarted(false);
    setSerieRunning(false);
    if (!ex) {
      setActiveExId(null);
      onActiveExChange?.(null);
      return;
    }
    setActiveExId(ex.id);
    onActiveExChange?.({ id: ex.id, name: ex.exercise_name, setNum: 1, totalSets: totalSets(ex) });
  }

  /** Cierra la vista previa y arranca la primera serie del ejercicio. */
  function beginExercise() {
    setAltPanel(null);
    setExStarted(true);
    setSerieRunning(true);
  }

  /** Reanuda el cronómetro para la serie siguiente, tras el descanso. */
  function beginSerie() {
    setSerieRunning(true);
  }

  /** Arranca el cronómetro y activa el primer ejercicio pendiente. */
  function handleStart() {
    startTimer();
    const idx = blocks.findIndex(b => b.exercises.some(e => !completedEx.has(e.id)));
    const target = idx >= 0 ? idx : 0;
    setBlockIdx(target);
    activate(firstPendingIn(blocks[target], completedEx));
  }

  /** Pasa al siguiente bloque y activa su primer ejercicio pendiente. */
  function handleNextBlock() {
    const idx = blockIdx + 1;
    setBlockIdx(idx);
    activate(firstPendingIn(blocks[idx], completedEx));
  }

  /** Cierra una serie del ejercicio activo (o el ejercicio, si es la última). */
  async function completeSerie(ex) {
    const sets = totalSets(ex);
    // Se cierra la serie: el cronómetro sólo sigue si arranca un descanso.
    setSerieRunning(false);

    if (isTimed(ex) || activeSetNum >= sets) {
      const done = new Set(completedEx).add(ex.id);
      setCompletedEx(done);
      onExerciseDone?.(ex.id);
      // Avance automático: el siguiente pendiente del bloque, sin elegir.
      activate(firstPendingIn(currentBlock, done));
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

  // ── Ejercicio alternativo ─────────────────────────────────────────────────
  async function openAlternatives(ex) {
    setAltPanel({ status: 'loading', options: [], error: null });
    try {
      const data = await api.post(`/workouts/sessions/${session.id}/exercises/${ex.id}/alternatives`, {});
      const options = Array.isArray(data?.alternatives) ? data.alternatives.slice(0, 3) : [];
      setAltPanel({ status: options.length ? 'ready' : 'empty', options, error: null });
    } catch {
      setAltPanel({ status: 'error', options: [], error: 'No pudimos cargar alternativas. Sigue con este ejercicio o inténtalo otra vez.' });
    }
  }

  async function chooseAlternative(ex, alt) {
    setAltPanel(prev => ({ ...(prev ?? { options: [] }), status: 'applying', error: null }));
    try {
      const data = await api.patch(
        `/workouts/sessions/${session.id}/exercises/${ex.id}/substitute`,
        { exercise_id: alt.id },
      );
      const row = data?.exercise;
      if (!row) throw new Error('Respuesta sin ejercicio');

      setReplacements(prev => ({ ...prev, [ex.id]: row }));
      setAltPanel(null);
      const merged = mergeExercise(ex, row);
      onActiveExChange?.({
        id: ex.id,
        name: merged.exercise_name,
        setNum: activeSetNum,
        totalSets: totalSets(merged),
      });
    } catch {
      setAltPanel(prev => ({
        status: 'ready',
        options: prev?.options ?? [],
        error: 'No pudimos cambiar el ejercicio. Inténtalo otra vez o continúa con el actual.',
      }));
    }
  }

  function stopTimers() {
    clearInterval(intervalRef.current);
    clearInterval(restRef.current);
    runningSinceRef.current = null;
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

  // Escape cierra primero el panel de alternativas; si no hay, minimiza.
  const altOpen = altPanel !== null;
  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = e => {
      if (e.key !== 'Escape') return;
      if (altOpen) setAltPanel(null);
      else onMinimize?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, onMinimize, altOpen]);

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
              className="metrics-row mb-4"
            >
              <Metric icon={Heart} color="text-red-400" label="FC bpm" value={hasWearable ? (hr ?? '—') : '—'} />
              <Metric icon={Flame} color="text-accent" label="Kcal" value={Math.round(calories)} />
              <Metric icon={Clock} color="text-blue" label="Tiempo" value={formatTimer(seconds)} />
            </motion.div>
          )}
        </AnimatePresence>

        {exercises.length === 0 && (
          <p className="text-xs text-txt3 text-center py-6">Esta sesión no tiene ejercicios cargados.</p>
        )}

        {/* Antes de empezar: un único botón. La app decide qué toca. */}
        {!timerStarted && exercises.length > 0 && !allDone && (
          <button type="button" className="btn btn-primary mb-3" onClick={handleStart}>
            <Play size={16} aria-hidden="true" /> Comenzar entrenamiento
          </button>
        )}

        {timerStarted && (
          <>
            {/* Cabecera del bloque actual */}
            {currentBlock && (
              <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 mb-3 border border-border border-l-[3px] ${currentBlock.borderClass} ${currentBlock.bgClass}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${currentBlock.colorClass}`}>
                  {currentBlock.label}
                </span>
                <span className="text-[10px] text-txt3 ml-auto">{blockIdx + 1} / {blocks.length}</span>
              </div>
            )}

            {/* Ejercicio actual: uno solo, sin lista ni selección */}
            <AnimatePresence mode="wait">
              {activeEx && (
                <ActiveExerciseCard
                  key={`${activeEx.id}-${activeEx.exercise_name}`}
                  exercise={activeEx}
                  block={currentBlock}
                  setNum={activeSetNum}
                  started={exStarted}
                  serieRunning={serieRunning}
                  onBegin={beginExercise}
                  onBeginSerie={beginSerie}
                  onCompleteSerie={() => completeSerie(activeEx)}
                />
              )}
            </AnimatePresence>

            {/* Sustituir solo tiene sentido antes de empezar: si ya hiciste una
                serie, es que sí puedes hacerlo. */}
            {activeEx && !exStarted && (
              <>
                <button
                  type="button"
                  className="btn btn-surface mb-3"
                  style={{ padding: '9px' }}
                  onClick={() => (altPanel ? setAltPanel(null) : openAlternatives(activeEx))}
                  aria-expanded={altPanel !== null}
                >
                  <RefreshCw size={14} aria-hidden="true" /> No puedo hacer este ejercicio
                </button>

                <AnimatePresence>
                  {altPanel && (
                    <AlternativesPanel
                      key="alternatives"
                      panel={altPanel}
                      onChoose={alt => chooseAlternative(activeEx, alt)}
                      onRetry={() => openAlternatives(activeEx)}
                      onDismiss={() => setAltPanel(null)}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </>
        )}

        {/* Avanzar de bloque / finalizar */}
        <AnimatePresence>
          {timerStarted && blockAllDone && !isLastBlock && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button type="button" className="btn btn-primary" onClick={handleNextBlock}>
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

/**
 * Media de referencia del ejercicio. El join `exercises` puede venir vacío
 * (es lo normal hoy): en ese caso se cae al icono del bloque.
 */
function ExerciseMedia({ exercise, block }) {
  const media = exercise?.exercises ?? null;
  const label = `Demostración de ${exercise?.exercise_name ?? 'el ejercicio'}`;
  const wrapper = 'relative w-full h-28 flex items-center justify-center overflow-hidden';

  if (media?.video_url) {
    return (
      <div className={wrapper} style={{ background: '#111' }}>
        <video
          src={media.video_url}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          role="img"
          aria-label={label}
        />
      </div>
    );
  }

  if (media?.image_url) {
    return (
      <div className={wrapper} style={{ background: '#111' }}>
        <img src={media.image_url} alt={label} className="w-full h-full object-cover" />
      </div>
    );
  }

  const type = exerciseType(exercise);
  const ExIcon = type === 'strength' ? Dumbbell : type === 'cardio' ? Zap : Wind;
  return (
    <div className={wrapper} style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#222 100%)' }}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${block?.bgClass ?? ''}`}>
        <ExIcon size={28} className={block?.colorClass} aria-hidden="true" />
      </div>
      <span className="absolute top-2 right-2 text-[10px] text-txt3 bg-black/40 rounded px-1.5 py-0.5">
        sin imagen
      </span>
    </div>
  );
}

/**
 * Ejercicio que toca ahora. Tiene dos estados:
 * - `started` false: vista previa. Se ve qué viene y se decide empezarlo o
 *   pedir un sustituto.
 * - `started` true: series en curso.
 */
function ActiveExerciseCard({ exercise, block, setNum, started, serieRunning, onBegin, onBeginSerie, onCompleteSerie }) {
  const timed = isTimed(exercise);
  const sets = totalSets(exercise);
  const isLastSet = timed || setNum >= sets;
  const weightLabel = Number(exercise.weight_kg) > 0 ? `${exercise.weight_kg} kg` : 'Peso corporal';
  const description = exercise?.exercises?.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-border overflow-hidden mb-3"
      style={{ background: 'var(--color-surface2)' }}
    >
      <ExerciseMedia exercise={exercise} block={block} />

      <div className="p-4">
        <p className="text-base font-bold mb-1">{exercise.exercise_name}</p>
        {description && (
          <p className="text-xs text-txt3 leading-relaxed mb-2">{description}</p>
        )}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {timed ? (
            <span className="text-sm font-semibold text-txt2">{formatDuration(exercise.duration_seconds)}</span>
          ) : (
            <>
              {/* En vista previa aún no hay barra de series: se anuncia aquí
                  cuántas te esperan. */}
              {!started && sets > 1 && (
                <>
                  <span className="text-sm font-semibold text-txt2">{sets} series</span>
                  <span className="w-1 h-1 rounded-full bg-txt3" />
                </>
              )}
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

        {started && !timed && sets > 1 && (
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

        {!started ? (
          <button type="button" className="btn btn-primary" style={{ padding: '11px' }} onClick={onBegin}>
            <Play size={15} aria-hidden="true" /> Empezar ejercicio
          </button>
        ) : serieRunning ? (
          <button type="button" className="btn btn-primary" style={{ padding: '11px' }} onClick={onCompleteSerie}>
            {isLastSet
              ? <><Check size={15} aria-hidden="true" /> Terminar ejercicio</>
              : <><ChevronRight size={15} aria-hidden="true" /> Serie {setNum} lista</>}
          </button>
        ) : (
          // Tras el descanso el cronómetro queda parado: hay que decir cuándo
          // arranca la serie siguiente para que vuelva a contar.
          <button type="button" className="btn btn-primary" style={{ padding: '11px' }} onClick={onBeginSerie}>
            <Play size={15} aria-hidden="true" /> Empezar serie {setNum}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/** Equipo necesario, legible. Acepta array (del catálogo) o texto suelto. */
function equipmentLabel(equipment) {
  if (Array.isArray(equipment)) return equipment.filter(Boolean).join(' · ');
  return typeof equipment === 'string' ? equipment.trim() : '';
}

/** Alternativas sugeridas por el backend cuando el ejercicio no es viable. */
function AlternativesPanel({ panel, onChoose, onRetry, onDismiss }) {
  const busy = panel.status === 'loading' || panel.status === 'applying';

  return (
    <motion.section
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-border bg-surface2 p-3.5 mb-3"
      aria-label="Ejercicios alternativos"
      aria-busy={busy}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">Alternativas</p>
        <div className="flex-1" />
        <button
          type="button"
          className="w-6 h-6 rounded-md bg-surface flex items-center justify-center border-none cursor-pointer"
          onClick={onDismiss}
          aria-label="Cerrar alternativas"
        >
          <X size={12} className="text-txt3" aria-hidden="true" />
        </button>
      </div>

      {panel.error && (
        <p className="flex items-start gap-2 text-xs text-txt2 leading-relaxed mb-2.5" role="alert">
          <AlertCircle size={13} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
          {panel.error}
        </p>
      )}

      {panel.status === 'loading' && (
        <p className="flex items-center gap-2 text-xs text-txt3 py-2" role="status">
          <Loader2 size={13} className="text-accent animate-spin" aria-hidden="true" />
          Buscando alternativas…
        </p>
      )}

      {panel.status === 'applying' && (
        <p className="flex items-center gap-2 text-xs text-txt3 py-2" role="status">
          <Loader2 size={13} className="text-accent animate-spin" aria-hidden="true" />
          Cambiando el ejercicio…
        </p>
      )}

      {panel.status === 'empty' && (
        <p className="text-xs text-txt3 py-1">
          No encontramos alternativas para este ejercicio. Continúa con el actual.
        </p>
      )}

      {panel.status === 'error' && (
        <button type="button" className="btn btn-surface" style={{ padding: '9px' }} onClick={onRetry}>
          <RefreshCw size={14} aria-hidden="true" /> Reintentar
        </button>
      )}

      {panel.status === 'ready' && (
        <ul className="list-none flex flex-col gap-2">
          {panel.options.map(alt => (
            <AlternativeOption key={alt.id} alt={alt} onChoose={() => onChoose(alt)} />
          ))}
        </ul>
      )}
    </motion.section>
  );
}

/**
 * Una alternativa. La fila despliega el desglose; sustituir exige un botón
 * aparte, porque con la fila desplegable un toque para mirar cambiaría el
 * ejercicio sin querer.
 */
function AlternativeOption({ alt, onChoose }) {
  const [open, setOpen] = useState(false);
  const detailId = `alt-detalle-${alt.id}`;

  return (
    <li className="rounded-xl border border-border bg-surface overflow-hidden">
      <button
        type="button"
        className="w-full text-left px-3 py-2.5 bg-transparent border-none cursor-pointer"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={detailId}
      >
        <span className="flex items-center gap-2">
          <span className="flex-1 min-w-0 text-xs font-semibold text-txt leading-snug">{alt.name}</span>
          {alt.score !== null && alt.score !== undefined && (
            <span className="text-[11px] font-bold text-accent shrink-0">{alt.score}%</span>
          )}
          <ChevronDown
            size={13}
            className={`text-txt3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
        {alt.reason && (
          <span className="block text-[10px] text-txt3 mt-0.5 leading-relaxed">{alt.reason}</span>
        )}
        {/* `equipment` es un array: sin unirlo, React concatena los
            elementos y se lee "mancuernasbanco". */}
        {equipmentLabel(alt.equipment) && (
          <span className="inline-block text-[10px] text-txt2 bg-surface2 rounded px-1.5 py-0.5 mt-1.5">
            {equipmentLabel(alt.equipment)}
          </span>
        )}
      </button>

      <div id={detailId} hidden={!open} className="px-3 pb-3">
        {alt.breakdown && (
          <dl className="flex flex-col gap-1.5 mb-3">
            <ScoreRow label="Músculos" value={alt.breakdown.muscular} />
            <ScoreRow label="Biomecánica" value={alt.breakdown.biomecanica} />
            <ScoreRow label="Fatiga" value={alt.breakdown.fatiga} />
          </dl>
        )}
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '9px' }}
          onClick={onChoose}
        >
          <RefreshCw size={13} aria-hidden="true" /> Cambiar a este ejercicio
        </button>
      </div>
    </li>
  );
}

/** Una dimensión del desglose. Sin dato se muestra "—", nunca un 0 inventado. */
function ScoreRow({ label, value }) {
  const known = value !== null && value !== undefined;
  return (
    <div className="flex items-center gap-2">
      <dt className="text-[10px] text-txt3 w-20 shrink-0">{label}</dt>
      <dd className="flex-1 flex items-center gap-2 m-0">
        <span className="flex-1 h-1 rounded-full bg-surface2 overflow-hidden">
          <span className="block h-full bg-accent rounded-full" style={{ width: known ? `${value}%` : 0 }} />
        </span>
        <span className="text-[10px] text-txt2 font-medium w-8 text-right">{known ? `${value}%` : '—'}</span>
      </dd>
    </div>
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
