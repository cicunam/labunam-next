// LabUNAM
// Servidor: laboratorios
// LaboratorioDao (consulta SQL de laboratorios y conversión de sus filas al modelo público)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { slugify, normalizeText, toTitleCase, getText, uniqueValues } from "../../lib/texto/texto";
import { grupos } from "../../lib/grupos/grupos";

// Conexión
import { query } from "../config/dbconnection.js";

// Constantes
const tipos = { 1: "internacionales", 2: "nacionales", 3: "universitarios", 4: "unidades" };
// El catálogo heredado usa nombres históricos y mayúsculas; estas equivalencias
// mantienen estables las etiquetas visibles y las claves de los filtros por sede.
const estadosConAcentos = {
  MEXICO: "Estado de México",
  QUERETARO: "Querétaro",
  MICHOACAN: "Michoacán",
  YUCATAN: "Yucatán",
  "NUEVO LEON": "Nuevo León",
  "SAN LUIS POTOSI": "San Luis Potosí",
  "BAJA CALIFORNIA NORTE": "Baja California",
  "MEXICO D.F.": "Ciudad de México",
  "DISTRITO FEDERAL": "Ciudad de México",
};

// Definición del DAO
class LaboratorioDao {
  async getAllActive() {
    // El esquema heredado guarda las disciplinas en 38 columnas de banderas.
    const disciplineColumns = Array.from({ length: 38 }, (_, index) => `s.dis${index + 1}`).join(
      ", ",
    );
    // Equipos, certificaciones y acreditaciones llegan como arreglos con JSON_ARRAYAGG.
    // No usamos GROUP_CONCAT: su límite de 1024 bytes truncaría los servicios de 125
    // laboratorios, y 911 valores contienen saltos de línea que romperían un separador.
    // Usamos las listas en el orden en que llegan; el primer servicio es el que muestra la tarjeta.
    return query(`
      SELECT s.idLab, s.labNombre, s.siglas, s.idTpLab,
             s.calleNum, s.colonia, s.muniDeleg, s.cp, s.latitud, s.longitud,
             s.webLab, s.palabrasClave, s.subDis, s.marcaAutorizaInfoWeb,
             s.objInvesApli, s.objInvesBasica, s.objDocencia, s.objServicios,
             COALESCE(s.fAprobacion, s.fActualiza, s.fAplica) AS fecha,
             d.dependencia, d.iniciales,
             cd.dep_nombre_may_min AS dependenciaTitulo,
             e.estado,
             (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                       'nombre', eq.nombre, 'tpPruebasServicio', eq.tpPruebasServicio))
                FROM r_equipoPrincipal AS eq
               WHERE eq.idLab = s.idLab) AS equipos,
             (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                       'nombre', c.certificacion, 'organismo', c.organismo, 'fFin', c.fFin))
                FROM r_certificaciones AS c
               WHERE c.idLab = s.idLab AND TRIM(c.certificacion) <> '') AS certificaciones,
             (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                       'nombre', a.acreditacion, 'organismo', a.organismo, 'fFin', a.fFin))
                FROM r_acreditaciones AS a
               WHERE a.idLab = s.idLab AND TRIM(a.acreditacion) <> '') AS acreditaciones,
             ${disciplineColumns}
      FROM r_seccion1 AS s
      LEFT JOIN catDepen AS d ON d.idDepen = s.idDepen
      LEFT JOIN catalogo_dependencias AS cd ON cd.dep_clave = d.dep_clave
      -- Si el laboratorio no declara estado, usamos el de su dependencia.
      LEFT JOIN catEstados AS e ON e.idEstado = COALESCE(NULLIF(s.entidad, 0), d.idEstado)
      WHERE s.activo = 1 AND s.idTpLab IN (1, 2, 3, 4)
      ORDER BY s.labNombre`);
  }
  // HTML de la portada. Cada columna llega vacía si no hay fila.
  async getHomeHtml(
    idLab, // Number - Identificador del laboratorio
  ) {
    const rows = await query(
      "SELECT intro, mision, vision FROM r_infoWeb WHERE idLab = ? LIMIT 1",
      [idLab],
    );
    const row = rows[0] ?? {};
    return {
      intro: row.intro ?? "",
      mision: row.mision ?? "",
      vision: row.vision ?? "",
    };
  }
}

// Conversión de filas
// Recibe una fila y devuelve un laboratorio, o null si su tipo no es público.
export function toLaboratorio(
  row, // Object - Fila de getAllActive: estado, equipos, certificaciones, acreditaciones y las 38 columnas de disciplinas
  disciplinas, // Map - Nombre de cada disciplina por su id (Number), leído por DisciplinaDao
) {
  const tipo = tipos[Number(row.idTpLab)];
  if (!tipo) {
    return null;
  }
  const idLab = Number(row.idLab);
  // Las disciplinas vienen en 38 columnas de banderas, no en una tabla de relaciones.
  const ids = [...disciplinas.keys()].filter((id) => Number(row[`dis${id}`]) === 1);
  const estado = getText(row.estado);
  const sedeNombre =
    estado === "NO ESPECIFICADO" ? "" : (estadosConAcentos[estado] ?? toTitleCase(estado));
  const equipoRows = row.equipos ?? [];
  const equipos = uniqueValues(equipoRows.map((equipo) => equipo.nombre));
  const servicios = uniqueValues(equipoRows.map((equipo) => equipo.tpPruebasServicio));
  const certificados = row.certificaciones ?? [];
  const acreditados = row.acreditaciones ?? [];
  const siglas = getText(row.siglas);
  const perfil = [];
  if (Number(row.objServicios) === 1) {
    perfil.push("servicios");
  }
  if (Number(row.objDocencia) === 1) {
    perfil.push("docencia");
  }
  if (Number(row.objInvesBasica) === 1) {
    perfil.push("basica");
  }
  if (Number(row.objInvesApli) === 1) {
    perfil.push("aplicada");
  }
  const lat = Number(row.latitud),
    lng = Number(row.longitud);
  // El valor 2 de marcaAutorizaInfoWeb indica que la ficha usa el micrositio institucional.
  const lab = {
    idLab,
    nombre: toTitleCase(row.labNombre, [siglas]),
    siglas,
    tipo,
    entidad:
      getText(row.dependenciaTitulo) ||
      toTitleCase(getText(row.dependencia), [getText(row.iniciales)]),
    entidadSiglas: getText(row.iniciales),
    sede: slugify(sedeNombre),
    sedeNombre,
    grupos: grupos
      .filter((grupo) => grupo.disciplinas.some((id) => ids.includes(id)))
      .map((grupo) => grupo.clave),
    disciplinas: ids.map((id) => disciplinas.get(id)),
    palabrasClave: getText(row.palabrasClave),
    servicios,
    equipos,
    distinciones: [
      ...certificados.map((row) => formatDistinction("Certificación", row)),
      ...acreditados.map((row) => formatDistinction("Acreditación", row)),
    ],
    certificado: certificados.length > 0,
    acreditado: acreditados.length > 0,
    micrositio: Number(row.marcaAutorizaInfoWeb) === 2,
    perfil,
    ubicacion: formatAddress(row),
    mapa:
      lat && lng && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
        ? `https://www.google.com/maps?q=${lat},${lng}`
        : "",
    sitio:
      Number(row.marcaAutorizaInfoWeb) === 2
        ? `https://labunam.unam.mx/micrositio/index.php?il=${idLab}`
        : normalizeWebsite(row.webLab),
    fecha: getText(row.fecha),
    indice: "",
  };
  lab.indice = normalizeText(
    [
      lab.nombre,
      siglas,
      lab.entidad,
      lab.entidadSiglas,
      lab.palabrasClave,
      getText(row.subDis),
      ...lab.disciplinas,
      ...equipos,
      ...servicios,
    ].join(" | "),
  );
  return lab;
}

// Utilidades

// Texto de una certificación o acreditación con su organismo y año de vigencia.
function formatDistinction(
  tipo, // String - "Certificación" o "Acreditación"
  row, // Object - Fila con nombre, organismo y fFin
) {
  const organismo = getText(row.organismo);
  const fecha = getText(row.fFin);
  return `${tipo}: ${getText(row.nombre)}${organismo ? ` · ${organismo}` : ""}${fecha && fecha !== "0000-00-00" ? ` (vigencia ${fecha.slice(0, 4)})` : ""}`;
}
// Dirección legible sin partes vacías ni ceros heredados.
function formatAddress(
  row, // Object - Fila con calleNum, colonia, muniDeleg y cp
) {
  const parts = [
    ...new Set(
      [row.calleNum, row.colonia, row.muniDeleg]
        .map(getText)
        .filter((parte) => parte && parte !== "0"),
    ),
  ].map((parte) => toTitleCase(parte));
  const cp = getText(row.cp);
  if (cp && cp !== "0") {
    parts.push(`C.P. ${cp}`);
  }
  return parts.join(", ");
}
// URL navegable del sitio del laboratorio, o cadena vacía si no es http ni https.
function normalizeWebsite(
  website, // String - Sitio tal como está registrado en la base
) {
  const value = getText(website);
  if (!value) {
    return "";
  }
  // Los enlaces de la base son externos; sólo se admiten protocolos navegables.
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) {
    return "";
  }
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `http://${value}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

export default LaboratorioDao;
