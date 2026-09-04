import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
vi.mock('../api/client.js', () => ({ api, supabase: {} }));

const { default: Progress, formatCount } = await import('./Progress.jsx');
const { makeProgressStats } = await import('../tests/factories.js');

beforeEach(() => {
  api.get.mockReset();
});

describe('formatCount', () => {
  it('abrevia los miles', () => {
    expect(formatCount(4200)).toBe('4.2k');
    expect(formatCount(999)).toBe('999');
    expect(formatCount(1000)).toBe('1.0k');
  });

  it('trata valores inválidos como 0', () => {
    expect(formatCount(null)).toBe('0');
    expect(formatCount(undefined)).toBe('0');
  });
});

describe('Progress', () => {
  it('muestra el esqueleto mientras carga', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    render(<Progress />);
    expect(screen.getByLabelText('Cargando progreso')).toBeInTheDocument();
  });

  it('muestra racha, nivel y métricas del mes', async () => {
    api.get.mockResolvedValue(makeProgressStats());
    render(<Progress />);

    expect(await screen.findByText('Días de racha')).toBeInTheDocument();
    expect(screen.getByText('Nivel 2')).toBeInTheDocument();
    expect(screen.getByText('En forma')).toBeInTheDocument();
    expect(screen.getByText('4.2k')).toBeInTheDocument();
    expect(screen.getByText('9h')).toBeInTheDocument();
  });

  it('muestra error con reintento si falla la carga', async () => {
    api.get.mockRejectedValue(new Error('502'));
    render(<Progress />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('pide la gráfica al cambiar de periodo', async () => {
    api.get.mockImplementation(path => (
      path === '/progress/stats'
        ? Promise.resolve(makeProgressStats())
        : Promise.resolve([{ label: 'S1', val: 30 }])
    ));
    render(<Progress />);

    await userEvent.click(await screen.findByRole('button', { name: '3M' }));

    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/progress/chart?period=3m'));
    expect(screen.getByRole('button', { name: '3M' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('no vuelve a pedir la gráfica de 4 semanas: reutiliza la de /stats', async () => {
    api.get.mockResolvedValue(makeProgressStats());
    render(<Progress />);
    await screen.findByText('Días de racha');

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).not.toHaveBeenCalledWith(expect.stringContaining('/progress/chart'));
  });

  it('muestra un estado vacío cuando no hay volumen registrado', async () => {
    // Antes se pintaba una línea plana sin explicar que no hay datos.
    api.get.mockResolvedValue(makeProgressStats({
      streak: 0,
      weekly_volume: [{ label: 'S1', val: 0 }, { label: 'S2', val: 0 }],
    }));
    render(<Progress />);

    expect(await screen.findByText(/aún no hay volumen registrado/i)).toBeInTheDocument();
  });

  it('adapta el insight cuando no hay racha', async () => {
    api.get.mockResolvedValue(makeProgressStats({ streak: 0, total_workouts: 0 }));
    render(<Progress />);
    expect(await screen.findByText(/aún no tienes racha activa/i)).toBeInTheDocument();
  });

  it('concuerda el singular de "día" con una racha de 1', async () => {
    api.get.mockResolvedValue(makeProgressStats({ streak: 1 }));
    render(<Progress />);
    expect(await screen.findByText(/llevas 1 día de racha/i)).toBeInTheDocument();
  });

  it('avisa si la gráfica falla sin tumbar la pantalla', async () => {
    api.get.mockImplementation(path => (
      path === '/progress/stats'
        ? Promise.resolve(makeProgressStats())
        : Promise.reject(new Error('500'))
    ));
    render(<Progress />);

    await userEvent.click(await screen.findByRole('button', { name: '1A' }));
    expect(await screen.findByText(/no se pudo cargar la gráfica/i)).toBeInTheDocument();
    expect(screen.getByText('Días de racha')).toBeInTheDocument();
  });
});
