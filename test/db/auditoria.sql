db.auditorias.insertOne({
  fecha: new Date(),
  accion: "CREAR_COMPARENDO",
  endpoint: "/api/comparendos",
  metodo: "POST",
  usuario: {
    id_usuario: "1",
    username: "admin",
    rol: "admin"
  },
  ip: "190.0.0.1",
  datos_entrada: { placa: "ABC123", id_infractor: 12 },
  datos_salida: { id_comparendo: 55, estado: "pendiente" },
  exito: true,
  mensaje_error: null
});
