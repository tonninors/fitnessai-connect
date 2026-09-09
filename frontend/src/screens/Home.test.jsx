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
  it('titula la sesión con la zona del cuerpo en español, no con el nombre de la IA', async () => {
    const session = makeSession({ name: 'Lower A — Enfoque en Sentadilla', focus_areas: ['cuádriceps', 'glúteos'] });
    api.get.mockResolvedValue(makeHomeData({ today_session: session }));
    renderHome();

    expect(await screen.findByRole('heading', { name: 'Piernas' })).toBeInTheDocument();
    expect(screen.queryByText('Lower A — Enfoque en Sentadilla')).not.toBeInTheDocument();
  });

  it('resume el entrenamiento en una línea y lo inicia', async () => {
    const session = makeSession();
    api.get.mockResolvedValue(makeHomeData({ today_session: session }));
    const onStartWorkout = vi.fn();
    renderHome({ onStartWorkout });

    expect(await screen.findByText('60 min · 4 ejercicios')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /iniciar entrenamiento/i }));
    expect(onStartWorkout).toHaveBeenCalledWith(session);
  });

  it('parte la barra de progreso en los bloques que toca ese día', async () => {
    // La sesión de la fábrica trae calentamiento, fuerza y estiramiento; sin
    // cardio no debe dibujarse una cuarta parte vacía.
    api.get.mockResolvedValue(makeHomeData({ today_session: makeSession() }));
    renderHome();

    expect(await screen.findByTestId('block-bar-warmup')).toBeInTheDocument();
    expect(screen.getByTestId('block-bar-strength')).toBeInTheDocument();
    expect(screen.getByTestId('block-bar-cooldown')).toBeInTheDocument();
    expect(screen.queryByTestId('block-bar-cardio')).not.toBeInTheDocument();
  });

  it('ya no muestra el texto de relleno de la IA', async () => {
    api.get.mockResolvedValue(makeHomeData({
      ai_insight: '¡Hoy en Upper A — Press Horizontal apunta a subir la carga!',
      hrv: 62,
    }));
    renderHome();

    await screen.findByRole('heading', { name: 'Pecho' });
    expect(screen.queryByText(/press horizontal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hrv/i)).not.toBeInTheDocument();
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
  function sesionEnCurso() {
    const warmup = makeExercise({ id: 'w', exercise_name: 'Movilidad de cadera', exercise_type: 'warmup', duration_seconds: 45, order_num: 1 });
    const strength = makeExercise({ id: 's', exercise_name: 'Sentadilla con Barra', exercise_type: 'strength', order_num: 2 });
    return makeSession({ session_exercises: [warmup, strength] });
  }

  it('deja un único botón en Inicio, que continúa el entrenamiento', async () => {
    // Antes convivían la tarjeta "en vivo" y la de hoy, cada una con su
    // botón: dos caminos al mismo entrenamiento.
    const session = sesionEnCurso();
    const onResumeWorkout = vi.fn();
    const onStartWorkout = vi.fn();
    api.get.mockResolvedValue(makeHomeData({ today_session: session }));
    renderHome({ runningSession: session, liveCompleted: new Set(['w']), onResumeWorkout, onStartWorkout });

    const boton = await screen.findByRole('button', { name: /continuar entrenamiento/i });
    expect(screen.queryByRole('button', { name: /iniciar entrenamiento/i })).not.toBeInTheDocument();

    await userEvent.click(boton);
    expect(onResumeWorkout).toHaveBeenCalled();
    expect(onStartWorkout).not.toHaveBeenCalled();
  });

  it('refleja en la barra lo que se va marcando en el modal', async () => {
    const session = sesionEnCurso();
    api.get.mockResolvedValue(makeHomeData({ today_session: session }));
    renderHome({ runningSession: session, liveCompleted: new Set(['w']) });

    expect(await screen.findByRole('img', { name: /1 de 2 ejercicios/i })).toBeInTheDocument();
  });

  it('no cuenta el progreso si lo que corre es otra sesión', async () => {
    // `liveCompleted` pertenece a la sesión en curso: aplicarlo a la de hoy
    // marcaría ejercicios que nadie hizo.
    const otra = makeSession({ id: 'otra-sesion' });
    api.get.mockResolvedValue(makeHomeData({ today_session: sesionEnCurso() }));
    renderHome({ runningSession: otra, liveCompleted: new Set(['w']) });

    expect(await screen.findByRole('img', { name: /0 de 2 ejercicios/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar entrenamiento/i })).toBeInTheDocument();
  });
});
