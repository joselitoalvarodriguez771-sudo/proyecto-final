import { Router } from 'express';
import { obtenerEspecialidades } from '../controllers/especialidadController.js';

const router = Router();

// Endpoint: GET /api/especialidades
router.get('/', obtenerEspecialidades);

export default router;