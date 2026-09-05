import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const supabase = { auth: { updateUser: vi.fn() } };
vi.mock('../api/client.js', () => ({ api: {}, supabase }));

const { default: ResetPassword } = await import('./ResetPassword.jsx');

beforeEach(() => {
  supabase.auth.updateUser.mockResolvedValue({ error: null });
});

describe('ResetPassword', () => {
  it('muestra los dos campos con label asociado', () => {
    render(<ResetPassword onDone={vi.fn()} />);
    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument();
  });

  it('los dos botones de mostrar contraseña tienen nombres distintos', () => {
    // Con la etiqueta por defecto los dos se llamarían igual y un lector de
    // pantalla no podría distinguir cuál campo destapa cada uno.
    render(<ResetPassword onDone={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Mostrar la nueva contraseña' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostrar la confirmación de contraseña' })).toBeInTheDocument();
  });

  it('actualiza la contraseña y avisa al terminar', async () => {
    const onDone = vi.fn();
    render(<ResetPassword onDone={onDone} />);

    await userEvent.type(screen.getByLabelText('Nueva contraseña'), 'nuevaClave1');
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'nuevaClave1');
    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    await waitFor(() => expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'nuevaClave1' }));
    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });

  it('bloquea el envío si las contraseñas no coinciden', async () => {
    const onDone = vi.fn();
    render(<ResetPassword onDone={onDone} />);

    await userEvent.type(screen.getByLabelText('Nueva contraseña'), 'nuevaClave1');
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'otraClave2');
    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Las contraseñas no coinciden.');
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it('muestra el error si Supabase rechaza la actualización', async () => {
    supabase.auth.updateUser.mockResolvedValue({ error: { message: 'token expirado' } });
    const onDone = vi.fn();
    render(<ResetPassword onDone={onDone} />);

    await userEvent.type(screen.getByLabelText('Nueva contraseña'), 'nuevaClave1');
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'nuevaClave1');
    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se pudo actualizar la contraseña/i);
    expect(onDone).not.toHaveBeenCalled();
  });
});
