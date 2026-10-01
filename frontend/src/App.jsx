import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Home as HomeIcon, Dumbbell, TrendingUp, MessageCircle, User, ChevronUp } from 'lucide-react';
import { supabase, api } from './api/client.js';
import Login from './screens/Login.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Home from './screens/Home.jsx';
import Plans from './screens/Plans.jsx';
import Profile from './screens/Profile.jsx';
import Chat from './screens/Chat.jsx';
import WorkoutModal from './components/WorkoutModal.jsx';
import ResetPassword from './screens/ResetPassword.jsx';
import { formatClock } from './lib/dates.js';
import { sessionFocusTitle, formatTimer } from './lib/workout.js';

// Recharts pesa ~400 kB y sólo lo usa Progreso; el panel de entrenador lo ve
// una minoría de usuarios. Ambos se cargan bajo demanda.
const Progress = lazy(() => import('./screens/Progress.jsx'));
const DashboardCoach = lazy(() => import('./screens/DashboardCoach.jsx'));

function ScreenFallback() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label="Cargando pantalla">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const NAV = [
  { id: 'home',     label: 'Inicio',   icon: HomeIcon },
  { id: 'plans',    label: 'Planes',   icon: Dumbbell },
  { id: 'progress', label: 'Progreso', icon: TrendingUp },
  { id: 'chat',     label: 'Chat',     icon: MessageCircle },
  { id: 'profile',  label: 'Perfil',   icon: User },
];

const SCREENS = { home: Home, plans: Plans, progress: Progress, profile: Profile };

const CLOCK_REFRESH_MS = 10_000;

// Curvas compartidas: llegada que frena con decisión, salida que acelera. La
// salida siempre es más corta que la entrada para que cambiar de pestaña no
// se sienta como esperar.
const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_IN = [0.4, 0, 1, 1];
const EASE_SHEET = [0.32, 0.72, 0, 1];
const NAV_INDEX = Object.fromEntries(NAV.map(({ id }, i) => [id, i]));

// Las pestañas se deslizan hacia el lado en que está la de destino en la barra
// inferior: de Inicio a Perfil entra desde la derecha; al volver, desde la
// izquierda. Sin dirección conocida (o con movimiento reducido) solo funden.
const pageVariants = {
  initial: ({ dir, reduce }) => (reduce ? { opacity: 0 } : dir ? { opacity: 0, x: dir * 28 } : { opacity: 0, y: 10 }),
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.32, ease: EASE_OUT } },
  exit: ({ dir, reduce }) => ({
    opacity: 0,
    x: reduce || !dir ? 0 : dir * -20,
    transition: { duration: 0.16, ease: EASE_IN },
  }),
};

export default function App() {
  const [session, setSession] = useState(null);
  const [authEvent, setAuthEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);
  const [isTrainer, setIsTrainer] = useState(false);
  const [activeScreen, setActiveScreen] = useState('home');
  const [navDir, setNavDir] = useState(0);
  const reduceMotion = useReducedMotion();

  const [activeSession, setActiveSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [liveCompleted, setLiveCompleted] = useState(null); // Set<exerciseId> | null
  const [liveActiveEx, setLiveActiveEx] = useState(null);   // { id, name, setNum, totalSets } | null
  const [liveElapsed, setLiveElapsed] = useState(0);        // segundos entrenados, para Inicio y la barra

  const [clock, setClock] = useState(() => formatClock());

  // Usuario al que pertenece el estado en memoria (entrenamiento en curso
  // incluido). Se compara por id, no por evento: un refresco de token es el
  // mismo usuario y no debe tocar nada.
  const lastUserIdRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      lastUserIdRef.current = data?.session?.user?.id ?? null;
      setSession(data?.session ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthEvent(event);

      // El entrenamiento en curso es de la cuenta que lo abrió. Al cerrar
      // sesión o entrar con otra se descarta: si no, el modal (y su
      // cronómetro) seguía en pantalla bajo el usuario nuevo, y sus escrituras
      // iban a una sesión ajena, que el backend rechaza con 403.
      const nextUserId = nextSession?.user?.id ?? null;
      if (nextUserId !== lastUserIdRef.current) {
        lastUserIdRef.current = nextUserId;
        setActiveSession(null);
        setModalVisible(false);
        setLiveCompleted(null);
        setLiveActiveEx(null);
        setLiveElapsed(0);
      }

      if (!nextSession) {
        setProfile(null);
        setIsTrainer(false);
        setActiveScreen('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return undefined;

    let cancelled = false;
    setProfileLoading(true);
    setProfileError(null);

    Promise.all([
      api.get('/profile'),
      supabase.from('trainer_profiles').select('id').eq('id', session.user.id).maybeSingle(),
    ])
      .then(([loadedProfile, trainerRes]) => {
        if (cancelled) return;
        setProfile(loadedProfile);
        setIsTrainer(!!trainerRes.data);
      })
      .catch((err) => {
        if (!cancelled) setProfileError(err?.message || 'No se pudo conectar con el servidor');
      })
      .finally(() => { if (!cancelled) setProfileLoading(false); });

    return () => { cancelled = true; };
  }, [session, retryToken]);

  useEffect(() => {
    const timer = setInterval(() => setClock(formatClock()), CLOCK_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const navigate = useCallback((next) => {
    if (next === activeScreen) return;
    const from = NAV_INDEX[activeScreen];
    const to = NAV_INDEX[next];
    // El panel coach se abre "hacia delante" desde Perfil y se cierra hacia atrás.
    if (next === 'coach') setNavDir(1);
    else if (activeScreen === 'coach') setNavDir(-1);
    else setNavDir(from !== undefined && to !== undefined ? Math.sign(to - from) : 0);
    setActiveScreen(next);
  }, [activeScreen]);

  const startWorkout = useCallback((workoutSession) => {
    setActiveSession(workoutSession);
    setModalVisible(true);
    setLiveCompleted(new Set((workoutSession.session_exercises ?? []).filter(e => e.completed).map(e => e.id)));
    setLiveActiveEx(null);
    setLiveElapsed(0);
  }, []);

  const closeWorkout = useCallback(() => {
    setActiveSession(null);
    setModalVisible(false);
    setLiveCompleted(null);
    setLiveActiveEx(null);
    setLiveElapsed(0);
  }, []);

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-bg" role="status" aria-label="Cargando">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Login />;
  if (authEvent === 'PASSWORD_RECOVERY') return <ResetPassword onDone={() => setAuthEvent(null)} />;

  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-bg gap-4 px-6 text-center" role="alert">
        <p className="text-txt font-semibold">No se pudo conectar al servidor</p>
        <p className="text-txt3 text-sm max-w-[320px] leading-relaxed">
          Asegúrate de que el backend esté corriendo en el puerto 3000.
        </p>
        <p className="text-txt3 text-xs">{profileError}</p>
        <button
          type="button"
          className="mt-2 px-6 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold border-none cursor-pointer"
          onClick={() => setRetryToken(t => t + 1)}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const showCoach = isTrainer && activeScreen === 'coach';
  const onboardingDone = !!profile?.onboarding_completed;
  const motionCtx = { dir: navDir, reduce: !!reduceMotion };
  // Con el entrenamiento abierto, la app retrocede detrás de la hoja.
  const recessed = !!activeSession && modalVisible;

  return (
    <div className="phone-scene">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="status-bar">
            <span className="font-semibold text-[15px] tracking-tight">{clock}</span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <svg viewBox="0 0 18 14" width="15" height="13" fill="currentColor"><rect x="0" y="8" width="3" height="6" rx="1" /><rect x="5" y="5" width="3" height="9" rx="1" /><rect x="10" y="2" width="3" height="12" rx="1" /><rect x="15" y="0" width="3" height="14" rx="1" opacity="0.3" /></svg>
              <svg viewBox="0 0 18 14" width="15" height="13"><path d="M1 5 Q9 -1 17 5" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" /><path d="M4 8.5 Q9 4.5 14 8.5" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" /><circle cx="9" cy="12" r="1.5" fill="currentColor" /></svg>
              <svg viewBox="0 0 22 12" width="19" height="11"><rect x="0" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" /><rect x="18.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.5" /><rect x="1.5" y="2.5" width="13" height="7" rx="1.2" fill="currentColor" /></svg>
            </span>
          </div>

          {!onboardingDone ? (
            <div className="screen" style={{ opacity: 1, pointerEvents: 'all', zIndex: 150 }}>
              <Onboarding
                user={session.user}
                onComplete={() => setProfile(p => ({ ...p, onboarding_completed: true }))}
              />
            </div>
          ) : (
            <>
              <div className={`app-stage${recessed ? ' is-recessed' : ''}`} aria-hidden={recessed || undefined}>
              <AnimatePresence>
                {showCoach && (
                  <motion.div
                    key="coach"
                    className="screen"
                    style={{ pointerEvents: 'all', zIndex: 100 }}
                    initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                    animate={{ x: 0, opacity: 1, transition: { duration: 0.36, ease: EASE_SHEET } }}
                    exit={reduceMotion
                      ? { opacity: 0, transition: { duration: 0.16 } }
                      : { x: '100%', transition: { duration: 0.24, ease: EASE_IN } }}
                  >
                    <div className="px-5 pt-2">
                      <button type="button" className="btn btn-surface btn-sm w-auto" onClick={() => navigate('profile')}>
                        ← Volver
                      </button>
                    </div>
                    <Suspense fallback={<ScreenFallback />}>
                      <DashboardCoach userId={session.user.id} />
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence custom={motionCtx}>
                {NAV.map(({ id }) => {
                  if (activeScreen !== id) return null;

                  if (id === 'chat') {
                    return (
                      <motion.div
                        key="chat"
                        className="screen screen--chat"
                        style={{ pointerEvents: 'all' }}
                        custom={motionCtx}
                        variants={pageVariants} initial="initial" animate="animate" exit="exit"
                      >
                        <Chat
                          userId={session.user.id}
                          trainerId={profile?.trainer_id ?? null}
                          trainerName={profile?.trainer_profiles?.full_name ?? null}
                        />
                      </motion.div>
                    );
                  }

                  const Screen = SCREENS[id];
                  return (
                    <motion.div
                      key={id}
                      className="screen"
                      style={{ pointerEvents: 'all' }}
                      custom={motionCtx}
                      variants={pageVariants} initial="initial" animate="animate" exit="exit"
                    >
                      <Suspense fallback={<ScreenFallback />}>
                      <Screen
                        onStartWorkout={startWorkout}
                        onNavigate={navigate}
                        isTrainer={isTrainer}
                        runningSession={activeSession}
                        onResumeWorkout={() => setModalVisible(true)}
                        liveCompleted={liveCompleted ?? new Set()}
                        liveActiveEx={liveActiveEx}
                        liveElapsed={liveElapsed}
                      />
                      </Suspense>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {!showCoach && (
                <nav className="bottom-nav" aria-label="Navegación principal">
                  {NAV.map(({ id, label, icon: Icon }) => {
                    const isActive = activeScreen === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => navigate(id)}
                        aria-current={isActive ? 'page' : undefined}
                        className="flex flex-col items-center gap-1 flex-1 pt-2 bg-transparent border-none cursor-pointer relative"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-indicator"
                            className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-accent"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <Icon size={20} strokeWidth={isActive ? 2.2 : 1.5} aria-hidden="true"
                          className={`transition-colors duration-200 ${isActive ? 'text-accent' : 'text-txt3'}`}
                        />
                        <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-accent' : 'text-txt3'}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              )}

              {/* Barra del entrenamiento minimizado */}
              {/* Aparece cuando la hoja ya bajó: es la misma sesión, aparcada. */}
              <AnimatePresence>
              {activeSession && !modalVisible && (
                <motion.button
                  key="mini-bar"
                  type="button"
                  className="absolute bottom-[80px] left-0 right-0 z-[70] px-4 pb-2 bg-transparent border-none cursor-pointer"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT, delay: 0.12 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  onClick={() => setModalVisible(true)}
                  aria-label={`Volver al entrenamiento ${sessionFocusTitle(activeSession)}`}
                >
                  <span
                    className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3"
                    style={{ boxShadow: '0 -2px 20px rgba(255,87,51,0.15)' }}
                  >
                    <span className="live-badge shrink-0">
                      <span className="live-dot" />
                      En vivo
                    </span>
                    <span className="flex-1 min-w-0 text-left">
                      <span className="block text-sm font-semibold truncate">{sessionFocusTitle(activeSession)}</span>
                    </span>
                    <span className="font-metric text-base font-bold text-blue leading-none shrink-0 tabular-nums">
                      {formatTimer(liveElapsed)}
                    </span>
                    <ChevronUp size={16} className="text-accent shrink-0" aria-hidden="true" />
                  </span>
                </motion.button>
              )}
              </AnimatePresence>
              </div>

              {/* El modal se mantiene montado mientras haya sesión activa para
                  que el cronómetro no se reinicie al minimizar. */}
              {activeSession && (
                <WorkoutModal
                  session={activeSession}
                  visible={modalVisible}
                  hasWearable={profile?.wearables?.some(w => w.connected)}
                  onClose={closeWorkout}
                  onMinimize={() => setModalVisible(false)}
                  onExerciseDone={id => setLiveCompleted(prev => new Set(prev).add(id))}
                  onActiveExChange={setLiveActiveEx}
                  onElapsedChange={setLiveElapsed}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
