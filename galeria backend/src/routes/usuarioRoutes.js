import { Router } from 'express';
import { 
  registrarUsuario, 
  loginUsuario, 
  obtenerUsuarios,
  obtenerUsuariosInactivos, 
  cambiarEstadoUsuario,
  enviarCodigoVerificacion,
  verificarCodigo,
  enviarCodigoRecuperacion,
  verificarCodigoRecuperacion,
  actualizarContrasenaRecuperacion
} from '../controllers/usuarioController.js';

const router = Router();

// ==========================================
// 1. RUTAS PÚBLICAS Y AUTENTICACIÓN
// ==========================================
router.post('/login', loginUsuario);
router.post('/registro', registrarUsuario);

// Verificación de Correo (Registro)
router.post('/enviar-codigo-verificacion', enviarCodigoVerificacion);
router.post('/verificar-codigo', verificarCodigo);

// Recuperación de Contraseña
router.post('/solicitar-recuperacion', enviarCodigoRecuperacion);
router.post('/verificar-recuperacion', verificarCodigoRecuperacion);
router.post('/actualizar-password-recuperacion', actualizarContrasenaRecuperacion);

// ==========================================
// 2. RUTAS DE ADMINISTRACIÓN / CONSULTA
// ==========================================

// Rutas estáticas siempre primero para evitar conflictos de parámetros
router.get('/inactivos', obtenerUsuariosInactivos);
router.get('/', obtenerUsuarios);

// Rutas dinámicas con parámetros al final
router.put('/:id/estado', cambiarEstadoUsuario);

export default router;