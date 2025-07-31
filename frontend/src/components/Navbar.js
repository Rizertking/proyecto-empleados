import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const {  role, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 mb-4">
      <Link className="navbar-brand" to="/">Administracion empleados</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/employees">Empleados</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/requests">Solicitudes</Link></li>
          {role === 'admin' && (
            <li className="nav-item"><Link className="nav-link" to="/register">Registrar usuario</Link></li>
          )}
          {role === 'admin' && (
          <li className="nav-item"><Link className="nav-link" to="/users">Usuarios</Link></li>
          )}
        </ul>
        {
          (role === 'empleado' || role === 'admin') && (
            
            <button className="btn btn-outline-light" onClick={logout}>Cerrar sesión</button>
          )
        }
      </div>
    </nav>
  );
}
