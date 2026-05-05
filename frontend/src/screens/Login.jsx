import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { supabase, api } from '../api/client.js';

export default function Login() {
  const [mode,     setMode]     = useState('login'); // 'login' | 'register' | 'forgot'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  function switchMode(next) {
    setMode(next);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) {
        setError('No se pudo enviar el correo. Intenta de nuevo.');
      } else {
        setSuccess('Te enviamos un correo para restablecer tu contraseña.');
      }
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Cuenta creada. Ya puedes iniciar sesión.');
        switchMode('login');
        setEmail(email);
        setPassword('');
        setName('');
      }
      setLoading(false);
      return;
    }

    // Login — validar si el correo existe primero
    try {
      const { exists } = await api.post('/auth/check-email', { email });
      if (!exists) {
        setError('Este correo no está registrado.');
        setLoading(false);
        return;
      }
    } catch {
      // Si falla el check, dejamos que el login intente de todos modos
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Contraseña incorrecta.');
    setLoading(false);
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-5">
            <Dumbbell size={28} className="text-accent" />
          </div>
          <div className="login-logo">FitnessAI Connect</div>
          <p className="login-sub">
            {mode === 'login'    ? 'Inicia sesión para continuar' :
             mode === 'register' ? 'Crea tu cuenta gratis' :
                                   'Recupera tu contraseña'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="input-group">
              <label className="text-xs text-txt3 font-medium mb-1.5 block">Nombre completo</label>
              <input
                className="w-full min-w-0 bg-surface2 border border-border rounded-xl px-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
                type="text" value={name} placeholder="Carlos Mendoza"
                onChange={e => setName(e.target.value)} required
              />
            </div>
          )}

          <div className="input-group">
            <label className="text-xs text-txt3 font-medium mb-1.5 block">Correo electrónico</label>
            <input
              className="w-full min-w-0 bg-surface2 border border-border rounded-xl px-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
              type="email" value={email} placeholder="tu@correo.com"
              autoComplete="email"
              onChange={e => setEmail(e.target.value)} required
            />
          </div>

          {mode !== 'forgot' && (
            <div className="input-group">
              <label className="text-xs text-txt3 font-medium mb-1.5 block">Contraseña</label>
              <input
                className="w-full min-w-0 bg-surface2 border border-border rounded-xl px-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
                type="password" value={password} placeholder="••••••••"
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)} required minLength={6}
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end mb-3 -mt-1">
              <button type="button" onClick={() => switchMode('forgot')}
                className="text-xs text-txt3 hover:text-accent transition-colors bg-transparent border-none cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {error   && <p className="text-red-400 text-xs text-center py-2">{error}</p>}
          {success && <p className="text-green text-xs text-center py-2">{success}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' :
             mode === 'login'    ? 'Entrar' :
             mode === 'register' ? 'Crear cuenta' :
                                   'Enviar correo'}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'forgot' ? (
            <>
              {'¿Recordaste? '}
              <button onClick={() => switchMode('login')}>Inicia sesión</button>
            </>
          ) : mode === 'login' ? (
            <>
              {'¿Sin cuenta? '}
              <button onClick={() => switchMode('register')}>Regístrate</button>
            </>
          ) : (
            <>
              {'¿Ya tienes cuenta? '}
              <button onClick={() => switchMode('login')}>Inicia sesión</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
