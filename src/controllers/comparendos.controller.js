import { ROLES, hasPermission, PERMISOS } from '../middlewares/auth.middleware.js';

/**
 * GET /api/comparendos
 * Lista comparendos según permisos del usuario
 */
export const getComparendos = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;
    const { limit = 50, offset = 0, estado } = req.query;

    let query = {};
    
    // Filtrar según rol
    if (hasPermission(rol, PERMISOS.COMPARENDO_READ_ALL)) {
      // Admin, supervisor, operador, auditor: ven todos
      if (estado) query.estado = estado;
    } 
    else if (hasPermission(rol, PERMISOS.COMPARENDO_READ)) {
      // Policías ven sus propios comparendos
      if (rol === ROLES.POLICIA) {
        query.id_policia_transito = id_usuario;
      }
      // Ciudadanos ven comparendos donde ellos son la persona
      else if (rol === ROLES.CIUDADANO) {
        query.id_persona = id_usuario;
      }
    }

    // Aquí irá tu consulta a Supabase
    // const comparendos = await ComparendoModel.findAll(query, limit, offset);

    return res.json({
      ok: true,
      total: 0, // comparendos.length
      comparendos: [],
      permisos: {
        puede_crear: hasPermission(rol, PERMISOS.COMPARENDO_CREATE),
        puede_anular: hasPermission(rol, PERMISOS.COMPARENDO_ANULAR),
      }
    });

  } catch (error) {
    console.error('Error obteniendo comparendos:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener comparendos'
    });
  }
};

/**
 * POST /api/comparendos
 * Crea un nuevo comparendo
 */
export const createComparendo = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;
    const datos = req.body;

    // Validaciones básicas
    if (!datos.placa || !datos.infracciones) {
      return res.status(400).json({
        ok: false,
        message: 'Placa e infracciones son requeridos'
      });
    }

    // Asignar el policía que crea el comparendo
    datos.id_policia_transito = id_usuario;
    datos.estado = 'PENDIENTE';

    // Aquí irá tu lógica de creación
    // const nuevoComparendo = await ComparendoModel.create(datos);

    return res.status(201).json({
      ok: true,
      message: 'Comparendo creado exitosamente',
      comparendo: null // nuevoComparendo
    });

  } catch (error) {
    console.error('Error creando comparendo:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al crear comparendo'
    });
  }
};

/**
 * GET /api/comparendos/:id
 * Obtiene un comparendo específico
 */
export const getComparendoById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario } = req.user;

    // Aquí irá tu consulta
    // const comparendo = await ComparendoModel.findById(id);

    // Verificar propiedad si es necesario
    if (rol === ROLES.CIUDADANO) {
      // if (comparendo.id_persona !== id_usuario) {
      //   return res.status(403).json({
      //     ok: false,
      //     message: 'No tienes acceso a este comparendo'
      //   });
      // }
    }

    return res.json({
      ok: true,
      comparendo: null // comparendo
    });

  } catch (error) {
    console.error('Error obteniendo comparendo:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener comparendo'
    });
  }
};

/**
 * PUT /api/comparendos/:id
 * Actualiza un comparendo
 */
export const updateComparendo = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario } = req.user;
    const datos = req.body;

    // Obtener comparendo actual
    // const comparendo = await ComparendoModel.findById(id);

    // Validaciones de negocio
    // if (comparendo.estado === 'PAGADO' && rol !== ROLES.ADMINISTRADOR) {
    //   return res.status(400).json({
    //     ok: false,
    //     message: 'No se pueden modificar comparendos pagados'
    //   });
    // }

    // Policías solo pueden actualizar sus propios comparendos
    if (rol === ROLES.POLICIA) {
      // if (comparendo.id_policia_transito !== id_usuario) {
      //   return res.status(403).json({
      //     ok: false,
      //     message: 'Solo puedes actualizar tus propios comparendos'
      //   });
      // }
    }

    // Actualizar
    // const actualizado = await ComparendoModel.update(id, datos);

    return res.json({
      ok: true,
      message: 'Comparendo actualizado correctamente',
      comparendo: null // actualizado
    });

  } catch (error) {
    console.error('Error actualizando comparendo:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar comparendo'
    });
  }
};

/**
 * POST /api/comparendos/:id/anular
 * Anula un comparendo
 */
export const anularComparendo = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    if (!motivo) {
      return res.status(400).json({
        ok: false,
        message: 'El motivo de anulación es requerido'
      });
    }

    // Obtener comparendo
    // const comparendo = await ComparendoModel.findById(id);

    // Validar que no esté ya anulado
    // if (comparendo.estado === 'ANULADO') {
    //   return res.status(400).json({
    //     ok: false,
    //     message: 'El comparendo ya está anulado'
    //   });
    // }

    // Anular
    // const anulado = await ComparendoModel.update(id, {
    //   estado: 'ANULADO',
    //   observaciones: motivo
    // });

    return res.json({
      ok: true,
      message: 'Comparendo anulado correctamente',
      comparendo: null // anulado
    });

  } catch (error) {
    console.error('Error anulando comparendo:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al anular comparendo'
    });
  }
};

/**
 * DELETE /api/comparendos/:id
 * Elimina un comparendo (solo admin)
 */
export const deleteComparendo = async (req, res) => {
  try {
    const { id } = req.params;

    // await ComparendoModel.delete(id);

    return res.json({
      ok: true,
      message: 'Comparendo eliminado correctamente'
    });

  } catch (error) {
    console.error('Error eliminando comparendo:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar comparendo'
    });
  }
};