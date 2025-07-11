--Nombre de la base de datos: siccee

-- Tabla de persona
CREATE TABLE persona (
  cedula VARCHAR(20) PRIMARY KEY,  
  nombre_completo VARCHAR(100),
  edad INTEGER,
  telefono VARCHAR(20),
  email VARCHAR(100),
  estado VARCHAR(50),
  municipio VARCHAR(50),
  direccion_actual VARCHAR(255), 
  tipo_persona VARCHAR(20)
);

-- Tabla de emprendimientos
CREATE TABLE emprendimientos (
  cedula_emprendedor VARCHAR(20) NOT NULL PRIMARY KEY,
  tipo_sector VARCHAR(50) NOT NULL,
  tipo_negocio VARCHAR(50) NOT NULL,
  nombre_emprendimiento VARCHAR(100) NOT NULL,
  consejo_nombre VARCHAR(100),
  comuna VARCHAR(50),
  direccion_emprendimiento VARCHAR(255) NOT NULL,
  CONSTRAINT fk_emprendimiento_emprendedor FOREIGN KEY (cedula_emprendedor) REFERENCES persona(cedula) ON DELETE CASCADE
);

-- Cuenta Bancaria
CREATE TABLE cuenta (
  cedula_titular VARCHAR (20) NOT NULL PRIMARY KEY,
  nombre_completo VARCHAR (20) NOT NULL,
  numero_cuentaVARCHAR (20) NOT NULL
)

-- Tabla de usuario
CREATE TABLE usuario (
  cedula_usuario VARCHAR(20) NOT NULL PRIMARY KEY,
  usuario VARCHAR(20) NOT NULL,
  clave VARCHAR(20) NOT NULL,
  rol VARCHAR(20) NOT NULL,
  estatus VARCHAR(20),
  CONSTRAINT fk_usuario_persona FOREIGN KEY (cedula_usuario) REFERENCES persona(cedula)
);

--TABLA DE REQUERIMIENTOS Y SOLICITUD

--TABLAS DE REQUEIMIENTOS
CREATE TABLE requerimientos (
    id_requerimientos SERIAL PRIMARY KEY,
    nombre_requerimiento VARCHAR (100)
);

CREATE TABLE requerimiento_emprendedor (
    id_req SERIAL PRIMARY KEY,
    cedula_emprendedor VARCHAR (20) NOT NULL,
    opt_requerimiento VARCHAR (1000000),
    CONSTRAINT fk_persona FOREIGN KEY (id_req) REFERENCES requerimientos(id_requerimientos),
    CONSTRAINT fk_requerimiento FOREIGN KEY (cedula_emprendedor) REFERENCES persona(cedula)
);

--TABLA DE SOLICITUD
CREATE TABLE solicitud (
  cedula_emprendedor VARCHAR(20) PRIMARY KEY,
  motivo VARCHAR (1000) NOT NULL,
  estatus VARCHAR (20),
  CONSTRAINT fk_solicitud_persona FOREIGN KEY (cedula_emprendedor) REFERENCES persona(cedula) ON DELETE CASCADE
);

--TABLA DE CLASIFICACION
CREATE TABLE clasificacion (
  id_clasificacion SERIAL PRIMARY KEY,
  sector VARCHAR(100) NOT NULL,
  negocio VARCHAR(100) NOT NULL
);



-- TABLA DE APROBACION
CREATE TABLE aprobacion (
  cedula_aprobacion VARCHAR (20) PRIMARY KEY,
  contrato VARCHAR (50) NOT NULL,
  estatus VARCHAR (10) NOT NULL,
  confirmacion_persona VARCHAR (15),
  condiciones TEXT,
  fecha_aprobacion VARCHAR (20) NOT NULL,
  CONSTRAINT fk_solicitud_persona FOREIGN KEY (cedula_aprobacion) REFERENCES persona(cedula) ON DELETE CASCADE
);

--TABLA DE FONDO
CREATE TABLE fondo (
  id_fondo SERIAL PRIMARY KEY,
  fecha VARCHAR (40),
  tipo_movimiento VARCHAR (10),
  monto VARCHAR (100),
  Saldo VARCHAR (100)
);

--TABLA DE CREDITO
CREATE TABLE credito (
  aprobacion_id SERIAL PRIMARY KEY,
  cedula_credito VARCHAR(20) NOT NULL,
  referencia VARCHAR(5) NOT NULL,
  monto_euros VARCHAR(255) NOT NULL,
  monto_bs VARCHAR(255) NOT NULL,
  diez_euros VARCHAR(255) NOT NULL,
  fecha_desde VARCHAR(15) NOT NULL,
  fecha_hasta VARCHAR(15) NOT NULL,
  estatus VARCHAR(40) NOT NULL,
  cuota VARCHAR(40) NOT NULL,
  CONSTRAINT fk_cedula FOREIGN KEY (cedula_credito) REFERENCES aprobacion(cedula_aprobacion)
);

    INSERT INTO requerimientos (nombre_requerimiento) VALUES
    ('Carta de Motivo para Solicitar Crédito'),
    ('Postulación UBCH'),
    ('Certificado de emprender juntos'),
    ('Registro Municipal'),
    ('Carta de residencia'),
    ('Copia de cédula'),
    ('RIF personal'),
    ('Fotos del emprendimiento'),
    ('RIF de emprendimiento'),
    ('Referencia bancaria');

    
INSERT INTO clasificacion (sector, negocio) VALUES
-- Sector Primario
('Agricultura', 'Cultivo de frutas'),
('Agricultura', 'Cultivo de verduras'),
('Agricultura', 'Cultivo de cereales'),
('Agricultura', 'Cultivo de flores y plantas ornamentales'),
('Agricultura', 'Cultivo de legumbres'),
('Ganadería', 'Cría de ganado vacuno'),
('Ganadería', 'Cría de aves'),
('Ganadería', 'Cría de cerdos'),
('Ganadería', 'Cría de ovinos y caprinos'),
('Ganadería', 'Apicultura'),
('Pesca', 'Acuicultura'),
('Pesca', 'Pesca comercial'),
('Pesca', 'Pesca recreativa'),
('Pesca', 'Pesca artesanal'),
('Minería', 'Extracción de minerales metálicos'),
('Minería', 'Extracción de minerales no metálicos'),
('Minería', 'Extracción de recursos energéticos'),
('Minería', 'Minería de metales preciosos'),
('Minería', 'Minería de minerales industriales'),
('Industria Manufacturera', 'Producción de alimentos y bebidas'),
('Industria Manufacturera', 'Fabricación de productos químicos'),
('Industria Manufacturera', 'Fabricación de maquinaria y equipo'),
('Industria Manufacturera', 'Producción de textiles y confección'),
('Industria Manufacturera', 'Fabricación de productos electrónicos'),
('Industria Manufacturera', 'Fabricación de muebles'),
('Industria Manufacturera', 'Producción de papel y productos de papel'),
('Industria Manufacturera', 'Fabricación de productos de plástico'),
('Construcción', 'Desarrollo de viviendas'),
('Construcción', 'Construcción de infraestructuras'),
('Construcción', 'Obras públicas'),
('Construcción', 'Renovación y rehabilitación de edificios'),
('Energía', 'Producción de energía solar'),
('Energía', 'Producción de energía eólica'),
('Energía', 'Producción de energía hidroeléctrica'),
('Energía', 'Producción de biocombustibles'),
('Energía', 'Energía geotérmica'),
('Comercio', 'Tiendas de abarrotes'),
('Comercio', 'Comercio electrónico'),
('Comercio', 'Mayoristas y minoristas'),
('Comercio', 'Comercio al por mayor'),
('Comercio', 'Comercio al por menor'),
('Transporte', 'Servicios de mensajería'),
('Transporte', 'Transporte de pasajeros'),
('Transporte', 'Transporte de carga'),
('Transporte', 'Transporte ferroviario'),
('Transporte', 'Transporte aéreo'),
('Turismo', 'Agencias de viajes'),
('Turismo', 'Hoteles y alojamientos'),
('Turismo', 'Restaurantes y servicios de alimentación'),
('Turismo', 'Actividades recreativas y de ocio'),
('Educación', 'Escuelas privadas'),
('Educación', 'Clases particulares'),
('Educación', 'Universidades y centros de formación'),
('Educación', 'Educación en línea'),
('Salud', 'Clínicas privadas'),
('Salud', 'Servicios de bienestar'),
('Salud', 'Farmacias y distribución de medicamentos'),
('Salud', 'Servicios de atención domiciliaria'),
('Tecnología de la Información', 'Desarrollo de software'),
('Tecnología de la Información', 'Servicios de ciberseguridad'),
('Tecnología de la Información', 'Consultoría en tecnología'),
('Tecnología de la Información', 'Desarrollo de aplicaciones móviles'),
('Consultoría', 'Consultoría empresarial'),
('Consultoría', 'Consultoría en marketing digital'),
('Consultoría', 'Consultoría financiera'),
('Consultoría', 'Consultoría en recursos humanos'),
('Investigación y Desarrollo', 'Laboratorios de investigación'),
('Investigación y Desarrollo', 'Startups tecnológicas'),
('Investigación y Desarrollo', 'Innovación en biotecnología'),
('Investigación y Desarrollo', 'Investigación en ciencias sociales'),
('Organizaciones No Gubernamentales (ONG)', 'Proyectos de desarrollo comunitario'),
('Organizaciones No Gubernamentales (ONG)', 'Iniciativas medioambientales'),
('Organizaciones No Gubernamentales (ONG)', 'Programas de derechos humanos'),
('Servicios Comunitarios', 'Programas de apoyo a la comunidad'),
('Servicios Comunitarios', 'Actividades culturales'),
('Servicios Comunitarios', 'Servicios de voluntariado'),
('Cultura y Arte', 'Producción de eventos culturales'),
('Cultura y Arte', 'Creación de contenido artístico'),
('Cultura y Arte', 'Actividades recreativas y deportivas'),
('Economía Digital', 'Comercio electrónico'),
('Economía Digital', 'Marketing digital'),
('Economía Digital', 'Criptomonedas y blockchain'),
('Economía Digital', 'Servicios de streaming'),
('Economía Verde', 'Energías renovables'),
('Economía Verde', 'Agricultura sostenible'),
('Economía Verde', 'Gestión de residuos'),
('Economía Verde', 'Conservación de recursos naturales'),
('Economía Colaborativa', 'Plataformas de economía compartida'),
('Economía Colaborativa', 'Servicios de coworking'),
('Economía Colaborativa', 'Intercambio de bienes y servicios');
