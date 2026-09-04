import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const state = { trainer: null, trainerError: null, clients: [], clientsError: null };

const supabase = {
  from: vi.fn((table) => ({
    select: () => ({
      eq: () => (
        table === 'trainer_profiles'
          ? {
            maybeSingle: () => Promise.resolve({ data: state.trainer, error: state.trainerError }),
            then: (resolve) => resolve({ data: state.clients, error: state.clientsError }),
          }
          : {
            maybeSingle: () => Promise.resolve({ data: state.trainer, error: state.trainerError }),
            then: (resolve) => resolve({ data: state.clients, error: state.clientsError }),
          }
      ),
    }),
  })),
};

vi.mock('../api/client.js', () => ({ api: {}, supabase }));

const { default: DashboardCoach, planCopy } = await import('./DashboardCoach.jsx');

beforeEach(() => {
  state.trainer = { id: 't1', full_name: 'Ana Torres', rating: 4.9, active_clients: 3, plan: 'pro', specialties: ['Fuerza', 'Hipertrofia'] };
  state.trainerError = null;
  state.clients = [];
  state.clientsError = null;
});

describe('planCopy', () => {
  it('describe cada plan y cae a starter', () => {
    expect(planCopy('elite')).toMatch(/sin comisiones/i);
    expect(planCopy('pro')).toMatch(/15% comisión/i);
    expect(planCopy(undefined)).toMatch(/hasta 5 clientes/i);
  });
});

describe('DashboardCoach', () => {
  it('muestra las métricas del entrenador', async () => {
    state.clients = [
      { id: 'c1', full_name: 'Carlos Mendoza', current_streak: 5, level_name: 'En forma', updated_at: new Date().toISOString(), subscription_plan: 'pro' },
      { id: 'c2', full_name: 'Lucía Pérez', current_streak: 0, level_name: 'Principiante', updated_at: null, subscription_plan: 'free' },
    ];
    render(<DashboardCoach userId="t1" />);

    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Clientes activos')).toBeInTheDocument();
    expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument();
    expect(screen.getByText('Lucía Pérez')).toBeInTheDocument();
    expect(screen.getByText('Fuerza')).toBeInTheDocument();
  });

  it('muestra el estado vacío sin clientes', async () => {
    render(<DashboardCoach userId="t1" />);
    expect(await screen.findByText(/aún no tienes clientes asignados/i)).toBeInTheDocument();
  });

  it('muestra error con reintento si Supabase falla', async () => {
    // Regresión: sin `.catch`, la pantalla se quedaba en "Cargando..." para
    // siempre y generaba un unhandled rejection.
    state.trainerError = { message: 'permission denied' };
    render(<DashboardCoach userId="t1" />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('recarga al pulsar reintentar', async () => {
    state.trainerError = { message: 'timeout' };
    render(<DashboardCoach userId="t1" />);
    await screen.findByRole('alert');

    state.trainerError = null;
    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await screen.findByText('Ana')).toBeInTheDocument();
  });

  it('muestra "Coach" si el perfil de entrenador está vacío', async () => {
    state.trainer = null;
    render(<DashboardCoach userId="t1" />);
    expect(await screen.findByText('Coach')).toBeInTheDocument();
  });
});
