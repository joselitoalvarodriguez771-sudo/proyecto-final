import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePublic from './pages/HomePublic';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProfesorDashboard from './pages/ProfesorDashboard';
import AlumnoDashboard from './pages/AlumnoDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal pública */}
        <Route path="/" element={<HomePublic />} />

        {/* Formularios de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Paneles privados por Rol */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
        <Route path="/alumno" element={<AlumnoDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}