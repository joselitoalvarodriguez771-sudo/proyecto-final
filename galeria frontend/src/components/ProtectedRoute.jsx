import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, rolPermitido }) {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolPermitido && Number(usuario.id_rol) !== Number(rolPermitido)) {
    return <Navigate to="/" replace />;
  }

  return children;
}