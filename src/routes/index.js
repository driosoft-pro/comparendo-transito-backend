import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import comparendosRoutes from "./comparendos.routes.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong desde /api/ping" });
});

router.use("/auth", authRoutes);

// Rutas protegidas (requieren autenticación)
router.use("/usuarios", usuariosRoutes);
router.use("/comparendos", comparendosRoutes);

export default router;
