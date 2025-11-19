import models from "../models/index.js";
const { LicenciaCategoriaModel } = models;

/**
 * GET /api/licencia-categoria
 * Query: page, pageSize, withDeleted?
 */
export const getLicenciasCategorias = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || req.query.limit || 50);
    const withDeleted = req.query.withDeleted === "true";

    const pageResult = await LicenciaCategoriaModel.findPage({
      page,
      pageSize,
      withRelations: false,
      filters: {},
    });

    let registros = pageResult.data || [];
    if (!withDeleted) {
      registros = registros.filter(
        (r) => r.deleted_at === null || r.deleted_at === undefined
      );
    }

    return res.json({
      ok: true,
      page: pageResult.page,
      pageSize: pageResult.pageSize,
      total: pageResult.total,
      totalPages: pageResult.totalPages,
      registros,
    });
  } catch (error) {
    console.error("Error listando licencias en categorías:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error obteniendo licencias en categorías",
    });
  }
};

/**
 * GET /api/licencia-categoria/:id
 */
export const getLicenciaCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const registro = await LicenciaCategoriaModel.findById(id);
    if (!registro) {
      return res.status(404).json({
        ok: false,
        message: "Registro de licencia en categoría no encontrado",
      });
    }

    return res.json({
      ok: true,
      registro,
    });
  } catch (error) {
    console.error("Error obteniendo licencia en categoría:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error obteniendo licencia en categoría",
    });
  }
};

/**
 * POST /api/licencia-categoria
 * body: { id_licencia_conduccion, id_categoria_licencia }
 */
export const createLicenciaCategoria = async (req, res) => {
  try {
    const data = req.body || {};

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No se recibieron datos para crear el registro",
      });
    }

    const nuevoRegistro = await LicenciaCategoriaModel.create(data);

    return res.status(201).json({
      ok: true,
      message: "Registro de licencia en categoría creado correctamente",
      registro: nuevoRegistro,
    });
  } catch (error) {
    console.error("Error creando licencia en categoría:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error creando licencia en categoría",
    });
  }
};

/**
 * PUT /api/licencia-categoria/:id
 */
export const updateLicenciaCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body || {};

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No hay campos para actualizar",
      });
    }

    const actualizado = await LicenciaCategoriaModel.update(id, campos);

    return res.json({
      ok: true,
      message: "Registro actualizado correctamente",
      registro: actualizado,
    });
  } catch (error) {
    console.error("Error actualizando licencia en categoría:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error actualizando licencia en categoría",
    });
  }
};

/**
 * DELETE /api/licencia-categoria/:id
 * Soft-delete
 */
export const deleteLicenciaCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await LicenciaCategoriaModel.delete(id);

    return res.json({
      ok: true,
      message: "Registro eliminado correctamente",
      registro: eliminado,
    });
  } catch (error) {
    console.error("Error eliminando licencia en categoría:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error eliminando licencia en categoría",
    });
  }
};
