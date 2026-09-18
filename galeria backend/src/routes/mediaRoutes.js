import { Router } from 'express';
import { 
  obtenerUrlSubida, 
  eliminarObraConMedia, 
  obtenerObrasPorEspecialidades 
} from '../controllers/mediaController.js';

const router = Router();

// Generar URL firmada de subida (al usarse app.use('/api/media', mediaRoutes) o app.use('/api', mediaRoutes))
router.post('/upload-url', obtenerUrlSubida);

// Eliminar obra y su multimedia
router.delete('/obras/:id', eliminarObraConMedia);

// Obtener obras organizadas por especialidad
router.get('/obras/por-especialidad', obtenerObrasPorEspecialidades);

export default router;