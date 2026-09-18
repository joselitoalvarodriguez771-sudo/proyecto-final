import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#1e293b', color: '#fff' }}>
      <h2>Galería Digital ESFAP MUA</h2>
      <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Inicio Público</Link>
        
        {!usuario ? (
          <>
            <Link to="/login" style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>Iniciar Sesión</Link>
            <Link to="/register" style={{ padding: '8px 16px', background: '#10b981', color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>Registrarse</Link>
          </>
        ) : (
          <>
            {Number(usuario.id_rol) === 1 && <Link to="/alumno" style={{ color: '#60a5fa' }}>Panel Alumno</Link>}
            {Number(usuario.id_rol) === 2 && <Link to="/admin" style={{ color: '#f87171' }}>Panel Admin</Link>}
            {Number(usuario.id_rol) === 3 && <Link to="/profesor" style={{ color: '#34d399' }}>Panel Profesor</Link>}
            
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}