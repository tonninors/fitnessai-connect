import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, CalendarDays, Bell, CreditCard, Link2, ChevronRight, Shield, LogOut } from 'lucide-react';
import { api, supabase } from '../api/client.js';

const PLATFORM_LABELS = { apple_health: 'Apple Watch', garmin: 'Garmin', google_fit: 'Google Fit', fitbit: 'Fitbit' };
const PLATFORM_ICONS  = { apple_health: '⌚', garmin: '🏃', google_fit: '📊', fitbit: '💚' };

export default function Profile({ onNavigate, isTrainer }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile').then(setProfile).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function toggleWearable(w) {
    if (w.connected) {
      await api.delete(`/profile/wearables/${w.platform}`).catch(console.error);
    } else {
      await api.post('/profile/wearables', { platform: w.platform, device_name: w.device_name }).catch(console.error);
    }
    setProfile(await api.get('/profile'));
  }

  if (loading) return <div className="p-10 text-txt3 text-sm">Cargando...</div>;
  if (!profile) return null;

  const planLabels = { free: 'Free', pro: 'Plan PRO', elite: 'Plan Elite' };

  const settings = [
    { icon: Target,       label: 'Mis objetivos',  sub: [profile.goals?.primary, profile.goals?.secondary].filter(Boolean).join(' · ') || 'Sin definir' },
    { icon: CalendarDays, label: 'Disponibilidad', sub: (profile.availability?.days || []).join(', ') || 'Sin definir' },
    { icon: Bell,         label: 'Notificaciones', sub: 'Recordatorios, logros, IA' },
    { icon: CreditCard,   label: 'Suscripción',    sub: `${planLabels[profile.subscription_plan]} · $14.99/mes` },
    { icon: Link2,        label: 'Invitar amigos', sub: 'Gana 1 mes gratis por referido' },
  ];

  const allPlatforms = ['apple_health', 'garmin', 'google_fit', 'fitbit'];
  const wearableMap  = Object.fromEntries((profile.wearables || []).map(w => [w.platform, w]));
  const wearableList = allPlatforms.map(p => wearableMap[p] ?? { platform: p, device_name: PLATFORM_LABELS[p], connected: false });

  return (
    <div>
      {/* Profile hero */}
      <div className="section">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card text-center py-8"
        >
          {/* Avatar with accent ring */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-[3px] border-accent animate-pulse opacity-40" />
            <div className="absolute inset-[3px] rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-3xl">
              {profile.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">{profile.full_name}</h2>
          <span className="inline-block bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-5">
            {planLabels[profile.subscription_plan]}
          </span>

          {/* Stats horizontal */}
          <div className="flex bg-surface2 rounded-xl overflow-hidden border border-border">
            <div className="flex-1 py-3.5 text-center border-r border-border">
              <div className="font-metric text-3xl font-bold text-accent leading-none">{profile.total_sessions}</div>
              <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">Sesiones</div>
            </div>
            <div className="flex-1 py-3.5 text-center border-r border-border">
              <div className="font-metric text-3xl font-bold text-green leading-none">{profile.current_streak}</div>
              <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">Racha</div>
            </div>
            <div className="flex-1 py-3.5 text-center">
              <div className="font-metric text-3xl font-bold text-blue leading-none">{profile.level}</div>
              <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">Nivel</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wearables */}
      <div className="section pt-0">
        <div className="card !p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <span className="text-[10px] text-txt3 uppercase tracking-wider font-semibold">Wearables</span>
          </div>
          {wearableList.map(w => (
            <div key={w.platform} className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border last:border-b-0">
              <span className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-lg">
                {PLATFORM_ICONS[w.platform]}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">{w.device_name}</div>
                <div className={`text-xs mt-0.5 ${w.connected ? 'text-green' : 'text-txt3'}`}>
                  {w.connected ? `Sincronizado${w.last_sync_at ? ` · ${timeAgo(w.last_sync_at)}` : ''}` : 'No conectado'}
                </div>
              </div>
              <button className={`toggle${w.connected ? ' on' : ''}`} onClick={() => toggleWearable(w)} />
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="section pt-0">
        <div className="card !p-0 overflow-hidden">
          {settings.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-surface2/50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-surface2 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-txt2" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{label}</div>
                {sub && <div className="text-xs text-txt3 mt-0.5 truncate">{sub}</div>}
              </div>
              <ChevronRight size={16} className="text-txt3 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Trainer + logout */}
      <div className="section pt-0 flex flex-col gap-2">
        {isTrainer && (
          <button className="btn btn-surface" onClick={() => onNavigate?.('coach')}>
            <Shield size={16} /> Vista de entrenador
          </button>
        )}
        <button className="btn btn-surface text-red-400" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (diff < 1)  return 'ahora';
  if (diff < 60) return `${diff} min`;
  return `${Math.floor(diff / 60)}h`;
}
