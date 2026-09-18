import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AlumnoDashboard() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('mis_obras'); // 'mis_obras' | 'subir_obra' | 'perfil'
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);

  // Perfil dinámico del estudiante
  const [perfil, setPerfil] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    foto_url: '',
    especialidad: 'Cargando...',
    ciclo: 'V'
  });

  // Estados para edición del perfil
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosForm, setDatosForm] = useState({ ...perfil });
  
  // Estado para modal de validación por código
  const [mostrarModalCodigo, setMostrarModalCodigo] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [errorCodigo, setErrorCodigo] = useState('');
  const [campoModificado, setCampoModificado] = useState('');

  // Lista de obras del alumno
  const [misObras, setMisObras] = useState([
    {
      id_obra: 101,
      titulo: 'Crepúsculo en la Galería',
      descripcion: 'Estudio de luz sobre lienzo.',
      anio_creacion: 2026,
      imagen_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
      estado_publicacion: 'Aprobado',
      fecha_subida: '2026-04-10'
    },
    {
      id_obra: 102,
      titulo: 'Retrato de Expresión',
      descripcion: 'Boceto rápido a carbón.',
      anio_creacion: 2026,
      imagen_url: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=600&auto=format&fit=crop',
      estado_publicacion: 'Pendiente',
      fecha_subida: '2026-05-02'
    }
  ]);

  // Formulario para subir obras
  const [nuevaObra, setNuevaObra] = useState({
    titulo: '',
    descripcion: '',
    anio_creacion: new Date().getFullYear(),
    archivo: null,
    preview_url: ''
  });

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      navigate('/');
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);
    let nombreEspecialidad = 'Sin asignar';

    if (usuario.especialidad && usuario.especialidad.nombre) {
      nombreEspecialidad = usuario.especialidad.nombre;
    }

    const datosPerfil = {
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      correo: usuario.correo_electronico || usuario.correo || '',
      telefono: usuario.telefono || usuario.celular || 'No registrado',
      foto_url: usuario.foto_url || usuario.avatar || '',
      especialidad: nombreEspecialidad,
      ciclo: usuario.ciclo || 'V'
    };

    setPerfil(datosPerfil);
    setDatosForm(datosPerfil);
  }, [navigate]);

  const handleConfirmarCerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  // Manejador de foto de perfil local
  const handleCambiarFotoPerfil = (e) => {
    const file = e.target.files[0];
    if (file) {
      const urlPreview = URL.createObjectURL(file);
      const perfilActualizado = { ...perfil, foto_url: urlPreview };
      setPerfil(perfilActualizado);
      setDatosForm(perfilActualizado);
      
      // Actualizar localStorage
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
      usuarioLocal.foto_url = urlPreview;
      localStorage.setItem('usuario', JSON.stringify(usuarioLocal));
    }
  };

  // Iniciar proceso de actualización de datos con validación
  const handleSolicitarGuardarDatos = (e) => {
    e.preventDefault();

    // Comprobar si hubo cambios en correo o teléfono
    const cambioCorreo = datosForm.correo !== perfil.correo;
    const cambioTelefono = datosForm.telefono !== perfil.telefono;
    const cambioNombres = datosForm.nombres !== perfil.nombres || datosForm.apellidos !== perfil.apellidos;

    if (!cambioCorreo && !cambioTelefono && !cambioNombres) {
      setModoEdicion(false);
      return;
    }

    // Generar código aleatorio de 6 dígitos
    const codigoSimulado = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(codigoSimulado);
    setCodigoIngresado('');
    setErrorCodigo('');
    
    let mensajeCampo = '';
    if (cambioCorreo) mensajeCampo = `al nuevo correo (${datosForm.correo})`;
    else if (cambioTelefono) mensajeCampo = `al teléfono (${datosForm.telefono})`;
    else mensajeCampo = 'a tus datos personales';

    setCampoModificado(mensajeCampo);
    setMostrarModalCodigo(true);
  };

  // Confirmar código de validación
  const handleValidarCodigo = () => {
    if (codigoIngresado.trim() === codigoGenerado) {
      // Código correcto: guardar los cambios
      setPerfil(datosForm);
      setMostrarModalCodigo(false);
      setModoEdicion(false);

      // Persistir en localStorage
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
      usuarioLocal.nombres = datosForm.nombres;
      usuarioLocal.apellidos = datosForm.apellidos;
      usuarioLocal.correo_electronico = datosForm.correo;
      usuarioLocal.telefono = datosForm.telefono;
      localStorage.setItem('usuario', JSON.stringify(usuarioLocal));

      alert('✅ ¡Datos actualizados con éxito!');
    } else {
      setErrorCodigo('Código incorrecto. Por favor verifícalo e inténtalo de nuevo.');
    }
  };

  // Manejar archivo de la obra
  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaObra(prev => ({
        ...prev,
        archivo: file,
        preview_url: URL.createObjectURL(file)
      }));
    }
  };

  // Enviar obra
  const handleSubirObra = (e) => {
    e.preventDefault();
    const obraParaGuardar = {
      id_obra: Date.now(),
      titulo: nuevaObra.titulo,
      descripcion: nuevaObra.descripcion,
      anio_creacion: nuevaObra.anio_creacion,
      imagen_url: nuevaObra.preview_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
      estado_publicacion: 'Pendiente',
      fecha_subida: new Date().toISOString().split('T')[0]
    };

    setMisObras([obraParaGuardar, ...misObras]);
    setNuevaObra({
      titulo: '',
      descripcion: '',
      anio_creacion: new Date().getFullYear(),
      archivo: null,
      preview_url: ''
    });
    setSeccionActiva('mis_obras');
  };

  const iniciales = `${perfil.nombres[0] || ''}${perfil.apellidos[0] || ''}`.toUpperCase();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#f8fafc' }}>
      
      {/* SIDEBAR */}
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
          <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a192f', padding: '6px 10px', borderRadius: '6px', fontWeight: '900', fontSize: '1.1rem' }}>
            MUA
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>PANEL ALUMNO</div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>{perfil.especialidad}</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {[
            { id: 'mis_obras', label: '🎨 Mis Obras Artísticas' },
            { id: 'subir_obra', label: '➕ Subir Nueva Obra' },
            { id: 'perfil', label: '👤 Mi Perfil Estudiantil' }
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
        
        {/* HEADER */}
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
            {seccionActiva === 'mis_obras' && 'Mis Obras Registradas'}
            {seccionActiva === 'subir_obra' && 'Publicar Nueva Obra'}
            {seccionActiva === 'perfil' && 'Perfil de Usuario'}
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Estudiante: <strong style={{ color: '#0f172a' }}>{`${perfil.nombres} ${perfil.apellidos}`}</strong>
          </div>
        </header>

        {/* ÁREA DE TRABAJO */}
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>

          {/* SECCIÓN PERFIL DE USUARIO */}
          {seccionActiva === 'perfil' && (
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
              }}>
                {/* Banner de fondo */}
                <div style={{ height: '130px', background: 'linear-gradient(135deg, #0a192f 0%, #1e3a8a 100%)' }}></div>

                {/* Contenido Perfil */}
                <div style={{ padding: '0 32px 32px 32px', textAlign: 'center', marginTop: '-60px' }}>
                  
                  {/* Foto de perfil + opción para subir nueva foto */}
                  <div style={{ display: 'inline-block', position: 'relative' }}>
                    {perfil.foto_url ? (
                      <img 
                        src={perfil.foto_url} 
                        alt="Foto de Perfil" 
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          border: '4px solid #ffffff',
                          objectFit: 'cover',
                          backgroundColor: '#f1f5f9',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '4px solid #ffffff',
                        backgroundColor: '#38bdf8',
                        color: '#0a192f',
                        fontSize: '2.2rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}>
                        {iniciales || '🎓'}
                      </div>
                    )}

                    {/* Botón Flotante para Cambiar Foto */}
                    <label style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      backgroundColor: '#0a192f',
                      color: '#ffffff',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} title="Cambiar foto de perfil">
                      📷
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCambiarFotoPerfil} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>

                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '12px 0 4px 0' }}>
                    {perfil.nombres} {perfil.apellidos}
                  </h2>
                  <p style={{ color: '#0284c7', fontWeight: '700', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                    {perfil.especialidad} — Ciclo {perfil.ciclo}
                  </p>

                  {/* Alternar entre modo vista y modo edición */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    {!modoEdicion ? (
                      <button 
                        onClick={() => { setDatosForm(perfil); setModoEdicion(true); }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#f1f5f9',
                          color: '#0f172a',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Editar Datos Personales
                      </button>
                    ) : (
                      <button 
                        onClick={() => setModoEdicion(false)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        ❌ Cancelar Edición
                      </button>
                    )}
                  </div>

                  {/* FORMULARIO DE PERFIL */}
                  <form onSubmit={handleSolicitarGuardarDatos} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Nombres y Apellidos */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>Nombres</label>
                        <input 
                          type="text" 
                          disabled={!modoEdicion}
                          value={datosForm.nombres}
                          onChange={e => setDatosForm({ ...datosForm, nombres: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: modoEdicion ? '#ffffff' : '#f8fafc', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>Apellidos</label>
                        <input 
                          type="text" 
                          disabled={!modoEdicion}
                          value={datosForm.apellidos}
                          onChange={e => setDatosForm({ ...datosForm, apellidos: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: modoEdicion ? '#ffffff' : '#f8fafc', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                        Correo Electrónico (Requiere verificación si cambia)
                      </label>
                      <input 
                        type="email" 
                        disabled={!modoEdicion}
                        value={datosForm.correo}
                        onChange={e => setDatosForm({ ...datosForm, correo: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: modoEdicion ? '#ffffff' : '#f8fafc', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                        Teléfono / Celular (Requiere verificación si cambia)
                      </label>
                      <input 
                        type="text" 
                        disabled={!modoEdicion}
                        value={datosForm.telefono}
                        onChange={e => setDatosForm({ ...datosForm, telefono: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: modoEdicion ? '#ffffff' : '#f8fafc', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Especialidad (Bloqueada) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>
                        Especialidad (🔒 Administrado por la institución)
                      </label>
                      <input 
                        type="text" 
                        disabled 
                        value={datosForm.especialidad}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Ciclo (Bloqueado) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>
                        Ciclo Académico (🔒 Administrado por la institución)
                      </label>
                      <input 
                        type="text" 
                        disabled 
                        value={`Ciclo ${datosForm.ciclo}`}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Botón de Guardar en modo edición */}
                    {modoEdicion && (
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
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        🔒 Solicitud de Actualización con Código de Verificación
                      </button>
                    )}

                  </form>
                </div>
              </div>
            </div>
          )}

          {/* OBRAS Y FORMULARIO DE SUBIDA (Igual que antes) */}
          {seccionActiva === 'mis_obras' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {misObras.map(obra => (
                <div key={obra.id_obra} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ height: '180px', backgroundColor: '#cbd5e1', position: 'relative' }}>
                    <img src={obra.imagen_url} alt={obra.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      backgroundColor: obra.estado_publicacion === 'Aprobado' ? '#dcfce7' : '#fef3c7',
                      color: obra.estado_publicacion === 'Aprobado' ? '#166534' : '#92400e'
                    }}>
                      {obra.estado_publicacion}
                    </span>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#0f172a' }}>{obra.titulo}</h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#475569' }}>{obra.descripcion}</p>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Año: {obra.anio_creacion} | Enviado: {obra.fecha_subida}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {seccionActiva === 'subir_obra' && (
            <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Detalles de la Obra Artística</h2>
              <form onSubmit={handleSubirObra} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Título de la Obra</label>
                  <input type="text" required placeholder="Ej. Sinfonía Nocturna" value={nuevaObra.titulo} onChange={e => setNuevaObra({ ...nuevaObra, titulo: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Año de Creación</label>
                  <input type="number" required min="1900" max={new Date().getFullYear()} value={nuevaObra.anio_creacion} onChange={e => setNuevaObra({ ...nuevaObra, anio_creacion: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Descripción</label>
                  <textarea rows="3" required placeholder="Escribe el concepto..." value={nuevaObra.descripcion} onChange={e => setNuevaObra({ ...nuevaObra, descripcion: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Adjuntar Imagen</label>
                  <input type="file" accept="image/*" required onChange={handleArchivoChange} style={{ width: '100%' }} />
                </div>
                <button type="submit" style={{ padding: '14px', backgroundColor: '#0a192f', color: '#38bdf8', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                  📤 Enviar obra a revisión de un docente
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* MODAL DE CÓDIGO DE VERIFICACIÓN */}
      {mostrarModalCodigo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 25, 47, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 6000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔐</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: '800' }}>
              Código de Verificación Solicitado
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4' }}>
              Hemos enviado un código de seguridad de 6 dígitos {campoModificado}.
            </p>

            {/* Simulación del código para testing */}
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px dashed #f59e0b',
              color: '#b45309',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              fontWeight: '700'
            }}>
              🔑 Código enviado (Prueba): <span style={{ fontSize: '1.1rem', letterSpacing: '2px', color: '#0f172a' }}>{codigoGenerado}</span>
            </div>

            <input 
              type="text" 
              maxLength="6"
              placeholder="000000"
              value={codigoIngresado}
              onChange={e => setCodigoIngresado(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1.25rem',
                letterSpacing: '6px',
                textAlign: 'center',
                borderRadius: '8px',
                border: '2px solid #cbd5e1',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            />

            {errorCodigo && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '12px', fontWeight: '700' }}>
                {errorCodigo}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => setMostrarModalCodigo(false)}
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
                onClick={handleValidarCodigo}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Verificar y Guardar
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
          backgroundColor: 'rgba(10, 25, 47, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 5000
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>¿Cerrar sesión activa?</h3>
            <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.9rem' }}>Estás a punto de salir de la plataforma.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setMostrarModalCerrarSesion(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleConfirmarCerrarSesion} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}>Sí, Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}