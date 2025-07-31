import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      const token = res.data.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      login(token, decoded.role);
      navigate('/employees');
    } catch {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <input name="email" className="form-control" placeholder="Email" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <input name="password" type="password" className="form-control" placeholder="Contraseña" onChange={handleChange} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Ingresar</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
