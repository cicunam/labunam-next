-- LabUNAM
-- Datos de prueba
-- 02_datos (catálogo ficticio que cubre los casos de las pruebas de navegador)
-- Raúl Salinas <raul.teo.salinas@cic.unam.mx>

-- Laboratorios, dependencias y organismos son inventados; sólo países, estados y la
-- UNAM son nombres públicos reales. Las pruebas no dependen de cuántos laboratorios hay,
-- pero sí de que existan estos casos:
--   · «microscopia» entre los nacionales, con al menos uno de Biología y uno en la
--     Ciudad de México, y ninguno de Humanidades (opciones deshabilitadas en Filtros).
--   · Dos laboratorios con el mismo nombre en entidades distintas que respondan a
--     «difraccion de rayos x».
--   · Laboratorios en Querétaro y Sonora, ninguno en Aguascalientes.
--   · Las tres redes principales con laboratorios, uno internacional con ficha completa
--     y al menos cuatro con fecha para «Recién incorporados».
--   · Un equipo cuyo nombre contenga «micros» en al menos tres laboratorios, para que
--     el buscador lo sugiera.
--   · Más de cien países, sólo uno que contenga «mexi».

SET NAMES utf8mb4;
SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION';

-- Estados con los nombres históricos del catálogo heredado

INSERT INTO catEstados (idEstado, estado) VALUES
  (1, 'AGUASCALIENTES'), (2, 'BAJA CALIFORNIA NORTE'), (3, 'BAJA CALIFORNIA SUR'),
  (4, 'CAMPECHE'), (5, 'COAHUILA'), (6, 'COLIMA'), (7, 'CHIAPAS'), (8, 'CHIHUAHUA'),
  (9, 'DISTRITO FEDERAL'), (10, 'DURANGO'), (11, 'GUANAJUATO'), (12, 'GUERRERO'),
  (13, 'HIDALGO'), (14, 'JALISCO'), (15, 'MEXICO'), (16, 'MICHOACAN'), (17, 'MORELOS'),
  (18, 'NAYARIT'), (19, 'NUEVO LEON'), (20, 'OAXACA'), (21, 'PUEBLA'), (22, 'QUERETARO'),
  (23, 'QUINTANA ROO'), (24, 'SAN LUIS POTOSI'), (25, 'SINALOA'), (26, 'SONORA'),
  (27, 'TABASCO'), (28, 'TAMAULIPAS'), (29, 'TLAXCALA'), (30, 'VERACRUZ'),
  (31, 'YUCATAN'), (32, 'ZACATECAS'), (33, 'NO ESPECIFICADO');

-- Dependencias: una sin nombre corregido y otra cancelada, que el formulario omite.

INSERT INTO catalogo_dependencias
  (dep_clave, dep_nombre, dep_nombre_may_min, dep_status, dep_fecha_cancela) VALUES
  ('010', 'INSTITUTO DE DEMOSTRACION', 'Instituto de Demostración', 1, NULL),
  ('011', 'FACULTAD DE EJEMPLO', 'Facultad de Ejemplo', 1, NULL),
  ('012', 'CENTRO DE PRUEBAS', '', 1, NULL),
  ('013', 'CCH PLANTEL DE EJEMPLO', NULL, 1, NULL),
  ('014', 'ESCUELA CANCELADA DE EJEMPLO', NULL, 1, '2020-01-01');

INSERT INTO catDepen (idDepen, dependencia, iniciales, dep_clave, idEstado) VALUES
  (1, 'INSTITUTO DE DEMOSTRACION', 'IDD', '010', 9),
  (2, 'FACULTAD DE EJEMPLO', 'FDE', '011', 22),
  (3, 'CENTRO DE PRUEBAS', 'CDP', '012', 26),
  (4, 'CENTRO REGIONAL DE EJEMPLO', 'CRE', NULL, 31);

-- Disciplinas: los identificadores coinciden con las áreas de src/lib/grupos/grupos.js.

INSERT INTO catDisiplina (idDis, disiplina) VALUES
  (1, 'CIENCIAS AGROPECUARIAS'), (2, 'ANTROPOLOGÍA Y ARQUEOLOGÍA'), (3, 'ASTRONOMÍA'),
  (4, 'BIOLOGÍA'), (5, 'BIOMEDICINA'), (6, 'BIOQUÍMICA'), (7, 'CIENCIAS ATMOSFÉRICAS'),
  (8, 'INGENIERÍA'), (9, 'CIENCIAS DE LA SALUD'), (10, 'CIENCIA DE MATERIALES'),
  (11, 'CIENCIAS DEL MAR'), (12, 'ECOLOGÍA'), (13, 'ENERGÍA'), (14, 'SUSTENTABILIDAD'),
  (15, 'FARMACOLOGÍA'), (16, 'FISIOLOGÍA'), (17, 'FÍSICA'), (18, 'FÍSICA NUCLEAR'),
  (19, 'GENÉTICA'), (20, 'GENÓMICA'), (21, 'GEOFÍSICA'), (22, 'GEOGRAFÍA'),
  (23, 'GEOLOGÍA'), (24, 'GEOQUÍMICA'), (25, 'INSTRUMENTACIÓN'), (26, 'MATEMÁTICAS'),
  (27, 'CÓMPUTO'), (28, 'MEDICINA'), (29, 'MEDICINA VETERINARIA'), (30, 'METALURGIA'),
  (31, 'MICROBIOLOGÍA'), (32, 'ÓPTICA'), (33, 'PALEONTOLOGÍA'), (34, 'NUTRICIÓN'),
  (35, 'NEUROBIOLOGÍA'), (36, 'QUÍMICA'), (37, 'FÍSICA DE RADIACIONES'), (38, 'ZOOLOGÍA');

-- Laboratorios. Tipos: 1 internacionales, 2 nacionales, 3 universitarios, 4 unidades.
-- entidad = 0 toma el estado de la dependencia; 33 no especifica estado.

INSERT INTO r_seccion1
  (idLab, labNombre, siglas, idTpLab, idDepen, entidad, activo,
   calleNum, colonia, muniDeleg, cp, latitud, longitud, webLab, palabrasClave, subDis,
   marcaAutorizaInfoWeb, objInvesApli, objInvesBasica, objDocencia, objServicios,
   fAprobacion, fActualiza, fAplica) VALUES
  (101, 'LABORATORIO NACIONAL DE MICROSCOPÍA AVANZADA', 'LANMA', 2, 1, 0, 1,
   'CIRCUITO DE PRUEBA 100', 'CIUDAD DE EJEMPLO', 'COYOACAN', '04510', '19.3260', '-99.1790',
   'https://example.org/lanma', 'Imagen, nanoestructuras', 'Microscopía electrónica',
   0, 1, 1, 0, 1, '2026-09-15', NULL, NULL),
  (102, 'LABORATORIO NACIONAL DE IMAGEN BIOLÓGICA', 'LANIB', 2, 2, 22, 1,
   'AVENIDA DE EJEMPLO 20', '0', 'JURIQUILLA', '76230', '20.7030', '-100.4470',
   '', 'Células, tejidos', 'Imagen biológica',
   2, 0, 1, 1, 1, '2026-08-01', NULL, NULL),
  (103, 'LABORATORIO NACIONAL DE CIENCIA DE MATERIALES', 'LANCIM', 2, 3, 26, 1,
   'BOULEVARD DE PRUEBA 5', 'CENTRO', 'HERMOSILLO', '83000', '29.0820', '-110.9600',
   'example.org/lancim', 'Caracterización, superficies', 'Materiales',
   0, 1, 0, 0, 1, NULL, '2026-07-10', NULL),
  (104, 'LABORATORIO NACIONAL DE CÓMPUTO CIENTÍFICO', 'LANCC', 2, 1, 0, 1,
   'CIRCUITO DE PRUEBA 200', 'CIUDAD DE EJEMPLO', 'COYOACAN', '04510', '19.3270', '-99.1800',
   'https://example.org/lancc', 'Simulación, datos', 'Cómputo',
   0, 1, 1, 1, 1, '2025-05-01', NULL, NULL),
  (105, 'LABORATORIO DE DIFRACCIÓN DE RAYOS X', NULL, 3, 1, 9, 1,
   'CIRCUITO DE PRUEBA 300', 'CIUDAD DE EJEMPLO', 'COYOACAN', '04510', '19.3250', '-99.1810',
   '', 'Cristalografía', 'Estructura cristalina',
   0, 0, 1, 1, 1, '2026-06-01', NULL, NULL),
  (106, 'LABORATORIO DE DIFRACCIÓN DE RAYOS X', NULL, 3, 2, 22, 1,
   'AVENIDA DE EJEMPLO 40', '0', 'JURIQUILLA', '76230', '', '',
   '', 'Minerales', 'Mineralogía',
   0, 1, 0, 0, 1, '2026-05-20', NULL, NULL),
  (107, 'LABORATORIO UNIVERSITARIO DE GENÓMICA', 'LUG', 3, 2, 9, 1,
   'CALLE DE PRUEBA 7', 'CIUDAD DE EJEMPLO', 'COYOACAN', '04510', '19.3240', '-99.1820',
   'https://example.org/lug', 'ADN, secuencias', 'Genómica funcional',
   0, 0, 1, 1, 1, '2025-11-11', NULL, NULL),
  (108, 'LABORATORIO DE ESPECTROMETRÍA DE MASAS', 'LEM', 3, 4, 14, 1,
   'CALLE DE EJEMPLO 15', 'CENTRO', 'GUADALAJARA', '44100', '20.6760', '-103.3470',
   '', 'Compuestos orgánicos', 'Química analítica',
   0, 1, 0, 0, 1, '2024-03-03', NULL, NULL),
  (109, 'LABORATORIO DE ARQUEOMETRÍA', 'LARQ', 3, 1, 9, 1,
   'CIRCUITO DE PRUEBA 400', 'CIUDAD DE EJEMPLO', 'COYOACAN', '04510', '19.3230', '-99.1830',
   '', 'Patrimonio, piezas', 'Arqueometría',
   0, 0, 1, 1, 0, '2025-01-15', NULL, NULL),
  (110, 'UNIDAD DE APOYO EN MICROSCOPÍA DE MATERIALES', 'UAMM', 4, 2, 22, 1,
   'AVENIDA DE EJEMPLO 60', '0', 'JURIQUILLA', '76230', '20.7040', '-100.4480',
   '', 'Nanomateriales', 'Microscopía electrónica',
   0, 1, 0, 0, 1, '2025-02-02', NULL, NULL),
  (111, 'UNIDAD DE SERVICIOS DE ANÁLISIS AMBIENTAL', 'USAA', 4, 4, 0, 1,
   'CARRETERA DE EJEMPLO KM 3', '0', 'MERIDA', '97000', '20.9670', '-89.6230',
   '', 'Agua, suelo', 'Análisis ambiental',
   0, 1, 0, 0, 1, '2024-09-09', NULL, NULL),
  (112, 'UNIDAD DE BIOTERIO DE EJEMPLO', 'UBE', 4, 3, 33, 1,
   '0', '0', '0', '0', '', '',
   '', 'Modelos animales', 'Bioterio',
   0, 0, 1, 0, 1, NULL, NULL, NULL),
  (113, 'LABORATORIO INTERNACIONAL DE ASTROFÍSICA', 'LIA', 1, 1, 9, 1,
   'CIRCUITO DE PRUEBA 500', 'CIUDAD DE EJEMPLO', 'COYOACAN', '04510', '19.3280', '-99.1770',
   'https://example.org/lia', 'Estrellas, galaxias', 'Astrofísica observacional',
   0, 0, 1, 1, 1, '2026-01-20', NULL, NULL),
  (114, 'LABORATORIO INTERNACIONAL DE OCEANOGRAFÍA', 'LIO', 1, 4, 31, 1,
   'PUERTO DE EJEMPLO 1', '0', 'SISAL', '97356', '21.1650', '-90.0300',
   '', 'Corrientes, costas', 'Oceanografía física',
   0, 1, 1, 0, 1, '2023-04-04', NULL, NULL),
  -- Ninguno de estos dos debe aparecer: uno está inactivo y el otro no es de un tipo público.
  (115, 'LABORATORIO NACIONAL INACTIVO DE MICROSCOPÍA', 'LNIM', 2, 1, 9, 0,
   '0', '0', '0', '0', '', '', '', '', '', 0, 0, 0, 0, 1, '2026-10-01', NULL, NULL),
  (116, 'LABORATORIO DE TIPO NO PÚBLICO', 'LTNP', 5, 1, 9, 1,
   '0', '0', '0', '0', '', '', '', '', '', 0, 0, 0, 0, 1, '2026-10-01', NULL, NULL);

UPDATE r_seccion1 SET dis4 = 1, dis17 = 1, dis32 = 1 WHERE idLab = 101;
UPDATE r_seccion1 SET dis4 = 1, dis19 = 1, dis31 = 1 WHERE idLab = 102;
UPDATE r_seccion1 SET dis10 = 1, dis30 = 1 WHERE idLab = 103;
UPDATE r_seccion1 SET dis26 = 1, dis27 = 1 WHERE idLab = 104;
UPDATE r_seccion1 SET dis10 = 1, dis36 = 1 WHERE idLab = 105;
UPDATE r_seccion1 SET dis23 = 1 WHERE idLab = 106;
UPDATE r_seccion1 SET dis19 = 1, dis20 = 1 WHERE idLab = 107;
UPDATE r_seccion1 SET dis6 = 1, dis36 = 1 WHERE idLab = 108;
UPDATE r_seccion1 SET dis2 = 1 WHERE idLab = 109;
UPDATE r_seccion1 SET dis10 = 1 WHERE idLab = 110;
UPDATE r_seccion1 SET dis12 = 1, dis13 = 1 WHERE idLab = 111;
UPDATE r_seccion1 SET dis28 = 1, dis29 = 1 WHERE idLab = 112;
UPDATE r_seccion1 SET dis3 = 1, dis32 = 1 WHERE idLab = 113;
UPDATE r_seccion1 SET dis11 = 1 WHERE idLab = 114;
UPDATE r_seccion1 SET dis4 = 1 WHERE idLab = 115;

-- Equipos y el servicio que ofrece cada uno; el primero es el que muestra la tarjeta.

INSERT INTO r_equipoPrincipal (idLab, nombre, tpPruebasServicio) VALUES
  (101, 'Microscopio electrónico de barrido', 'Microscopía electrónica de barrido'),
  (101, 'Microscopio confocal', 'Imagen de fluorescencia en células'),
  (102, 'Microscopio de fluorescencia', 'Microscopía de fluorescencia'),
  (102, 'Autoclave', 'Esterilización de material'),
  (103, 'Microscopio de fuerza atómica', 'Microscopía de fuerza atómica'),
  (103, 'Difractómetro de rayos X', 'Difracción de rayos X de polvos'),
  (104, 'Clúster de cómputo', 'Cómputo de alto rendimiento'),
  (105, 'Difractómetro de monocristal', 'Difracción de rayos X de monocristal'),
  (106, 'Difractómetro de polvos', 'Difracción de rayos X de polvos'),
  (107, 'Secuenciador de nueva generación', 'Secuenciación masiva'),
  (107, 'Autoclave', 'Esterilización de material'),
  (108, 'Espectrómetro de masas', 'Identificación de compuestos'),
  (109, 'Espectrómetro de fluorescencia de rayos X', 'Fluorescencia de rayos X en piezas'),
  (110, 'Microscopio electrónico de transmisión', 'Microscopía electrónica de transmisión'),
  (111, 'Cromatógrafo de gases', 'Análisis de contaminantes en agua'),
  (112, 'Autoclave', 'Esterilización de material'),
  (112, 'Cámara de flujo laminar', 'Manejo de muestras biológicas'),
  (113, 'Telescopio óptico', 'Observación astronómica'),
  (113, 'Espectrógrafo', 'Espectroscopía de estrellas'),
  (114, 'Perfilador de corrientes', 'Medición de corrientes marinas'),
  (115, 'Microscopio óptico', 'Microscopía óptica'),
  -- El buscador sólo sugiere equipos presentes en al menos tres laboratorios.
  (101, 'Microscopio óptico', 'Microscopía óptica'),
  (102, 'Microscopio óptico', 'Microscopía óptica'),
  (110, 'Microscopio óptico', 'Microscopía óptica');

INSERT INTO r_certificaciones (idLab, certificacion, organismo, fFin) VALUES
  (101, 'ISO 9001:2015', 'Organismo certificador de ejemplo', '2027-12-31'),
  (108, 'ISO 9001:2015', 'Organismo certificador de ejemplo', '2025-06-30'),
  (113, '   ', 'Registro vacío que se descarta', '2027-01-01');

INSERT INTO r_acreditaciones (idLab, acreditacion, organismo, fFin) VALUES
  (103, 'Acreditación de ensayos de ejemplo', 'Entidad de acreditación de ejemplo', '0000-00-00'),
  (108, 'Acreditación de pruebas de ejemplo', NULL, '2028-03-31');

-- Países del formulario de solicitud, en mayúsculas como en el catálogo heredado

INSERT INTO catalogo_paises (pais_clave, pais_nombre) VALUES
  ('AFG', 'AFGANISTAN'), ('ALB', 'ALBANIA'), ('DEU', 'ALEMANIA'), ('AND', 'ANDORRA'),
  ('AGO', 'ANGOLA'), ('SAU', 'ARABIA SAUDITA'), ('DZA', 'ARGELIA'), ('ARG', 'ARGENTINA'),
  ('ARM', 'ARMENIA'), ('AUS', 'AUSTRALIA'), ('AUT', 'AUSTRIA'), ('AZE', 'AZERBAIYAN'),
  ('BHS', 'BAHAMAS'), ('BGD', 'BANGLADES'), ('BRB', 'BARBADOS'), ('BEL', 'BELGICA'),
  ('BLZ', 'BELICE'), ('BEN', 'BENIN'), ('BLR', 'BIELORRUSIA'), ('BOL', 'BOLIVIA'),
  ('BIH', 'BOSNIA Y HERZEGOVINA'), ('BWA', 'BOTSUANA'), ('BRA', 'BRASIL'), ('BGR', 'BULGARIA'),
  ('BFA', 'BURKINA FASO'), ('BTN', 'BUTAN'), ('CPV', 'CABO VERDE'), ('KHM', 'CAMBOYA'),
  ('CMR', 'CAMERUN'), ('CAN', 'CANADA'), ('QAT', 'CATAR'), ('TCD', 'CHAD'),
  ('CHL', 'CHILE'), ('CHN', 'CHINA'), ('CYP', 'CHIPRE'), ('COL', 'COLOMBIA'),
  ('KOR', 'COREA DEL SUR'), ('CRI', 'COSTA RICA'), ('CIV', 'COSTA DE MARFIL'), ('HRV', 'CROACIA'),
  ('CUB', 'CUBA'), ('DNK', 'DINAMARCA'), ('DMA', 'DOMINICA'), ('ECU', 'ECUADOR'),
  ('EGY', 'EGIPTO'), ('SLV', 'EL SALVADOR'), ('ARE', 'EMIRATOS ARABES UNIDOS'), ('SVK', 'ESLOVAQUIA'),
  ('SVN', 'ESLOVENIA'), ('ESP', 'ESPAÑA'), ('USA', 'ESTADOS UNIDOS'), ('EST', 'ESTONIA'),
  ('ETH', 'ETIOPIA'), ('PHL', 'FILIPINAS'), ('FIN', 'FINLANDIA'), ('FJI', 'FIYI'),
  ('FRA', 'FRANCIA'), ('GAB', 'GABON'), ('GEO', 'GEORGIA'), ('GHA', 'GHANA'),
  ('GRC', 'GRECIA'), ('GTM', 'GUATEMALA'), ('GUY', 'GUYANA'), ('HTI', 'HAITI'),
  ('HND', 'HONDURAS'), ('HUN', 'HUNGRIA'), ('IND', 'INDIA'), ('IDN', 'INDONESIA'),
  ('IRQ', 'IRAK'), ('IRL', 'IRLANDA'), ('ISL', 'ISLANDIA'), ('ISR', 'ISRAEL'),
  ('ITA', 'ITALIA'), ('JAM', 'JAMAICA'), ('JPN', 'JAPON'), ('JOR', 'JORDANIA'),
  ('KAZ', 'KAZAJISTAN'), ('KEN', 'KENIA'), ('KWT', 'KUWAIT'), ('LVA', 'LETONIA'),
  ('LBN', 'LIBANO'), ('LTU', 'LITUANIA'), ('LUX', 'LUXEMBURGO'), ('MDG', 'MADAGASCAR'),
  ('MYS', 'MALASIA'), ('MLT', 'MALTA'), ('MAR', 'MARRUECOS'), ('MEX', 'MEXICO'),
  ('MCO', 'MONACO'), ('MNG', 'MONGOLIA'), ('MOZ', 'MOZAMBIQUE'), ('NAM', 'NAMIBIA'),
  ('NPL', 'NEPAL'), ('NIC', 'NICARAGUA'), ('NGA', 'NIGERIA'), ('NOR', 'NORUEGA'),
  ('NZL', 'NUEVA ZELANDA'), ('NLD', 'PAISES BAJOS'), ('PAK', 'PAKISTAN'), ('PAN', 'PANAMA'),
  ('PRY', 'PARAGUAY'), ('PER', 'PERU'), ('POL', 'POLONIA'), ('PRT', 'PORTUGAL'),
  ('GBR', 'REINO UNIDO'), ('CZE', 'REPUBLICA CHECA'), ('DOM', 'REPUBLICA DOMINICANA'), ('ROU', 'RUMANIA'),
  ('RUS', 'RUSIA'), ('SEN', 'SENEGAL'), ('SRB', 'SERBIA'), ('SGP', 'SINGAPUR'),
  ('ZAF', 'SUDAFRICA'), ('SWE', 'SUECIA'), ('CHE', 'SUIZA'), ('THA', 'TAILANDIA'),
  ('TZA', 'TANZANIA'), ('TTO', 'TRINIDAD Y TOBAGO'), ('TUN', 'TUNEZ'), ('TUR', 'TURQUIA'),
  ('UKR', 'UCRANIA'), ('UGA', 'UGANDA'), ('URY', 'URUGUAY'), ('VEN', 'VENEZUELA'),
  ('VNM', 'VIETNAM'), ('ZMB', 'ZAMBIA'), ('ZWE', 'ZIMBABUE');

-- Estados: el formulario sólo los ofrece para México y Estados Unidos.

INSERT INTO catalogo_paises_edo (id, pais_clave, edo_nombre) VALUES
  (1, 'MEX', 'AGUASCALIENTES'), (2, 'MEX', 'BAJA CALIFORNIA'), (3, 'MEX', 'BAJA CALIFORNIA SUR'),
  (4, 'MEX', 'CAMPECHE'), (5, 'MEX', 'COAHUILA'), (6, 'MEX', 'COLIMA'), (7, 'MEX', 'CHIAPAS'),
  (8, 'MEX', 'CHIHUAHUA'), (9, 'MEX', 'CIUDAD DE MEXICO'), (10, 'MEX', 'DURANGO'),
  (11, 'MEX', 'GUANAJUATO'), (12, 'MEX', 'GUERRERO'), (13, 'MEX', 'HIDALGO'),
  (14, 'MEX', 'JALISCO'), (15, 'MEX', 'ESTADO DE MEXICO'), (16, 'MEX', 'MICHOACAN'),
  (17, 'MEX', 'MORELOS'), (18, 'MEX', 'NAYARIT'), (19, 'MEX', 'NUEVO LEON'),
  (20, 'MEX', 'OAXACA'), (21, 'MEX', 'PUEBLA'), (22, 'MEX', 'QUERETARO'),
  (23, 'MEX', 'QUINTANA ROO'), (24, 'MEX', 'SAN LUIS POTOSI'), (25, 'MEX', 'SINALOA'),
  (26, 'MEX', 'SONORA'), (27, 'MEX', 'TABASCO'), (28, 'MEX', 'TAMAULIPAS'),
  (29, 'MEX', 'TLAXCALA'), (30, 'MEX', 'VERACRUZ'), (31, 'MEX', 'YUCATAN'),
  (32, 'MEX', 'ZACATECAS'),
  (51, 'USA', 'ARIZONA'), (52, 'USA', 'CALIFORNIA'), (53, 'USA', 'FLORIDA'),
  (54, 'USA', 'NUEVO MEXICO'), (55, 'USA', 'TEXAS'),
  (90, 'CAN', 'QUEBEC');

-- Instituciones: la de 2001 ya terminó y no debe sugerirse.

INSERT INTO catalogo_instituciones
  (institucion_clave, institucion_nombre, institucion_siglas, anio_ActivoTermino) VALUES
  (1, 'UNIVERSIDAD NACIONAL AUTONOMA DE MEXICO', 'UNAM', NULL),
  (2, 'UNIVERSIDAD DE DEMOSTRACION', 'UDD', NULL),
  (3, 'INSTITUTO TECNOLOGICO DE EJEMPLO', 'ITE', 2999),
  (4, 'CENTRO DE EJEMPLO DE LA UNIVERSIDAD DE DEMOSTRACION', '', NULL),
  (5, 'INSTITUTO CERRADO DE EJEMPLO', 'ICE', 2001);

INSERT INTO cat_cargos (id, cargo) VALUES
  (1, 'Estudiante'), (2, 'Investigador o investigadora'), (3, 'Técnico académico'), (4, 'Otro');

INSERT INTO cat_tipo_muestra (id, muestra) VALUES
  (1, 'Biológica'), (2, 'Mineral'), (3, 'Química'), (4, 'Otra');

INSERT INTO cat_tipo_colaboracion (id, colaboracion) VALUES
  (1, 'Proyecto de investigación'), (2, 'Estancia'), (3, 'Servicio externo');
