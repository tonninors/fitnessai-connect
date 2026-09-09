import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordField from './PasswordField.jsx';

function renderField(props = {}) {
  return render(
    <PasswordField
      id="test-password"
      label="Contraseña"
      value="secreto123"
      onChange={() => {}}
      autoComplete="current-password"
      {...props}
    />,
  );
}

describe('PasswordField', () => {
  it('arranca con la contraseña oculta', () => {
    renderField();

    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' }))
      .toHaveAttribute('aria-pressed', 'false');
  });

  it('el botón muestra la contraseña y vuelve a ocultarla', async () => {
    renderField();
    const boton = screen.getByRole('button', { name: 'Mostrar contraseña' });

    await userEvent.click(boton);
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'text');
    expect(boton).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(boton);
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
    expect(boton).toHaveAttribute('aria-pressed', 'false');
  });

  it('mantiene el valor al alternar', async () => {
    // Cambiar el `type` no debe reemplazar el input ni perder lo tecleado.
    renderField();

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(screen.getByLabelText('Contraseña')).toHaveValue('secreto123');
  });

  it('no envía el formulario al pulsarlo', async () => {
    // Sin `type="button"` el botón haría submit: está dentro de un <form>.
    const onSubmit = vi.fn(e => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <PasswordField id="p" label="Contraseña" value="" onChange={() => {}} />
      </form>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('el icono no se le anuncia al lector de pantalla', () => {
    renderField();
    const icono = screen.getByRole('button', { name: 'Mostrar contraseña' }).querySelector('svg');

    expect(icono).toHaveAttribute('aria-hidden', 'true');
  });

  it('permite nombrar el botón cuando hay más de un campo', () => {
    renderField({ toggleLabel: 'Mostrar la nueva contraseña' });

    expect(screen.getByRole('button', { name: 'Mostrar la nueva contraseña' })).toBeInTheDocument();
  });

  it('muestra la ayuda sólo cuando se le pasa', () => {
    const { unmount } = renderField();
    expect(screen.queryByText('Mínimo 6 caracteres.')).not.toBeInTheDocument();
    unmount();

    renderField({ hint: 'Mínimo 6 caracteres.' });
    expect(screen.getByText('Mínimo 6 caracteres.')).toBeInTheDocument();
  });
});
