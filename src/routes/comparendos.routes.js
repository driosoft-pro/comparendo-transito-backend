import { Router } from 'express';
import {
  createComparendo,
  getComparendos,
  getComparendoById,
  updateComparendo,
  anularComparendo,
  deleteComparendo,
} from '../controllers/comparendos.controller.js';
import {
  authMiddleware,
  requirePermission,
  requireAnyPermission,
  requireOwnership,
  isAdmin,
  isTrafficStaff,
  PERMISOS,
} from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear comparendo - Solo policías, supervisores y admin
router.post('/',
  requirePermission(PERMISOS.COMPARENDO_CREATE),
  createComparendo
);

// Listar comparendos - Según permisos
router.get('/',
  requireAnyPermission(
    PERMISOS.COMPARENDO_READ_ALL,
    PERMISOS.COMPARENDO_READ
  ),
  getComparendos
);

// Ver un comparendo - Verificar propiedad si es ciudadano
router.get('/:id',
  requireAnyPermission(
    PERMISOS.COMPARENDO_READ_ALL,
    PERMISOS.COMPARENDO_READ
  ),
  requireOwnership('id'),
  getComparendoById
);

// Actualizar comparendo - Personal autorizado
router.put('/:id',
  requirePermission(PERMISOS.COMPARENDO_UPDATE),
  updateComparendo
);

// Anular comparendo - Solo supervisores y admin
router.post('/:id/anular',
  requirePermission(PERMISOS.COMPARENDO_ANULAR),
  anularComparendo
);

// Eliminar comparendo - Solo admin
router.delete('/:id',
  isAdmin,
  deleteComparendo
);

export default router;