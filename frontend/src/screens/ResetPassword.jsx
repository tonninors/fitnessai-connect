import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { supabase } from '../api/client.js';

export default function ResetPassword({ onDone }) {
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError('No se pudo actualizar la contraseña. Intenta de nuevo.');
    } else {
      onDone();
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
            <KeyRound size={28} className="text-accent" />
          </div>
          <div className="login-logo">Nueva contraseña</div>
          <p className="login-sub">Elige una contraseña segura</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="text-xs text-txt3 font-medium mb-1.5 block">Nueva contraseña</label>
            <input
              className="w-full min-w-0 bg-surface2 border border-border rounded-xl px-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
              type="password" value={password} placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} required minLength={6}
            />
          </div>
          <div className="input-group">
            <label className="text-xs text-txt3 font-medium mb-1.5 block">Confirmar contraseña</label>
            <input
              className="w-full min-w-0 bg-surface2 border border-border rounded-xl px-4 py-3 text-sm text-txt outline-none focus:border-accent transition-colors"
              type="password" value={confirm} placeholder="••••••••"
              onChange={e => setConfirm(e.target.value)} required minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center py-2">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
