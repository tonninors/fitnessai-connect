import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CalendarDays, Bell, CreditCard, Link2, ChevronRight, Shield, LogOut, Watch, Activity, BarChart2, Heart } from 'lucide-react';
import { api, supabase } from '../api/client.js';
import { useApiData } from '../hooks/useApiData.js';
import ErrorState from '../components/ErrorState.jsx';
import { timeAgo } from '../lib/dates.js';

const PLATFORMS = ['apple_health', 'garmin', 'google_fit', 'fitbit'];
const PLATFORM_LABELS = { apple_health: 'Apple Watch', garmin: 'Garmin', google_fit: 'Google Fit', fitbit: 'Fitbit' };
const PLATFORM_ICONS = { apple_health: Watch, garmin: Activity, google_fit: BarChart2, fitbit: Heart };
const PLAN_LABELS = { free: 'Free', pro: 'Plan PRO', elite: 'Plan Elite' };

export function planLabel(plan) {
  return PLAN_LABELS[plan] ?? 'Free';
}

/**
 * Resumen legible de los objetivos guardados en el onboarding.
 * El onboarding guarda `{primary, all}`; la pantalla leía `{primary, secondary}`,
 * así que siempre mostraba "Sin definir".
 */
export function describeGoals(goals) {
  if (Array.isArray(goals?.all) && goals.all.length > 0) {
    return goals.all.map(g => g.replaceAll('_', ' ')).join(' · ');
  }
  if (goals?.primary) return String(goals.primary).replaceAll('_', ' ');
  return 'Sin definir';
}

/**
 * Resumen de disponibilidad. El onboarding guarda
 * `{days_per_week, session_duration, cardio_minutes}`, no `{days}`.
 */
export function describeAvailability(availability) {
  const parts = [];
  if (availability?.days_per_week) parts.push(`${availability.days_per_week} días/semana`);
  if (availability?.session_duration) parts.push(`${availability.session_duration} min`);
  if (Number.isFinite(availability?.cardio_minutes)) {
    parts.push(availability.cardio_minutes === 0 ? 'sin cardio' : `${availability.cardio_minutes} min cardio`);
  }
  if (parts.length === 0 && Array.isArray(availability?.days) && availability.days.length > 0) {
    return availability.days.join(', ');
  }
  return parts.length > 0 ? parts.join(' · ') : 'Sin definir';
}

/** Las 4 plataformas soportadas, mezcladas con el estado real de conexión. */
export function buildWearableList(wearables = []) {
  const byPlatform = Object.fromEntries(wearables.map(w => [w.platform, w]));
  return PLATFORMS.map(p => byPlatform[p] ?? { platform: p, device_name: PLATFORM_LABELS[p], connected: false });
}

export default function Profile({ onNavigate, isTrainer }) {
  const { data: profile, setData: setProfile, loading, error, reload } = useApiData(() => api.get('/profile'));
  const [busyPlatform, setBusyPlatform] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function toggleWearable(wearable) {
    setBusyPlatform(wearable.platform);
    setActionError(null);
    try {
      if (wearable.connected) {
        await api.delete(`/profile/wearables/${wearable.platform}`);
      } else {
        await api.post('/profile/wearables', {
          platform: wearable.platform,
          device_name: wearable.device_name ?? PLATFORM_LABELS[wearable.platform],
        });
      }
      setProfile(await api.get('/profile'));
    } catch (e) {
      setActionError(e.message || 'No se pudo actualizar el wearable');
    } finally {
      setBusyPlatform(null);
    }
  }

  if (loading) return <ProfileSkeleton />;
  if (error) return <ErrorState title="No se pudo cargar tu perfil" message={error} onRetry={reload} />;
  if (!profile) return null;

  const settings = [
    { icon: Target, label: 'Mis objetivos', sub: describeGoals(profile.goals) },
    { icon: CalendarDays, label: 'Disponibilidad', sub: describeAvailability(profile.availability) },
    { icon: Bell, label: 'Notificaciones', sub: 'Recordatorios, logros, IA' },
    { icon: CreditCard, label: 'Suscripción', sub: `${planLabel(profile.subscription_plan)} · $14.99/mes` },
    { icon: Link2, label: 'Invitar amigos', sub: 'Gana 1 mes gratis por referido' },
  ];

  return (
    <div>
      {/* Cabecera */}
      <div className="section">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center py-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-[3px] border-accent opacity-40" />
            <div className="absolute inset-[3px] rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-3xl">
              {profile.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">{profile.full_name}</h2>
          <span className="inline-block bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-5">
            {planLabel(profile.subscription_plan)}
          </span>

          <div className="flex bg-surface2 rounded-xl overflow-hidden border border-border">
            <HeroStat value={profile.total_sessions ?? 0} label="Sesiones" color="text-accent" />
            <HeroStat value={profile.current_streak ?? 0} label="Racha" color="text-green" />
            <HeroStat value={profile.level ?? 1} label="Nivel" color="text-blue" last />
          </div>
        </motion.div>
      </div>

      {/* Wearables */}
      <div className="section pt-0">
        <div className="card !p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <span className="text-[10px] text-txt3 uppercase tracking-wider font-semibold">Wearables</span>
          </div>
          <ul className="list-none">
            {buildWearableList(profile.wearables).map(w => {
              const WearIcon = PLATFORM_ICONS[w.platform];
              const label = w.device_name ?? PLATFORM_LABELS[w.platform];
              return (
                <li key={w.platform} className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border last:border-b-0">
                  <span className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center">
                    <WearIcon size={18} className="text-txt2" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className={`block text-xs mt-0.5 ${w.connected ? 'text-green' : 'text-txt3'}`}>
                      {w.connected
                        ? `Sincronizado${w.last_sync_at ? ` · ${timeAgo(w.last_sync_at)}` : ''}`
                        : 'No conectado'}
                    </span>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!!w.connected}
                    aria-label={`${w.connected ? 'Desconectar' : 'Conectar'} ${label}`}
                    disabled={busyPlatform === w.platform}
                    className={`toggle${w.connected ? ' on' : ''}`}
                    onClick={() => toggleWearable(w)}
                  />
                </li>
              );
            })}
          </ul>
          {actionError && <p className="px-5 pb-4 text-xs text-red-400" role="alert">{actionError}</p>}
        </div>
      </div>

      {/* Ajustes */}
      <div className="section pt-0">
        <div className="card !p-0 overflow-hidden">
          <ul className="list-none">
            {settings.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border last:border-b-0">
                <span className="w-9 h-9 rounded-xl bg-surface2 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-txt2" aria-hidden="true" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium">{label}</span>
                  {sub && <span className="block text-xs text-txt3 mt-0.5 truncate">{sub}</span>}
                </span>
                {/* Sin chevron: estas filas todavía no navegan a ninguna parte,
                    y la flecha prometía una interacción inexistente. */}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Acciones */}
      <div className="section pt-0 flex flex-col gap-2">
        {isTrainer && (
          <button type="button" className="btn btn-surface" onClick={() => onNavigate?.('coach')}>
            <Shield size={16} aria-hidden="true" /> Vista de entrenador
            <ChevronRight size={14} className="text-txt3" aria-hidden="true" />
          </button>
        )}
        <button type="button" className="btn btn-surface text-red-400" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function HeroStat({ value, label, color, last }) {
  return (
    <div className={`flex-1 py-3.5 text-center ${last ? '' : 'border-r border-border'}`}>
      <div className={`font-metric text-3xl font-bold ${color} leading-none`}>{value}</div>
      <div className="text-[10px] text-txt3 uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="p-5 pt-2" aria-busy="true" aria-label="Cargando perfil">
      <div className="skeleton h-52 rounded-2xl mb-2.5" />
      <div className="skeleton h-44 rounded-2xl mb-2.5" />
      <div className="skeleton h-52 rounded-2xl" />
    </div>
  );
}
