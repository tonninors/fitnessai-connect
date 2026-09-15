import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Tests de regresión de los flujos que atraviesan varias pantallas:
 * sesión → onboarding → inicio → entrenamiento en curso → minimizar.
 */
const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };

const authState = { session: null, listener: null };
const supabase = {
  auth: {
    getSession: vi.fn(async () => ({ data: { session: authState.session } })),
    onAuthStateChange: vi.fn((cb) => {
      authState.listener = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
    signOut: vi.fn(),
  },
  from: vi.fn(() => ({
    select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
  })),
  channel: vi.fn(() => ({ on: () => ({ subscribe: () => ({}) }) })),
  removeChannel: vi.fn(),
};

vi.mock('./api/client.js', () => ({ api, supabase }));

const { default: App } = await import('./App.jsx');
const { makeHomeData, makeProfile, makeSession } = await import('./tests/factories.js');

const SESSION = { user: { id: 'user-1', email: 'carlos@example.com', user_metadata: { full_name: 'Carlos Mendoza' } } };

beforeEach(() => {
  authState.session = SESSION;
  api.get.mockReset();
  api.post.mockReset();
  api.patch.mockReset();
  api.post.mockResolvedValue({ insight: 'Buen ritmo.' });
  api.patch.mockResolvedValue({});
});

function mockApi({ profile = makeProfile(), home = makeHomeData() } = {}) {
  api.get.mockImplementation((path) => {
    if (path === '/profile') return Promise.resolve(profile);
    if (path === '/home') return Promise.resolve(home);
    if (path === '/workouts/plan') return Promise.resolve(null);
    if (path === '/workouts/upcoming') return Promise.resolve([]);
    if (path === '/progress/stats') return Promise.resolve({ streak: 0, level: 1, level_name: 'Principiante', total_workouts: 0, total_calories: 0, total_hours: 0, weekly_volume: [] });
    return Promise.resolve(null);
  });
}

describe('App — arranque', () => {
  it('muestra el login cuando no hay sesión', async () => {
    authState.session = null;
    mockApi();
    render(<App />);
    expect(await screen.findByText('FitnessAI Connect')).toBeInTheDocument();
  });

  it('muestra el onboarding si el perfil no lo ha completado', async () => {
    mockApi({ profile: makeProfile({ onboarding_completed: false }) });
    render(<App />);
    await waitFor(() => expect(screen.getByText('¡Hola, Carlos!')).toBeInTheDocument());
    // Sin onboarding no se muestra la navegación principal.
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('muestra la app con navegación cuando el onboarding está completo', async () => {
    mockApi();
    render(<App />);
    expect(await screen.findByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument();
    expect(await screen.findByText('Carlos')).toBeInTheDocument();
  });

  it('muestra un error accionable si el backend no responde', async () => {
    api.get.mockRejectedValue(new Error('Failed to fetch'));
    render(<App />);

    expect(await screen.findByText('No se pudo conectar al servidor')).toBeInTheDocument();

    mockApi();
    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(await screen.findByRole('navigation')).toBeInTheDocument();
  });
});

describe('App — navegación', () => {
  it('cambia de pantalla y marca la pestaña activa', async () => {
    mockApi();
    render(<App />);

    const nav = await screen.findByRole('navigation');
    const plansTab = within(nav).getByRole('button', { name: /planes/i });
    await userEvent.click(plansTab);

    expect(await screen.findByText('Mis Planes')).toBeInTheDocument();
    expect(plansTab).toHaveAttribute('aria-current', 'page');
  });
});

describe('App — entrenamiento en curso (regresión)', () => {
  async function startWorkout() {
    const session = makeSession();
    mockApi({ home: makeHomeData({ today_session: session }) });
    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: /iniciar entrenamiento/i }));
    return session;
  }

  it('minimizar deja la barra "En vivo" y permite volver sin perder la sesión', async () => {
    await startWorkout();
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /minimizar entrenamiento/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    // La barra nombra la sesión por su zona del cuerpo ("Pecho"), no por el
    // nombre en inglés que le pone la IA.
    const miniBar = await screen.findByRole('button', { name: /volver al entrenamiento pecho/i });
    await userEvent.click(miniBar);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('cerrar el modal quita también la barra minimizada', async () => {
    await startWorkout();
    await screen.findByRole('dialog');

    await userEvent.click(screen.getByRole('button', { name: /cerrar entrenamiento/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /volver al entrenamiento/i })).not.toBeInTheDocument();
  });

  it('el progreso del modal se refleja en la tarjeta de Inicio', async () => {
    await startWorkout();
    await screen.findByRole('dialog');

    // La app decide qué ejercicio toca: solo hay que arrancarlo y terminarlo.
    await userEvent.click(screen.getByRole('button', { name: /comenzar entrenamiento/i }));
    await userEvent.click(await screen.findByRole('button', { name: /empezar ejercicio/i }));
    await userEvent.click(await screen.findByRole('button', { name: /terminar ejercicio/i }));
    await userEvent.click(screen.getByRole('button', { name: /minimizar entrenamiento/i }));

    // La barra segmentada de Inicio marca 1 de 4 ejercicios completados.
    expect(await screen.findByRole('img', { name: /1 de 4 ejercicios/i })).toBeInTheDocument();
  });

  it('la barra minimizada muestra el tiempo entrenado', async () => {
    await startWorkout();
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: /minimizar entrenamiento/i }));

    const miniBar = await screen.findByRole('button', { name: /volver al entrenamiento/i });
    expect(within(miniBar).getByText('00:00')).toBeInTheDocument();
  });

  it('cambiar de cuenta descarta el entrenamiento en curso', async () => {
    // Regresión: al cerrar sesión y entrar con otra cuenta, el modal (y su
    // cronómetro) seguía montado bajo el usuario nuevo: Planes mostraba un
    // plan y el panel de abajo el entrenamiento del otro.
    await startWorkout();
    await screen.findByRole('dialog');

    await act(async () => { authState.listener('SIGNED_OUT', null); });
    expect(await screen.findByText('FitnessAI Connect')).toBeInTheDocument();

    const otraCuenta = { user: { id: 'user-2', email: 'lucia@example.com', user_metadata: { full_name: 'Lucía Fernández' } } };
    await act(async () => { authState.listener('SIGNED_IN', otraCuenta); });

    await screen.findByRole('navigation');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /volver al entrenamiento/i })).not.toBeInTheDocument();
    // La tarjeta de Inicio ofrece iniciar, no continuar.
    expect(await screen.findByRole('button', { name: /iniciar entrenamiento/i })).toBeInTheDocument();
  });

  it('un refresco de token del mismo usuario no toca el entrenamiento', async () => {
    await startWorkout();
    await screen.findByRole('dialog');

    await act(async () => { authState.listener('TOKEN_REFRESHED', { ...SESSION }); });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
