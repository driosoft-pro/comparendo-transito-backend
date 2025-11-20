import { createBaseModel } from "./baseModel.js";
import { validateRequired } from "../utils/validators.js";

const TABLE = "comparendo_infraccion";
const ID_COLUMN = "id_comparendo";

const DEFAULT_SELECT =
  "id_comparendo, id_infraccion, valor_calculado, observaciones";

const baseModel = createBaseModel({
  table: TABLE,
  idColumn: ID_COLUMN,
  requiredOnCreate: ["id_comparendo", "id_infraccion", "valor_calculado"],
  requiredOnUpdate: [],
  requiredOnDelete: [],
  softDelete: false,
  defaultSelect: DEFAULT_SELECT,
  relationsSelect:
    "id_comparendo, id_infraccion, valor_calculado, observaciones",
});

export const ComparendoInfraccionModel = {
  ...baseModel,

  validatePayload(payload, { isCreate = true } = {}) {
    if (isCreate) {
      validateRequired(payload, [
        "id_comparendo",
        "id_infraccion",
        "valor_calculado",
      ]);
    } else {
      const campos = {};
      if ("id_comparendo" in payload)
        campos.id_comparendo = payload.id_comparendo;
      if ("id_infraccion" in payload)
        campos.id_infraccion = payload.id_infraccion;
      if ("valor_calculado" in payload)
        campos.valor_calculado = payload.valor_calculado;

      if (Object.keys(campos).length > 0) {
        validateRequired(campos, [
          "id_comparendo",
          "id_infraccion",
          "valor_calculado",
        ]);
      }
    }
  },

  async create(payload, options = {}) {
    this.validatePayload(payload, { isCreate: true });
    return baseModel.create(payload, options);
  },

  async update(id, payload, options = {}) {
    this.validatePayload(payload, { isCreate: false });
    return baseModel.update(id, payload, options);
  },

  async findByComparendo(id_comparendo, { withRelations = false } = {}) {
    return baseModel.findAll({
      withRelations,
      filters: { id_comparendo },
    });
  },

  async findByInfraccion(id_infraccion, { withRelations = false } = {}) {
    return baseModel.findAll({
      withRelations,
      filters: { id_infraccion },
    });
  },
};

export default ComparendoInfraccionModel;
