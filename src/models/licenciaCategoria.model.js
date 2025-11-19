import { createBaseModel } from "./baseModel.js";

const TABLE = "licencia_categoria";
const ID_COLUMN = "id_licencia_categoria";

export const LicenciaCategoriaModel = createBaseModel({
  table: TABLE,
  idColumn: ID_COLUMN,
  requiredOnCreate: ["id_licencia_conduccion", "id_categoria_licencia"],
  requiredOnUpdate: ["id_licencia_conduccion", "id_categoria_licencia"],
  requiredOnDelete: [],
  softDelete: true,
  defaultSelect: "*",
  relationsSelect: "*, licencia_conduccion(*), categoria_licencia(*)",
});

export default LicenciaCategoriaModel;
