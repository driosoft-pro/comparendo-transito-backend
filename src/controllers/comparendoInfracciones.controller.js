import models from "../models/index.js";
const { ComparendoInfraccionModel } = models;

/**
 * GET /api/comparendo-infraccion
 * Query opcionales:
 *   - id_comparendo
 *   - id_infraccion
 *   - page, pageSize
 */
export const getComparendoInfracciones = async (req, res) => {
  try {
    const { id_comparendo, id_infraccion } = req.query;
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || req.query.limit || 50);

    const filters = {};
    if (id_comparendo) filters.id_comparendo = Number(id_comparendo);
    if (id_infraccion) filters.id_infraccion = Number(id_infraccion);

    const pageResult = await ComparendoInfraccionModel.findPage({
      page,
      pageSize,
      withRelations: false,
      filters,
    });

    return res.json({
      ok: true,
      page: pageResult.page,
      pageSize: pageResult.pageSize,
      total: pageResult.total,
      totalPages: pageResult.totalPages,
      comparendosInfracciones: pageResult.data,
    });
  } catch (error) {
    console.error("Error listando comparendo_infraccion:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error obteniendo comparendo_infraccion",
    });
  }
};

/**
 * GET /api/comparendo-infraccion/:id
 */
export const getComparendoInfraccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const registro = await ComparendoInfraccionModel.findById(id);
    if (!registro) {
      return res.status(404).json({
        ok: false,
        message: "Registro comparendo_infraccion no encontrado",
      });
    }

    return res.json({
      ok: true,
      comparendoInfraccion: registro,
    });
  } catch (error) {
    console.error("Error obteniendo comparendo_infraccion:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error obteniendo comparendo_infraccion",
    });
  }
};

/**
 * POST /api/comparendo-infraccion
 * body: { id_comparendo, id_infraccion, valor_calculado, observaciones? }
 */
export const createComparendoInfraccion = async (req, res) => {
  try {
    const { id_comparendo, id_infraccion, valor_calculado, observaciones } =
      req.body;

    const payload = {
      id_comparendo,
      id_infraccion,
      valor_calculado,
      observaciones: observaciones ?? null,
    };

    const nuevo = await ComparendoInfraccionModel.create(payload);

    return res.status(201).json({
      ok: true,
      message: "Registro comparendo_infraccion creado correctamente",
      comparendoInfraccion: nuevo,
    });
  } catch (error) {
    console.error("Error creando comparendo_infraccion:", error.message);
    // Podrías inspeccionar error.code para manejar UNIQUE (id_comparendo, id_infraccion) duplicado
    return res.status(500).json({
      ok: false,
      message: "Error creando comparendo_infraccion",
    });
  }
};

/**
 * PUT /api/comparendo-infraccion/:id
 * body: { id_comparendo?, id_infraccion?, valor_calculado?, observaciones? }
 */
export const updateComparendoInfraccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_comparendo, id_infraccion, valor_calculado, observaciones } =
      req.body;

    const campos = {};
    if (id_comparendo !== undefined) campos.id_comparendo = id_comparendo;
    if (id_infraccion !== undefined) campos.id_infraccion = id_infraccion;
    if (valor_calculado !== undefined) campos.valor_calculado = valor_calculado;
    if (observaciones !== undefined) campos.observaciones = observaciones;

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No hay campos para actualizar",
      });
    }

    const actualizado = await ComparendoInfraccionModel.update(id, campos);

    return res.json({
      ok: true,
      message: "Registro comparendo_infraccion actualizado correctamente",
      comparendoInfraccion: actualizado,
    });
  } catch (error) {
    console.error("Error actualizando comparendo_infraccion:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error actualizando comparendo_infraccion",
    });
  }
};

/**
 * DELETE /api/comparendo-infraccion/:id
 * Borrado físico (no hay soft delete en esta tabla)
 */
export const deleteComparendoInfraccion = async (req, res) => {
  try {
    const { id } = req.params;

    await ComparendoInfraccionModel.delete(id);

    return res.json({
      ok: true,
      message: "Registro comparendo_infraccion eliminado correctamente",
    });
  } catch (error) {
    console.error("Error eliminando comparendo_infraccion:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error eliminando comparendo_infraccion",
    });
  }
};
