import { Router } from "express";
import {
  getComparendoInfracciones,
  getComparendoInfraccionById,
  createComparendoInfraccion,
  updateComparendoInfraccion,
  deleteComparendoInfraccion,
} from "../controllers/comparendoInfracciones.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// Listar
router.get("/", getComparendoInfracciones);

// Obtener por ID
router.get("/:id", getComparendoInfraccionById);

// Crear relación comparendo-infracción
router.post("/", createComparendoInfraccion);

// Actualizar
router.put("/:id", updateComparendoInfraccion);

// Eliminar
router.delete("/:id", deleteComparendoInfraccion);

export default router;
