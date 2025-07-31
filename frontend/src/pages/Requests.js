import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Requests() {
  const { role } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchRequests = async () => {
    const res = await API.get(`/requests?page=${page}&limit=${limit}&search=${search}`);
    setRequests(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    await API.post('/requests', { description });
    setDescription('');
    fetchRequests();
  };

  const handleDelete = async (id) => {
    await API.delete(`/requests/${id}`);
    fetchRequests();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleNext = () => setPage(page + 1);
  const handlePrev = () => setPage(page > 1 ? page - 1 : 1);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  return (
    <div className="container mt-4">
      <h2>Solicitudes</h2>

      {/* Búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por descripción..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-10">
          <input
            className="form-control"
            value={description}
            placeholder="Descripción"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" type="submit">Crear</button>
        </div>
      </form>

      {/* Lista */}
      <ul className="list-group mb-3">
        {requests.map((r) => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            {r.description}
            {role === 'admin' && (
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Eliminar</button>
            )}
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={handlePrev}>Anterior</button>
        <span>Página {page}</span>
        <button className="btn btn-outline-secondary" disabled={requests.length < limit} onClick={handleNext}>Siguiente</button>
      </div>
    </div>
  );
}
