import { slugify, normalizeText, toTitleCase } from "../../lib/texto/texto";
import { grupos } from "../../lib/grupos/grupos";
import {
  getText,
  uniqueValues,
  formatDistinction,
  formatAddress,
  normalizeWebsite,
} from "./laboratorioFormatting";

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
/** Recibe una fila y relaciones indexadas; devuelve un laboratorio o null si su tipo no es público. */
export function toLaboratorio(fila, relations) {
  const { estados, disciplinas, equiposPorLab, certificaciones, acreditaciones } = relations;
  const tipo = tipos[Number(fila.idTpLab)];
  if (!tipo) {
    return null;
  }
  const idLab = Number(fila.idLab);
  // Las disciplinas vienen en 38 columnas de banderas, no en una tabla de relaciones.
  const ids = [...disciplinas.keys()].filter((id) => Number(fila[`dis${id}`]) === 1);
  // Si el laboratorio no declara estado, usamos el de su dependencia.
  const estado = estados.get(Number(fila.idEstado) || Number(fila.idEstadoDepen)) ?? "";
  const sedeNombre =
    estado === "NO ESPECIFICADO" ? "" : (estadosConAcentos[estado] ?? toTitleCase(estado));
  const filasEquipo = equiposPorLab.get(idLab) ?? [];
  const equipos = uniqueValues(filasEquipo.map((equipo) => equipo.nombre));
  const servicios = uniqueValues(filasEquipo.map((equipo) => equipo.tpPruebasServicio));
  const certificados = certificaciones.get(idLab) ?? [];
  const acreditados = acreditaciones.get(idLab) ?? [];
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
