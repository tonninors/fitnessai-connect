import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Carga de datos con estados de carga, error y reintento.
 *
 * Las cuatro pantallas principales repetían `useState + useEffect +
 * .catch(console.error)`, lo que dejaba la pantalla en blanco y sin mensaje
 * cuando la API fallaba.
 *
 * @param {() => Promise<any>} loader  Función que devuelve los datos.
 * @param {Array} deps                 Dependencias que fuerzan una recarga.
 */
export function useApiData(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => loaderRef.current())
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'No se pudieron cargar los datos');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const reload = useCallback(() => setReloadToken(t => t + 1), []);

  return { data, setData, loading, error, reload };
}

export default useApiData;
