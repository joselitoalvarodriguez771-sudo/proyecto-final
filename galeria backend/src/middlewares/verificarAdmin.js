export const verificarCodigoAdmin = (req, res, next) => {
  const { id_rol, codigo_seguridad } = req.body;

  // Si intenta registrarse como Admin (Rol 2)
  if (Number(id_rol) === 2) {
    if (!codigo_seguridad || codigo_seguridad !== 'CLAVE_ADMIN_123') {
      return res.status(403).json({ 
        mensaje: 'Acceso denegado: Código de seguridad de administrador inválido.' 
      });
    }
  }

  // Si pasa la validación, continúa hacia el controlador
  next();
};