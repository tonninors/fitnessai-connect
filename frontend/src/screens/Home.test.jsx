import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
vi.mock('../api/client.js', () => ({ api, supabase: {} }));

const { default: Home } = await import('./Home.jsx');
const { makeHomeData, makeSession, makeExercise } = await import('../tests/factories.js');
const { todayISO, addDays } = await import('../lib/dates.js');

beforeEach(() => {
  api.get.mockReset();
});

function renderHome(props = {}) {
  return render(
    <Home
      onStartWorkout={vi.fn()}
      onNavigate={vi.fn()}
      runningSession={null}
      onResumeWorkout={vi.fn()}
      liveCompleted={new Set()}
      liveActiveEx={null}
      {...props}
    />,
  );
}

describe('Home — carga y errores', () => {
  it('muestra el esqueleto mientras carga', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderHome();
    expect(screen.getByLabelText('Cargando inicio')).toBeInTheDocument();
  });

  it('muestra el saludo y el nombre del usuario', async () => {
    api.get.mockResolvedValue(makeHomeData());
    renderHome();
    expect(await screen.findByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Buenos días')).toBeInTheDocument();
  });

  it('muestra un estado de error con reintento cuando falla la API', async () => {
    // Regresión: antes se hacía `catch(console.error)` y la pantalla quedaba
    // en blanco, sin mensaje ni forma de recuperarse.
    api.get.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderHome();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();

    api.get.mockResolvedValueOnce(makeHomeData());
    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await screen.findByText('Carlos')).toBeInTheDocument();
  });
});

describe('Home — entrenamiento del día', () => {
  it('muestra la sesión de hoy con sus métricas y permite iniciarla', async () => {
    const session = makeSession({ name: 'Push A — Pecho y Hombros' });
    api.get.mockResolvedValue(makeHomeData({ today_session: session }));
    const onStartWorkout = vi.fn();
    renderHome({ onStartWorkout });

    expect(await screen.findByText('Push A — Pecho y Hombros')).toBeInTheDocument();
    expect(screen.getByText('Ejercicios')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /iniciar entrenamiento/i }));
    expect(onStartWorkout).toHaveBeenCalledWith(session);
  });

  it('deshabilita el botón si la sesión ya está completada', async () => {
    api.get.mockResolvedValue(makeHomeData({ today_session: makeSession({ status: 'completed' }) }));
    renderHome();
    expect(await screen.findByRole('button', { name: /completado/i })).toBeDisabled();
  });

  it('muestra la próxima sesión cuando no hay entrenamiento hoy', async () => {
    api.get.mockResolvedValue(makeHomeData({
      today_session: null,
      next_session: { id: 'n1', name: 'Pull A', scheduled_date: '2026-08-20', estimated_duration: 55, day_order: 2 },
    }));
    renderHome();
    expect(await screen.findByText('Día 2')).toBeInTheDocument();
    expect(screen.getByText(/Próximo entrenamiento/i)).toBeInTheDocument();
  });

  it('ofrece generar plan cuando no hay ninguna sesión', async () => {
    api.get.mockResolvedValue(makeHomeData({ today_session: null, next_session: null }));
    const onNavigate = vi.fn();
    renderHome({ onNavigate });

    expect(await screen.findByText('Sin plan activo')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /generar plan/i }));
    expect(onNavigate).toHaveBeenCalledWith('plans');
  });
});

describe('Home — tira semanal', () => {
  it('marca hoy en la posición correcta de la semana', async () => {
    // Regresión de zona horaria: con `new Date('YYYY-MM-DD')` el resaltado de
    // "hoy" se desplazaba un día en husos negativos (América).
    const today = todayISO();
    api.get.mockResolvedValue(makeHomeData({
      week_sessions: [{ id: 'w1', scheduled_date: today, status: 'scheduled' }],
    }));
    renderHome();

    const cell = await screen.findByTestId(`week-day-${today}`);
    expect(cell).toHaveAttribute('data-today', 'true');
    expect(cell).toHaveAttribute('data-status', 'pending');
  });

  it('marca como completados los días con sesión terminada', async () => {
    const yesterday = addDays(todayISO(), -1);
    api.get.mockResolvedValue(makeHomeData({
      week_sessions: [{ id: 'w1', scheduled_date: yesterday, status: 'completed' }],
    }));
    renderHome();

    await waitFor(() => expect(screen.getByTestId(`week-day-${yesterday}`)).toHaveAttribute('data-status', 'completed'));
  });
});

describe('Home — entrenamiento en curso', () => {
  it('muestra el progreso y el siguiente ejercicio pendiente', async () => {
    const warmup = makeExercise({ id: 'w', exercise_name: 'Movilidad de cadera', exercise_type: 'warmup', duration_seconds: 45, order_num: 1 });
    const strength = makeExercise({ id: 's', exercise_name: 'Sentadilla con Barra', exercise_type: 'strength', order_num: 2 });
    const running = makeSession({ session_exercises: [warmup, strength] });

    api.get.mockResolvedValue(makeHomeData());
    renderHome({ runningSession: running, liveCompleted: new Set(['w']) });

    expect(await screen.findByText('Sentadilla con Barra')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('vuelve al modal al pulsar la tarjeta en vivo', async () => {
    const onResumeWorkout = vi.fn();
    api.get.mockResolvedValue(makeHomeData());
    renderHome({ runningSession: makeSession(), onResumeWorkout });

    await userEvent.click(await screen.findByRole('button', { name: /volver al entrenamiento en curso/i }));
    expect(onResumeWorkout).toHaveBeenCalled();
  });

  it('avisa cuando ya se completaron todos los ejercicios', async () => {
    const running = makeSession({ session_exercises: [makeExercise({ id: 'a' })] });
    api.get.mockResolvedValue(makeHomeData());
    renderHome({ runningSession: running, liveCompleted: new Set(['a']) });

    expect(await screen.findByText('Todos los ejercicios completados')).toBeInTheDocument();
  });
});
