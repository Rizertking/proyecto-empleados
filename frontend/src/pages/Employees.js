import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', position: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchEmployees = async () => {
    const res = await API.get(`/employees?page=${page}&limit=${limit}&search=${search}`);
    setEmployees(res.data);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/employees', form);
    setForm({ name: '', position: '' });
    fetchEmployees();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reinicia la página al cambiar búsqueda
  };

  const handleNext = () => setPage(page + 1);
  const handlePrev = () => setPage(page > 1 ? page - 1 : 1);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  return (
    <div className="container mt-4">
      <h2>Empleados</h2>

      {/* Búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-5">
          <input name="name" className="form-control" placeholder="Nombre" value={form.name} onChange={handleChange} />
        </div>
        <div className="col-md-5">
          <input name="position" className="form-control" placeholder="Cargo" value={form.position} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">Agregar</button>
        </div>
      </form>

      {/* Lista */}
      <ul className="list-group mb-3">
        {employees.map(emp => (
          <li key={emp.id} className="list-group-item">{emp.name} - {emp.position}</li>
        ))}
      </ul>

      {/* Paginación */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={handlePrev}>Anterior</button>
        <span>Página {page}</span>
        <button className="btn btn-outline-secondary" disabled={employees.length < limit} onClick={handleNext}>Siguiente</button>
      </div>
    </div>
  );
}
