
import { verifyToken } from '../config/jwt.js';

// Sistema de Control de Acceso Basado en Roles (RBAC)

// ROLES Y PERMISOS
export const ROLES = {
  ADMINISTRADOR: 'administrador',
  POLICIA: 'policia_transito',
  SUPERVISOR: 'supervisor',
  OPERADOR: 'operador',
  AUDITOR: 'auditor',
  CIUDADANO: 'ciudadano',
};

// Permisos por recurso
export const PERMISOS = {
  // COMPARENDOS
  COMPARENDO_CREATE: 'comparendo:create',
  COMPARENDO_READ: 'comparendo:read',
  COMPARENDO_READ_ALL: 'comparendo:read_all',
  COMPARENDO_UPDATE: 'comparendo:update',
  COMPARENDO_DELETE: 'comparendo:delete',
  COMPARENDO_ANULAR: 'comparendo:anular',
  
  // USUARIOS
  USUARIO_CREATE: 'usuario:create',
  USUARIO_READ: 'usuario:read',
  USUARIO_READ_ALL: 'usuario:read_all',
  USUARIO_UPDATE: 'usuario:update',
  USUARIO_DELETE: 'usuario:delete',
  
  // PERSONAS
  PERSONA_CREATE: 'persona:create',
  PERSONA_READ: 'persona:read',
  PERSONA_UPDATE: 'persona:update',
  PERSONA_DELETE: 'persona:delete',
  
  // VEHÍCULOS
  VEHICULO_CREATE: 'vehiculo:create',
  VEHICULO_READ: 'vehiculo:read',
  VEHICULO_UPDATE: 'vehiculo:update',
  VEHICULO_DELETE: 'vehiculo:delete',
  
  // QUEJAS
  QUEJA_CREATE: 'queja:create',
  QUEJA_READ: 'queja:read',
  QUEJA_READ_ALL: 'queja:read_all',
  QUEJA_UPDATE: 'queja:update',
  QUEJA_RESOLVE: 'queja:resolve',
  
  // REPORTES
  REPORTE_CREATE: 'reporte:create',
  REPORTE_READ: 'reporte:read',
  REPORTE_FINANCIERO: 'reporte:financiero',
  
  // AUDITORÍA
  AUDITORIA_READ: 'auditoria:read',
  AUDITORIA_READ_ALL: 'auditoria:read_all',
  
  // INFRACCIONES
  INFRACCION_CREATE: 'infraccion:create',
  INFRACCION_UPDATE: 'infraccion:update',
  INFRACCION_DELETE: 'infraccion:delete',
};

// Matriz de permisos por rol
const PERMISOS_POR_ROL = {
  [ROLES.ADMINISTRADOR]: [
    // Todos los permisos
    ...Object.values(PERMISOS),
  ],
  
  [ROLES.POLICIA]: [
    // Comparendos
    PERMISOS.COMPARENDO_CREATE,
    PERMISOS.COMPARENDO_READ,
    PERMISOS.COMPARENDO_UPDATE, // Solo sus propios comparendos
    
    // Personas (consulta)
    PERMISOS.PERSONA_READ,
    
    // Vehículos (consulta)
    PERMISOS.VEHICULO_READ,
    
    // Quejas (puede ver las que le hicieron)
    PERMISOS.QUEJA_READ,
    
    // Reportes básicos
    PERMISOS.REPORTE_READ,
  ],
  
  [ROLES.SUPERVISOR]: [
    // Comparendos
    PERMISOS.COMPARENDO_READ_ALL,
    PERMISOS.COMPARENDO_UPDATE,
    PERMISOS.COMPARENDO_ANULAR,
    
    // Usuarios (consulta)
    PERMISOS.USUARIO_READ_ALL,
    
    // Personas
    PERMISOS.PERSONA_READ,
    PERMISOS.PERSONA_UPDATE,
    
    // Vehículos
    PERMISOS.VEHICULO_READ,
    PERMISOS.VEHICULO_UPDATE,
    
    // Quejas
    PERMISOS.QUEJA_READ_ALL,
    PERMISOS.QUEJA_UPDATE,
    PERMISOS.QUEJA_RESOLVE,
    
    // Reportes
    PERMISOS.REPORTE_CREATE,
    PERMISOS.REPORTE_READ,
    
    // Auditoría
    PERMISOS.AUDITORIA_READ,
  ],
  
  [ROLES.OPERADOR]: [
    // Comparendos
    PERMISOS.COMPARENDO_READ_ALL,
    PERMISOS.COMPARENDO_UPDATE,
    
    // Personas
    PERMISOS.PERSONA_CREATE,
    PERMISOS.PERSONA_READ,
    PERMISOS.PERSONA_UPDATE,
    
    // Vehículos
    PERMISOS.VEHICULO_CREATE,
    PERMISOS.VEHICULO_READ,
    PERMISOS.VEHICULO_UPDATE,
    
    // Quejas (consulta)
    PERMISOS.QUEJA_READ_ALL,
    
    // Reportes
    PERMISOS.REPORTE_READ,
  ],
  
  [ROLES.AUDITOR]: [
    // Comparendos (solo lectura)
    PERMISOS.COMPARENDO_READ_ALL,
    
    // Usuarios (consulta)
    PERMISOS.USUARIO_READ_ALL,
    
    // Quejas
    PERMISOS.QUEJA_READ_ALL,
    PERMISOS.QUEJA_UPDATE,
    PERMISOS.QUEJA_RESOLVE,
    
    // Reportes
    PERMISOS.REPORTE_CREATE,
    PERMISOS.REPORTE_READ,
    PERMISOS.REPORTE_FINANCIERO,
    
    // Auditoría
    PERMISOS.AUDITORIA_READ_ALL,
  ],
  
  [ROLES.CIUDADANO]: [
    // Comparendos (solo los suyos)
    PERMISOS.COMPARENDO_READ,
    
    // Personas (solo su info)
    PERMISOS.PERSONA_READ,
    PERMISOS.PERSONA_UPDATE, // Solo sus propios datos
    
    // Vehículos (solo los suyos)
    PERMISOS.VEHICULO_READ,
    
    // Quejas
    PERMISOS.QUEJA_CREATE,
    PERMISOS.QUEJA_READ, // Solo las que él creó
  ],
};

// MIDDLEWARE DE AUTENTICACIÓN
/**
 * Middleware que verifica si el token es válido
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({
        ok: false,
        message: 'Token no proporcionado o formato inválido',
      });
    }

    const payload = verifyToken(token);
    req.user = payload; // { id_usuario, username, rol }

    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error.message);
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado',
    });
  }
};

// MIDDLEWARE DE AUTORIZACIÓN POR ROL
/**
 * Middleware que verifica si el usuario tiene uno de los roles permitidos
 * @param {...string} rolesPermitidos - Roles que pueden acceder
 * @example requireRole(ROLES.ADMINISTRADOR, ROLES.SUPERVISOR)
 */
export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autenticado',
      });
    }

    const { rol } = req.user;

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para acceder a este recurso',
        requiredRoles: rolesPermitidos,
        userRole: rol,
      });
    }

    next();
  };
};

// MIDDLEWARE DE AUTORIZACIÓN POR PERMISO
/**
 * Middleware que verifica si el usuario tiene un permiso específico
 * @param {string} permiso - Permiso requerido (ej: PERMISOS.COMPARENDO_CREATE)
 */
export const requirePermission = (permiso) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autenticado',
      });
    }

    const { rol } = req.user;
    const permisosDelRol = PERMISOS_POR_ROL[rol] || [];

    if (!permisosDelRol.includes(permiso)) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredPermission: permiso,
        userRole: rol,
      });
    }

    next();
  };
};

/**
 * Middleware que verifica si el usuario tiene AL MENOS UNO de los permisos
 * @param {...string} permisos - Lista de permisos permitidos
 */
export const requireAnyPermission = (...permisos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autenticado',
      });
    }

    const { rol } = req.user;
    const permisosDelRol = PERMISOS_POR_ROL[rol] || [];

    const tieneAlgunPermiso = permisos.some(permiso => 
      permisosDelRol.includes(permiso)
    );

    if (!tieneAlgunPermiso) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredPermissions: permisos,
        userRole: rol,
      });
    }

    next();
  };
};

/**
 * Middleware que verifica si el usuario tiene TODOS los permisos
 * @param {...string} permisos - Lista de permisos requeridos
 */
export const requireAllPermissions = (...permisos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autenticado',
      });
    }

    const { rol } = req.user;
    const permisosDelRol = PERMISOS_POR_ROL[rol] || [];

    const tieneTodosLosPermisos = permisos.every(permiso => 
      permisosDelRol.includes(permiso)
    );

    if (!tieneTodosLosPermisos) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes todos los permisos necesarios',
        requiredPermissions: permisos,
        userRole: rol,
      });
    }

    next();
  };
};

// MIDDLEWARE DE VERIFICACIÓN DE PROPIEDAD
/**
 * Middleware que verifica si el usuario es el dueño del recurso
 * Solo aplica para ciudadanos que intentan acceder a sus propios datos
 */
export const requireOwnership = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autenticado',
      });
    }

    const { rol, id_usuario } = req.user;

    // Los administradores y supervisores pueden acceder a todo
    if ([ROLES.ADMINISTRADOR, ROLES.SUPERVISOR, ROLES.AUDITOR].includes(rol)) {
      return next();
    }

    // Para ciudadanos, verificar que sea el dueño
    const resourceId = req.params[resourceIdParam] || req.query[resourceIdParam];
    
    // Si no hay ID en la ruta, permitir (se validará en el controlador)
    if (!resourceId) {
      return next();
    }

    // Verificar propiedad (esto debe complementarse en el controlador)
    req.checkOwnership = true;
    req.ownerId = id_usuario;

    next();
  };
};

// HELPERS
/**
 * Verifica si un usuario tiene un permiso específico
 * @param {string} rol - Rol del usuario
 * @param {string} permiso - Permiso a verificar
 * @returns {boolean}
 */
export const hasPermission = (rol, permiso) => {
  const permisosDelRol = PERMISOS_POR_ROL[rol] || [];
  return permisosDelRol.includes(permiso);
};

/**
 * Obtiene todos los permisos de un rol
 * @param {string} rol - Rol del usuario
 * @returns {string[]}
 */
export const getPermissionsByRole = (rol) => {
  return PERMISOS_POR_ROL[rol] || [];
};

/**
 * Verifica si un rol puede acceder a un recurso
 * @param {string} rol - Rol del usuario
 * @param {string} recurso - Recurso (ej: 'comparendo')
 * @param {string} accion - Acción (ej: 'create', 'read', 'update', 'delete')
 * @returns {boolean}
 */
export const canAccess = (rol, recurso, accion) => {
  const permiso = `${recurso}:${accion}`;
  return hasPermission(rol, permiso);
};

// SHORTCUTS DE MIDDLEWARES COMUNES
// Solo administradores
export const isAdmin = requireRole(ROLES.ADMINISTRADOR);

// Administradores o supervisores
export const isAdminOrSupervisor = requireRole(
  ROLES.ADMINISTRADOR, 
  ROLES.SUPERVISOR
);

// Personal de tránsito (policías, supervisores, administradores)
export const isTrafficStaff = requireRole(
  ROLES.ADMINISTRADOR,
  ROLES.SUPERVISOR,
  ROLES.POLICIA
);

// Personal operativo (operadores, administradores, supervisores)
export const isOperationalStaff = requireRole(
  ROLES.ADMINISTRADOR,
  ROLES.SUPERVISOR,
  ROLES.OPERADOR
);

// Personal de control (auditores, administradores)
export const isControlStaff = requireRole(
  ROLES.ADMINISTRADOR,
  ROLES.AUDITOR
);

// MIDDLEWARE DE LOGGING DE PERMISOS (para debug)
/**
 * Middleware para loguear los permisos del usuario (solo desarrollo)
 */
export const logPermissions = (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && req.user) {
    const { rol, username } = req.user;
    const permisos = getPermissionsByRole(rol);
    console.log('\n--- DEBUG PERMISOS ---');
    console.log(`Usuario: ${username}`);
    console.log(`Rol: ${rol}`);
    console.log(`Permisos (${permisos.length}):`, permisos);
    console.log('----------------------\n');
  }
  next();
};

// EXPORTAR TODO
export default {
  ROLES,
  PERMISOS,
  authMiddleware,
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireOwnership,
  hasPermission,
  getPermissionsByRole,
  canAccess,
  isAdmin,
  isAdminOrSupervisor,
  isTrafficStaff,
  isOperationalStaff,
  isControlStaff,
  logPermissions,
};