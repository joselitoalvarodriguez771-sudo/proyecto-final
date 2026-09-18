import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, updateEstadoUsuario } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('usuarios');
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);
  
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [obraHistorica, setObraHistorica] = useState({
    titulo: '',
    autor: 'Colección Institucional ESFAP',
    anio: '1995',
    categoria: 'Pintura',
    descripcion: ''
  });

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const response = await getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    cargarUsuarios();
  }, []);

  const handleConfirmarCerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleEstadoUsuario = async (id_usuario, estadoActual) => {
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await updateEstadoUsuario(id_usuario, nuevoEstado);
      setUsuarios(prev => prev.map(u => u.id_usuario === id_usuario ? { ...u, estado: nuevoEstado } : u));
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('No se pudo actualizar el estado del usuario.');
    }
  };

  const mapearNombreRol = (id_rol) => {
    switch (Number(id_rol)) {
      case 2: return 'Admin';
      case 3: return 'Profesor';
      default: return 'Alumno';
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const nombreCompleto = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase()) || 
                             u.correo_electronico.toLowerCase().includes(busqueda.toLowerCase());
    const rolNombre = mapearNombreRol(u.id_rol).toLowerCase();
    const coincideRol = filtroRol === 'todos' || rolNombre === filtroRol.toLowerCase();
    return coincideBusqueda && coincideRol;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#f1f5f9', position: 'relative' }}>
      
      {/* SIDEBAR LATERAL */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0a192f',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#0a192f',
            padding: '6px 10px',
            borderRadius: '6px',
            fontWeight: '900',
            fontSize: '1.1rem'
          }}>
            MUA
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem', letterSpacing: '0.5px' }}>PANEL CONTROL</div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Administrador ESFAP</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {[
            { id: 'resumen', label: '📊 Resumen General' },
            { id: 'usuarios', label: '👥 Gestión de Usuarios' },
            { id: 'obras', label: '🖼️ Moderación de Obras' },
            { id: 'historicas', label: '🏛️ Obras Históricas' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSeccionActiva(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: seccionActiva === item.id ? '#1e293b' : 'transparent',
                color: seccionActiva === item.id ? '#38bdf8' : '#94a3b8',
                fontWeight: seccionActiva === item.id ? '700' : '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setMostrarModalCerrarSesion(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          height: '70px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {seccionActiva === 'resumen' && 'Resumen del Sistema'}
            {seccionActiva === 'usuarios' && 'Gestión y Control de Usuarios'}
            {seccionActiva === 'obras' && 'Moderación Global de Obras'}
            {seccionActiva === 'historicas' && 'Registro de Obras Históricas / Institucionales'}
          </h1>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Sesión: <strong>Admin Principal</strong></span>
          </div>
        </header>

        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>

          {/* SECCIÓN RESUMEN */}
          {seccionActiva === 'resumen' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>Total Usuarios</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginTop: '8px' }}>{usuarios.length}</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>Usuarios Activos</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#16a34a', marginTop: '8px' }}>
                  {usuarios.filter(u => u.estado === 'Activo').length}
                </div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>Obras Publicadas</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#3b82f6', marginTop: '8px' }}>17</div>
              </div>
            </div>
          )}

          {/* SECCIÓN GESTIÓN DE USUARIOS */}
          {seccionActiva === 'usuarios' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o correo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    width: '300px',
                    fontSize: '0.9rem'
                  }}
                />

                <select 
                  value={filtroRol} 
                  onChange={(e) => setFiltroRol(e.target.value)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="todos">Todos los Roles</option>
                  <option value="admin">Administradores</option>
                  <option value="profesor">Profesores</option>
                  <option value="alumno">Alumnos</option>
                </select>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {cargando ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Cargando usuarios...</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '16px 20px' }}>Usuario</th>
                        <th style={{ padding: '16px 20px' }}>Correo</th>
                        <th style={{ padding: '16px 20px' }}>Rol</th>
                        <th style={{ padding: '16px 20px' }}>Estado</th>
                        <th style={{ padding: '16px 20px', textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map(u => {
                        const esActivo = u.estado === 'Activo';
                        const nombreRol = mapearNombreRol(u.id_rol);
                        return (
                          <tr key={u.id_usuario} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0f172a' }}>
                              {u.nombres} {u.apellidos || ''}
                            </td>
                            <td style={{ padding: '16px 20px', color: '#64748b' }}>{u.correo_electronico}</td>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                backgroundColor: nombreRol === 'Admin' ? '#dbeafe' : nombreRol === 'Profesor' ? '#dcfce7' : '#fef3c7',
                                color: nombreRol === 'Admin' ? '#1e40af' : nombreRol === 'Profesor' ? '#166534' : '#92400e'
                              }}>
                                {nombreRol}
                              </span>
                            </td>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ color: esActivo ? '#16a34a' : '#dc2626', fontWeight: '700' }}>
                                {esActivo ? '● Activo' : '○ Inactivo'}
                              </span>
                            </td>
                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                              <button
                                onClick={() => toggleEstadoUsuario(u.id_usuario, u.estado)}
                                style={{
                                  padding: '6px 14px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: esActivo ? '#fee2e2' : '#dcfce7',
                                  color: esActivo ? '#991b1b' : '#166534',
                                  fontWeight: '700',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >
                                {esActivo ? 'Desactivar' : 'Activar'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN OBRAS HISTÓRICAS */}
          {seccionActiva === 'historicas' && (
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '700px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                Registro de Archivo Histórico / Propiedad Institucional
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); alert('Obra histórica registrada correctamente'); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Título de la Obra</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Mural Fundacional ESFAP" 
                    value={obraHistorica.titulo}
                    onChange={(e) => setObraHistorica({ ...obraHistorica, titulo: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Atribución / Autor</label>
                    <input 
                      type="text" 
                      value={obraHistorica.autor}
                      onChange={(e) => setObraHistorica({ ...obraHistorica, autor: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Año estimado</label>
                    <input 
                      type="text" 
                      value={obraHistorica.anio}
                      onChange={(e) => setObraHistorica({ ...obraHistorica, anio: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  style={{ 
                    marginTop: '12px',
                    padding: '12px', 
                    backgroundColor: '#0a192f', 
                    color: '#38bdf8', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: '800', 
                    cursor: 'pointer' 
                  }}
                >
                  Guardar en Colección Histórica
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* MODAL CERRAR SESIÓN */}
      {mostrarModalCerrarSesion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 25, 47, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>
              ¿Cerrar sesión de Administrador?
            </h3>
            <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Estás a punto de cerrar la sesión activa. Se borrarán las credenciales locales de este navegador.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setMostrarModalCerrarSesion(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarCerrarSesion}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}