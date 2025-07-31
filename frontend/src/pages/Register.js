import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
  // const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'empleado' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      if (res.status === 201) {
        setSuccess('✅ Usuario registrado correctamente.');
        setError('');
        setForm({ email: '', password: '', role: 'empleado' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || '❌ No se pudo registrar el usuario.';
      setError(msg);
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>

      {/* Alertas */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <input
            name="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <select name="role" className="form-select" value={form.role} onChange={handleChange}>
            <option value="empleado">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button className="btn btn-success w-100" type="submit">Registrarse</button>
      </form>
    </div>
  );
}

