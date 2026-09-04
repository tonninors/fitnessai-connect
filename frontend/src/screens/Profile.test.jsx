import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const supabase = { auth: { signOut: vi.fn() } };
vi.mock('../api/client.js', () => ({ api, supabase }));

const {
  default: Profile,
  describeGoals,
  describeAvailability,
  buildWearableList,
  planLabel,
} = await import('./Profile.jsx');
const { makeProfile } = await import('../tests/factories.js');

beforeEach(() => {
  api.get.mockReset();
  api.post.mockReset();
  api.delete.mockReset();
});

describe('describeGoals', () => {
  it('lista los objetivos elegidos en el onboarding', () => {
    // Regresión: la pantalla leía `goals.secondary`, que el onboarding nunca
    // escribe, así que siempre mostraba "Sin definir".
    expect(describeGoals({ primary: 'ganar_musculo', all: ['ganar_musculo', 'perder_grasa'] }))
      .toBe('ganar musculo · perder grasa');
  });

  it('usa el objetivo principal si no hay lista', () => {
    expect(describeGoals({ primary: 'flexibilidad' })).toBe('flexibilidad');
  });

  it('indica cuando no hay nada configurado', () => {
    expect(describeGoals(null)).toBe('Sin definir');
    expect(describeGoals({ all: [] })).toBe('Sin definir');
  });
});

describe('describeAvailability', () => {
  it('resume días, duración y cardio', () => {
    expect(describeAvailability({ days_per_week: 4, session_duration: 60, cardio_minutes: 15 }))
      .toBe('4 días/semana · 60 min · 15 min cardio');
  });

  it('distingue explícitamente "sin cardio"', () => {
    expect(describeAvailability({ days_per_week: 3, cardio_minutes: 0 }))
      .toBe('3 días/semana · sin cardio');
  });

  it('acepta el formato antiguo con lista de días', () => {
    expect(describeAvailability({ days: ['lunes', 'miércoles'] })).toBe('lunes, miércoles');
  });

  it('indica cuando no hay nada configurado', () => {
    expect(describeAvailability(undefined)).toBe('Sin definir');
    expect(describeAvailability({})).toBe('Sin definir');
  });
});

describe('buildWearableList / planLabel', () => {
  it('siempre devuelve las 4 plataformas soportadas', () => {
    const list = buildWearableList([{ platform: 'garmin', connected: true, device_name: 'Forerunner' }]);
    expect(list).toHaveLength(4);
    expect(list.find(w => w.platform === 'garmin').connected).toBe(true);
    expect(list.find(w => w.platform === 'fitbit').connected).toBe(false);
  });

  it('funciona sin wearables', () => {
    expect(buildWearableList()).toHaveLength(4);
  });

  it('etiqueta los planes conocidos y cae a Free', () => {
    expect(planLabel('pro')).toBe('Plan PRO');
    expect(planLabel(undefined)).toBe('Free');
    expect(planLabel('inventado')).toBe('Free');
  });
});

describe('Profile — pantalla', () => {
  it('muestra los datos del usuario', async () => {
    api.get.mockResolvedValue(makeProfile());
    render(<Profile onNavigate={vi.fn()} isTrainer={false} />);

    expect(await screen.findByText('Carlos Mendoza')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument(); // sesiones
    expect(screen.getByText('4 días/semana · 60 min · 15 min cardio')).toBeInTheDocument();
  });

  it('muestra error con reintento si la API falla', async () => {
    api.get.mockRejectedValue(new Error('sin conexión'));
    render(<Profile onNavigate={vi.fn()} isTrainer={false} />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('los wearables son interruptores accesibles', async () => {
    api.get.mockResolvedValue(makeProfile({ wearables: [{ platform: 'garmin', device_name: 'Garmin', connected: true }] }));
    render(<Profile onNavigate={vi.fn()} isTrainer={false} />);

    const switches = await screen.findAllByRole('switch');
    expect(switches).toHaveLength(4);
    expect(screen.getByRole('switch', { name: /desconectar garmin/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('conecta un wearable no conectado', async () => {
    api.get.mockResolvedValue(makeProfile());
    api.post.mockResolvedValue({});
    render(<Profile onNavigate={vi.fn()} isTrainer={false} />);

    await userEvent.click(await screen.findByRole('switch', { name: /conectar garmin/i }));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/profile/wearables', expect.objectContaining({ platform: 'garmin' })));
  });

  it('desconecta un wearable conectado', async () => {
    api.get.mockResolvedValue(makeProfile({ wearables: [{ platform: 'fitbit', device_name: 'Fitbit', connected: true }] }));
    api.delete.mockResolvedValue({});
    render(<Profile onNavigate={vi.fn()} isTrainer={false} />);

    await userEvent.click(await screen.findByRole('switch', { name: /desconectar fitbit/i }));
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/profile/wearables/fitbit'));
  });

  it('avisa si no se puede actualizar el wearable', async () => {
    api.get.mockResolvedValue(makeProfile());
    api.post.mockRejectedValue(new Error('403'));
    render(<Profile onNavigate={vi.fn()} isTrainer={false} />);

    await userEvent.click(await screen.findByRole('switch', { name: /conectar garmin/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('403');
  });

  it('la vista de entrenador sólo aparece para entrenadores', async () => {
    api.get.mockResolvedValue(makeProfile());
    const { rerender } = render(<Profile onNavigate={vi.fn()} isTrainer={false} />);
    await screen.findByText('Carlos Mendoza');
    expect(screen.queryByRole('button', { name: /vista de entrenador/i })).not.toBeInTheDocument();

    const onNavigate = vi.fn();
    rerender(<Profile onNavigate={onNavigate} isTrainer />);
    await userEvent.click(await screen.findByRole('button', { name: /vista de entrenador/i }));
    expect(onNavigate).toHaveBeenCalledWith('coach');
  });

  it('cierra sesión', async () => {
    api.get.mockResolvedValue(makeProfile());
    render(<Profile onNavigate={vi.fn()} isTrainer={false} />);

    await userEvent.click(await screen.findByRole('button', { name: /cerrar sesión/i }));
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
