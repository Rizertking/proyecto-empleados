import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Requests() {
  const { role } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [userFilter, setUserFilter] = useState('');
  const limit = 5;

  const fetchRequests = async (newSearch = search, newUser = userFilter, newPage = page) => {
    try {
    const res = await API.get(`/requests?page=${newPage}&limit=${limit}&search=${newSearch}&user=${newUser}`);
    setRequests(res.data);
    } catch (err) {
      console.error('❌ Error al obtener empleados:', err.response?.data?.message || err.message);
    }
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



  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRequests(search, userFilter, nextPage);
  };
  const handlePrev = () => {
    const prevPage = page > 1 ? page - 1 : 1;
    setPage(prevPage);
    fetchRequests(search, userFilter, prevPage);
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  return (
    <div className="container mt-4">
      <h2>Solicitudes</h2>


      {/* Búsqueda por usuario */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por usuario (email)..."
          value={userFilter}
          onChange={(e) => {
            const value = e.target.value;
            setUserFilter(value);
            setPage(1);
            fetchRequests(search, value, 1);
          }}
        />
      </div>

      {/* Búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por descripción..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            setPage(1);
            fetchRequests(value, userFilter, 1);
          }}
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
            <div>
              <strong>{r.description}</strong>
              <br />
              <small className="text-muted">Por: {r.user_email}</small>
            </div>
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
