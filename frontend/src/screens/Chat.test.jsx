import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const state = { rows: [], loadError: null, insertResult: null };

/** Doble mínimo del cliente Supabase para `messages`. */
const supabase = {
  from: vi.fn(() => ({
    select: () => ({
      or: () => ({
        order: () => Promise.resolve({ data: state.rows, error: state.loadError }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve(state.insertResult),
      }),
    }),
  })),
  channel: vi.fn(() => ({ on: () => ({ subscribe: () => ({ id: 'ch' }) }) })),
  removeChannel: vi.fn(),
};

vi.mock('../api/client.js', () => ({ api: {}, supabase }));

const { default: Chat } = await import('./Chat.jsx');

const USER_ID = 'user-1';
const TRAINER_ID = 'trainer-1';

beforeEach(() => {
  state.rows = [];
  state.loadError = null;
  state.insertResult = { data: { id: 'm-real', sender_id: USER_ID, receiver_id: TRAINER_ID, content: 'Hola coach', created_at: '2026-08-18T10:00:00Z' }, error: null };
});

function renderChat(props = {}) {
  return render(<Chat userId={USER_ID} trainerId={TRAINER_ID} trainerName="Ana Torres" {...props} />);
}

describe('Chat — sin entrenador', () => {
  it('muestra el estado vacío con llamada a la acción', () => {
    render(<Chat userId={USER_ID} trainerId={null} trainerName={null} />);
    expect(screen.getByText(/tu entrenador personal te espera/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explorar entrenadores/i })).toBeDisabled();
  });

  it('no abre canal de realtime sin entrenador', () => {
    render(<Chat userId={USER_ID} trainerId={null} />);
    expect(supabase.channel).not.toHaveBeenCalled();
  });
});

describe('Chat — conversación', () => {
  it('carga el historial y lo muestra', async () => {
    state.rows = [
      { id: 'm1', sender_id: TRAINER_ID, receiver_id: USER_ID, content: '¿Cómo fue la sesión?', created_at: '2026-08-18T09:00:00Z' },
      { id: 'm2', sender_id: USER_ID, receiver_id: TRAINER_ID, content: 'Muy bien, subí 5 kg', created_at: '2026-08-18T09:05:00Z' },
    ];
    renderChat();

    expect(await screen.findByText('¿Cómo fue la sesión?')).toBeInTheDocument();
    expect(screen.getByText('Muy bien, subí 5 kg')).toBeInTheDocument();
    expect(screen.getByRole('log', { name: /mensajes/i })).toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay mensajes', async () => {
    renderChat();
    expect(await screen.findByText('Envía tu primer mensaje')).toBeInTheDocument();
  });

  it('avisa si el historial no se puede cargar', async () => {
    state.loadError = { message: 'permission denied' };
    renderChat();
    expect(await screen.findByRole('alert')).toHaveTextContent(/no se pudieron cargar los mensajes/i);
  });

  it('envía el mensaje de forma optimista y lo confirma', async () => {
    renderChat();
    await screen.findByText('Envía tu primer mensaje');

    await userEvent.type(screen.getByLabelText('Mensaje'), 'Hola coach');
    await userEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

    expect(await screen.findByText('Hola coach')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Enviando…')).not.toBeInTheDocument());
  });

  it('marca el mensaje como fallido y permite reintentar', async () => {
    // Regresión: si el insert fallaba, el mensaje quedaba en pantalla como si
    // se hubiera enviado correctamente.
    state.insertResult = { data: null, error: { message: 'network' } };
    renderChat();
    await screen.findByText('Envía tu primer mensaje');

    await userEvent.type(screen.getByLabelText('Mensaje'), 'Mensaje perdido');
    await userEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

    const retry = await screen.findByRole('button', { name: /no se envió · reintentar/i });
    await userEvent.click(retry);

    expect(screen.getByLabelText('Mensaje')).toHaveValue('Mensaje perdido');
    expect(screen.queryByText('Mensaje perdido')).not.toBeInTheDocument();
  });

  it('no envía mensajes vacíos', async () => {
    renderChat();
    await screen.findByText('Envía tu primer mensaje');

    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Mensaje'), '   ');
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeDisabled();
  });

  it('se desuscribe del canal al desmontar', async () => {
    const { unmount } = renderChat();
    await screen.findByText('Envía tu primer mensaje');
    unmount();
    expect(supabase.removeChannel).toHaveBeenCalled();
  });
});
