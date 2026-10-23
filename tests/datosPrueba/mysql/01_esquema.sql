-- LabUNAM
-- Datos de prueba
-- 01_esquema (tablas de MySQL que consulta el portal, para las pruebas de navegador)
-- Raúl Salinas <raul.teo.salinas@cic.unam.mx>

-- No es una copia del esquema real: sólo tiene las tablas y columnas que leen los DAO
-- de src/server/, con los mismos nombres. Si un DAO consulta una columna nueva, hay que
-- agregarla aquí o las pruebas de navegador fallarán en GitHub.

SET NAMES utf8mb4;
-- La base heredada acepta fechas 0000-00-00; el modo estricto de MySQL 8 las rechazaría.
SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION';

-- Catálogos de laboratorios

CREATE TABLE catEstados (
  idEstado INT PRIMARY KEY,
  estado VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE catalogo_dependencias (
  dep_clave VARCHAR(10) PRIMARY KEY,
  dep_nombre VARCHAR(255) NOT NULL,
  dep_nombre_may_min VARCHAR(255),
  dep_status TINYINT NOT NULL DEFAULT 1,
  dep_fecha_cancela DATE
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE catDepen (
  idDepen INT PRIMARY KEY,
  dependencia VARCHAR(255) NOT NULL,
  iniciales VARCHAR(30),
  dep_clave VARCHAR(10),
  idEstado INT
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE catDisiplina (
  idDis INT PRIMARY KEY,
  disiplina VARCHAR(150) NOT NULL
) DEFAULT CHARSET = utf8mb4;

-- Laboratorios: el esquema heredado guarda las 38 disciplinas como columnas de banderas.

CREATE TABLE r_seccion1 (
  idLab INT PRIMARY KEY,
  labNombre VARCHAR(255) NOT NULL,
  siglas VARCHAR(50),
  idTpLab INT NOT NULL,
  idDepen INT,
  entidad INT DEFAULT 0,
  activo TINYINT NOT NULL DEFAULT 1,
  calleNum VARCHAR(255),
  colonia VARCHAR(255),
  muniDeleg VARCHAR(255),
  cp VARCHAR(10),
  latitud VARCHAR(20),
  longitud VARCHAR(20),
  webLab VARCHAR(255),
  palabrasClave TEXT,
  subDis TEXT,
  marcaAutorizaInfoWeb TINYINT DEFAULT 0,
  objInvesApli TINYINT DEFAULT 0,
  objInvesBasica TINYINT DEFAULT 0,
  objDocencia TINYINT DEFAULT 0,
  objServicios TINYINT DEFAULT 0,
  fAprobacion DATE,
  fActualiza DATE,
  fAplica DATE,
  dis1 TINYINT DEFAULT 0, dis2 TINYINT DEFAULT 0, dis3 TINYINT DEFAULT 0,
  dis4 TINYINT DEFAULT 0, dis5 TINYINT DEFAULT 0, dis6 TINYINT DEFAULT 0,
  dis7 TINYINT DEFAULT 0, dis8 TINYINT DEFAULT 0, dis9 TINYINT DEFAULT 0,
  dis10 TINYINT DEFAULT 0, dis11 TINYINT DEFAULT 0, dis12 TINYINT DEFAULT 0,
  dis13 TINYINT DEFAULT 0, dis14 TINYINT DEFAULT 0, dis15 TINYINT DEFAULT 0,
  dis16 TINYINT DEFAULT 0, dis17 TINYINT DEFAULT 0, dis18 TINYINT DEFAULT 0,
  dis19 TINYINT DEFAULT 0, dis20 TINYINT DEFAULT 0, dis21 TINYINT DEFAULT 0,
  dis22 TINYINT DEFAULT 0, dis23 TINYINT DEFAULT 0, dis24 TINYINT DEFAULT 0,
  dis25 TINYINT DEFAULT 0, dis26 TINYINT DEFAULT 0, dis27 TINYINT DEFAULT 0,
  dis28 TINYINT DEFAULT 0, dis29 TINYINT DEFAULT 0, dis30 TINYINT DEFAULT 0,
  dis31 TINYINT DEFAULT 0, dis32 TINYINT DEFAULT 0, dis33 TINYINT DEFAULT 0,
  dis34 TINYINT DEFAULT 0, dis35 TINYINT DEFAULT 0, dis36 TINYINT DEFAULT 0,
  dis37 TINYINT DEFAULT 0, dis38 TINYINT DEFAULT 0
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE r_equipoPrincipal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idLab INT NOT NULL,
  nombre VARCHAR(255),
  tpPruebasServicio TEXT
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE r_certificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idLab INT NOT NULL,
  certificacion VARCHAR(255),
  organismo VARCHAR(255),
  fFin DATE
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE r_acreditaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idLab INT NOT NULL,
  acreditacion VARCHAR(255),
  organismo VARCHAR(255),
  fFin DATE
) DEFAULT CHARSET = utf8mb4;

-- Catálogos del formulario de solicitud

CREATE TABLE catalogo_paises (
  pais_clave CHAR(3) PRIMARY KEY,
  pais_nombre VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE catalogo_paises_edo (
  id INT PRIMARY KEY,
  pais_clave CHAR(3) NOT NULL,
  edo_nombre VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE catalogo_instituciones (
  institucion_clave INT PRIMARY KEY,
  institucion_nombre VARCHAR(255) NOT NULL,
  institucion_siglas VARCHAR(50),
  anio_ActivoTermino INT
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE cat_cargos (
  id INT PRIMARY KEY,
  cargo VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE cat_tipo_muestra (
  id INT PRIMARY KEY,
  muestra VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;

CREATE TABLE cat_tipo_colaboracion (
  id INT PRIMARY KEY,
  colaboracion VARCHAR(100) NOT NULL
) DEFAULT CHARSET = utf8mb4;
