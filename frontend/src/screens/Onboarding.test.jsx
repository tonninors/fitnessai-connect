import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
vi.mock('../api/client.js', () => ({ api, supabase: {} }));

const { default: Onboarding } = await import('./Onboarding.jsx');

const USER = { user_metadata: { full_name: 'Carlos Mendoza' } };

beforeEach(() => {
  api.get.mockResolvedValue({ full_name: 'Carlos Mendoza' });
  api.patch.mockResolvedValue({});
  api.post.mockResolvedValue({ plan_id: 'plan-1' });
});

/** El wizard usa AnimatePresence: hay que esperar a que monte cada paso. */
async function next(user) {
  await user.click(screen.getByRole('button', { name: 'Continuar' }));
}

async function goal(user, name) {
  await next(user);
  await user.click(await screen.findByRole('button', { name }));
}

/** Avanza el wizard hasta el último paso con selecciones válidas. */
async function completeToLastStep(user, { cardio } = {}) {
  await goal(user, /ganar músculo/i);
  await next(user);
  await user.click(await screen.findByRole('button', { name: '4 dias por semana' }));
  if (cardio) await user.click(screen.getByRole('button', { name: cardio }));
  await next(user);
  await user.click(await screen.findByRole('radio', { name: /principiante/i }));
}

describe('Onboarding — navegación', () => {
  it('saluda con el nombre del usuario', () => {
    render(<Onboarding user={USER} onComplete={vi.fn()} />);
    expect(screen.getByText('¡Hola, Carlos!')).toBeInTheDocument();
  });

  it('bloquea el avance hasta elegir un objetivo', async () => {
    const user = userEvent.setup();
    render(<Onboarding user={USER} onComplete={vi.fn()} />);

    await next(user);
    expect(await screen.findByText('¿Cuál es tu objetivo?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /perder grasa/i }));
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled();
  });

  it('permite volver al paso anterior', async () => {
    const user = userEvent.setup();
    render(<Onboarding user={USER} onComplete={vi.fn()} />);

    await next(user);
    expect(await screen.findByText('¿Cuál es tu objetivo?')).toBeInTheDocument();

    const backButtons = screen.getAllByRole('button');
    await user.click(backButtons[0]);
    expect(await screen.findByText('¡Hola, Carlos!')).toBeInTheDocument();
  });

  it('exige elegir nivel antes de generar el plan', async () => {
    const user = userEvent.setup();
    render(<Onboarding user={USER} onComplete={vi.fn()} />);

    await goal(user, /ganar músculo/i);
    await next(user);
    await screen.findByText('¿Cuánto puedes entrenar?');
    await next(user);

    expect(await screen.findByRole('button', { name: /crear mi plan con ia/i })).toBeDisabled();
  });
});

describe('Onboarding — accesibilidad', () => {
  it('los chips son botones con estado pulsado', async () => {
    const user = userEvent.setup();
    render(<Onboarding user={USER} onComplete={vi.fn()} />);
    await next(user);

    const chip = await screen.findByRole('button', { name: /ganar músculo/i });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('el nivel se expone como radiogroup', async () => {
    const user = userEvent.setup();
    render(<Onboarding user={USER} onComplete={vi.fn()} />);
    await completeToLastStep(user);

    expect(screen.getByRole('radiogroup', { name: /nivel de experiencia/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /principiante/i })).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Onboarding — finalización', () => {
  it('guarda el perfil y pide el plan con los datos elegidos', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Onboarding user={USER} onComplete={onComplete} />);

    await completeToLastStep(user);
    await user.click(screen.getByRole('button', { name: /crear mi plan con ia/i }));

    await waitFor(() => expect(api.patch).toHaveBeenCalledWith('/profile', expect.objectContaining({
      onboarding_completed: true,
      availability: expect.objectContaining({ days_per_week: 4 }),
    })));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/ai/generate-plan', expect.objectContaining({
      days_per_week: 4,
      fitness_level: 'beginner',
    })));

    await waitFor(() => expect(onComplete).toHaveBeenCalled());
  });

  it('completa el onboarding aunque la IA falle', async () => {
    // El plan puede generarse después desde Planes: un fallo de la IA no debe
    // dejar al usuario atrapado en el wizard.
    api.post.mockRejectedValue(new Error('502'));
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Onboarding user={USER} onComplete={onComplete} />);

    await completeToLastStep(user);
    await user.click(screen.getByRole('button', { name: /crear mi plan con ia/i }));

    await waitFor(() => expect(onComplete).toHaveBeenCalled());
  });

  it('muestra el error si no se puede guardar el perfil', async () => {
    api.patch.mockRejectedValue(new Error('No se pudo guardar tu perfil.'));
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Onboarding user={USER} onComplete={onComplete} />);

    await completeToLastStep(user);
    await user.click(screen.getByRole('button', { name: /crear mi plan con ia/i }));

    expect(await screen.findByText('No se pudo guardar tu perfil.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('permite elegir "sin cardio" y lo propaga al generador', async () => {
    const user = userEvent.setup();
    render(<Onboarding user={USER} onComplete={vi.fn()} />);

    await goal(user, /ganar músculo/i);
    await next(user);
    await user.click(await screen.findByRole('button', { name: 'Sin cardio' }));
    await next(user);
    await user.click(await screen.findByRole('radio', { name: /avanzado/i }));
    await user.click(screen.getByRole('button', { name: /crear mi plan con ia/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith(
      '/ai/generate-plan',
      expect.objectContaining({ cardio_minutes: 0 }),
    ));
  });
});
