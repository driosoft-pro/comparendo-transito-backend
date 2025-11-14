import { Router } from 'express';
import authRoutes from './auth.routes.js';


// Módulo de usuarios supabse
import usuariosRoutes from './usuarios.routes.js';


const router = Router();

router.get('/ping', (req, res) => {
  res.json({
    ok: true,
    message: 'pong desde /api/ping',
  });
});

// Módulo de autenticación
router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);

export default router;


