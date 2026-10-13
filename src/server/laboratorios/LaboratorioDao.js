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
}

// Conversión de filas
// Recibe una fila y devuelve un laboratorio, o null si su tipo no es público.
export function toLaboratorio(
  fila, // Object - Fila de getAllActive: estado, equipos, certificaciones, acreditaciones y las 38 columnas de disciplinas
  disciplinas, // Map - Nombre de cada disciplina por su id (Number), leído por DisciplinaDao
) {
  const tipo = tipos[Number(fila.idTpLab)];
  if (!tipo) {
    return null;
  }
  const idLab = Number(fila.idLab);
  // Las disciplinas vienen en 38 columnas de banderas, no en una tabla de relaciones.
  const ids = [...disciplinas.keys()].filter((id) => Number(fila[`dis${id}`]) === 1);
  const estado = getText(fila.estado);
  const sedeNombre =
    estado === "NO ESPECIFICADO" ? "" : (estadosConAcentos[estado] ?? toTitleCase(estado));
  const filasEquipo = fila.equipos ?? [];
  const equipos = uniqueValues(filasEquipo.map((equipo) => equipo.nombre));
  const servicios = uniqueValues(filasEquipo.map((equipo) => equipo.tpPruebasServicio));
  const certificados = fila.certificaciones ?? [];
  const acreditados = fila.acreditaciones ?? [];
  const siglas = getText(fila.siglas);
  const perfil = [];
  if (Number(fila.objServicios) === 1) {
    perfil.push("servicios");
  }
  if (Number(fila.objDocencia) === 1) {
    perfil.push("docencia");
  }
  if (Number(fila.objInvesBasica) === 1) {
    perfil.push("basica");
  }
  if (Number(fila.objInvesApli) === 1) {
    perfil.push("aplicada");
  }
  const lat = Number(fila.latitud),
    lng = Number(fila.longitud);
  // El valor 2 de marcaAutorizaInfoWeb indica que la ficha usa el micrositio institucional.
  const lab = {
    idLab,
    nombre: toTitleCase(fila.labNombre, [siglas]),
    siglas,
    tipo,
    entidad:
      getText(fila.dependenciaTitulo) ||
      toTitleCase(getText(fila.dependencia), [getText(fila.iniciales)]),
    entidadSiglas: getText(fila.iniciales),
    sede: slugify(sedeNombre),
    sedeNombre,
    grupos: grupos
      .filter((grupo) => grupo.disciplinas.some((id) => ids.includes(id)))
      .map((grupo) => grupo.clave),
    disciplinas: ids.map((id) => disciplinas.get(id)),
    palabrasClave: getText(fila.palabrasClave),
    servicios,
    equipos,
    distinciones: [
      ...certificados.map((fila) => formatDistinction("Certificación", fila)),
      ...acreditados.map((fila) => formatDistinction("Acreditación", fila)),
    ],
    certificado: certificados.length > 0,
    acreditado: acreditados.length > 0,
    micrositio: Number(fila.marcaAutorizaInfoWeb) === 2,
    perfil,
    ubicacion: formatAddress(fila),
    mapa:
      lat && lng && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
        ? `https://www.google.com/maps?q=${lat},${lng}`
        : "",
    sitio:
      Number(fila.marcaAutorizaInfoWeb) === 2
        ? `https://labunam.unam.mx/micrositio/index.php?il=${idLab}`
        : normalizeWebsite(fila.webLab),
    fecha: getText(fila.fecha),
    indice: "",
  };
  lab.indice = normalizeText(
    [
      lab.nombre,
      siglas,
      lab.entidad,
      lab.entidadSiglas,
      lab.palabrasClave,
      getText(fila.subDis),
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
  fila, // Object - Fila con nombre, organismo y fFin
) {
  const organismo = getText(fila.organismo);
  const fecha = getText(fila.fFin);
  return `${tipo}: ${getText(fila.nombre)}${organismo ? ` · ${organismo}` : ""}${fecha && fecha !== "0000-00-00" ? ` (vigencia ${fecha.slice(0, 4)})` : ""}`;
}
// Dirección legible sin partes vacías ni ceros heredados.
function formatAddress(
  fila, // Object - Fila con calleNum, colonia, muniDeleg y cp
) {
  const partes = [
    ...new Set(
      [fila.calleNum, fila.colonia, fila.muniDeleg]
        .map(getText)
        .filter((parte) => parte && parte !== "0"),
    ),
  ].map((parte) => toTitleCase(parte));
  const cp = getText(fila.cp);
  if (cp && cp !== "0") {
    partes.push(`C.P. ${cp}`);
  }
  return partes.join(", ");
}
// URL navegable del sitio del laboratorio, o cadena vacía si no es http ni https.
function normalizeWebsite(
  web, // String - Sitio tal como está registrado en la base
) {
  const valor = getText(web);
  if (!valor) {
    return "";
  }
  // Los enlaces de la base son externos; sólo se admiten protocolos navegables.
  if (/^[a-z][a-z\d+.-]*:/i.test(valor) && !/^https?:\/\//i.test(valor)) {
    return "";
  }
  try {
    const url = new URL(/^https?:\/\//i.test(valor) ? valor : `http://${valor}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

export default LaboratorioDao;
