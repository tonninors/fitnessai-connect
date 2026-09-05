import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
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

  const [activeSession, setActiveSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [liveCompleted, setLiveCompleted] = useState(null); // Set<exerciseId> | null
  const [liveActiveEx, setLiveActiveEx] = useState(null);   // { id, name, setNum, totalSets } | null

  const [clock, setClock] = useState(() => formatClock());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthEvent(event);
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

  const startWorkout = useCallback((workoutSession) => {
    setActiveSession(workoutSession);
    setModalVisible(true);
    setLiveCompleted(new Set((workoutSession.session_exercises ?? []).filter(e => e.completed).map(e => e.id)));
    setLiveActiveEx(null);
  }, []);

  const closeWorkout = useCallback(() => {
    setActiveSession(null);
    setModalVisible(false);
    setLiveCompleted(null);
    setLiveActiveEx(null);
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
              {showCoach && (
                <div className="screen" style={{ opacity: 1, pointerEvents: 'all', zIndex: 100 }}>
                  <div className="px-5 pt-2">
                    <button type="button" className="btn btn-surface btn-sm w-auto" onClick={() => setActiveScreen('profile')}>
                      ← Volver
                    </button>
                  </div>
                  <Suspense fallback={<ScreenFallback />}>
                    <DashboardCoach userId={session.user.id} />
                  </Suspense>
                </div>
              )}

              <AnimatePresence mode="wait">
                {NAV.map(({ id }) => {
                  if (activeScreen !== id) return null;

                  if (id === 'chat') {
                    return (
                      <motion.div
                        key="chat"
                        className="screen screen--chat"
                        style={{ opacity: 1, pointerEvents: 'all' }}
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
                      style={{ opacity: 1, pointerEvents: 'all' }}
                      variants={pageVariants} initial="initial" animate="animate" exit="exit"
                    >
                      <Suspense fallback={<ScreenFallback />}>
                      <Screen
                        onStartWorkout={startWorkout}
                        onNavigate={setActiveScreen}
                        isTrainer={isTrainer}
                        runningSession={activeSession}
                        onResumeWorkout={() => setModalVisible(true)}
                        liveCompleted={liveCompleted ?? new Set()}
                        liveActiveEx={liveActiveEx}
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
                        onClick={() => setActiveScreen(id)}
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
              {activeSession && !modalVisible && (
                <button
                  type="button"
                  className="absolute bottom-[80px] left-0 right-0 z-[70] px-4 pb-2 bg-transparent border-none cursor-pointer"
                  onClick={() => setModalVisible(true)}
                  aria-label={`Volver al entrenamiento ${activeSession.name}`}
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
                      <span className="block text-sm font-semibold truncate">{activeSession.name}</span>
                    </span>
                    <ChevronUp size={16} className="text-accent shrink-0" aria-hidden="true" />
                  </span>
                </button>
              )}

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
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
