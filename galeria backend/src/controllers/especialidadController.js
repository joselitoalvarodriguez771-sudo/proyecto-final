import models from '../models/index.js';
import EspecialidadModel from '../models/especialidad.js';

const Especialidad = models.Especialidad || models.default?.Especialidad || EspecialidadModel;

export const obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({
      attributes: ['id_especialidad', 'nombre', 'descripcion']
    });
    return res.status(200).json(especialidades);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    return res.status(500).json({ 
      mensaje: 'Error interno del servidor al obtener las especialidades.' 
    });
  }
};