import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
vi.mock('../api/client.js', () => ({ api, supabase: {} }));

const { default: Plans, planRequestFromProfile, completedBySession } = await import('./Plans.jsx');
const { makePlan, makeSession, makeExercise, makeProfile } = await import('../tests/factories.js');
const { todayISO } = await import('../lib/dates.js');

beforeEach(() => {
  api.get.mockReset();
  api.post.mockReset();
  api.patch.mockReset();
});

/** Enruta las respuestas por endpoint. */
function mockApi({ plan = null, upcoming = [], profile = makeProfile() } = {}) {
  api.get.mockImplementation((path) => {
    if (path === '/workouts/plan') return Promise.resolve(plan);
    if (path === '/workouts/upcoming') return Promise.resolve(upcoming);
    if (path === '/profile') return Promise.resolve(profile);
    return Promise.resolve(null);
  });
}

function renderPlans(props = {}) {
  return render(
    <Plans
      onStartWorkout={vi.fn()}
      runningSession={null}
      onResumeWorkout={vi.fn()}
      liveCompleted={null}
      {...props}
    />,
  );
}

describe('planRequestFromProfile', () => {
  it('usa las preferencias guardadas en el onboarding', () => {
    // Regresión: se enviaban valores fijos (3 días, fitness general), así que
    // regenerar el plan descartaba lo que el usuario había configurado.
    const request = planRequestFromProfile(makeProfile());
    expect(request.days_per_week).toBe(4);
    expect(request.cardio_minutes).toBe(15);
    expect(request.goals).toContain('ganar_musculo');
  });

  it('cae a valores por defecto sin perfil', () => {
    expect(planRequestFromProfile(null)).toMatchObject({
      goals: 'fitness general',
      days_per_week: 3,
      cardio_minutes: 15,
    });
  });

  it('usa el objetivo principal si no hay lista', () => {
    const request = planRequestFromProfile({ goals: { primary: 'perder_grasa' } });
    expect(request.goals).toBe('perder_grasa');
  });

  it('respeta "sin cardio" (0 minutos)', () => {
    const request = planRequestFromProfile({ availability: { cardio_minutes: 0 } });
    expect(request.cardio_minutes).toBe(0);
  });
});

describe('completedBySession', () => {
  it('agrupa los ejercicios completados por sesión', () => {
    const plan = makePlan({
      workout_sessions: [
        makeSession({ id: 's1', session_exercises: [makeExercise({ id: 'a', completed: true }), makeExercise({ id: 'b' })] }),
        makeSession({ id: 's2', session_exercises: [makeExercise({ id: 'c' })] }),
      ],
    });
    const result = completedBySession(plan);
    expect([...result.s1]).toEqual(['a']);
    expect(result.s2).toBeUndefined();
  });

  it('devuelve {} sin plan', () => {
    expect(completedBySession(null)).toEqual({});
  });
});

describe('Plans — estados', () => {
  it('muestra el esqueleto mientras carga', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderPlans();
    expect(screen.getByLabelText('Cargando planes')).toBeInTheDocument();
  });

  it('muestra error con reintento si falla la carga', async () => {
    api.get.mockRejectedValue(new Error('500'));
    renderPlans();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('ofrece generar plan cuando no hay ninguno activo', async () => {
    mockApi({ plan: null });
    renderPlans();
    expect(await screen.findByText('No tienes un plan activo')).toBeInTheDocument();
  });

  it('celebra el plan terminado cuando no quedan sesiones pendientes', async () => {
    mockApi({ plan: makePlan({ workout_sessions: [makeSession({ status: 'completed' })] }) });
    renderPlans();
    expect(await screen.findByText('¡Plan completado!')).toBeInTheDocument();
  });
});

describe('Plans — sesión activa', () => {
  it('muestra la sesión de hoy con sus bloques ordenados', async () => {
    const session = makeSession({ scheduled_date: todayISO() });
    mockApi({ plan: makePlan({ workout_sessions: [session] }) });
    renderPlans();

    expect(await screen.findByText('Calentamiento')).toBeInTheDocument();
    expect(screen.getByText('Entrenamiento')).toBeInTheDocument();
    expect(screen.getByText('Estiramiento')).toBeInTheDocument();
    expect(screen.getByText('Press Banca con Barra')).toBeInTheDocument();
  });

  it('marca como "Siguiente" el primer ejercicio pendiente por orden de bloque', async () => {
    // Regresión: la marca se calculaba con `[...done].length === globalIdx`,
    // lo que la colocaba en un ejercicio arbitrario al completar fuera de orden.
    const warm = makeExercise({ id: 'w', exercise_type: 'warmup', duration_seconds: 45, order_num: 1 });
    const st = makeExercise({ id: 's', exercise_type: 'strength', order_num: 2 });
    const session = makeSession({ scheduled_date: todayISO(), session_exercises: [st, warm] });
    mockApi({ plan: makePlan({ workout_sessions: [session] }) });
    renderPlans();

    await waitFor(() => expect(screen.getByTestId('exercise-w')).toHaveAttribute('data-next', 'true'));
    expect(screen.getByTestId('exercise-s')).toHaveAttribute('data-next', 'false');
  });

  it('inicia el entrenamiento de la sesión activa', async () => {
    const session = makeSession({ scheduled_date: todayISO() });
    mockApi({ plan: makePlan({ workout_sessions: [session] }) });
    const onStartWorkout = vi.fn();
    renderPlans({ onStartWorkout });

    await userEvent.click(await screen.findByRole('button', { name: /iniciar ahora/i }));
    expect(onStartWorkout).toHaveBeenCalledWith(expect.objectContaining({ id: session.id }));
  });

  it('ofrece volver al entrenamiento si ya está en curso', async () => {
    const session = makeSession({ scheduled_date: todayISO() });
    mockApi({ plan: makePlan({ workout_sessions: [session] }) });
    const onResumeWorkout = vi.fn();
    renderPlans({ runningSession: session, liveCompleted: new Set(), onResumeWorkout });

    await userEvent.click(await screen.findByRole('button', { name: /ver entrenamiento en curso/i }));
    expect(onResumeWorkout).toHaveBeenCalled();
  });

  it('permite finalizar la sesión cuando todos los ejercicios están hechos', async () => {
    const exercises = [makeExercise({ id: 'a', completed: true }), makeExercise({ id: 'b', completed: true })];
    const session = makeSession({ id: 'sess-fin', scheduled_date: todayISO(), session_exercises: exercises });
    mockApi({ plan: makePlan({ workout_sessions: [session] }) });
    api.patch.mockResolvedValue({});
    renderPlans();

    await userEvent.click(await screen.findByRole('button', { name: /finalizar sesión/i }));
    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith('/workouts/sessions/sess-fin/complete', {}),
    );
  });
});

describe('Plans — generación con IA', () => {
  it('envía las preferencias reales del perfil al regenerar', async () => {
    mockApi({ plan: makePlan(), profile: makeProfile() });
    api.post.mockResolvedValue({ plan_id: 'p2' });
    renderPlans();

    await userEvent.click(await screen.findByRole('button', { name: /regenerar plan con ia/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith(
      '/ai/generate-plan',
      expect.objectContaining({ days_per_week: 4, cardio_minutes: 15 }),
    ));
  });

  it('muestra el error del backend si la IA falla', async () => {
    mockApi({ plan: null });
    api.post.mockRejectedValue(new Error('El servicio de IA está muy ocupado.'));
    renderPlans();

    await userEvent.click(await screen.findByRole('button', { name: /generar plan con ia/i }));
    expect(await screen.findByText('El servicio de IA está muy ocupado.')).toBeInTheDocument();
  });
});

describe('Plans — próximas sesiones', () => {
  it('abre el detalle de una próxima sesión y permite iniciarla', async () => {
    const active = makeSession({ id: 'hoy', scheduled_date: todayISO() });
    const future = makeSession({ id: 'manana', name: 'Pull A — Espalda', scheduled_date: '2026-08-20', day_order: 2 });
    mockApi({
      plan: makePlan({ workout_sessions: [active, future] }),
      upcoming: [{ id: 'manana', name: 'Pull A — Espalda', scheduled_date: '2026-08-20', estimated_duration: 55, rpe_target: 7, day_order: 2 }],
    });
    const onStartWorkout = vi.fn();
    renderPlans({ onStartWorkout });

    await userEvent.click(await screen.findByRole('button', { name: /Día 2/ }));

    const sheet = await screen.findByRole('dialog');
    expect(within(sheet).getByText('Pull A — Espalda')).toBeInTheDocument();

    await userEvent.click(within(sheet).getByRole('button', { name: /iniciar sesión/i }));
    expect(onStartWorkout).toHaveBeenCalledWith(expect.objectContaining({ id: 'manana' }));
  });
});
