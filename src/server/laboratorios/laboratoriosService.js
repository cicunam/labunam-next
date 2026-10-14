// LabUNAM
// Servidor: laboratorios
// laboratoriosService (lo que páginas y API pueden preguntar sobre los laboratorios)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import {
  countFacet,
  filterLaboratorios,
  filtros,
  normalizeCriteria,
} from "../../lib/buscador/buscador";
import { getPhotos } from "../../lib/fotos/fotos";

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
  const { filters, total } = prepareFilters(catalogo, criteria);

  return {
    criteria,
    results: filterLaboratorios(catalogo.laboratorios, criteria),
    filters,
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
    tipos: countFacet(laboratorios, {}, "tipo", getOptionKeys("tipo")),
    areas: countFacet(laboratorios, {}, "disciplina", getOptionKeys("disciplina")),
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

// Claves de las opciones fijas de un filtro (red o área), para los conteos de la portada.
function getOptionKeys(
  eje, // String - "tipo" o "disciplina"
) {
  return filtros
    .find((filtro) => filtro.eje === eje)
    .opciones()
    .map((opcion) => opcion.clave);
}

// Cada filtro del diálogo cuenta sus opciones con los demás filtros aplicados, para mostrar
// cuántos resultados daría elegir cada una.
function prepareFilters(
  catalogo, // Object - Catálogo armado por laboratoriosCatalogo
  criteria, // Object - Criterios ya validados con normalizeCriteria
) {
  return {
    total: filterLaboratorios(catalogo.laboratorios, criteria).length,
    filters: filtros
      .filter((filtro) => filtro.enDialogo)
      .map((filtro) => {
        const opciones = filtro.opciones(catalogo);
        const counts = countFacet(
          catalogo.laboratorios,
          criteria,
          filtro.eje,
          opciones.map((opcion) => opcion.clave),
        );
        const withTotals = opciones.map((opcion) => ({ ...opcion, total: counts[opcion.clave] }));
        if (filtro.reordenar) {
          withTotals.sort(
            (a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"),
          );
        }
        return {
          eje: filtro.eje,
          etiqueta: filtro.etiqueta,
          opciones: withTotals,
          cualquiera: filterLaboratorios(catalogo.laboratorios, { ...criteria, [filtro.eje]: "" })
            .length,
        };
      }),
  };
}
