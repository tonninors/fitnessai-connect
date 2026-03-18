import { useState } from 'react';
import { supabase } from '../api/client.js';

export default function Login() {
  const [mode,     setMode]     = useState('login');  // 'login' | 'register'
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
        setSuccess('¡Cuenta creada! Ya puedes iniciar sesión.');
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
        <div className="login-logo">FitnessAI Connect</div>
        <p className="login-sub">
          {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="input-group">
              <label>Nombre completo</label>
              <input
                type="text" value={name} placeholder="Carlos Mendoza"
                onChange={e => setName(e.target.value)} required
              />
            </div>
          )}
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email" value={email} placeholder="tu@correo.com"
              onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password" value={password} placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} required minLength={6}
            />
          </div>

          {error   && <p className="error-msg">{error}</p>}
          {success && <p className="error-msg" style={{ color: 'var(--primary)' }}>{success}</p>}

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
