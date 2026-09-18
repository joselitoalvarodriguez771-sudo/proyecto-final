import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onClose, onSwitchToRegister, setUsuarioGlobal }) {
  const [modo, setModo] = useState('login'); // 'login' | 'olvide'
  const [pasoOlvide, setPasoOlvide] = useState(2);

  const [credenciales, setCredenciales] = useState({ identificador: '', clave: '' });

  const [olvideData, setOlvideData] = useState({
    correo: '',
    codigo: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  });

  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleOlvideChange = (e) => {
    setOlvideData({ ...olvideData, [e.target.name]: e.target.value });
  };

  // RECUPERACIÓN DIRECTA
  const solicitarRecuperacionDirecta = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    const valorLimpio = credenciales.identificador.trim();

    if (!valorLimpio) {
      setError('Por favor, ingresa tu correo en el campo de inicio de sesión para recuperar tu contraseña.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|pe)$/i;
    if (!emailRegex.test(valorLimpio)) {
      setError('La recuperación por código requiere un correo electrónico válido.');
      return;
    }

    setCargando(true);
    try {
      const res = await api.post('/usuarios/solicitar-recuperacion', {
        correo_electronico: valorLimpio
      });

      setOlvideData((prev) => ({ ...prev, correo: valorLimpio }));
      setMensajeExito(res.data?.mensaje || `Código de verificación enviado a: ${valorLimpio}`);
      setPasoOlvide(2);
      setModo('olvide');
    } catch (err) {
      console.error('Error al solicitar recuperación:', err);
      setError(err.response?.data?.mensaje || 'No se pudo enviar el código de recuperación.');
    } finally {
      setCargando(false);
    }
  };

  // INICIO DE SESIÓN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const valorLimpio = credenciales.identificador.trim();
    const claveLimpia = credenciales.clave.trim();

    try {
      const res = await api.post('/usuarios/login', {
        identificador: valorLimpio,
        correo_electronico: valorLimpio,
        correo: valorLimpio,
        telefono: valorLimpio,
        contrasena: claveLimpia,
        contraseña: claveLimpia,
        clave: claveLimpia
      });

      const data = res.data;
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      if (setUsuarioGlobal) {
        setUsuarioGlobal(data.usuario);
      }

      if (onClose) onClose();

      const rol = Number(data.usuario.id_rol);
      if (rol === 2) {
        navigate('/admin');
      } else if (rol === 3) {
        navigate('/profesor');
      } else {
        navigate('/alumno');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      if (err.response) {
        setError(err.response.data?.mensaje || 'Credenciales incorrectas.');
      } else if (err.request) {
        setError('No se pudo conectar con el servidor backend.');
      } else {
        setError('Error al procesar la solicitud.');
      }
    } finally {
      setCargando(false);
    }
  };

  // VERIFICAR CÓDIGO
  const handleOlvidePaso2 = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    if (olvideData.codigo.trim().length < 6) {
      setError('Ingresa el código completo de 6 dígitos.');
      return;
    }

    setCargando(true);
    try {
      const res = await api.post('/usuarios/verificar-recuperacion', {
        correo_electronico: olvideData.correo.trim(),
        codigo: olvideData.codigo.trim()
      });

      setMensajeExito(res.data?.mensaje || 'Código verificado correctamente.');
      setPasoOlvide(3);
    } catch (err) {
      console.error('Error al verificar código:', err);
      setError(err.response?.data?.mensaje || 'Código incorrecto o expirado.');
    } finally {
      setCargando(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setError('');
    setMensajeExito('');
    setCargando(true);
    try {
      const res = await api.post('/usuarios/solicitar-recuperacion', {
        correo_electronico: olvideData.correo.trim()
      });
      setMensajeExito(res.data?.mensaje || 'Se ha reenviado un nuevo código a tu correo.');
    } catch (err) {
      console.error('Error al reenviar código:', err);
      setError(err.response?.data?.mensaje || 'No se pudo reenviar el código.');
    } finally {
      setCargando(false);
    }
  };

  // ACTUALIZAR CONTRASEÑA
  const handleOlvidePaso3 = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    if (olvideData.nuevaContrasena !== olvideData.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(olvideData.nuevaContrasena)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, un número y un carácter especial.');
      return;
    }

    setCargando(true);
    try {
      await api.post('/usuarios/actualizar-password-recuperacion', {
        correo_electronico: olvideData.correo.trim(),
        codigo: olvideData.codigo.trim(),
        nuevaContrasena: olvideData.nuevaContrasena
      });

      setPasoOlvide(4);
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError(err.response?.data?.mensaje || 'No se pudo restablecer la contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '32px',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      borderTop: '6px solid #38bdf8',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {onClose && (
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            color: '#0a192f',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
      )}

      <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#0a192f' }}>
        {modo === 'login' && 'Iniciar Sesión'}
        {modo === 'olvide' && pasoOlvide === 2 && 'Verificación de Código'}
        {modo === 'olvide' && pasoOlvide === 3 && 'Restablecer Contraseña'}
        {modo === 'olvide' && pasoOlvide === 4 && '¡Contraseña Actualizada!'}
      </h2>
      
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {mensajeExito && (
        <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '6px', marginBottom: '15px', fontSize: '0.875rem' }}>
          {mensajeExito}
        </div>
      )}

      {/* VISTA LOGIN */}
      {modo === 'login' && (
        <>
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                Correo o Celular
              </label>
              <input 
                type="text" 
                name="identificador" 
                required 
                value={credenciales.identificador} 
                onChange={handleLoginChange} 
                placeholder="ejemplo@correo.com o 987654321"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', boxSizing: 'border-box', fontSize: '0.95rem', color: '#0f172a' }} 
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                Contraseña
              </label>
              <input 
                type="password" 
                name="clave" 
                required 
                value={credenciales.clave} 
                onChange={handleLoginChange} 
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', boxSizing: 'border-box', fontSize: '0.95rem', color: '#0f172a' }} 
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <a 
                href="#" 
                onClick={solicitarRecuperacionDirecta}
                style={{ fontSize: '0.85rem', color: '#0a192f', textDecoration: 'underline' }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={cargando}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: cargando ? '#fcd34d' : '#f59e0b', 
                color: '#0a192f', 
                border: 'none', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: cargando ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              {cargando ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>

          {onSwitchToRegister && (
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#0f172a' }}>
              ¿No tienes cuenta?{' '}
              <span 
                onClick={onSwitchToRegister} 
                style={{ color: '#0a192f', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Registrarse
              </span>
            </div>
          )}
        </>
      )}

      {/* VISTA OLVIDÉ CONTRASEÑA */}
      {modo === 'olvide' && (
        <>
          {pasoOlvide === 2 && (
            <form onSubmit={handleOlvidePaso2} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ textAlign: 'center', backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <p style={{ fontSize: '0.9rem', color: '#0369a1', margin: 0 }}>
                  Enviamos un código de verificación al correo:
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0c4a6e', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
                  {olvideData.correo}
                </p>
              </div>

              <input 
                type="text" 
                name="codigo" 
                placeholder="Ingresa el código" 
                maxLength="6"
                value={olvideData.codigo} 
                onChange={handleOlvideChange} 
                required 
                disabled={cargando}
                style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid #38bdf8', 
                  fontSize: '1.2rem', 
                  textAlign: 'center',
                  letterSpacing: '4px',
                  fontWeight: 'bold',
                  color: '#0f172a' 
                }}
              />

              <button 
                type="submit" 
                disabled={cargando}
                style={{ 
                  padding: '12px', 
                  backgroundColor: cargando ? '#fcd34d' : '#f59e0b', 
                  color: '#0a192f', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: cargando ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                {cargando ? 'Verificando...' : 'Verificar Código'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <button 
                  type="button" 
                  disabled={cargando}
                  onClick={handleReenviarCodigo}
                  style={{ 
                    width: '100%',
                    padding: '8px', 
                    backgroundColor: '#f1f5f9', 
                    color: '#0284c7', 
                    border: '1px solid #bae6fd', 
                    borderRadius: '6px', 
                    cursor: cargando ? 'not-allowed' : 'pointer', 
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  🔄 Reenviar código
                </button>
              </div>
            </form>
          )}

          {pasoOlvide === 3 && (
            <form onSubmit={handleOlvidePaso3} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                Crea una nueva contraseña segura para tu cuenta.
              </p>

              <input 
                type="password" 
                name="nuevaContrasena" 
                placeholder="Nueva Contraseña" 
                value={olvideData.nuevaContrasena} 
                onChange={handleOlvideChange} 
                required 
                disabled={cargando}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', fontSize: '0.95rem', color: '#0f172a' }}
              />

              <input 
                type="password" 
                name="confirmarContrasena" 
                placeholder="Confirmar Nueva Contraseña" 
                value={olvideData.confirmarContrasena} 
                onChange={handleOlvideChange} 
                required 
                disabled={cargando}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', fontSize: '0.95rem', color: '#0f172a' }}
              />

              <button 
                type="submit" 
                disabled={cargando}
                style={{ 
                  padding: '12px', 
                  backgroundColor: cargando ? '#fcd34d' : '#f59e0b', 
                  color: '#0a192f', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: cargando ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginTop: '8px'
                }}
              >
                {cargando ? 'Actualizando...' : 'Restablecer Contraseña'}
              </button>
            </form>
          )}

          {pasoOlvide === 4 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>
                ¡Tu contraseña ha sido restablecida correctamente!
              </p>
              <button 
                type="button" 
                onClick={() => { setModo('login'); setPasoOlvide(2); setOlvideData({ correo: '', codigo: '', nuevaContrasena: '', confirmarContrasena: '' }); }}
                style={{ 
                  padding: '12px', 
                  backgroundColor: '#f59e0b', 
                  color: '#0a192f', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}