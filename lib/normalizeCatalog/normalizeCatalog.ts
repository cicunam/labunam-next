import { slugify, normalizeText, toTitleCase } from "../texto/texto";
import { grupos } from "../grupos/grupos";
import type { Catalogo, Laboratorio, Opcion, Perfil, TipoLaboratorio } from "../tipos/tipos";
import type { DatosCatalogo, FilaDistincion, FilaLaboratorio } from "../tiposBase/tiposBase";

const tipos: Record<number, TipoLaboratorio> = { 1: "internacionales", 2: "nacionales", 3: "universitarios", 4: "unidades" };
const estadosConAcentos: Record<string, string> = {
  MEXICO: "Estado de México", QUERETARO: "Querétaro", MICHOACAN: "Michoacán", YUCATAN: "Yucatán",
  "NUEVO LEON": "Nuevo León", "SAN LUIS POTOSI": "San Luis Potosí", "BAJA CALIFORNIA NORTE": "Baja California",
  "MEXICO D.F.": "Ciudad de México", "DISTRITO FEDERAL": "Ciudad de México",
};
const getText = (valor: string | number | null | undefined) => String(valor ?? "").trim();

function groupByLaboratorio<T extends { idLab: number }>(filas: T[]): Map<number, T[]> {
  const grupos = new Map<number, T[]>();
  for (const fila of filas) {
    const id = Number(fila.idLab);
    const lista = grupos.get(id) ?? [];
    lista.push(fila);
    grupos.set(id, lista);
  }
  return grupos;
}

function uniqueValues(valores: (string | null)[]): string[] {
  const encontrados = new Map<string, string>();
  for (const valor of valores) {
    const limpio = getText(valor).replace(/\s+/gu, " ");
    if (limpio && !encontrados.has(normalizeText(limpio))) encontrados.set(normalizeText(limpio), limpio);
  }
  return [...encontrados.values()];
}

function formatDistinction(tipo: string, fila: FilaDistincion): string {
  const organismo = getText(fila.organismo);
  const fecha = getText(fila.fFin);
  return `${tipo}: ${getText(fila.nombre)}${organismo ? ` · ${organismo}` : ""}${fecha && fecha !== "0000-00-00" ? ` (vigencia ${fecha.slice(0, 4)})` : ""}`;
}

function formatAddress(fila: FilaLaboratorio): string {
  const partes = [...new Set([fila.calleNum, fila.colonia, fila.muniDeleg].map(getText).filter((parte) => parte && parte !== "0"))].map((parte) => toTitleCase(parte));
  const cp = getText(fila.cp);
  if (cp && cp !== "0") partes.push(`C.P. ${cp}`);
  return partes.join(", ");
}

function normalizeWebsite(web: string | null): string {
  const valor = getText(web);
  if (!valor) return "";
  // Los enlaces de la base son externos; sólo se admiten protocolos navegables.
  if (/^[a-z][a-z\d+.-]*:/i.test(valor) && !/^https?:\/\//i.test(valor)) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(valor) ? valor : `http://${valor}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch { return ""; }
}

function buildOptions(valores: string[], laboratorios: Laboratorio[], eje: "sede" | "disciplinas"): Opcion[] {
  const etiquetas = new Map(valores.filter(Boolean).map((valor) => [slugify(valor), valor]));
  const totales = new Map<string, number>();
  for (const lab of laboratorios) {
    const claves = eje === "sede" ? [lab.sede] : lab.disciplinas.map(slugify);
    for (const valor of new Set(claves)) totales.set(valor, (totales.get(valor) ?? 0) + 1);
  }
  return [...etiquetas].map(([clave, etiqueta]) => ({ clave, etiqueta, total: totales.get(clave) ?? 0 }))
    .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"));
}

export function normalizeCatalog(datos: DatosCatalogo): Catalogo {
  const estados = new Map(datos.estados.map((fila) => [Number(fila.idEstado), getText(fila.estado)]));
  const disciplinas = new Map(datos.disciplinas.map((fila) => [Number(fila.idDis), toTitleCase(fila.disiplina)]));
  const equiposPorLab = groupByLaboratorio(datos.equipos);
  const certificaciones = groupByLaboratorio(datos.certificaciones.filter((fila) => getText(fila.nombre)));
  const acreditaciones = groupByLaboratorio(datos.acreditaciones.filter((fila) => getText(fila.nombre)));
  const frecuencias = new Map<string, { etiqueta: string; total: number }>();
  const laboratorios: Laboratorio[] = [];

  for (const fila of datos.filas) {
    const tipo = tipos[Number(fila.idTpLab)];
    if (!tipo) continue;
    const idLab = Number(fila.idLab);
    const ids = [...disciplinas.keys()].filter((id) => Number(fila[`dis${id}`]) === 1);
    const estado = estados.get(Number(fila.idEstado) || Number(fila.idEstadoDepen)) ?? "";
    const sedeNombre = estado === "NO ESPECIFICADO" ? "" : estadosConAcentos[estado] ?? toTitleCase(estado);
    const filasEquipo = equiposPorLab.get(idLab) ?? [];
    const equipos = uniqueValues(filasEquipo.map((equipo) => equipo.nombre));
    const servicios = uniqueValues(filasEquipo.map((equipo) => equipo.tpPruebasServicio));
    for (const equipo of equipos) {
      const frecuencia = frecuencias.get(normalizeText(equipo)) ?? { etiqueta: toTitleCase(equipo.toUpperCase()), total: 0 };
      frecuencia.total++;
      frecuencias.set(normalizeText(equipo), frecuencia);
    }
    const certificados = certificaciones.get(idLab) ?? [];
    const acreditados = acreditaciones.get(idLab) ?? [];
    const siglas = getText(fila.siglas);
    const perfil: Perfil[] = [];
    if (Number(fila.objServicios) === 1) perfil.push("servicios");
    if (Number(fila.objDocencia) === 1) perfil.push("docencia");
    if (Number(fila.objInvesBasica) === 1) perfil.push("basica");
    if (Number(fila.objInvesApli) === 1) perfil.push("aplicada");
    const lat = Number(fila.latitud), lng = Number(fila.longitud);
    const lab: Laboratorio = {
      idLab, nombre: toTitleCase(fila.labNombre, [siglas]), siglas, tipo,
      entidad: getText(fila.dependenciaTitulo) || toTitleCase(getText(fila.dependencia), [getText(fila.iniciales)]),
      entidadSiglas: getText(fila.iniciales), sede: slugify(sedeNombre), sedeNombre,
      grupos: grupos.filter((grupo) => grupo.disciplinas.some((id) => ids.includes(id))).map((grupo) => grupo.clave),
      disciplinas: ids.map((id) => disciplinas.get(id)!), palabrasClave: getText(fila.palabrasClave),
      servicios, equipos,
      distinciones: [...certificados.map((fila) => formatDistinction("Certificación", fila)), ...acreditados.map((fila) => formatDistinction("Acreditación", fila))],
      certificado: certificados.length > 0, acreditado: acreditados.length > 0,
      micrositio: Number(fila.marcaAutorizaInfoWeb) === 2, perfil, ubicacion: formatAddress(fila),
      mapa: lat && lng && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? `https://www.google.com/maps?q=${lat},${lng}` : "",
      sitio: Number(fila.marcaAutorizaInfoWeb) === 2 ? `https://labunam.unam.mx/micrositio/index.php?il=${idLab}` : normalizeWebsite(fila.webLab),
      fecha: getText(fila.fecha), indice: "",
    };
    lab.indice = normalizeText([lab.nombre, siglas, lab.entidad, lab.entidadSiglas, lab.palabrasClave, getText(fila.subDis), ...lab.disciplinas, ...equipos, ...servicios].join(" | "));
    laboratorios.push(lab);
  }
  laboratorios.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const frecuentes = [...frecuencias.values()].filter((equipo) => equipo.total >= 3).sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es")).slice(0, 60);
  return {
    laboratorios,
    sedes: buildOptions(laboratorios.map((lab) => lab.sedeNombre), laboratorios, "sede"),
    disciplinas: buildOptions([...disciplinas.values()], laboratorios, "disciplinas"),
    sugerencias: uniqueValues([...disciplinas.values(), ...frecuentes.map((equipo) => equipo.etiqueta)]),
  };
}
