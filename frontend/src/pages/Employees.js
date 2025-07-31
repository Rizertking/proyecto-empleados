import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export default function Employees() {
  const { role } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: '',
    position: '',
    fecha_ingreso: '',
    salario: '',
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchEmployees = async () => {
    try {
      const res = await API.get(`/employees?page=${page}&limit=${limit}&search=${search}`);
      setEmployees(res.data);
    } catch (err) {
      console.error('❌ Error al obtener empleados:', err.response?.data?.message || err.message);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/employees', form);
    setForm({ name: '', position: '', fecha_ingreso: '', salario: '' });
    fetchEmployees();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reinicia la página al cambiar búsqueda
  };

  const handleDelete = async (id) => {
  if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error('❌ Error al eliminar empleado:', err.response?.data?.message || err.message);
    }
  }
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
        <div className="col-md-3">
          <input name="name" className="form-control" placeholder="Nombre" value={form.name} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input name="position" className="form-control" placeholder="Cargo" value={form.position} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input type="date" name="fecha_ingreso" className="form-control" value={form.fecha_ingreso} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input type="number" name="salario" className="form-control" placeholder="Salario" value={form.salario} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">Agregar</button>
        </div>
      </form>


      {/* Lista */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Fecha de Ingreso</th>
            <th>Salario</th>
            {role === 'admin' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{new Date(emp.fecha_ingreso).toLocaleDateString('es-CO')}</td>
              <td>${emp.salario}</td>
              {role === 'admin' && (
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={handlePrev}>Anterior</button>
        <span>Página {page}</span>
        <button className="btn btn-outline-secondary" disabled={employees.length < limit} onClick={handleNext}>Siguiente</button>
      </div>
    </div>
  );
}
