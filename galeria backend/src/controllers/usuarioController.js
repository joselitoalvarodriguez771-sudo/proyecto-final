import bcrypt from 'bcrypt';
import models from '../models/index.js';
import UsuarioModel from '../models/usuario.js';
import { 
  enviarCodigoVerificacion as enviarCorreoVerificacion, 
  enviarCodigoRecuperacion as enviarCorreoRecuperacion 
} from '../config/mailer.js'; 

const Usuario = models.Usuario || models.default?.Usuario || UsuarioModel;

// --- VERIFICACIÓN DE CORREO EN REGISTRO ---

export const enviarCodigoVerificacion = async (req, res) => {
  try {
    const { correo_electronico } = req.body;
    if (!correo_electronico) {
      return res.status(400).json({ mensaje: 'El correo electrónico es requerido.' });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    await enviarCorreoVerificacion(correo_electronico, codigo);

    return res.status(200).json({ mensaje: `Código de verificación enviado a ${correo_electronico}` });
  } catch (error) {
    console.error('Error al enviar código de verificación:', error);
    return res.status(500).json({ mensaje: 'Error interno al enviar el código.' });
  }
};

export const verificarCodigo = async (req, res) => {
  try {
    const { correo_electronico, codigo } = req.body;
    if (!correo_electronico || !codigo) {
      return res.status(400).json({ mensaje: 'El correo y el código son requeridos.' });
    }

    return res.status(200).json({ mensaje: 'Código verificado exitosamente.' });
  } catch (error) {
    console.error('Error al verificar código:', error);
    return res.status(500).json({ mensaje: 'Error interno al verificar el código.' });
  }
};

// --- RECUPERACIÓN DE CONTRASEÑA ---

export const enviarCodigoRecuperacion = async (req, res) => {
  try {
    const { correo_electronico } = req.body;
    if (!correo_electronico) {
      return res.status(400).json({ mensaje: 'El correo electrónico es requerido.' });
    }

    const usuario = await Usuario.findOne({ where: { correo_electronico: correo_electronico.trim() } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'No existe un usuario registrado con este correo.' });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    usuario.codigo_verificacion = codigo;
    usuario.codigo_expiracion = expiracion;
    await usuario.save();

    await enviarCorreoRecuperacion(correo_electronico, codigo);

    return res.status(200).json({ mensaje: `Código de recuperación enviado a: ${correo_electronico}` });
  } catch (error) {
    console.error('Error en enviarCodigoRecuperacion:', error);
    return res.status(500).json({ mensaje: 'Error interno al enviar el código de recuperación.' });
  }
};

export const verificarCodigoRecuperacion = async (req, res) => {
  try {
    const { correo_electronico, codigo } = req.body;
    if (!correo_electronico || !codigo) {
      return res.status(400).json({ mensaje: 'El correo y el código son requeridos.' });
    }

    const usuario = await Usuario.findOne({ where: { correo_electronico: correo_electronico.trim() } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    if (usuario.codigo_verificacion !== codigo) {
      return res.status(400).json({ mensaje: 'El código ingresado es incorrecto.' });
    }

    if (!usuario.codigo_expiracion || new Date() > new Date(usuario.codigo_expiracion)) {
      return res.status(400).json({ mensaje: 'El código ha expirado. Solicita uno nuevo.' });
    }

    return res.status(200).json({ mensaje: 'Código de recuperación verificado correctamente.' });
  } catch (error) {
    console.error('Error en verificarCodigoRecuperacion:', error);
    return res.status(500).json({ mensaje: 'Error interno al verificar el código.' });
  }
};

export const actualizarContrasenaRecuperacion = async (req, res) => {
  try {
    const { correo_electronico, codigo, nuevaContrasena, nuevaContraseña, password } = req.body;
    const claveNueva = (nuevaContrasena || nuevaContraseña || password || '').trim();

    if (!correo_electronico || !claveNueva) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos.' });
    }

    const usuario = await Usuario.findOne({ where: { correo_electronico: correo_electronico.trim() } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    if (codigo && usuario.codigo_verificacion !== codigo) {
      return res.status(400).json({ mensaje: 'Código inválido para esta operación.' });
    }

    const hashedPassword = await bcrypt.hash(claveNueva, 10);

    usuario.contraseña = hashedPassword;
    usuario.codigo_verificacion = null;
    usuario.codigo_expiracion = null;
    await usuario.save();

    return res.status(200).json({ mensaje: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error en actualizarContrasenaRecuperacion:', error);
    return res.status(500).json({ mensaje: 'Error interno al actualizar la contraseña.' });
  }
};

// --- AUTENTICACIÓN PÚBLICA ---

export const registrarUsuario = async (req, res) => {
  try {
    const { nombres, apellidos, correo_electronico, contrasena, contraseña, password, id_rol, id_especialidad } = req.body;
    const claveIngresada = (contrasena || contraseña || password || '').trim();
    const emailNormalizado = (correo_electronico || '').trim();
    const rolAsignado = Number(id_rol) || 1; // Por defecto rol 1 (Alumno / Estudiante)

    // Si el usuario es de rol 1 (Alumno/Estudiante) y no envía especialidad, se puede validar
    if (rolAsignado === 1 && !id_especialidad) {
      return res.status(400).json({ mensaje: 'Debe seleccionar una especialidad para registrarse.' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { correo_electronico: emailNormalizado } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya se encuentra registrado.' });
    }

    const hashedPassword = await bcrypt.hash(claveIngresada, 10);

    const nuevoUsuario = await Usuario.create({
      nombres,
      apellidos: apellidos || '',
      correo_electronico: emailNormalizado,
      contraseña: hashedPassword,
      id_rol: rolAsignado,
      id_especialidad: id_especialidad ? Number(id_especialidad) : null,
      estado: 'Activo'
    });

    return res.status(201).json({ mensaje: 'Usuario registrado con éxito.', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    return res.status(500).json({ mensaje: 'Error interno al registrar usuario.' });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { correo_electronico, contrasena, contraseña, password } = req.body;

    const emailInput = (correo_electronico || '').trim();
    const passwordInput = (contrasena || contraseña || password || '').trim();

    if (!emailInput || !passwordInput) {
      return res.status(400).json({ mensaje: 'El correo y la contraseña son requeridos.' });
    }

    const usuario = await Usuario.findOne({ 
      where: { correo_electronico: emailInput },
      include: [
        { model: models.Especialidad || models.default?.Especialidad, as: 'especialidad', attributes: ['id_especialidad', 'nombre'] }
      ]
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const dbPassword = (usuario.contraseña || usuario.contrasena || '').trim();

    const esValida = await bcrypt.compare(passwordInput, dbPassword);

    if (!esValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    if (usuario.estado !== 'Activo') {
      return res.status(403).json({ mensaje: 'Usuario inactivo. Contacta al administrador.' });
    }

    return res.status(200).json({ mensaje: 'Inicio de sesión exitoso.', usuario });
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    return res.status(500).json({ mensaje: 'Error interno al iniciar sesión.' });
  }
};

// --- GESTIÓN DE USUARIOS ---

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ 
      attributes: { exclude: ['contraseña'] },
      include: [
        { model: models.Especialidad || models.default?.Especialidad, as: 'especialidad', attributes: ['id_especialidad', 'nombre'] }
      ]
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ mensaje: 'Error al obtener usuarios.' });
  }
};

export const obtenerUsuariosInactivos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ where: { estado: 'Inactivo' } });
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios inactivos:', error);
    return res.status(500).json({ mensaje: 'Error al obtener usuarios inactivos.' });
  }
};

export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    usuario.estado = estado;
    await usuario.save();

    return res.status(200).json({ 
      mensaje: `Estado del usuario actualizado a ${estado}.`,
      usuario 
    });
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno al actualizar el estado.' });
  }
};