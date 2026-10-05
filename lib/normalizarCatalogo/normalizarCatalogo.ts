import { clave, plano, titulo } from "../texto/texto";
import { grupos } from "../grupos/grupos";
import type { Catalogo, Laboratorio, Opcion, Perfil, TipoLaboratorio } from "../tipos/tipos";
import type { DatosCatalogo, FilaDistincion, FilaLaboratorio } from "../tiposBase/tiposBase";

const tipos: Record<number, TipoLaboratorio> = { 1: "internacionales", 2: "nacionales", 3: "universitarios", 4: "unidades" };
const estadosConAcentos: Record<string, string> = {
  MEXICO: "Estado de México", QUERETARO: "Querétaro", MICHOACAN: "Michoacán", YUCATAN: "Yucatán",
  "NUEVO LEON": "Nuevo León", "SAN LUIS POTOSI": "San Luis Potosí", "BAJA CALIFORNIA NORTE": "Baja California",
  "MEXICO D.F.": "Ciudad de México", "DISTRITO FEDERAL": "Ciudad de México",
};
const texto = (valor: string | number | null | undefined) => String(valor ?? "").trim();

function agrupar<T extends { idLab: number }>(filas: T[]): Map<number, T[]> {
  const grupos = new Map<number, T[]>();
  for (const fila of filas) {
    const id = Number(fila.idLab);
    const lista = grupos.get(id) ?? [];
    lista.push(fila);
    grupos.set(id, lista);
  }
  return grupos;
}

function unicos(valores: (string | null)[]): string[] {
  const encontrados = new Map<string, string>();
  for (const valor of valores) {
    const limpio = texto(valor).replace(/\s+/gu, " ");
    if (limpio && !encontrados.has(plano(limpio))) encontrados.set(plano(limpio), limpio);
  }
  return [...encontrados.values()];
}

function distincion(tipo: string, fila: FilaDistincion): string {
  const organismo = texto(fila.organismo);
  const fecha = texto(fila.fFin);
  return `${tipo}: ${texto(fila.nombre)}${organismo ? ` · ${organismo}` : ""}${fecha && fecha !== "0000-00-00" ? ` (vigencia ${fecha.slice(0, 4)})` : ""}`;
}

function direccion(fila: FilaLaboratorio): string {
  const partes = [...new Set([fila.calleNum, fila.colonia, fila.muniDeleg].map(texto).filter((parte) => parte && parte !== "0"))].map((parte) => titulo(parte));
  const cp = texto(fila.cp);
  if (cp && cp !== "0") partes.push(`C.P. ${cp}`);
  return partes.join(", ");
}

function sitio(web: string | null): string {
  const valor = texto(web);
  if (!valor) return "";
  // Los enlaces de la base son externos; sólo se admiten protocolos navegables.
  if (/^[a-z][a-z\d+.-]*:/i.test(valor) && !/^https?:\/\//i.test(valor)) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(valor) ? valor : `http://${valor}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch { return ""; }
}

function opciones(valores: string[], laboratorios: Laboratorio[], eje: "sede" | "disciplinas"): Opcion[] {
  const etiquetas = new Map(valores.filter(Boolean).map((valor) => [clave(valor), valor]));
  const totales = new Map<string, number>();
  for (const lab of laboratorios) {
    const claves = eje === "sede" ? [lab.sede] : lab.disciplinas.map(clave);
    for (const valor of new Set(claves)) totales.set(valor, (totales.get(valor) ?? 0) + 1);
  }
  return [...etiquetas].map(([clave, etiqueta]) => ({ clave, etiqueta, total: totales.get(clave) ?? 0 }))
    .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"));
}

export function normalizarCatalogo(datos: DatosCatalogo): Catalogo {
  const estados = new Map(datos.estados.map((fila) => [Number(fila.idEstado), texto(fila.estado)]));
  const disciplinas = new Map(datos.disciplinas.map((fila) => [Number(fila.idDis), titulo(fila.disiplina)]));
  const equiposPorLab = agrupar(datos.equipos);
  const certificaciones = agrupar(datos.certificaciones.filter((fila) => texto(fila.nombre)));
  const acreditaciones = agrupar(datos.acreditaciones.filter((fila) => texto(fila.nombre)));
  const frecuencias = new Map<string, { etiqueta: string; total: number }>();
  const laboratorios: Laboratorio[] = [];

  for (const fila of datos.filas) {
    const tipo = tipos[Number(fila.idTpLab)];
    if (!tipo) continue;
    const idLab = Number(fila.idLab);
    const ids = [...disciplinas.keys()].filter((id) => Number(fila[`dis${id}`]) === 1);
    const estado = estados.get(Number(fila.idEstado) || Number(fila.idEstadoDepen)) ?? "";
    const sedeNombre = estado === "NO ESPECIFICADO" ? "" : estadosConAcentos[estado] ?? titulo(estado);
    const filasEquipo = equiposPorLab.get(idLab) ?? [];
    const equipos = unicos(filasEquipo.map((equipo) => equipo.nombre));
    const servicios = unicos(filasEquipo.map((equipo) => equipo.tpPruebasServicio));
    for (const equipo of equipos) {
      const frecuencia = frecuencias.get(plano(equipo)) ?? { etiqueta: titulo(equipo.toUpperCase()), total: 0 };
      frecuencia.total++;
      frecuencias.set(plano(equipo), frecuencia);
    }
    const certificados = certificaciones.get(idLab) ?? [];
    const acreditados = acreditaciones.get(idLab) ?? [];
    const siglas = texto(fila.siglas);
    const perfil: Perfil[] = [];
    if (Number(fila.objServicios) === 1) perfil.push("servicios");
    if (Number(fila.objDocencia) === 1) perfil.push("docencia");
    if (Number(fila.objInvesBasica) === 1) perfil.push("basica");
    if (Number(fila.objInvesApli) === 1) perfil.push("aplicada");
    const lat = Number(fila.latitud), lng = Number(fila.longitud);
    const lab: Laboratorio = {
      idLab, nombre: titulo(fila.labNombre, [siglas]), siglas, tipo,
      entidad: texto(fila.dependenciaTitulo) || titulo(texto(fila.dependencia), [texto(fila.iniciales)]),
      entidadSiglas: texto(fila.iniciales), sede: clave(sedeNombre), sedeNombre,
      grupos: grupos.filter((grupo) => grupo.disciplinas.some((id) => ids.includes(id))).map((grupo) => grupo.clave),
      disciplinas: ids.map((id) => disciplinas.get(id)!), palabrasClave: texto(fila.palabrasClave),
      servicios, equipos,
      distinciones: [...certificados.map((fila) => distincion("Certificación", fila)), ...acreditados.map((fila) => distincion("Acreditación", fila))],
      certificado: certificados.length > 0, acreditado: acreditados.length > 0,
      micrositio: Number(fila.marcaAutorizaInfoWeb) === 2, perfil, ubicacion: direccion(fila),
      mapa: lat && lng && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? `https://www.google.com/maps?q=${lat},${lng}` : "",
      sitio: Number(fila.marcaAutorizaInfoWeb) === 2 ? `https://labunam.unam.mx/micrositio/index.php?il=${idLab}` : sitio(fila.webLab),
      fecha: texto(fila.fecha), indice: "",
    };
    lab.indice = plano([lab.nombre, siglas, lab.entidad, lab.entidadSiglas, lab.palabrasClave, texto(fila.subDis), ...lab.disciplinas, ...equipos, ...servicios].join(" | "));
    laboratorios.push(lab);
  }
  laboratorios.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const frecuentes = [...frecuencias.values()].filter((equipo) => equipo.total >= 3).sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es")).slice(0, 60);
  return {
    laboratorios,
    sedes: opciones(laboratorios.map((lab) => lab.sedeNombre), laboratorios, "sede"),
    disciplinas: opciones([...disciplinas.values()], laboratorios, "disciplinas"),
    sugerencias: unicos([...disciplinas.values(), ...frecuentes.map((equipo) => equipo.etiqueta)]),
  };
}
