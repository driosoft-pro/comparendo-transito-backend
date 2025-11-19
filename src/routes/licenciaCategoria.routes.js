import { Router } from "express";
import {
  getLicenciasCategorias,
  getLicenciaCategoriaById,
  createLicenciaCategoria,
  updateLicenciaCategoria,
  deleteLicenciaCategoria,
} from "../controllers/licenciaCategoria.controller.js";
import {
  authMiddleware,
  isAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authMiddleware);

// CRUD Licencia–Categoría
router.get("/", isAdmin, getLicenciasCategorias);
router.get("/:id", isAdmin, getLicenciaCategoriaById);
router.post("/", isAdmin, createLicenciaCategoria);
router.put("/:id", isAdmin, updateLicenciaCategoria);
router.delete("/:id", isAdmin, deleteLicenciaCategoria);

export default router;
