import { Router } from 'express';
import { createUsuario } from '../controllers/usuarios.controller.js';

const router = Router();

// POST /api/usuarios
router.post('/', createUsuario);

export default router;
