import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { supabase, api } from '../api/client.js';
import PasswordField from '../components/PasswordField.jsx';

const INPUT_CLASS =
  'w-full min-w-0 bg-surface2 border border-border rounded-xl px-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors';

const COPY = {
  login:    { subtitle: 'Inicia sesión para continuar', submit: 'Entrar' },
  register: { subtitle: 'Crea tu cuenta gratis',        submit: 'Crear cuenta' },
  forgot:   { subtitle: 'Recupera tu contraseña',       submit: 'Enviar correo' },
};

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError('');
    setSuccess('');
  }

  async function handleForgot() {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (resetError) setError('No se pudo enviar el correo. Intenta de nuevo.');
    else setSuccess('Te enviamos un correo para restablecer tu contraseña.');
  }

  async function handleRegister() {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setMode('login');
    setError('');
    setSuccess('Cuenta creada. Ya puedes iniciar sesión.');
    setPassword('');
    setName('');
  }

  async function handleLogin() {
    try {
      const { exists } = await api.post('/auth/check-email', { email });
      if (!exists) {
        setError('Este correo no está registrado.');
        return;
      }
    } catch {
      // Si el backend no responde, dejamos que Supabase valide directamente.
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError('Contraseña incorrecta.');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'forgot') await handleForgot();
      else if (mode === 'register') await handleRegister();
      else await handleLogin();
    } catch (err) {
      setError(err?.message || 'Algo salió mal. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-5">
            <Dumbbell size={28} className="text-accent" aria-hidden="true" />
          </div>
          <h1 className="login-logo">FitnessAI Connect</h1>
          <p className="login-sub">{COPY[mode].subtitle}</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate={false}>
          {mode === 'register' && (
            <div className="input-group">
              {/* Los labels ahora están asociados con `htmlFor`/`id`: antes los
                  lectores de pantalla no podían anunciar los campos. */}
              <label htmlFor="login-name" className="text-xs text-txt3 font-medium mb-1.5 block">
                Nombre completo
              </label>
              <input
                id="login-name"
                className={INPUT_CLASS}
                type="text"
                value={name}
                placeholder="Carlos Mendoza"
                autoComplete="name"
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="login-email" className="text-xs text-txt3 font-medium mb-1.5 block">
              Correo electrónico
            </label>
            <input
              id="login-email"
              className={INPUT_CLASS}
              type="email"
              value={email}
              placeholder="tu@correo.com"
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <PasswordField
              id="login-password"
              label="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              hint={mode === 'register' ? 'Mínimo 6 caracteres.' : null}
            />
          )}

          {mode === 'login' && (
            <div className="flex justify-end mb-3 -mt-1">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-xs text-txt3 hover:text-accent transition-colors bg-transparent border-none cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <div aria-live="polite">
            {error && <p className="text-red-400 text-xs text-center py-2" role="alert">{error}</p>}
            {success && <p className="text-green text-xs text-center py-2">{success}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : COPY[mode].submit}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'forgot' ? (
            <>
              {'¿Recordaste? '}
              <button type="button" onClick={() => switchMode('login')}>Inicia sesión</button>
            </>
          ) : mode === 'login' ? (
            <>
              {'¿Sin cuenta? '}
              <button type="button" onClick={() => switchMode('register')}>Regístrate</button>
            </>
          ) : (
            <>
              {'¿Ya tienes cuenta? '}
              <button type="button" onClick={() => switchMode('login')}>Inicia sesión</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
