import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Users() {
  const { role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/auth/users/${id}`);
      fetchUsers(); // recarga lista
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  useEffect(() => {
    if (role === 'admin') fetchUsers();
  }, [role]);

  if (role !== 'admin') return <p>No autorizado</p>;

  return (
    <div className="container mt-4">
      <h2>Usuarios Registrados</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== 'admin' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
