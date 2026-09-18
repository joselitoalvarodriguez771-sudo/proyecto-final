import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfesorDashboard() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('evaluar');
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  const [perfilDocente] = useState({
    nombres: 'Prof. Carlos Mendoza',
    correo: 'cmendoza@esfap.edu.pe',
    especialidad: 'Artes Visuales',
    cargo: 'Docente Nombrado'
  });

  const [evaluacionForm, setEvaluacionForm] = useState({
    nota: '',
    observacion: ''
  });

  const [obras, setObras] = useState([
    {
      id_obra: 102,
      estudiante: 'Joselito Rodríguez',
      ciclo: 'V',
      titulo: 'Retrato de Expresión',
      descripcion: 'Boceto rápido a carbón sobre fondo de textura gruesa.',
      tecnica: 'Carboncillo sobre papel',
      dimensiones: '40x50 cm',
      anio_creacion: 2026,
      imagen_url: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=600&auto=format&fit=crop',
      estado_publicacion: 'Pendiente',
      fecha_subida: '2026-05-02',
      nota: null,
      observacion: ''
    },
    {
      id_obra: 103,
      estudiante: 'María Fernández',
      ciclo: 'VII',
      titulo: 'Luz Arequipeña',
      descripcion: 'Captura de sombras en arquitectura colonial.',
      tecnica: 'Acuarela',
      dimensiones: '30x40 cm',
      anio_creacion: 2026,
      imagen_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
      estado_publicacion: 'Pendiente',
      fecha_subida: '2026-05-04',
      nota: null,
      observacion: ''
    },
    {
      id_obra: 101,
      estudiante: 'Joselito Rodríguez',
      ciclo: 'V',
      titulo: 'Crepúsculo en la Galería',
      descripcion: 'Estudio de luz sobre lienzo.',
      tecnica: 'Óleo sobre lienzo',
      dimensiones: '60x80 cm',
      anio_creacion: 2026,
      imagen_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
      estado_publicacion: 'Aprobado',
      fecha_subida: '2026-04-10',
      nota: 18,
      observacion: 'Excelente manejo del claroscuro y contraste.'
    }
  ]);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  const handleConfirmarCerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleAbrirEvaluacion = (obra) => {
    setObraSeleccionada(obra);
    setEvaluacionForm({
      nota: obra.nota || '',
      observacion: obra.observacion || ''
    });
  };

  const handleProcesarEvaluacion = (nuevoEstado) => {
    if (!evaluacionForm.nota && nuevoEstado === 'Aprobado') {
      alert('Por favor ingrese una nota antes de aprobar.');
      return;
    }

    setObras(obras.map(item => {
      if (item.id_obra === obraSeleccionada.id_obra) {
        return {
          ...item,
          estado_publicacion: nuevoEstado,
          nota: evaluacionForm.nota ? Number(evaluacionForm.nota) : null,
          observacion: evaluacionForm.observacion
        };
      }
      return item;
    }));

    setObraSeleccionada(null);
  };

  const obrasPendientes = obras.filter(o => o.estado_publicacion === 'Pendiente');
  const obrasEvaluadas = obras.filter(o => o.estado_publicacion !== 'Pendiente');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#f8fafc', position: 'relative' }}>
      
      {/* SIDEBAR PROFESOR */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0a192f',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{
            background: '#10b981',
            color: '#ffffff',
            padding: '6px 10px',
            borderRadius: '6px',
            fontWeight: '900',
            fontSize: '1.1rem'
          }}>
            MUA
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ffffff' }}>PANEL DOCENTE</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600' }}>{perfilDocente.especialidad}</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {[
            { id: 'evaluar', label: `📋 Obras por Evaluar (${obrasPendientes.length})` },
            { id: 'historial', label: '📊 Historial y Notas' },
            { id: 'perfil', label: '👤 Perfil Docente' }
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
                color: seccionActiva === item.id ? '#34d399' : '#cbd5e1',
                fontWeight: seccionActiva === item.id ? '700' : '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CERRAR SESIÓN */}
        <button
          onClick={() => setMostrarModalCerrarSesion(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
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
        
        {/* HEADER LIMPIO (SIN VISTA PREVIA) */}
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
            {seccionActiva === 'evaluar' && 'Evaluación y Calificación de Obras'}
            {seccionActiva === 'historial' && 'Historial de Obras Procesadas'}
            {seccionActiva === 'perfil' && 'Información del Docente'}
          </h1>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#475569' }}>
              Docente: <strong style={{ color: '#0f172a' }}>{perfilDocente.nombres}</strong>
            </span>
          </div>
        </header>

        {/* ÁREA DE TRABAJO */}
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>

          {/* OBRAS PENDIENTES */}
          {seccionActiva === 'evaluar' && (
            <>
              {obrasPendientes.length === 0 ? (
                <div style={{ backgroundColor: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#334155' }}>
                  🎉 No hay obras pendientes de revisión para la especialidad de <strong>{perfilDocente.especialidad}</strong>.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {obrasPendientes.map(obra => (
                    <div key={obra.id_obra} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '200px', backgroundColor: '#cbd5e1', position: 'relative' }}>
                        <img src={obra.imagen_url} alt={obra.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', backgroundColor: '#854d0e', color: '#ffffff' }}>
                          Pendiente
                        </span>
                      </div>
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: '800', marginBottom: '4px' }}>
                            Estudiante: {obra.estudiante} (Ciclo {obra.ciclo})
                          </div>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#0f172a' }}>{obra.titulo}</h3>
                          <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#334155' }}>{obra.descripcion}</p>
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '16px' }}>
                            <strong>Técnica:</strong> {obra.tecnica} | <strong>Dim.:</strong> {obra.dimensiones}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAbrirEvaluacion(obra)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️ Calificar y Revisar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* HISTORIAL */}
          {seccionActiva === 'historial' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0a192f', color: '#ffffff' }}>
                    <th style={{ padding: '16px' }}>Estudiante</th>
                    <th style={{ padding: '16px' }}>Título Obra</th>
                    <th style={{ padding: '16px' }}>Técnica</th>
                    <th style={{ padding: '16px' }}>Estado</th>
                    <th style={{ padding: '16px' }}>Nota</th>
                    <th style={{ padding: '16px' }}>Observación</th>
                    <th style={{ padding: '16px' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {obrasEvaluadas.map(obra => (
                    <tr key={obra.id_obra} style={{ borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>
                      <td style={{ padding: '16px', fontWeight: '700' }}>{obra.estudiante}</td>
                      <td style={{ padding: '16px' }}>{obra.titulo}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>{obra.tecnica}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          backgroundColor: obra.estado_publicacion === 'Aprobado' ? '#166534' : '#991b1b',
                          color: '#ffffff'
                        }}>
                          {obra.estado_publicacion}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontWeight: '800', color: obra.nota >= 11 ? '#166534' : '#991b1b' }}>
                        {obra.nota !== null ? obra.nota : '-'}
                      </td>
                      <td style={{ padding: '16px', color: '#334155', maxWidth: '200px' }}>{obra.observacion || 'Sin observaciones'}</td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => handleAbrirEvaluacion(obra)}
                          style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', backgroundColor: '#3b82f6', color: '#ffffff', cursor: 'pointer', fontWeight: '700' }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PERFIL DOCENTE */}
          {seccionActiva === 'perfil' && (
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #cbd5e1', maxWidth: '500px', color: '#0f172a' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>Datos del Docente</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                <div><strong>Nombres:</strong> {perfilDocente.nombres}</div>
                <div><strong>Correo:</strong> {perfilDocente.correo}</div>
                <div><strong>Especialidad Asignada:</strong> {perfilDocente.especialidad}</div>
                <div><strong>Cargo:</strong> {perfilDocente.cargo}</div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL DE EVALUACIÓN Y CALIFICACIÓN */}
      {obraSeleccionada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 25, 47, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 4000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', width: '90%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: '800' }}>
              Evaluar Obra: {obraSeleccionada.titulo}
            </h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <img src={obraSeleccionada.imagen_url} alt="" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Estudiante:</strong> {obraSeleccionada.estudiante}</div>
                <div><strong>Técnica:</strong> {obraSeleccionada.tecnica}</div>
                <div><strong>Dimensiones:</strong> {obraSeleccionada.dimensiones}</div>
                <div><strong>Año:</strong> {obraSeleccionada.anio_creacion}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#0f172a' }}>Nota (0 - 20)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={evaluacionForm.nota}
                onChange={e => setEvaluacionForm({ ...evaluacionForm, nota: e.target.value })}
                placeholder="Ej. 17"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#0f172a' }}>Observaciones / Retroalimentación</label>
              <textarea
                rows="3"
                value={evaluacionForm.observacion}
                onChange={e => setEvaluacionForm({ ...evaluacionForm, observacion: e.target.value })}
                placeholder="Ingrese sus comentarios para el alumno..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setObraSeleccionada(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleProcesarEvaluacion('Rechazado')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
              >
                Rechazar
              </button>
              <button
                onClick={() => handleProcesarEvaluacion('Aprobado')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
              >
                Aprobar y Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CERRAR SESIÓN */}
      {mostrarModalCerrarSesion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 25, 47, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>¿Cerrar sesión activa?</h3>
            <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '0.9rem' }}>Se cerrará el panel de revisión docente.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setMostrarModalCerrarSesion(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleConfirmarCerrarSesion} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}>Sí, Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}