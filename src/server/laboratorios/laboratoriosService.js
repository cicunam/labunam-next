// LabUNAM
// Servidor: laboratorios
// laboratoriosService (lo que páginas y API pueden preguntar sobre los laboratorios)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import {
  countFacet,
  filterLaboratorios,
  normalizeCriteria,
  perfiles,
  reconocimientos,
} from "../../lib/buscador/buscador";
import { getPhotos } from "../../lib/fotos/fotos";
import { grupos } from "../../lib/grupos/grupos";
import { redes } from "../../lib/redes/redes";

// Servicios
import { loadCatalog } from "./laboratoriosCatalogo";
import { readPhotos } from "../fotos/fotosService";

// Definición del servicio
// Todas las funciones leen la misma copia en caché: llamarlas juntas no multiplica consultas.

export function isValidId(
  id, // String - Identificador recibido en la URL; sólo se aceptan enteros positivos sin ceros a la izquierda
) {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

// Ficha pública compartida por la página y el modal. No expone el índice de búsqueda ni filas SQL.
export async function getById(
  id, // String - Identificador del laboratorio
) {
  const laboratorio = await findLaboratorio(id);
  if (!laboratorio) {
    return null;
  }
  const photos = await readPhotos();
  return {
    idLab: laboratorio.idLab,
    nombre: laboratorio.nombre,
    tipo: laboratorio.tipo,
    entidad: laboratorio.entidad,
    sedeNombre: laboratorio.sedeNombre,
    ubicacion: laboratorio.ubicacion,
    mapa: laboratorio.mapa,
    servicios: laboratorio.servicios,
    equipos: laboratorio.equipos,
    distinciones: laboratorio.distinciones,
    sitio: laboratorio.sitio,
    galeria: getPhotos(laboratorio.idLab, photos, laboratorio.grupos),
  };
}

// Datos mínimos para la solicitud de servicio, sin leer fotografías.
export async function getContactDetails(
  id, // String - Identificador del laboratorio
) {
  const laboratorio = await findLaboratorio(id);
  if (!laboratorio) {
    return null;
  }
  return {
    idLab: laboratorio.idLab,
    nombre: laboratorio.nombre,
    entidad: laboratorio.entidad,
    servicios: laboratorio.servicios,
    sitio: laboratorio.sitio,
  };
}

// Resultados y filtros de la página del catálogo, calculados sobre la misma copia
// para que sus conteos coincidan.
export async function searchLaboratorios(
  parameters, // Object - Parámetros de la URL tal como los entrega Next; sólo se conservan las cadenas
) {
  const [catalogo, photos] = await Promise.all([loadCatalog(), readPhotos()]);
  // Next puede entregar valores repetidos como arrays; sólo aceptamos criterios simples.
  const entries = Object.entries(parameters).filter(([, value]) => typeof value === "string");
  const criteria = normalizeCriteria(catalogo.laboratorios, Object.fromEntries(entries));
  const { filtros, total } = prepareFilters(catalogo, criteria);

  return {
    criteria,
    results: filterLaboratorios(catalogo.laboratorios, criteria),
    filters: filtros,
    total,
    locations: catalogo.sedes,
    suggestions: catalogo.sugerencias,
    photos,
  };
}

// Conteos de cada filtro para el diálogo de filtros, sin cambiar la URL.
export async function getFilterCounts(
  parameters, // Object - Parámetros de la petición a /api/filtros
) {
  const catalogo = await loadCatalog();
  const criteria = normalizeCriteria(catalogo.laboratorios, parameters);
  return prepareFilters(catalogo, criteria);
}

// Sedes y sugerencias para el buscador.
export async function getSearchOptions() {
  const catalogo = await loadCatalog();
  return { locations: catalogo.sedes, suggestions: catalogo.sugerencias };
}

// Total de laboratorios y cuántos hay por tipo de red y por área.
export async function countLaboratorios() {
  const { laboratorios } = await loadCatalog();
  return {
    total: laboratorios.length,
    tipos: countFacet(laboratorios, {}, "tipo", Object.keys(redes)),
    areas: countFacet(
      laboratorios,
      {},
      "disciplina",
      grupos.map((grupo) => grupo.clave),
    ),
  };
}

// Laboratorios aprobados o actualizados más recientemente.
export async function getRecentLaboratorios(
  limit = 4, // Number Optional - Cuántos laboratorios devolver
) {
  const { laboratorios } = await loadCatalog();
  // Copiamos antes de ordenar para no alterar el orden alfabético del catálogo compartido.
  return [...laboratorios]
    .sort((first, second) => second.fecha.localeCompare(first.fecha) || second.idLab - first.idLab)
    .slice(0, limit);
}

// Utilidades

async function findLaboratorio(
  id, // String - Identificador del laboratorio
) {
  if (!isValidId(id)) {
    return null;
  }
  const { laboratorios } = await loadCatalog();
  return laboratorios.find((laboratorio) => laboratorio.idLab === Number(id)) ?? null;
}

// Cada filtro cuenta sus opciones con los demás filtros aplicados, para mostrar cuántos
// resultados daría elegir cada una.
function prepareFilters(
  catalogo, // Object - Catálogo armado por laboratoriosCatalogo
  criterios, // Object - Criterios ya validados con normalizeCriteria
) {
  const getOptions = (opciones) =>
    Object.entries(opciones).map(([clave, etiqueta]) => ({ clave, etiqueta, total: 0 }));
  const definiciones = [
    {
      eje: "disciplina",
      etiqueta: "Área",
      opciones: grupos.map((g) => ({ clave: g.clave, etiqueta: g.etiqueta, total: 0 })),
    },
    { eje: "especialidad", etiqueta: "Disciplina", opciones: catalogo.disciplinas },
    { eje: "sede", etiqueta: "Sede", opciones: catalogo.sedes },
    { eje: "perfil", etiqueta: "Actividad", opciones: getOptions(perfiles) },
    { eje: "reconocimiento", etiqueta: "Reconocimientos", opciones: getOptions(reconocimientos) },
  ];
  return {
    total: filterLaboratorios(catalogo.laboratorios, criterios).length,
    filtros: definiciones.map((filtro) => {
      const cuentas = countFacet(
        catalogo.laboratorios,
        criterios,
        filtro.eje,
        filtro.opciones.map((o) => o.clave),
      );
      const opciones = filtro.opciones.map((opcion) => ({
        ...opcion,
        total: cuentas[opcion.clave],
      }));
      if (["especialidad", "sede"].includes(filtro.eje)) {
        opciones.sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"));
      }
      return {
        ...filtro,
        opciones,
        cualquiera: filterLaboratorios(catalogo.laboratorios, { ...criterios, [filtro.eje]: "" })
          .length,
      };
    }),
  };
}
