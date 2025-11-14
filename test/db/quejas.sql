db.quejas.insertOne({
  fecha_radicacion: new Date(),
  texto_queja: "El policía fue grosero durante el procedimiento.",
  estado: "radicada",
  medio_radicacion: "web",
  id_persona_quejosa: "123",     // id_persona en Supabase
  id_policia_denunciado: "5",    // id_policia en Supabase
  id_comparendo: "10",           // id_comparendo en Supabase
  adjuntos: [],
  creado_en: new Date(),
  actualizado_en: new Date()
});
