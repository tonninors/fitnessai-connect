import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Estado de error reutilizable. Antes, si una petición fallaba, la pantalla se
 * quedaba en blanco sin explicación ni forma de reintentar.
 */
export default function ErrorState({
  title = 'No se pudieron cargar los datos',
  message,
  onRetry,
  retryLabel = 'Reintentar',
}) {
  return (
    <div className="section" role="alert">
      <div className="card text-center py-8">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-accent" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold mb-1">{title}</p>
        {message && <p className="text-xs text-txt3 mb-5 leading-relaxed px-4">{message}</p>}
        {onRetry && (
          <button type="button" className="btn btn-surface btn-sm mx-auto" onClick={onRetry}>
            <RotateCcw size={14} aria-hidden="true" /> {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
