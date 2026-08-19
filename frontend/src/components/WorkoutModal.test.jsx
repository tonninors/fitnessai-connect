import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
vi.mock('../api/client.js', () => ({ api, supabase: {} }));

const { default: WorkoutModal } = await import('./WorkoutModal.jsx');
const { makeSession, makeExercise } = await import('../tests/factories.js');

beforeEach(() => {
  api.post.mockResolvedValue({ insight: 'Mantén el tempo controlado.' });
  api.patch.mockResolvedValue({});
});

function renderModal(over = {}, props = {}) {
  const session = makeSession(over);
  const handlers = {
    onClose: vi.fn(),
    onMinimize: vi.fn(),
    onExerciseDone: vi.fn(),
    onActiveExChange: vi.fn(),
    ...props,
  };
  render(<WorkoutModal session={session} visible {...handlers} />);
  return { session, ...handlers };
}

describe('WorkoutModal — estructura', () => {
  it('se anuncia como diálogo modal', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('empieza en el bloque de calentamiento', () => {
    renderModal();
    expect(screen.getByText('Calentamiento')).toBeInTheDocument();
    expect(screen.getByText('Movilidad de hombro')).toBeInTheDocument();
    // Los ejercicios de fuerza aún no se muestran: son del bloque siguiente.
    expect(screen.queryByText('Press Banca con Barra')).not.toBeInTheDocument();
  });

  it('muestra los ejercicios sin exercise_type en el bloque de fuerza', async () => {
    // Regresión: el filtro estricto `e.exercise_type === type` los descartaba
    // de todos los bloques, así que la sesión no se podía completar nunca.
    renderModal({
      session_exercises: [
        makeExercise({ id: 'legacy', exercise_name: 'Remo con Barra', exercise_type: null }),
      ],
    });

    expect(screen.getByText('Entrenamiento')).toBeInTheDocument();
    expect(screen.getByText('Remo con Barra')).toBeInTheDocument();
  });

  it('avisa cuando la sesión no tiene ejercicios', () => {
    renderModal({ session_exercises: [] });
    expect(screen.getByText(/no tiene ejercicios cargados/i)).toBeInTheDocument();
  });

  it('muestra la pista inicial hasta que se toca un ejercicio', async () => {
    renderModal();
    expect(screen.getByText('Toca un ejercicio para comenzar')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /movilidad de hombro/i }));
    expect(screen.queryByText('Toca un ejercicio para comenzar')).not.toBeInTheDocument();
  });
});

describe('WorkoutModal — flujo de ejercicio', () => {
  it('arranca el cronómetro y marca la sesión como iniciada en el backend', async () => {
    const { session } = renderModal();
    await userEvent.click(screen.getByRole('button', { name: /movilidad de hombro/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(`/workouts/sessions/${session.id}/start`, {}),
    );
  });

  it('un ejercicio por tiempo se completa de un solo toque', async () => {
    const { session, onExerciseDone } = renderModal();
    const warmupId = session.session_exercises[0].id;

    await userEvent.click(screen.getByRole('button', { name: /movilidad de hombro/i }));
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));

    expect(onExerciseDone).toHaveBeenCalledWith(warmupId);
    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith(
        `/workouts/sessions/${session.id}/exercises/${warmupId}/toggle`,
        { completed: true },
      ),
    );
  });

  it('un ejercicio de fuerza avanza serie a serie', async () => {
    const strength = makeExercise({ id: 'st', exercise_name: 'Sentadilla con Barra', sets: 3, reps: 8, rest_seconds: 0 });
    const { onActiveExChange, onExerciseDone } = renderModal({ session_exercises: [strength] });

    await userEvent.click(screen.getByRole('button', { name: /sentadilla con barra/i }));
    expect(screen.getByText('Serie 1 de 3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /serie 1 lista/i }));
    expect(screen.getByText('Serie 2 de 3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /serie 2 lista/i }));
    expect(screen.getByText('Serie 3 de 3')).toBeInTheDocument();

    // La última serie cierra el ejercicio.
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));
    expect(onExerciseDone).toHaveBeenCalledWith('st');
    expect(onActiveExChange).toHaveBeenLastCalledWith(null);
  });

  it('muestra el descanso entre series y permite saltarlo', async () => {
    const strength = makeExercise({ id: 'st', exercise_name: 'Peso Muerto Rumano', sets: 3, rest_seconds: 90 });
    renderModal({ session_exercises: [strength] });

    await userEvent.click(screen.getByRole('button', { name: /peso muerto rumano/i }));
    await userEvent.click(screen.getByRole('button', { name: /serie 1 lista/i }));

    expect(screen.getByText('Tiempo de descanso')).toBeInTheDocument();
    expect(screen.getByText('01:30')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /saltar descanso/i }));
    await waitFor(() => expect(screen.queryByText('Tiempo de descanso')).not.toBeInTheDocument());
  });

  it('no abre descanso si el ejercicio no tiene rest_seconds', async () => {
    const strength = makeExercise({ id: 'st', exercise_name: 'Curl de Bíceps', sets: 2, rest_seconds: null });
    renderModal({ session_exercises: [strength] });

    await userEvent.click(screen.getByRole('button', { name: /curl de bíceps/i }));
    await userEvent.click(screen.getByRole('button', { name: /serie 1 lista/i }));

    expect(screen.queryByText('Tiempo de descanso')).not.toBeInTheDocument();
  });

  it('no permite reabrir un ejercicio ya completado', async () => {
    const done = makeExercise({ id: 'done', exercise_name: 'Plancha', duration_seconds: 60, completed: true });
    renderModal({ session_exercises: [done] });

    expect(screen.getByRole('button', { name: /plancha \(completado\)/i })).toBeDisabled();
  });
});

describe('WorkoutModal — bloques y finalización', () => {
  it('ofrece avanzar de fase al terminar el bloque actual', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: /movilidad de hombro/i }));
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));

    const nextPhase = await screen.findByRole('button', { name: /siguiente fase: entrenamiento/i });
    await userEvent.click(nextPhase);

    expect(await screen.findByText('Press Banca con Barra')).toBeInTheDocument();
  });

  it('finaliza la sesión enviando duración y calorías', async () => {
    const only = makeExercise({ id: 'one', exercise_name: 'Plancha', exercise_type: 'warmup', duration_seconds: 60 });
    const { session, onClose } = renderModal({ session_exercises: [only] });

    await userEvent.click(screen.getByRole('button', { name: /plancha/i }));
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));
    await userEvent.click(await screen.findByRole('button', { name: /finalizar sesión/i }));

    await waitFor(() => {
      const call = api.patch.mock.calls.find(([url]) => url.endsWith(`/sessions/${session.id}/complete`));
      expect(call).toBeDefined();
      expect(call[1]).toHaveProperty('actual_duration');
      expect(call[1]).toHaveProperty('actual_calories');
    });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('refleja el progreso en la barra', async () => {
    renderModal();
    const bar = screen.getByRole('progressbar', { name: /progreso del entrenamiento/i });
    expect(bar).toHaveAttribute('aria-valuenow', '0');

    await userEvent.click(screen.getByRole('button', { name: /movilidad de hombro/i }));
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));

    await waitFor(() => expect(bar).toHaveAttribute('aria-valuenow', '25'));
  });
});

describe('WorkoutModal — cronómetro y calorías', () => {
  it('cuenta con reloj de pared y estima calorías realistas', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const now = Date.parse('2026-08-18T10:00:00Z');
    vi.setSystemTime(now);

    render(
      <WorkoutModal
        session={makeSession({ rpe_target: 7 })}
        visible
        onClose={vi.fn()}
        onMinimize={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /movilidad de hombro/i }));

    await act(async () => { vi.setSystemTime(now + 65_000); vi.advanceTimersByTime(1000); });

    expect(screen.getByText('01:05')).toBeInTheDocument();
    // Regresión: la fórmula anterior daba ~0,2 kcal al minuto de sesión.
    expect(screen.getByText('10 kcal')).toBeInTheDocument();
  });

  it('guarda el inicio en localStorage para sobrevivir a un minimizado', async () => {
    const { session } = renderModal();
    await userEvent.click(screen.getByRole('button', { name: /movilidad de hombro/i }));
    expect(localStorage.getItem(`workout_start_${session.id}`)).toBeTruthy();
  });
});

describe('WorkoutModal — controles', () => {
  it('minimiza con el botón y con Escape', async () => {
    const { onMinimize } = renderModal();

    await userEvent.click(screen.getByRole('button', { name: /minimizar entrenamiento/i }));
    expect(onMinimize).toHaveBeenCalledTimes(1);

    await userEvent.keyboard('{Escape}');
    expect(onMinimize).toHaveBeenCalledTimes(2);
  });

  it('cerrar limpia el cronómetro guardado', async () => {
    const { session, onClose } = renderModal();
    await userEvent.click(screen.getByRole('button', { name: /movilidad de hombro/i }));
    await userEvent.click(screen.getByRole('button', { name: /cerrar entrenamiento/i }));

    expect(onClose).toHaveBeenCalled();
    expect(localStorage.getItem(`workout_start_${session.id}`)).toBeNull();
  });

  it('no renderiza nada cuando está minimizado', () => {
    render(
      <WorkoutModal session={makeSession()} visible={false} onClose={vi.fn()} onMinimize={vi.fn()} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('muestra el insight de IA cuando llega', async () => {
    api.post.mockResolvedValue({ insight: 'Sube 2,5 kg respecto a la última sesión.' });
    renderModal();
    expect(await screen.findByText('Sube 2,5 kg respecto a la última sesión.')).toBeInTheDocument();
  });

  it('mantiene el texto por defecto si el insight falla', async () => {
    api.post.mockRejectedValue(new Error('502'));
    renderModal();
    expect(await screen.findByText(/zona óptima/i)).toBeInTheDocument();
  });

  it('sin wearable no inventa frecuencia cardiaca', () => {
    render(<WorkoutModal session={makeSession()} visible hasWearable={false} onClose={vi.fn()} onMinimize={vi.fn()} />);
    expect(screen.getByText('FC bpm')).toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
