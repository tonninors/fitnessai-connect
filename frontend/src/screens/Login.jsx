import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../api/client.js';

export default function Login() {
  const [mode,     setMode]     = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Cuenta creada. Ya puedes iniciar sesión.');
        setMode('login');
        setEmail(email);
        setPassword('');
        setName('');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('Correo o contraseña incorrectos');
    }
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
            {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="input-group">
              <label className="text-xs text-txt3 font-medium mb-1.5 block">Nombre completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt3" />
                <input
                  className="w-full bg-surface2 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
                  type="text" value={name} placeholder="Carlos Mendoza"
                  onChange={e => setName(e.target.value)} required
                />
              </div>
            </div>
          )}
          <div className="input-group">
            <label className="text-xs text-txt3 font-medium mb-1.5 block">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt3" />
              <input
                className="w-full bg-surface2 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
                type="email" value={email} placeholder="tu@correo.com"
                onChange={e => setEmail(e.target.value)} required
              />
            </div>
          </div>
          <div className="input-group">
            <label className="text-xs text-txt3 font-medium mb-1.5 block">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt3" />
              <input
                className="w-full bg-surface2 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
                type="password" value={password} placeholder="••••••••"
                onChange={e => setPassword(e.target.value)} required minLength={6}
              />
            </div>
          </div>

          {error   && <p className="text-red-400 text-xs text-center py-2">{error}</p>}
          {success && <p className="text-green text-xs text-center py-2">{success}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'login' ? '¿Sin cuenta? ' : '¿Ya tienes cuenta? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}>
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
