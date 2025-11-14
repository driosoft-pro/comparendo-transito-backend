-- INSERTS DE EJEMPLO — PERSONAS


-- PERSONAS
INSERT INTO persona (tipo_doc, num_doc, nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, email, id_municipio_residencia)
VALUES
('CC', '1000123456', 'Juan', 'Pérez', '1990-05-12', 'Masculino', 'Cra 10 #12-45', '3001112233', 'juanp@example.com', 1),
('CC', '1000789456', 'Ana', 'Gómez', '1985-03-22', 'Femenino', 'Cll 8 #9-12', '3012223344', 'ana@example.com', 2),
('CC', '900123456', 'Carlos', 'López', '1975-11-02', 'Masculino', 'Av 5 # 15-10', '3023334455', 'carlos@example.com', 1);

-- INSERTS — AUTOMOTORES
INSERT INTO automotor (placa, tipo_vehiculo, marca, linea_modelo, modelo_anio, color, cilindraje, clase_servicio, id_municipio_registro)
VALUES
('ABC123', 'Automóvil', 'Chevrolet', 'Spark GT', 2018, 'Plateado', 1200, 'Particular', 1),
('XYZ987', 'Motocicleta', 'Yamaha', 'FZ16', 2020, 'Negro', 160, 'Particular', 2),
('KLM456', 'Camioneta', 'Toyota', 'Hilux', 2019, 'Blanco', 2800, 'Público', 1);

-- INSERTS — PROPIEDAD_AUTOMOTOR
INSERT INTO propiedad_automotor (id_persona, placa, fecha_inicio, es_propietario_principal, responsable_impuestos)
VALUES
(1, 'ABC123', '2018-06-01', TRUE, TRUE),
(2, 'XYZ987', '2020-01-15', TRUE, TRUE),
(3, 'KLM456', '2019-03-10', TRUE, TRUE);

-- INSERTS — INFRACCIONES (CATÁLOGO)
INSERT INTO infraccion (codigo_infraccion, descripcion, tipo_infraccion, valor_base, puntos_descuento)
VALUES
('A01', 'No detenerse en semáforo en rojo', 'Grave', 500000, 0),
('B02', 'Conducir sin licencia', 'Muy grave', 900000, 0),
('C03', 'Exceso de velocidad en zona urbana', 'Grave', 438000, 0),
('D04', 'Estacionar en lugar prohibido', 'Leve', 196000, 0),
('E05', 'Conducir bajo efectos del alcohol', 'Muy grave', 2500000, 0);



-- SECCIÓN POLICÍAS / SECRETARÍA / MUNICIPIO
--(Necesario para poder crear comparendos)


-- INSERTS — MUNICIPIO
INSERT INTO municipio (nombre_municipio, departamento, codigo_dane)
VALUES
('Cali', 'Valle del Cauca', '76001'),
('Palmira', 'Valle del Cauca', '76520');

-- INSERTS — SECRETARÍA DE TRÁNSITO
INSERT INTO secretaria_transito (nombre_secretaria, direccion, telefono, email, id_municipio)
VALUES
('Secretaría de Tránsito de Cali', 'Cll 34 #5-12', '6025551234', 'transito.cali@gov.co', 1),
('Secretaría de Tránsito de Palmira', 'Cra 15 #20-10', '6025555678', 'transito.palmira@gov.co', 2);

-- INSERTS — CARGOS POLICIALES
INSERT INTO cargo_policial (nombre_cargo, descripcion, grado)
VALUES
('Agente', 'Agente de tránsito operativo', 'A1'),
('Supervisor', 'Supervisor de agentes', 'B1');

-- INSERTS — POLICIAS
INSERT INTO policia_transito (nombres, apellidos, genero, fecha_nacimiento, fecha_vinculacion, salario, id_cargo, id_secretaria)
VALUES
('Luis', 'Martínez', 'Masculino', '1980-02-20', '2010-03-15', 2500000, 1, 1),
('Marta', 'Quintero', 'Femenino', '1988-07-10', '2015-05-12', 3200000, 2, 1);

-- INSERTS — COMPARENDO (con varias infracciones)
INSERT INTO comparendo (
    numero_comparendo, fecha_hora_registro, direccion_infraccion,
    coordenadas_gps, observaciones, estado, placa, id_infractor, id_municipio, id_policia
)
VALUES
('COMP-0001', NOW(), 'Av 6 Norte #45-10', '3.451,-76.531', 'Pasó en rojo', 'pendiente',
 'ABC123', 1, 1, 1),

('COMP-0002', NOW(), 'Cra 15 #20-55', '3.541,-76.332', 'Alta velocidad', 'pendiente',
 'XYZ987', 2, 2, 2);

9.1 COMPARENDO 1 — Infracciones múltiples
INSERT INTO comparendo_infraccion (id_comparendo, id_infraccion, valor_calculado)
VALUES
(1, 1, 500000),  -- Semáforo en rojo
(1, 2, 900000);  -- Conducir sin licencia

9.2 COMPARENDO 2
INSERT INTO comparendo_infraccion (id_comparendo, id_infraccion, valor_calculado)
VALUES
(2, 3, 438000);  -- Exceso velocidad

-- INSERTS — USUARIOS DEL SISTEMA (para JWT)

INSERT INTO usuario_sistema (username, password_hash, rol, id_policia, id_persona)
VALUES
('admin', 'sha256$374e80803afe37a6a38545bfe901580f$a478b8378309a3bf11b1239d15f7ca30c6e851f76a8cc2bf831fb549bd167245', 'admin', NULL, NULL),
('policia1', 'sha256$cc07d7749c5c3eeb07c7523ac449ec75$489e51ae8c2b1e609cefaba861d1eb953469e5bbdc49b92a51792ee880cb8b7a', 'policia', 1, NULL),
('ciudadano1', 'sha256$61a50a868d6d45168026cce3685efe77$aaedf4f10cf6041486a1790a4520c5017439ffdc841de5b7c86ed301833478bb', 'ciudadano', NULL, 1);


-- CONSULTAS útiles de Supabase / PostgreSQL
-- Obtener comparendos con todas sus infracciones:
SELECT 
  c.id_comparendo,
  c.numero_comparendo,
  p.nombres || ' ' || p.apellidos AS infractor,
  auto.placa,
  m.nombre_municipio,
  c.fecha_hora_registro,
  json_agg(
    json_build_object(
      'codigo', inf.codigo_infraccion,
      'descripcion', inf.descripcion,
      'valor', ci.valor_calculado
    )
  ) AS infracciones
FROM comparendo c
JOIN persona p ON p.id_persona = c.id_infractor
JOIN automotor auto ON auto.placa = c.placa
JOIN municipio m ON m.id_municipio = c.id_municipio
JOIN comparendo_infraccion ci ON ci.id_comparendo = c.id_comparendo
JOIN infraccion inf ON inf.id_infraccion = ci.id_infraccion
GROUP BY c.id_comparendo, p.id_persona, auto.placa, m.id_municipio;

-- Consulta para historial del automotor:
SELECT 
  a.placa,
  a.marca,
  a.linea_modelo,
  a.modelo_anio,
  json_agg(
    json_build_object(
      'propietario', p.nombres || ' ' || p.apellidos,
      'fecha_inicio', pa.fecha_inicio,
      'fecha_fin', pa.fecha_fin
    )
  ) AS historial_propietarios
FROM automotor a
JOIN propiedad_automotor pa ON pa.placa = a.placa
JOIN persona p ON p.id_persona = pa.id_persona
WHERE a.placa = 'ABC123'
GROUP BY a.placa;