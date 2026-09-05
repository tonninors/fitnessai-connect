import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// `pr-12` en lugar de `px-4`: el botón del ojo se monta encima del input y sin
// ese hueco el texto de la contraseña le pasaría por debajo. Los 48px del
// padding son exactamente el ancho del botón.
const INPUT_CLASS =
  'w-full min-w-0 bg-surface2 border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-txt outline-none focus:border-accent transition-colors';

/**
 * Campo de contraseña con botón para mostrarla u ocultarla.
 *
 * `toggleLabel` es un prop y no un texto fijo porque una misma pantalla puede
 * tener dos campos (ResetPassword): dos botones con el mismo nombre accesible
 * son ambiguos para un lector de pantalla.
 *
 * El botón usa `aria-pressed` con una etiqueta constante en vez de cambiarle
 * el texto: así el lector anuncia "Mostrar contraseña, pulsado" en vez de
 * contradecirse con un "Ocultar contraseña, pulsado".
 */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  toggleLabel = 'Mostrar contraseña',
  hint = null,
  minLength = 6,
}) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="input-group">
      <label htmlFor={id} className="text-xs text-txt3 font-medium mb-1.5 block">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          className={INPUT_CLASS}
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder="••••••••"
          autoComplete={autoComplete}
          onChange={onChange}
          required
          minLength={minLength}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={toggleLabel}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-transparent border-none cursor-pointer text-txt3 hover:text-txt2 transition-colors"
        >
          <Icon size={18} aria-hidden="true" />
        </button>
      </div>

      {hint && <p className="text-[11px] text-txt3 mt-1.5">{hint}</p>}
    </div>
  );
}
