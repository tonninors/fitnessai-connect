import { useState, useEffect } from 'react';
import { api, supabase } from '../api/client.js';

const PLATFORM_LABELS = {
  apple_health: 'Apple Watch',
  garmin:       'Garmin',
  google_fit:   'Google Fit',
  fitbit:       'Fitbit',
};
const PLATFORM_ICONS = {
  apple_health: '⌚',
  garmin:       '🏃',
  google_fit:   '📊',
  fitbit:       '💚',
};

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
      // En producción: OAuth flow con el proveedor. Aquí simulamos la conexión.
      await api.post('/profile/wearables', {
        platform: w.platform, device_name: w.device_name,
      }).catch(console.error);
    }
    const updated = await api.get('/profile');
    setProfile(updated);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) return <div style={{ padding: 24, color: 'var(--text-2)' }}>Cargando...</div>;
  if (!profile) return null;

  const planLabels = { free: 'Free', pro: '⚡ Plan PRO', elite: '👑 Plan Elite' };
  const daysLeft   = profile.subscription_expires
    ? Math.ceil((new Date(profile.subscription_expires) - Date.now()) / 86400000)
    : null;

  const settings = [
    { icon: '🎯', label: 'Mis objetivos',     sub: [profile.goals?.primary, profile.goals?.secondary].filter(Boolean).join(' · ') || 'Sin definir' },
    { icon: '📅', label: 'Disponibilidad',    sub: (profile.availability?.days || []).join(', ') || 'Sin definir' },
    { icon: '🔔', label: 'Notificaciones',    sub: 'Recordatorios, logros, IA' },
    { icon: '💳', label: 'Suscripción',       sub: `${planLabels[profile.subscription_plan]} · $14.99/mes` },
    { icon: '🔗', label: 'Invitar amigos',    sub: 'Gana 1 mes gratis por referido' },
  ];

  // Wearables: mostrar los del usuario + los no conectados como sugerencias
  const allPlatforms = ['apple_health', 'garmin', 'google_fit', 'fitbit'];
  const wearableMap  = Object.fromEntries((profile.wearables || []).map(w => [w.platform, w]));
  const wearableList = allPlatforms.map(p => wearableMap[p] ?? { platform: p, device_name: PLATFORM_LABELS[p], connected: false });

  return (
    <div>
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="section-title">Mi Perfil</div>
      </div>

      {/* Profile hero */}
      <div className="section">
        <div className="profile-hero">
          <div className="avatar">🏋️</div>
          <div className="profile-name">{profile.full_name}</div>
          <div>
            <span className="plan-badge">
              {planLabels[profile.subscription_plan]}
            </span>
          </div>
          {daysLeft !== null && (
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12 }}>
              Activo · Renueva en {daysLeft} días
            </div>
          )}
          <div className="profile-stats">
            <div className="p-stat">
              <span className="p-stat-val">{profile.total_sessions}</span>
              <span className="p-stat-lbl">Sesiones</span>
            </div>
            <div className="p-stat">
              <span className="p-stat-val">{profile.current_streak}</span>
              <span className="p-stat-lbl">Racha</span>
            </div>
            <div className="p-stat">
              <span className="p-stat-val">{profile.level}</span>
              <span className="p-stat-lbl">Nivel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wearables */}
      <div className="section">
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Wearables conectados</div>
          {wearableList.map(w => (
            <div className="wearable-item" key={w.platform}>
              <span className="wearable-icon">{PLATFORM_ICONS[w.platform]}</span>
              <div className="wearable-info">
                <div className="wearable-name">{w.device_name}</div>
                <div className={`wearable-status${w.connected ? ' connected' : ''}`}>
                  {w.connected
                    ? `● Sincronizado${w.last_sync_at ? ` · hace ${timeAgo(w.last_sync_at)}` : ''}`
                    : '○ No conectado'}
                </div>
              </div>
              <button
                className={`toggle${w.connected ? ' on' : ''}`}
                onClick={() => toggleWearable(w)}
                aria-label="toggle wearable"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="section">
        <div className="card">
          {settings.map(({ icon, label, sub }) => (
            <div className="settings-item" key={label}>
              <span className="settings-icon">{icon}</span>
              <div className="settings-info">
                <div className="settings-label">{label}</div>
                {sub && <div className="settings-sub">{sub}</div>}
              </div>
              <span className="chevron">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard de entrenador */}
      {isTrainer && (
        <div className="section" style={{ paddingTop: 0 }}>
          <button
            className="btn btn-surface"
            onClick={() => onNavigate?.('coach')}
            style={{ borderColor: 'rgba(110,231,183,0.25)', color: 'var(--primary)' }}
          >
            🏅 Vista de entrenador
          </button>
        </div>
      )}

      {/* Sign out */}
      <div className="section">
        <button className="btn btn-surface" onClick={signOut} style={{ color: 'var(--accent)', borderColor: 'rgba(244,114,182,0.2)' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (diff < 1)  return 'ahora mismo';
  if (diff < 60) return `${diff} min`;
  return `${Math.floor(diff / 60)}h`;
}
