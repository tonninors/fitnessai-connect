import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const api = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const supabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    resetPasswordForEmail: vi.fn(),
  },
};
vi.mock('../api/client.js', () => ({ api, supabase }));

const { default: Login } = await import('./Login.jsx');

beforeEach(() => {
  api.post.mockResolvedValue({ exists: true });
  supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
  supabase.auth.signUp.mockResolvedValue({ error: null });
  supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
});

async function fillLogin(email = 'carlos@example.com', password = 'secreto123') {
  await userEvent.type(screen.getByLabelText(/correo electrónico/i), email);
  await userEvent.type(screen.getByLabelText(/^contraseña$/i), password);
}

describe('Login — modo inicio de sesión', () => {
  it('muestra los campos de correo y contraseña', () => {
    render(<Login />);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('inicia sesión con credenciales válidas', async () => {
    render(<Login />);
    await fillLogin();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'carlos@example.com',
      password: 'secreto123',
    }));
  });

  it('avisa si el correo no está registrado y no intenta autenticar', async () => {
    api.post.mockResolvedValue({ exists: false });
    render(<Login />);
    await fillLogin();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Este correo no está registrado.')).toBeInTheDocument();
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('avisa cuando la contraseña es incorrecta', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    render(<Login />);
    await fillLogin();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Contraseña incorrecta.')).toBeInTheDocument();
  });

  it('si la verificación de correo falla, intenta el login igualmente', async () => {
    api.post.mockRejectedValue(new Error('backend caído'));
    render(<Login />);
    await fillLogin();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(supabase.auth.signInWithPassword).toHaveBeenCalled());
  });
});

describe('Login — registro', () => {
  it('pide el nombre y crea la cuenta', async () => {
    render(<Login />);
    await userEvent.click(screen.getByRole('button', { name: /regístrate/i }));

    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Ana Torres');
    await fillLogin('ana@example.com', 'secreto123');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'secreto123',
      options: { data: { full_name: 'Ana Torres' } },
    }));
    expect(await screen.findByText(/cuenta creada/i)).toBeInTheDocument();
  });

  it('muestra el error devuelto por Supabase', async () => {
    supabase.auth.signUp.mockResolvedValue({ error: { message: 'User already registered' } });
    render(<Login />);
    await userEvent.click(screen.getByRole('button', { name: /regístrate/i }));

    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Ana');
    await fillLogin('ana@example.com', 'secreto123');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByText('User already registered')).toBeInTheDocument();
  });
});

describe('Login — recuperar contraseña', () => {
  it('envía el correo de recuperación', async () => {
    render(<Login />);
    await userEvent.click(screen.getByRole('button', { name: /olvidaste tu contraseña/i }));

    // En este modo no se pide contraseña.
    expect(screen.queryByLabelText(/^contraseña$/i)).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'carlos@example.com');
    await userEvent.click(screen.getByRole('button', { name: /enviar correo/i }));

    await waitFor(() => expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalled());
    expect(await screen.findByText(/te enviamos un correo/i)).toBeInTheDocument();
  });

  it('avisa si el envío falla', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ error: { message: 'rate limit' } });
    render(<Login />);
    await userEvent.click(screen.getByRole('button', { name: /olvidaste tu contraseña/i }));
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'carlos@example.com');
    await userEvent.click(screen.getByRole('button', { name: /enviar correo/i }));

    expect(await screen.findByText(/no se pudo enviar el correo/i)).toBeInTheDocument();
  });

  it('limpia el error al cambiar de modo', async () => {
    api.post.mockResolvedValue({ exists: false });
    render(<Login />);
    await fillLogin();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Este correo no está registrado.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /regístrate/i }));
    expect(screen.queryByText('Este correo no está registrado.')).not.toBeInTheDocument();
  });
});
