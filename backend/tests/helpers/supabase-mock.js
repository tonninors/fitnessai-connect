/**
 * Doble de prueba del cliente Supabase.
 *
 * Reproduce la API encadenable de `@supabase/supabase-js` (`from().select().eq()…`)
 * y delega en un `resolver` que el test controla. Cada consulta se registra en
 * `client.queries`, de modo que los tests pueden afirmar sobre los filtros
 * aplicados (por ejemplo, que se filtró por `user_id`).
 */

const CHAINABLE_FILTERS = [
  'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in', 'or', 'not', 'contains',
];

const CHAINABLE_MODIFIERS = ['order', 'limit', 'range'];

/**
 * @param {(query: object) => ({data?: any, error?: any}) | undefined} resolver
 *        Recibe la consulta acumulada y devuelve la respuesta simulada.
 */
export function createSupabaseMock(resolver = () => ({ data: null, error: null })) {
  const queries = [];

  function from(table) {
    const query = {
      table,
      op: null,
      columns: null,
      payload: null,
      options: {},
      filters: [],
      modifiers: [],
      single: false,
      maybeSingle: false,
    };

    const settle = () => {
      queries.push(query);
      const result = resolver(query);
      return Promise.resolve(result ?? { data: null, error: null });
    };

    const chain = {
      __query: query,
      select(columns) {
        query.columns = columns ?? '*';
        query.op = query.op ?? 'select';
        return chain;
      },
      insert(payload) { query.op = 'insert'; query.payload = payload; return chain; },
      update(payload) { query.op = 'update'; query.payload = payload; return chain; },
      upsert(payload, options) { query.op = 'upsert'; query.payload = payload; query.options = options ?? {}; return chain; },
      delete() { query.op = 'delete'; return chain; },
      single() { query.single = true; return settle(); },
      maybeSingle() { query.maybeSingle = true; return settle(); },
      then(onFulfilled, onRejected) { return settle().then(onFulfilled, onRejected); },
      catch(onRejected) { return settle().catch(onRejected); },
    };

    for (const name of CHAINABLE_FILTERS) {
      chain[name] = (column, value) => { query.filters.push([name, column, value]); return chain; };
    }
    for (const name of CHAINABLE_MODIFIERS) {
      chain[name] = (...args) => { query.modifiers.push([name, ...args]); return chain; };
    }

    return chain;
  }

  return {
    from,
    queries,
    /** Devuelve todas las consultas registradas sobre una tabla. */
    queriesFor(table) { return queries.filter(q => q.table === table); },
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error('no configurado') }),
      admin: {
        listUsers: async () => ({ data: { users: [] }, error: null }),
      },
    },
  };
}

/** Comprueba si una consulta aplicó un filtro concreto. */
export function hasFilter(query, op, column, value) {
  return query.filters.some(([o, c, v]) => o === op && c === column && (value === undefined || v === value));
}

/** Usuario autenticado de ejemplo. */
export const TEST_USER = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'carlos@example.com',
};

export const OTHER_USER_SESSION_ID = '99999999-9999-4999-8999-999999999999';
export const TEST_SESSION_ID = '22222222-2222-4222-8222-222222222222';
export const TEST_EXERCISE_ID = '33333333-3333-4333-8333-333333333333';
