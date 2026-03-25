import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Flame, Dumbbell, Wind, Footprints, Trophy, Heart, ArrowLeft, Sparkles, Wifi, UserCheck } from 'lucide-react';
import { api } from '../api/client.js';

const GOALS = [
  { id: 'perder_grasa',        label: 'Perder grasa',    Icon: Flame },
  { id: 'ganar_musculo',       label: 'Ganar músculo',   Icon: Dumbbell },
  { id: 'mejorar_resistencia', label: 'Resistencia',     Icon: Footprints },
  { id: 'flexibilidad',        label: 'Flexibilidad',    Icon: Wind },
  { id: 'rendimiento',         label: 'Rendimiento',     Icon: Trophy },
  { id: 'salud_general',       label: 'Salud general',   Icon: Heart },
];

const DAYS      = [2, 3, 4, 5, 6];
const DURATIONS = [30, 45, 60, 90];
const LEVELS    = [
  { id: 'beginner',     label: 'Principiante', desc: 'Menos de 6 meses entrenando' },
  { id: 'intermediate', label: 'Intermedio',   desc: '6 meses – 2 años' },
  { id: 'advanced',     label: 'Avanzado',     desc: 'Más de 2 años de experiencia' },
];
const EQUIPMENT = [
  { id: 'ninguno',           label: 'Sin equipo', icon: '🏠' },
  { id: 'mancuernas',        label: 'Mancuernas', icon: '🏋️' },
  { id: 'gimnasio_completo', label: 'Gimnasio',   icon: '🏟️' },
  { id: 'calistenia',        label: 'Calistenia', icon: '🤸' },
];

const stepVariants = {
  enter:  { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -30 },
};

export default function Onboarding({ user, onComplete }) {
  const [step,     setStep]     = useState(0);
  const [goals,    setGoals]    = useState([]);
  const [days,     setDays]     = useState(3);
  const [duration, setDuration] = useState(45);
  const [level,    setLevel]    = useState('');
  const [equip,    setEquip]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [name,     setName]     = useState(
    user?.user_metadata?.full_name?.split(' ')[0] ?? 'Atleta'
  );

  useEffect(() => {
    if (!user?.user_metadata?.full_name) {
      api.get('/profile').then(p => {
        const firstName = p?.full_name?.split(' ')[0];
        if (firstName) setName(firstName);
      }).catch(() => {});
    }
  }, [user]);

  const toggleList = (list, setList, id) =>
    setList(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);

  const canNext = [true, goals.length > 0, true, level !== ''][step];

  async function finish() {
    setLoading(true);
    setError('');
    try {
      const goalsStr = goals.join(', ') || 'fitness general';
      const equipStr = equip.join(', ')  || 'ninguno';

      await api.patch('/profile', {
        goals:                { primary: goals[0] || null, all: goals },
        availability:         { days_per_week: days, session_duration: duration },
        onboarding_completed: true,
      });

      try {
        await api.post('/ai/generate-plan', {
          goals:         goalsStr,
          days_per_week: days,
          fitness_level: level,
          equipment:     equipStr,
          focus_areas:   goalsStr,
        });
      } catch (aiErr) {
        console.warn('Plan IA no generado:', aiErr.message);
      }

      onComplete();
    } catch (e) {
      setError(e.message || 'Error al guardar tu perfil. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <div className="onboard-wrap">
      {/* Topbar */}
      <div className="onboard-topbar">
        {step > 0
          ? <button className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border-none cursor-pointer" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={16} className="text-txt2" />
            </button>
          : <div className="w-8" />
        }
        <div className="onboard-dots">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`onboard-dot${step === i ? ' active' : step > i ? ' done' : ''}`} />
          ))}
        </div>
        <div className="w-8" />
      </div>

      <div className="onboard-body">
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={stepVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25 }}
          >

        {/* Step 0 — Bienvenida */}
        {step === 0 && (
          <div className="onboard-step">
            <div className="w-20 h-20 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <Rocket size={36} className="text-accent" />
            </div>
            <h1 className="text-2xl font-extrabold mb-2 text-center">¡Hola, {name}!</h1>
            <p className="text-sm text-txt3 text-center mb-8 leading-relaxed max-w-[280px] mx-auto">
              Configura tu experiencia en 4 pasos para que la IA genere tu plan perfecto.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { Icon: Sparkles, text: 'Plan generado por IA en segundos' },
                { Icon: Wifi, text: 'Sincronización con tu wearable' },
                { Icon: UserCheck, text: 'Conexión directa con tu entrenador' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5 bg-surface2 rounded-xl px-4 py-3.5 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <span className="text-sm text-txt">{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Objetivos */}
        {step === 1 && (
          <div className="onboard-step">
            <h2 className="text-xl font-bold mb-1 text-center">¿Cuál es tu objetivo?</h2>
            <p className="text-sm text-txt3 text-center mb-6">Selecciona uno o varios</p>
            <div className="onboard-chip-grid">
              {GOALS.map(({ id, label, Icon }) => (
                <div
                  key={id}
                  className={`onboard-chip${goals.includes(id) ? ' selected' : ''}`}
                  onClick={() => toggleList(goals, setGoals, id)}
                >
                  <Icon size={20} className={goals.includes(id) ? 'text-white' : 'text-txt3'} />
                  <span className="chip-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Disponibilidad */}
        {step === 2 && (
          <div className="onboard-step">
            <h2 className="text-xl font-bold mb-1 text-center">¿Cuánto puedes entrenar?</h2>
            <p className="text-sm text-txt3 text-center mb-6">La IA adaptará la carga a tu disponibilidad</p>

            <div className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-2.5">Días por semana</div>
            <div className="onboard-num-row">
              {DAYS.map(d => (
                <div
                  key={d}
                  className={`onboard-num-chip${days === d ? ' selected' : ''}`}
                  onClick={() => setDays(d)}
                >{d}</div>
              ))}
            </div>

            <div className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-2.5 mt-6">Duración por sesión</div>
            <div className="onboard-num-row">
              {DURATIONS.map(d => (
                <div
                  key={d}
                  className={`onboard-num-chip${duration === d ? ' selected' : ''}`}
                  onClick={() => setDuration(d)}
                >{d}m</div>
              ))}
            </div>

            <div className="mt-5 flex gap-3 items-start bg-surface2 rounded-xl p-4 border border-border">
              <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-txt2 leading-relaxed">
                Con {days} días × {duration} min la IA diseñará un plan de{' '}
                {days * duration >= 210 ? 'volumen progresivo' : 'eficiencia máxima'}.
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Nivel + Equipo */}
        {step === 3 && (
          <div className="onboard-step">
            <h2 className="text-xl font-bold mb-1 text-center">Nivel y equipo</h2>
            <p className="text-sm text-txt3 text-center mb-6">Para calibrar la intensidad exacta</p>

            <div className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-2.5">Experiencia</div>
            <div className="flex flex-col gap-2 mb-6">
              {LEVELS.map(({ id, label, desc }) => (
                <div
                  key={id}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border cursor-pointer transition-all ${
                    level === id
                      ? 'bg-accent/10 border-accent'
                      : 'bg-surface2 border-border hover:border-txt3'
                  }`}
                  onClick={() => setLevel(id)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    level === id ? 'border-accent' : 'border-txt3'
                  }`}>
                    {level === id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-txt3 mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-txt3 uppercase tracking-wider font-semibold mb-2.5">Equipo disponible</div>
            <div className="onboard-chip-grid">
              {EQUIPMENT.map(({ id, label, icon }) => (
                <div
                  key={id}
                  className={`onboard-chip${equip.includes(id) ? ' selected' : ''}`}
                  onClick={() => toggleList(equip, setEquip, id)}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="chip-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

          </motion.div>
        </AnimatePresence>
      </div>

      {error && <p className="text-red-400 text-xs text-center px-5 pb-2">{error}</p>}

      <div className="onboard-footer">
        {step < 3 ? (
          <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext}>
            Continuar
          </button>
        ) : (
          <button className="btn btn-primary" onClick={finish} disabled={loading || !canNext}>
            {loading ? 'Generando tu plan...' : 'Crear mi plan con IA'}
          </button>
        )}
      </div>
    </div>
  );
}
