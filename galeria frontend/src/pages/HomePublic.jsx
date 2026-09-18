import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

export default function HomePublic() {
  const [usuario, setUsuario] = useState(null);
  const [modalActivo, setModalActivo] = useState(null);
  const [menuExplorar, setMenuExplorar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const navigate = useNavigate();

  const categorias = [
    { id: 'musica', nombre: 'MÚSICA', icon: '🎵' },
    { id: 'artes_visuales', nombre: 'ARTES VISUALES', icon: '🎨' },
    { id: 'pintura', nombre: 'PINTURA', icon: '🖌️' },
    { id: 'escultura', nombre: 'ESCULTURA', icon: '🗿' }
  ];

  useEffect(() => {
    // Sobrescribir estilos globales del body y root para evitar márgenes laterales externos
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.maxWidth = '100%';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';

    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.maxWidth = '100%';
      rootElement.style.width = '100%';
      rootElement.style.padding = '0';
      rootElement.style.margin = '0';
    }

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (err) {
        console.error('Error al leer el usuario del localStorage:', err);
      }
    }
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/');
  };

  const irAMiPanel = () => {
    if (!usuario) return;
    const rol = Number(usuario.id_rol);
    if (rol === 2) navigate('/admin');
    else if (rol === 3) navigate('/profesor');
    else navigate('/alumno');
  };

  return (
    <div style={{ 
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif", 
      minHeight: '100vh', 
      width: '100%',
      backgroundColor: '#f8fafc', 
      color: '#0f172a',
      position: 'relative',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      
      {/* ==================== NAVBAR PRINCIPAL FIJO ==================== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        height: '72px',
        backgroundColor: '#0a192f',
        borderBottom: '2px solid #1e293b',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        zIndex: 1000
      }}>
        {/* LOGO INSTITUCIONAL */}
        <div 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#0a192f',
            padding: '6px 12px',
            borderRadius: '8px',
            fontWeight: '900',
            fontSize: '1.3rem',
            letterSpacing: '1px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
          }}>
            MUA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px', lineHeight: 1.1 }}>
              GALERÍA DIGITAL
            </span>
            <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: '600', letterSpacing: '1px' }}>
              ESFAP MÁXIMO URQUIAGA ALFONSO
            </span>
          </div>
        </div>

        {/* NAVEGACIÓN CENTRAL */}
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', height: '100%' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#ffffff', 
              fontSize: '0.9rem', 
              fontWeight: '700', 
              letterSpacing: '1px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '6px'
            }}
          >
            INICIO
          </button>

          {/* DESPLEGABLE EXPLORAR CATEGORÍAS */}
          <div 
            onMouseEnter={() => setMenuExplorar(true)}
            onMouseLeave={() => setMenuExplorar(false)}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <button 
              style={{ 
                background: menuExplorar ? 'rgba(56, 189, 248, 0.15)' : 'none',
                border: 'none',
                color: menuExplorar ? '#38bdf8' : '#e2e8f0', 
                fontSize: '0.9rem', 
                fontWeight: '700', 
                letterSpacing: '1px',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              EXPLORAR <span style={{ fontSize: '0.75rem', transform: menuExplorar ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {menuExplorar && (
              <div style={{
                position: 'absolute',
                top: '62px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '10px',
                width: '240px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 2000
              }}>
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoriaSeleccionada(cat.nombre);
                      setMenuExplorar(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      backgroundColor: 'transparent',
                      color: '#f8fafc',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textAlign: 'left'
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nombre}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ACCIONES DE USUARIO / SESIÓN */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {usuario ? (
            <>
              <div style={{ textAlign: 'right', marginRight: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sesión iniciada</div>
                <div style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 'bold' }}>{usuario.nombres}</div>
              </div>

              <button 
                onClick={irAMiPanel}
                style={{
                  padding: '9px 18px',
                  backgroundColor: '#38bdf8',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Mi Panel
              </button>

              <button 
                onClick={handleCerrarSesion}
                style={{
                  padding: '9px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <button 
              onClick={() => setModalActivo('login')} 
              style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0a192f',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)'
              }}
            >
              REGISTRO / INICIAR SESIÓN
            </button>
          )}
        </div>
      </header>

      {/* ==================== HERO SECTION PRINCIPAL ==================== */}
      <section style={{
        marginTop: '72px',
        width: '100%',
        minHeight: '480px',
        background: 'linear-gradient(180deg, #0a192f 0%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '60px 40px',
        boxSizing: 'border-box'
      }}>
        <span style={{
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '700',
          letterSpacing: '1.5px',
          marginBottom: '20px'
        }}>
          EXPOSICIÓN ARTÍSTICA INSTITUCIONAL
        </span>

        <h1 style={{
          color: '#ffffff',
          fontSize: '2.8rem',
          fontWeight: '900',
          letterSpacing: '-0.5px',
          maxWidth: '850px',
          margin: '0 0 16px 0',
          lineHeight: '1.2'
        }}>
          Descubre la creatividad y el talento en la <span style={{ color: '#38bdf8' }}>ESFAP MUA</span>
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '1.1rem',
          maxWidth: '650px',
          margin: '0 0 32px 0',
          lineHeight: '1.6'
        }}>
          Un espacio digital concebido para exponer y difundir la producción artística y musical realizada por nuestros estudiantes y docentes.
        </p>

        {!usuario && (
          <button 
            onClick={() => setModalActivo('login')}
            style={{
              padding: '14px 32px',
              backgroundColor: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)'
            }}
          >
            Explorar Galería Digital
          </button>
        )}
      </section>

      {/* ==================== FILTROS Y CONTENIDO DE OBRAS (100% PANTALLA COMPLETA) ==================== */}
      <main style={{ width: '100%', margin: '0', padding: '60px 40px', boxSizing: 'border-box' }}>
        
        {/* ENCABEZADO DE GALERÍA Y FILTROS */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
              Colección Destacada
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
              Filtro actual: <strong style={{ color: '#0a192f' }}>{categoriaSeleccionada}</strong>
            </p>
          </div>

          {/* PÍLDORAS DE FILTRADO RÁPIDO */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCategoriaSeleccionada('Todas')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                backgroundColor: categoriaSeleccionada === 'Todas' ? '#0a192f' : '#e2e8f0',
                color: categoriaSeleccionada === 'Todas' ? '#ffffff' : '#475569'
              }}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.nombre)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  backgroundColor: categoriaSeleccionada === cat.nombre ? '#0a192f' : '#e2e8f0',
                  color: categoriaSeleccionada === cat.nombre ? '#ffffff' : '#475569'
                }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* REJILLA DE OBRAS / TARJETAS EN ANCHO COMPLETO */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '28px'
        }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                height: '240px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '0.9rem',
                fontWeight: '600',
                position: 'relative'
              }}>
                [ Muestra de Arte #{item} ]
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(10, 25, 47, 0.8)',
                  color: '#38bdf8',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  Obra ESFAP
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '700' }}>
                  Título de la Obra #{item}
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                  Autor: Estudiante de Arte
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ==================== MODAL DE AUTENTICACIÓN ==================== */}
      {modalActivo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 25, 47, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3000
        }}>
          {modalActivo === 'login' && (
            <Login 
              onClose={() => setModalActivo(null)} 
              onSwitchToRegister={() => setModalActivo('registro')} 
              setUsuarioGlobal={setUsuario}
            />
          )}

          {modalActivo === 'registro' && (
            <Register 
              onClose={() => setModalActivo(null)} 
              onSwitchToLogin={() => setModalActivo('login')} 
            />
          )}
        </div>
      )}

    </div>
  );
}