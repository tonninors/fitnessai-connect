import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home as HomeIcon, Dumbbell, TrendingUp, MessageCircle, User, ChevronUp } from 'lucide-react';
import { supabase, api } from './api/client.js';
import Login          from './screens/Login.jsx';
import Onboarding     from './screens/Onboarding.jsx';
import Home           from './screens/Home.jsx';
import Plans          from './screens/Plans.jsx';
import Progress       from './screens/Progress.jsx';
import Profile        from './screens/Profile.jsx';
import Chat           from './screens/Chat.jsx';
import DashboardCoach from './screens/DashboardCoach.jsx';
import WorkoutModal   from './components/WorkoutModal.jsx';

const NAV = [
  { id: 'home',     label: 'Inicio',   icon: HomeIcon     },
  { id: 'plans',    label: 'Planes',   icon: Dumbbell     },
  { id: 'progress', label: 'Progreso', icon: TrendingUp   },
  { id: 'chat',     label: 'Chat',     icon: MessageCircle },
  { id: 'profile',  label: 'Perfil',   icon: User         },
];

const SCREENS = { home: Home, plans: Plans, progress: Progress, profile: Profile };

const pageVariants = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function App() {
  const [session,       setSession]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [profile,       setProfile]       = useState(null);
  const [profileLoad,   setProfileLoad]   = useState(false);
  const [isTrainer,     setIsTrainer]     = useState(false);
  const [activeScreen,  setActiveScreen]  = useState('home');
  const [activeSession,  setActiveSession]  = useState(null);
  const [modalVisible,   setModalVisible]   = useState(false);
  const [clock,         setClock]         = useState(getTime());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) { setProfile(null); setIsTrainer(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setProfileLoad(true);
    Promise.all([
      api.get('/profile'),
      supabase.from('trainer_profiles').select('id').eq('id', session.user.id).maybeSingle(),
    ]).then(([prof, trainerRes]) => {
      setProfile(prof);
      setIsTrainer(!!trainerRes.data);
      setProfileLoad(false);
    }).catch(() => setProfileLoad(false));
  }, [session]);

  useEffect(() => {
    const t = setInterval(() => setClock(getTime()), 10000);
    return () => clearInterval(t);
  }, []);

  if (loading || profileLoad) return null;
  if (!session) return <Login />;
  if (!profile) return null;

  const showCoach = isTrainer && activeScreen === 'coach';

  return (
    <div>
      <div className="phone-scene">
        <div className="phone-frame">
          <div className="phone-notch" />
          <div className="phone-screen">
            {/* Status bar */}
            <div className="status-bar">
              <span className="font-semibold text-[15px] tracking-tight">{clock}</span>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 18 14" width="15" height="13" fill="currentColor"><rect x="0" y="8" width="3" height="6" rx="1"/><rect x="5" y="5" width="3" height="9" rx="1"/><rect x="10" y="2" width="3" height="12" rx="1"/><rect x="15" y="0" width="3" height="14" rx="1" opacity="0.3"/></svg>
                <svg viewBox="0 0 18 14" width="15" height="13"><path d="M1 5 Q9 -1 17 5" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"/><path d="M4 8.5 Q9 4.5 14 8.5" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/></svg>
                <svg viewBox="0 0 22 12" width="19" height="11"><rect x="0" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="18.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.5"/><rect x="1.5" y="2.5" width="13" height="7" rx="1.2" fill="currentColor"/></svg>
              </div>
            </div>

            {/* Onboarding gate */}
            {!profile?.onboarding_completed && (
              <div className="screen" style={{ opacity: 1, pointerEvents: 'all', zIndex: 150 }}>
                <Onboarding
                  user={session.user}
                  onComplete={() => setProfile(p => ({ ...p, onboarding_completed: true }))}
                />
              </div>
            )}

            {profile?.onboarding_completed && (
              <>
                {/* Coach dashboard overlay */}
                {showCoach && (
                  <div className="screen" style={{ opacity: 1, pointerEvents: 'all', zIndex: 100 }}>
                    <div className="px-5 pt-2">
                      <button className="btn btn-surface btn-sm w-auto" onClick={() => setActiveScreen('profile')}>
                        ← Volver
                      </button>
                    </div>
                    <DashboardCoach userId={session.user.id} />
                  </div>
                )}

                {/* Main screens with transitions */}
                <AnimatePresence mode="wait">
                  {NAV.map(({ id }) => {
                    if (activeScreen !== id) return null;
                    if (id === 'chat') {
                      return (
                        <motion.div key="chat" className="screen screen--chat" style={{ opacity: 1, pointerEvents: 'all' }}
                          variants={pageVariants} initial="initial" animate="animate" exit="exit"
                        >
                          <Chat userId={session.user.id} trainerId={profile?.trainer_id ?? null} trainerName={profile?.trainer_profiles?.full_name ?? null} />
                        </motion.div>
                      );
                    }
                    const Screen = SCREENS[id];
                    return (
                      <motion.div key={id} className="screen" style={{ opacity: 1, pointerEvents: 'all' }}
                        variants={pageVariants} initial="initial" animate="animate" exit="exit"
                      >
                        <Screen onStartWorkout={s => { setActiveSession(s); setModalVisible(true); }} onNavigate={setActiveScreen} isTrainer={isTrainer} />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Bottom nav */}
                {!showCoach && (
                  <nav className="bottom-nav">
                    {NAV.map(({ id, label, icon: Icon }) => {
                      const isActive = activeScreen === id;
                      return (
                        <button key={id} onClick={() => setActiveScreen(id)}
                          className="flex flex-col items-center gap-1 flex-1 pt-2 bg-transparent border-none cursor-pointer relative"
                        >
                          {isActive && (
                            <motion.div layoutId="nav-indicator"
                              className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-accent"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                          <Icon size={20} strokeWidth={isActive ? 2.2 : 1.5}
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

                {/* Mini workout bar (modal minimizado) */}
                {activeSession && !modalVisible && (
                  <div
                    className="absolute bottom-[80px] left-0 right-0 z-[70] px-4 pb-2"
                    onClick={() => setModalVisible(true)}
                  >
                    <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3 cursor-pointer"
                      style={{ boxShadow: '0 -2px 20px rgba(255,87,51,0.15)' }}
                    >
                      <div className="live-badge shrink-0">
                        <div className="live-dot" />
                        En vivo
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{activeSession.name}</div>
                      </div>
                      <ChevronUp size={16} className="text-accent shrink-0" />
                    </div>
                  </div>
                )}

                {/* Workout modal */}
                {activeSession && modalVisible && (
                  <WorkoutModal
                    session={activeSession}
                    hasWearable={profile?.wearables?.some(w => w.connected)}
                    onClose={() => { setActiveSession(null); setModalVisible(false); }}
                    onMinimize={() => setModalVisible(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTime() {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });
}
