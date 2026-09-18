import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Register({ onClose, onSwitchToLogin }) {
  const [paso, setPaso] = useState(1);
  const [especialidades, setEspecialidades] = useState([]);

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    id_rol: '1',
    id_especialidad: '',
    correo_electronico: '',
    codigo_verificacion: '',
    contraseña: '',
    codigo_seguridad: ''
  });

  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await api.get('/especialidades');
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setEspecialidades(data);
      } catch (err) {
        console.error('Error al cargar especialidades:', err);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // PASO 1: Validar Datos, Teléfono, Correo y Enviar Código
  const handlePaso1Siguiente = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (formData.id_rol === '1' && !formData.id_especialidad) {
      setMensajeError('Por favor selecciona una especialidad.');
      return;
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (formData.telefono && !phoneRegex.test(formData.telefono.trim())) {
      setMensajeError('El número celular debe tener 9 dígitos numéricos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|pe)$/i;
    if (!emailRegex.test(formData.correo_electronico)) {
      setMensajeError('El correo electrónico debe incluir "@" y terminar en ".com" o ".pe".');
      return;
    }

    setCargando(true);

    try {
      const response = await api.post('/usuarios/enviar-codigo-verificacion', {
        correo_electronico: formData.correo_electronico
      });

      setMensajeExito(response.data?.mensaje || 'Código enviado correctamente a tu correo.');
      setPaso(2);
    } catch (err) {
      console.error('Error al enviar código:', err);
      setMensajeError(err.response?.data?.mensaje || 'Correo electrónico inválido o no se pudo enviar el código.');
    } finally {
      setCargando(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setMensajeError('');
    setMensajeExito('');
    setCargando(true);

    try {
      const response = await api.post('/usuarios/enviar-codigo-verificacion', {
        correo_electronico: formData.correo_electronico
      });
      setMensajeExito(response.data?.mensaje || 'Se ha reenviado un nuevo código a tu correo.');
    } catch (err) {
      console.error('Error al reenviar código:', err);
      setMensajeError(err.response?.data?.mensaje || 'No se pudo reenviar el código.');
    } finally {
      setCargando(false);
    }
  };

  // PASO 2: Verificar Código
  const handlePaso2Verificar = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!formData.codigo_verificacion || formData.codigo_verificacion.length < 6) {
      setMensajeError('Ingresa el código completo de 6 dígitos.');
      return;
    }

    setCargando(true);

    try {
      const response = await api.post('/usuarios/verificar-codigo', {
        correo_electronico: formData.correo_electronico,
        codigo: formData.codigo_verificacion
      });

      setMensajeExito(response.data?.mensaje || 'Código verificado correctamente.');
      setPaso(3);
    } catch (err) {
      console.error('Error de verificación:', err);
      setMensajeError(err.response?.data?.mensaje || 'El código ingresado es incorrecto o ha expirado.');
    } finally {
      setCargando(false);
    }
  };

  // PASO 3: Registro Final
  const handlePaso3RegistroFinal = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(formData.contraseña)) {
      setMensajeError(
        'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, un número y un carácter especial.'
      );
      return;
    }

    setCargando(true);

    try {
      const response = await api.post('/usuarios/registro', {
        id_rol: Number(formData.id_rol),
        id_especialidad: formData.id_rol === '1' ? Number(formData.id_especialidad) : null,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        correo_electronico: formData.correo_electronico,
        contrasena: formData.contraseña,
        codigo_seguridad: formData.codigo_seguridad
      });

      alert(response.data.mensaje || 'Registro completado con éxito.');
      
      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      setMensajeError(err.response?.data?.mensaje || 'No se pudo completar el registro del usuario.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ 
      width: '90%', 
      maxWidth: '420px', 
      padding: '28px', 
      backgroundColor: '#ffffff', 
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      borderTop: '6px solid #f59e0b',
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

      <h2 style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px', color: '#0a192f' }}>
        {paso === 1 && 'Registro de Usuario'}
        {paso === 2 && 'Verificación de Correo'}
        {paso === 3 && 'Crear Contraseña'}
      </h2>
      
      {mensajeError && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' }}>
          {mensajeError}
        </div>
      )}

      {mensajeExito && (
        <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' }}>
          {mensajeExito}
        </div>
      )}

      {/* PASO 1 */}
      {paso === 1 && (
        <form onSubmit={handlePaso1Siguiente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            name="nombres" 
            placeholder="Nombres" 
            value={formData.nombres} 
            onChange={handleChange} 
            required 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', fontSize: '0.95rem', color: '#0f172a' }}
          />
          
          <input 
            type="text" 
            name="apellidos" 
            placeholder="Apellidos" 
            value={formData.apellidos} 
            onChange={handleChange} 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', fontSize: '0.95rem', color: '#0f172a' }}
          />

          <input 
            type="tel" 
            name="telefono" 
            placeholder="Número de celular (ej. 987654321)" 
            value={formData.telefono} 
            onChange={handleChange} 
            maxLength="9"
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', fontSize: '0.95rem', color: '#0f172a' }}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a' }}>Tipo de Rol:</label>
            <select 
              name="id_rol" 
              value={formData.id_rol} 
              onChange={handleChange} 
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', fontSize: '0.95rem', backgroundColor: '#fff', color: '#0f172a' }}
            >
              <option value="1">Alumno (Rol 1)</option>
              <option value="2">Administrador (Rol 2)</option>
              <option value="3">Profesor (Rol 3)</option>
            </select>
          </div>

          {formData.id_rol === '1' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a' }}>Especialidad:</label>
              <select 
                name="id_especialidad" 
                value={formData.id_especialidad} 
                onChange={handleChange} 
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #38bdf8', fontSize: '0.95rem', backgroundColor: '#fff', color: '#0f172a' }}
              >
                <option value="">-- Selecciona una especialidad --</option>
                {especialidades.map((esp) => (
                  <option key={esp.id_especialidad} value={esp.id_especialidad}>
                    {esp.nombre || esp.nombre_especialidad}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.id_rol === '2' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 'bold' }}>
                Código Clave de Administrador:
              </label>
              <input 
                type="password" 
                name="codigo_seguridad" 
                placeholder="Ingresa la clave maestra" 
                value={formData.codigo_seguridad} 
                onChange={handleChange} 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #dc2626', fontSize: '0.95rem' }}
                required 
              />
            </div>
          )}

          <input 
            type="email" 
            name="correo_electronico" 
            placeholder="Correo Electrónico (ej. usuario@gmail.com)" 
            value={formData.correo_electronico} 
            onChange={handleChange} 
            required 
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
            {cargando ? 'Enviando Código...' : 'Siguiente'}
          </button>
        </form>
      )}

      {/* PASO 2 */}
      {paso === 2 && (
        <form onSubmit={handlePaso2Verificar} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ textAlign: 'center', backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <p style={{ fontSize: '0.9rem', color: '#0369a1', margin: 0 }}>
              Enviamos un código de verificación al correo:
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0c4a6e', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
              {formData.correo_electronico}
            </p>
          </div>

          <input 
            type="text" 
            name="codigo_verificacion" 
            placeholder="Ingresa el código" 
            maxLength="6"
            value={formData.codigo_verificacion} 
            onChange={handleChange} 
            required 
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

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '6px' }}>
            <button 
              type="button" 
              onClick={() => { setPaso(1); setMensajeError(''); setMensajeExito(''); }}
              style={{ 
                flex: 1,
                padding: '8px', 
                backgroundColor: '#f1f5f9', 
                color: '#475569', 
                border: '1px solid #cbd5e1', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '0.78rem',
                fontWeight: '600'
              }}
            >
              ✏️ Regresar y editar datos
            </button>

            <button 
              type="button" 
              onClick={handleReenviarCodigo}
              disabled={cargando}
              style={{ 
                flex: 1,
                padding: '8px', 
                backgroundColor: '#f1f5f9', 
                color: '#0284c7', 
                border: '1px solid #bae6fd', 
                borderRadius: '6px', 
                cursor: cargando ? 'not-allowed' : 'pointer', 
                fontSize: '0.78rem',
                fontWeight: '600'
              }}
            >
              🔄 Volver a enviar código
            </button>
          </div>
        </form>
      )}

      {/* PASO 3 */}
      {paso === 3 && (
        <form onSubmit={handlePaso3RegistroFinal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
            Correo verificado con éxito. Ingresa tu contraseña:
          </p>

          <input 
            type="password" 
            name="contraseña" 
            placeholder="Nueva Contraseña" 
            value={formData.contraseña} 
            onChange={handleChange} 
            required 
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
            {cargando ? 'Registrando...' : 'Completar Registro'}
          </button>
        </form>
      )}

      {onSwitchToLogin && (
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#0f172a' }}>
          ¿Ya tienes cuenta?{' '}
          <span 
            onClick={onSwitchToLogin} 
            style={{ color: '#0a192f', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Iniciar Sesión
          </span>
        </div>
      )}
    </div>
  );
}