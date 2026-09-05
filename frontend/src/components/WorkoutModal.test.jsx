import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
vi.mock('../api/client.js', () => ({ api, supabase: {} }));

const { default: WorkoutModal } = await import('./WorkoutModal.jsx');
const { makeSession, makeExercise, makeAlternative } = await import('../tests/factories.js');

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  api.post.mockResolvedValue({});
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

/** Pulsa "Comenzar entrenamiento" y deja el primer ejercicio en vista previa. */
async function verVistaPrevia() {
  await userEvent.click(screen.getByRole('button', { name: /comenzar entrenamiento/i }));
  return screen.findByRole('button', { name: /empezar ejercicio/i });
}

/**
 * Vista previa + "Empezar ejercicio": deja el primer ejercicio con las series
 * en curso, que es donde empiezan casi todos los casos.
 */
async function comenzar() {
  await userEvent.click(await verVistaPrevia());
  return screen.findByRole('button', { name: /(terminar ejercicio|serie 1 lista)/i });
}

/**
 * Despliega una alternativa y la aplica. La fila solo abre el desglose: la
 * sustitución exige el botón de dentro, para no cambiar de ejercicio por mirar.
 */
async function elegirAlternativa(nombre) {
  await userEvent.click(await screen.findByRole('button', { name: new RegExp(nombre, 'i') }));
  await userEvent.click(await screen.findByRole('button', { name: /cambiar a este ejercicio/i }));
}

/** Dos ejercicios del mismo bloque, para comprobar el avance automático. */
function bloqueDeFuerza() {
  return [
    makeExercise({ id: 'f1', exercise_name: 'Sentadilla con Barra', exercise_type: 'strength', sets: 1, reps: 5, weight_kg: 80, rest_seconds: 0, order_num: 1 }),
    makeExercise({ id: 'f2', exercise_name: 'Remo con Barra', exercise_type: 'strength', sets: 1, reps: 8, weight_kg: 50, rest_seconds: 0, order_num: 2 }),
  ];
}

describe('WorkoutModal — estructura', () => {
  it('se anuncia como diálogo modal', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('antes de empezar solo ofrece "Comenzar entrenamiento"', () => {
    renderModal();

    expect(screen.getByRole('button', { name: /comenzar entrenamiento/i })).toBeInTheDocument();
    // Ningún ejercicio es seleccionable ni visible todavía.
    expect(screen.queryByText('Movilidad de hombro')).not.toBeInTheDocument();
    expect(screen.queryByText('Press Banca con Barra')).not.toBeInTheDocument();
    expect(screen.queryByText(/toca un ejercicio/i)).not.toBeInTheDocument();
  });

  it('al comenzar activa el primer ejercicio del primer bloque', async () => {
    renderModal();
    await comenzar();

    expect(screen.getByText('Calentamiento')).toBeInTheDocument();
    expect(await screen.findByText('Movilidad de hombro')).toBeInTheDocument();
  });

  it('salta los ejercicios ya completados al comenzar', async () => {
    renderModal({
      session_exercises: [
        makeExercise({ id: 'w1', exercise_name: 'Movilidad de cadera', exercise_type: 'warmup', duration_seconds: 45, completed: true, order_num: 1 }),
        makeExercise({ id: 's1', exercise_name: 'Peso Muerto Rumano', exercise_type: 'strength', sets: 1, reps: 8, rest_seconds: 0, order_num: 2 }),
      ],
    });
    await comenzar();

    expect(await screen.findByText('Peso Muerto Rumano')).toBeInTheDocument();
    expect(screen.queryByText('Movilidad de cadera')).not.toBeInTheDocument();
  });

  it('muestra los ejercicios sin exercise_type en el bloque de fuerza', async () => {
    // Regresión: el filtro estricto `e.exercise_type === type` los descartaba
    // de todos los bloques, así que la sesión no se podía completar nunca.
    renderModal({
      session_exercises: [
        makeExercise({ id: 'legacy', exercise_name: 'Jalón al Pecho', exercise_type: null, sets: 1, rest_seconds: 0 }),
      ],
    });
    await comenzar();

    expect(screen.getByText('Entrenamiento')).toBeInTheDocument();
    expect(await screen.findByText('Jalón al Pecho')).toBeInTheDocument();
  });

  it('avisa cuando la sesión no tiene ejercicios', () => {
    renderModal({ session_exercises: [] });
    expect(screen.getByText(/no tiene ejercicios cargados/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /comenzar entrenamiento/i })).not.toBeInTheDocument();
  });

  it('ya no renderiza el bloque de IA en tiempo real', async () => {
    renderModal();
    await comenzar();

    expect(screen.queryByText(/ia en tiempo real/i)).not.toBeInTheDocument();
    expect(api.post.mock.calls.some(([url]) => String(url).includes('/ai/'))).toBe(false);
  });
});

describe('WorkoutModal — un ejercicio a la vez', () => {
  it('no deja elegir un ejercicio arbitrario ni adelanta el resto de la sesión', async () => {
    renderModal({ session_exercises: bloqueDeFuerza() });
    await comenzar();

    expect(await screen.findByText('5 reps')).toBeInTheDocument();
    // Solo se ve el ejercicio en curso: ni lista, ni el siguiente, ni botones
    // para saltar a otro.
    expect(screen.queryByText('Remo con Barra')).not.toBeInTheDocument();
    expect(screen.queryByText(/^Siguiente:/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /remo con barra/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sentadilla con barra/i })).not.toBeInTheDocument();
  });

  it('no muestra la barra de progreso global', () => {
    renderModal();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText('Progreso')).not.toBeInTheDocument();
  });

  it('al terminar un ejercicio propone el siguiente en vista previa', async () => {
    const { onActiveExChange } = renderModal({ session_exercises: bloqueDeFuerza() });
    await comenzar();

    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));

    // Sin ningún click de selección la tarjeta pasa al segundo ejercicio, pero
    // en vista previa: hay que aceptarlo antes de que corran las series.
    expect(await screen.findByText('Remo con Barra')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /empezar ejercicio/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /serie 1 lista|terminar ejercicio/i })).not.toBeInTheDocument();
    expect(onActiveExChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'f2', name: 'Remo con Barra', setNum: 1 }),
    );
  });

  it('arranca el cronómetro y marca la sesión como iniciada en el backend', async () => {
    const { session } = renderModal();
    await comenzar();

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(`/workouts/sessions/${session.id}/start`, {}),
    );
  });

  it('un ejercicio por tiempo se completa de un solo toque', async () => {
    const { session, onExerciseDone } = renderModal();
    const warmupId = session.session_exercises[0].id;

    await comenzar();
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

    await comenzar();
    expect(await screen.findByText('Serie 1 de 3')).toBeInTheDocument();

    // Cada serie se abre a mano: al cerrar la anterior el cronómetro se para.
    await userEvent.click(screen.getByRole('button', { name: /serie 1 lista/i }));
    expect(screen.getByText('Serie 2 de 3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /empezar serie 2/i }));
    await userEvent.click(screen.getByRole('button', { name: /serie 2 lista/i }));
    expect(screen.getByText('Serie 3 de 3')).toBeInTheDocument();

    // La última serie cierra el ejercicio.
    await userEvent.click(screen.getByRole('button', { name: /empezar serie 3/i }));
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));
    expect(onExerciseDone).toHaveBeenCalledWith('st');
    expect(onActiveExChange).toHaveBeenLastCalledWith(null);
  });

  it('muestra el descanso entre series y permite saltarlo', async () => {
    const strength = makeExercise({ id: 'st', exercise_name: 'Peso Muerto Rumano', sets: 3, rest_seconds: 90 });
    renderModal({ session_exercises: [strength] });

    await comenzar();
    await userEvent.click(screen.getByRole('button', { name: /serie 1 lista/i }));

    expect(screen.getByText('Tiempo de descanso')).toBeInTheDocument();
    expect(screen.getByText('01:30')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /saltar descanso/i }));
    await waitFor(() => expect(screen.queryByText('Tiempo de descanso')).not.toBeInTheDocument());
  });

  it('no abre descanso si el ejercicio no tiene rest_seconds', async () => {
    const strength = makeExercise({ id: 'st', exercise_name: 'Curl de Bíceps', sets: 2, rest_seconds: null });
    renderModal({ session_exercises: [strength] });

    await comenzar();
    await userEvent.click(screen.getByRole('button', { name: /serie 1 lista/i }));

    expect(screen.queryByText('Tiempo de descanso')).not.toBeInTheDocument();
  });
});

describe('WorkoutModal — media de referencia', () => {
  it('sin URLs cae al placeholder del bloque', async () => {
    renderModal();
    await comenzar();

    expect(await screen.findByText('sin imagen')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('muestra la imagen del ejercicio y su indicación de ejecución', async () => {
    renderModal({
      session_exercises: [
        makeExercise({
          id: 'img', exercise_name: 'Remo con Barra', sets: 1, rest_seconds: 0,
          exercises: {
            image_url: 'https://cdn.dorcher.app/remo-con-barra.jpg',
            video_url: null,
            description: 'Espalda neutra, lleva la barra al ombligo.',
          },
        }),
      ],
    });
    await comenzar();

    const img = await screen.findByRole('img', { name: /demostración de remo con barra/i });
    expect(img).toHaveAttribute('src', 'https://cdn.dorcher.app/remo-con-barra.jpg');
    expect(screen.getByText('Espalda neutra, lleva la barra al ombligo.')).toBeInTheDocument();
    expect(screen.queryByText('sin imagen')).not.toBeInTheDocument();
  });

  it('prefiere el vídeo cuando existe', async () => {
    renderModal({
      session_exercises: [
        makeExercise({
          id: 'vid', exercise_name: 'Sentadilla Frontal', sets: 1, rest_seconds: 0,
          exercises: {
            image_url: 'https://cdn.dorcher.app/sentadilla.jpg',
            video_url: 'https://cdn.dorcher.app/sentadilla.mp4',
            description: null,
          },
        }),
      ],
    });
    await comenzar();

    const media = await screen.findByRole('img', { name: /demostración de sentadilla frontal/i });
    expect(media.tagName).toBe('VIDEO');
    expect(media).toHaveAttribute('src', 'https://cdn.dorcher.app/sentadilla.mp4');
  });
});

describe('WorkoutModal — ejercicio alternativo', () => {
  const alternativas = [
    makeAlternative({ id: 'alt-press', name: 'Press con Mancuernas', equipment: 'Mancuernas', reason: 'Menos estrés en el hombro.' }),
    makeAlternative({ id: 'alt-fondos', name: 'Fondos en Paralelas', equipment: 'Paralelas', reason: 'Mismo patrón de empuje sin barra.' }),
  ];

  function mockAlternativas(payload = { alternatives: alternativas }) {
    api.post.mockImplementation(url =>
      String(url).includes('/alternatives') ? Promise.resolve(payload) : Promise.resolve({}));
  }

  function sesionConPressBanca() {
    return {
      session_exercises: [
        makeExercise({ id: 'pb', exercise_name: 'Press Banca con Barra', exercise_type: 'strength', sets: 3, reps: 6, weight_kg: 60, rest_seconds: 0, order_num: 1 }),
      ],
    };
  }

  it('pide alternativas al backend y las muestra con razón y equipo', async () => {
    mockAlternativas();
    const { session } = renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith(
        `/workouts/sessions/${session.id}/exercises/pb/alternatives`, {},
      ),
    );
    expect(await screen.findByRole('button', { name: /press con mancuernas/i })).toBeInTheDocument();
    expect(screen.getByText('Menos estrés en el hombro.')).toBeInTheDocument();
    expect(screen.getByText('Mancuernas')).toBeInTheDocument();
  });

  it('muestra el porcentaje de sustitución y despliega el desglose al tocar', async () => {
    mockAlternativas({
      alternatives: [
        makeAlternative({ name: 'Press con Mancuernas', score: 86, breakdown: { muscular: 91, biomecanica: 76, fatiga: 48 } }),
        makeAlternative({ name: 'Fondos en Paralelas', score: 62, breakdown: { muscular: 70, biomecanica: 55, fatiga: 40 } }),
      ],
    });
    renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));

    const fila = await screen.findByRole('button', { name: /press con mancuernas/i });
    expect(fila).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('86%')).toBeInTheDocument();
    // El desglose está plegado: ni sus cifras ni el botón de cambiar son accesibles.
    expect(screen.queryByRole('button', { name: /cambiar a este ejercicio/i })).not.toBeInTheDocument();

    await userEvent.click(fila);

    expect(fila).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText('91%')).toBeInTheDocument();
    expect(screen.getByText('76%')).toBeInTheDocument();
    expect(screen.getByText('48%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cambiar a este ejercicio/i })).toBeInTheDocument();
  });

  it('sin desglose no inventa cifras', async () => {
    mockAlternativas({ alternatives: [makeAlternative({ name: 'Fondos', score: null, breakdown: null })] });
    renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));
    await userEvent.click(await screen.findByRole('button', { name: /fondos/i }));

    expect(screen.queryByText('0%')).not.toBeInTheDocument();
    // Se puede sustituir igualmente aunque el backend no mande métricas.
    expect(screen.getByRole('button', { name: /cambiar a este ejercicio/i })).toBeInTheDocument();
  });

  it('sustituye el ejercicio y lo deja listo para empezar', async () => {
    mockAlternativas();
    api.patch.mockImplementation((url, body) => {
      if (String(url).includes('/substitute')) {
        expect(body).toEqual({ exercise_id: 'alt-press' });
        return Promise.resolve({
          exercise: {
            id: 'pb', exercise_name: 'Press con Mancuernas', exercise_id: 'alt-press',
            sets: 3, reps: 6, weight_kg: 24, rest_seconds: 0, duration_seconds: null,
            exercise_type: 'strength', order_num: 1, completed: false,
            exercises: { image_url: null, video_url: null, description: 'Codos a 45 grados.' },
          },
        });
      }
      return Promise.resolve({});
    });

    const { session } = renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));
    await elegirAlternativa('press con mancuernas');

    await waitFor(() =>
      expect(api.patch).toHaveBeenCalledWith(
        `/workouts/sessions/${session.id}/exercises/pb/substitute`, { exercise_id: 'alt-press' },
      ),
    );
    expect(await screen.findByText('Press con Mancuernas')).toBeInTheDocument();
    expect(screen.queryByText('Press Banca con Barra')).not.toBeInTheDocument();
    expect(screen.getByText('Codos a 45 grados.')).toBeInTheDocument();
    // Sigue en vista previa: el sustituto se empieza igual que cualquier otro.
    expect(screen.getByRole('button', { name: /empezar ejercicio/i })).toBeInTheDocument();
    // El panel se cierra solo.
    expect(screen.queryByRole('button', { name: /cambiar a este ejercicio/i })).not.toBeInTheDocument();
  });

  it('una vez empezadas las series ya no ofrece sustituir el ejercicio', async () => {
    mockAlternativas();
    renderModal(sesionConPressBanca());

    // En vista previa sí se ofrece.
    await verVistaPrevia();
    expect(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /empezar ejercicio/i }));

    // Empezado el ejercicio, la sustitución deja de tener sentido: ya pudiste.
    expect(await screen.findByRole('button', { name: /serie 1 lista/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /no puedo hacer este ejercicio/i })).not.toBeInTheDocument();
  });

  it('si falla la red avisa y deja seguir con el ejercicio original', async () => {
    api.post.mockImplementation(url =>
      String(url).includes('/alternatives')
        ? Promise.reject(new Error('No se pudo conectar con el servidor.'))
        : Promise.resolve({}));

    renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));

    expect(await screen.findByText(/no pudimos cargar alternativas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /cerrar alternativas/i }));

    await waitFor(() => expect(screen.queryByText(/no pudimos cargar alternativas/i)).not.toBeInTheDocument());
    // El ejercicio original sigue propuesto y se puede empezar.
    expect(screen.getByText('Press Banca con Barra')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /empezar ejercicio/i })).toBeEnabled();
  });

  it('si falla la sustitución mantiene el ejercicio actual', async () => {
    mockAlternativas();
    api.patch.mockImplementation(url =>
      String(url).includes('/substitute')
        ? Promise.reject(new Error('No se pudo conectar con el servidor.'))
        : Promise.resolve({}));

    renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));
    await elegirAlternativa('fondos en paralelas');

    expect(await screen.findByText(/no pudimos cambiar el ejercicio/i)).toBeInTheDocument();
    expect(screen.getByText('Press Banca con Barra')).toBeInTheDocument();
  });

  it('avisa cuando el backend no encuentra alternativas', async () => {
    mockAlternativas({ alternatives: [] });
    renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));
    expect(await screen.findByText(/no encontramos alternativas/i)).toBeInTheDocument();
  });

  it('Escape cierra el panel de alternativas sin minimizar el modal', async () => {
    mockAlternativas();
    const { onMinimize } = renderModal(sesionConPressBanca());
    await verVistaPrevia();

    await userEvent.click(screen.getByRole('button', { name: /no puedo hacer este ejercicio/i }));
    await screen.findByRole('button', { name: /press con mancuernas/i });

    await userEvent.keyboard('{Escape}');

    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /press con mancuernas/i })).not.toBeInTheDocument());
    expect(onMinimize).not.toHaveBeenCalled();
  });
});

describe('WorkoutModal — bloques y finalización', () => {
  it('ofrece avanzar de fase al terminar el bloque actual y activa el primero del siguiente', async () => {
    renderModal();

    await comenzar();
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));

    const nextPhase = await screen.findByRole('button', { name: /siguiente fase: entrenamiento/i });
    await userEvent.click(nextPhase);

    // El primero del bloque nuevo se propone solo, en vista previa.
    expect(await screen.findByText('Press Banca con Barra')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /empezar ejercicio/i }));
    expect(await screen.findByRole('button', { name: /serie 1 lista/i })).toBeInTheDocument();
  });

  it('finaliza la sesión enviando duración y calorías', async () => {
    const only = makeExercise({ id: 'one', exercise_name: 'Plancha Frontal', exercise_type: 'warmup', duration_seconds: 60 });
    const { session, onClose } = renderModal({ session_exercises: [only] });

    await comenzar();
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

  it('lleva la cuenta de ejercicios completados en la cabecera', async () => {
    // Sustituye a la antigua barra de progreso: el recuento vive en el header.
    renderModal();
    expect(screen.getByText('0 de 4 ejercicios completados')).toBeInTheDocument();

    await comenzar();
    await userEvent.click(screen.getByRole('button', { name: /terminar ejercicio/i }));

    expect(await screen.findByText('1 de 4 ejercicios completados')).toBeInTheDocument();
  });
});

describe('WorkoutModal — cronómetro y calorías', () => {
  // Si el test falla antes de restaurarlos, los temporizadores falsos se
  // filtran al resto del archivo y tumban pruebas que no tienen nada que ver.
  afterEach(() => {
    vi.useRealTimers();
  });

  it('cuenta con reloj de pared y estima calorías realistas', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(Date.parse('2026-08-18T10:00:00Z'));

    render(
      <WorkoutModal
        session={makeSession({ rpe_target: 7 })}
        visible
        onClose={vi.fn()}
        onMinimize={vi.fn()}
      />,
    );

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.click(screen.getByRole('button', { name: /comenzar entrenamiento/i }));
    // El reloj no arranca hasta que hay un ejercicio en ejecución.
    await user.click(await screen.findByRole('button', { name: /empezar ejercicio/i }));

    await act(async () => { vi.advanceTimersByTime(65_400); });

    // El reloj ronda el minuto: el valor exacto depende de los milisegundos
    // que consuman los clics, y lo que se comprueba aquí son las calorías.
    expect(screen.getByLabelText('Tiempo transcurrido').textContent).toMatch(/^01:0\d$/);
    // Regresión: la fórmula anterior daba ~0,2 kcal al minuto de sesión.
    expect(screen.getByText('10 kcal')).toBeInTheDocument();
  });

  it('consolida el tiempo en localStorage al pausar, para sobrevivir a una recarga', async () => {
    // Se guarda al pausar, no al arrancar: lo que interesa conservar es el
    // tiempo ya entrenado, no el instante en que se abrió el modal.
    const { session } = renderModal({
      session_exercises: [makeExercise({ id: 'st', sets: 2, rest_seconds: 0 })],
    });
    await comenzar();
    expect(localStorage.getItem(`workout_elapsed_${session.id}`)).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: /serie 1 lista/i }));
    expect(localStorage.getItem(`workout_elapsed_${session.id}`)).toBeTruthy();
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
    await comenzar();
    await userEvent.click(screen.getByRole('button', { name: /cerrar entrenamiento/i }));

    expect(onClose).toHaveBeenCalled();
    expect(localStorage.getItem(`workout_elapsed_${session.id}`)).toBeNull();
  });

  it('no renderiza nada cuando está minimizado', () => {
    render(
      <WorkoutModal session={makeSession()} visible={false} onClose={vi.fn()} onMinimize={vi.fn()} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('sin wearable no inventa frecuencia cardiaca', () => {
    render(<WorkoutModal session={makeSession()} visible hasWearable={false} onClose={vi.fn()} onMinimize={vi.fn()} />);
    expect(screen.getByText('FC bpm')).toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});

describe('WorkoutModal — el cronómetro sólo corre entrenando', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * `shouldAdvanceTime` deja correr el tiempo real además del falso. Hace
   * falta: las transiciones de framer-motion van por `requestAnimationFrame`,
   * que Vitest no falsea, y sin ellas las tarjetas nunca terminan de montarse.
   * El precio es que cada clic mete unos milisegundos en el reloj, así que las
   * comprobaciones de abajo toleran un segundo de más.
   */
  function conRelojFalso() {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    return userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  }

  const reloj = () => screen.getByLabelText('Tiempo transcurrido').textContent;
  const segundos = (txt) => {
    const [min, seg] = txt.split(':').map(Number);
    return min * 60 + seg;
  };
  const correr = (ms) => act(async () => { vi.advanceTimersByTime(ms); });

  /**
   * El reloj marca `esperado`, con un segundo de tolerancia a cada lado: el
   * último tic del intervalo cae unos milisegundos antes de completar el
   * avance, así que el truncado puede quedarse corto por uno.
   * Lo que se comprueba aquí es que el reloj avanzó; que se detenga se
   * verifica aparte, con igualdad exacta, que no sufre deriva.
   */
  function marca(esperado) {
    const txt = reloj();
    expect(segundos(txt), `el reloj marca ${txt}`).toBeGreaterThanOrEqual(esperado - 1);
    expect(segundos(txt), `el reloj marca ${txt}`).toBeLessThanOrEqual(esperado + 1);
  }

  it('no corre mientras el ejercicio está en vista previa', async () => {
    const user = conRelojFalso();
    renderModal({ session_exercises: [makeExercise({ id: 'st', sets: 2, rest_seconds: 30 })] });

    await user.click(screen.getByRole('button', { name: /comenzar entrenamiento/i }));
    await screen.findByRole('button', { name: /empezar ejercicio/i });

    await correr(15_000);
    // Exacto: en pausa no hay deriva que valga, tiene que seguir en cero.
    expect(reloj()).toBe('00:00');
  });

  it('cuenta la serie y el descanso, y para al saltarlo', async () => {
    const user = conRelojFalso();
    renderModal({
      session_exercises: [makeExercise({ id: 'st', exercise_name: 'Sentadilla con Barra', sets: 3, rest_seconds: 60 })],
    });

    await user.click(screen.getByRole('button', { name: /comenzar entrenamiento/i }));
    await user.click(await screen.findByRole('button', { name: /empezar ejercicio/i }));

    // Serie en ejecución: cuenta.
    await correr(5000);
    marca(5);

    // Descanso: el ejercicio no ha terminado, así que sigue contando.
    await user.click(await screen.findByRole('button', { name: /serie 1 lista/i }));
    await correr(3000);
    marca(8);

    // Saltar el descanso lo detiene: el valor exacto ya no se mueve.
    await user.click(await screen.findByRole('button', { name: /saltar descanso/i }));
    const alPausar = reloj();
    await correr(30_000);
    expect(reloj()).toBe(alPausar);

    // Y la serie siguiente lo reanuda desde donde se quedó.
    await user.click(await screen.findByRole('button', { name: /empezar serie 2/i }));
    await correr(4000);
    marca(segundos(alPausar) + 4);
  });

  it('para solo cuando el descanso llega a cero, sin tocar nada', async () => {
    const user = conRelojFalso();
    renderModal({ session_exercises: [makeExercise({ id: 'st', sets: 2, rest_seconds: 5 })] });

    await user.click(screen.getByRole('button', { name: /comenzar entrenamiento/i }));
    await user.click(await screen.findByRole('button', { name: /empezar ejercicio/i }));
    await correr(5000);

    await user.click(await screen.findByRole('button', { name: /serie 1 lista/i }));
    await correr(5000); // la cuenta atrás baja un segundo por tick
    const alAgotarse = reloj();
    marca(10);

    // Nadie ha tocado nada y el aviso sigue en pantalla, pero ya no suma.
    await correr(20_000);
    expect(reloj()).toBe(alAgotarse);
  });

  it('al terminar un ejercicio deja de contar hasta empezar el siguiente', async () => {
    const user = conRelojFalso();
    renderModal({ session_exercises: bloqueDeFuerza() });

    await user.click(screen.getByRole('button', { name: /comenzar entrenamiento/i }));
    await user.click(await screen.findByRole('button', { name: /empezar ejercicio/i }));
    await correr(7000);

    // De una serie: cierra el ejercicio y propone el siguiente en vista previa.
    await user.click(await screen.findByRole('button', { name: /terminar ejercicio/i }));
    await screen.findByRole('button', { name: /empezar ejercicio/i });
    const enPrevia = reloj();
    await correr(25_000);
    expect(reloj()).toBe(enPrevia);

    await user.click(screen.getByRole('button', { name: /empezar ejercicio/i }));
    await correr(3000);
    marca(segundos(enPrevia) + 3);
  });
});
