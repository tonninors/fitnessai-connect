import { useState, useEffect } from 'react';
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
  { id: 'home',     label: 'Inicio',  icon: HomeIcon     },
  { id: 'plans',    label: 'Planes',  icon: DumbbellIcon },
  { id: 'progress', label: 'Progreso',icon: ChartIcon    },
  { id: 'chat',     label: 'Chat',    icon: ChatIcon     },
  { id: 'profile',  label: 'Perfil',  icon: UserIcon     },
];

export default function App() {
  const [session,       setSession]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [profile,       setProfile]       = useState(null);
  const [profileLoad,   setProfileLoad]   = useState(false);
  const [isTrainer,     setIsTrainer]     = useState(false);
  const [activeScreen,  setActiveScreen]  = useState('home');
  const [activeSession, setActiveSession] = useState(null);
  const [clock,         setClock]         = useState(getTime());

  // Auth listener
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

  // Load profile + check trainer role when session starts
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

  // Clock
  useEffect(() => {
    const t = setInterval(() => setClock(getTime()), 10000);
    return () => clearInterval(t);
  }, []);

  if (loading || profileLoad) return null;
  if (!session) return <Login />;
  if (!profile) return null;  // Esperar a que cargue el perfil antes de decidir onboarding

  const showCoach = isTrainer && activeScreen === 'coach';

  return (
    <div>
      <div className="page-header">
        <h1>FitnessAI Connect</h1>
        <p>Web preview — MVP con Supabase + Node.js + Gemini</p>
      </div>

      <div className="phone-scene">
        <div className="phone-frame">
          <div className="phone-notch">
            <div className="notch-speaker" />
            <div className="notch-camera" />
          </div>
          <div className="phone-btn btn-vol-up" />
          <div className="phone-btn btn-vol-down" />
          <div className="phone-btn btn-power" />

          <div className="phone-screen">
            {/* Status bar */}
            <div className="status-bar">
              <span className="status-time">{clock}</span>
              <div className="status-icons">
                <span style={{ fontSize: 12 }}>●●●</span>
                <span style={{ fontSize: 12 }}>WiFi</span>
                <span style={{ fontSize: 12 }}>100%</span>
              </div>
            </div>

            {/* Onboarding — antes de la app principal */}
            {!profile?.onboarding_completed && (
              <div className="screen active" style={{ zIndex: 150 }}>
                <Onboarding
                  user={session.user}
                  onComplete={() => setProfile(p => ({ ...p, onboarding_completed: true }))}
                />
              </div>
            )}

            {profile?.onboarding_completed && (
              <>
                {/* Dashboard Coach — pantalla completa encima del nav */}
                {showCoach && (
                  <div className="screen active" style={{ zIndex: 100 }}>
                    <div style={{ padding: '8px 20px 0' }}>
                      <button
                        className="btn btn-surface btn-sm"
                        style={{ width: 'auto' }}
                        onClick={() => setActiveScreen('profile')}
                      >
                        ← Volver
                      </button>
                    </div>
                    <DashboardCoach userId={session.user.id} />
                  </div>
                )}

                {/* Screens normales */}
                {NAV.map(({ id }) => {
                  if (id === 'chat') {
                    return (
                      <div key="chat" className={`screen screen--chat${activeScreen === 'chat' ? ' active' : ''}`}>
                        <Chat
                          userId={session.user.id}
                          trainerId={profile?.trainer_id ?? null}
                          trainerName={profile?.trainer_profiles?.full_name ?? null}
                        />
                      </div>
                    );
                  }

                  const SCREENS = { home: Home, plans: Plans, progress: Progress, profile: Profile };
                  const Screen  = SCREENS[id];
                  return (
                    <div key={id} className={`screen${activeScreen === id ? ' active' : ''}`}>
                      <Screen
                        onStartWorkout={setActiveSession}
                        onNavigate={setActiveScreen}
                        isTrainer={isTrainer}
                      />
                    </div>
                  );
                })}

                {/* Bottom nav */}
                {!showCoach && (
                  <nav className="bottom-nav">
                    {NAV.map(({ id, label, icon: Icon }) => (
                      <div
                        key={id}
                        className={`nav-item${activeScreen === id ? ' active' : ''}`}
                        onClick={() => setActiveScreen(id)}
                      >
                        <div className="nav-icon"><Icon /></div>
                        <span className="nav-label">{label}</span>
                      </div>
                    ))}
                  </nav>
                )}

                {/* Workout modal */}
                {activeSession && (
                  <WorkoutModal
                    session={activeSession}
                    hasWearable={profile?.wearables?.some(w => w.connected)}
                    onClose={() => setActiveSession(null)}
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

function HomeIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function DumbbellIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.5 6.5h11M6.5 17.5h11M3 9.5h18M3 14.5h18"/></svg>; }
function ChartIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function ChatIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function UserIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
