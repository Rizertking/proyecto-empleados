import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// ✅ Mock solo de la API
jest.mock('../api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(() =>
      Promise.reject({
        response: { data: { message: 'Credenciales inválidas' } },
      })
    ),
  },
}));

describe('Login', () => {
  test('debería mostrar los campos de login y el botón', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  test('debería mostrar error si las credenciales son inválidas', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'wrong@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
  });
});
