// LabUNAM
// Utilidades compartidas
// coincidencias (búsqueda por nombre o siglas para los campos con sugerencias)
// Ángelo M

// Dependencias
import { normalizeText } from "../texto/texto";

// Constantes
export const MIN_SEARCH_LENGTH = 2;
const LIMIT = 15;

// Definición del módulo
// La usan las instituciones de la solicitud (los laboratorios usan la búsqueda del catálogo,
// filterLaboratorios). Las coincidencias exactas y por inicio aparecen
// primero para que el nombre completo siempre esté entre las sugerencias. Si los elementos traen
// searchName y searchAcronym (de withSearchKeys) se usan sin volver a normalizar.
export function searchByName(
  items, // Array - Elementos con nombre y siglas, como las instituciones
  text, // String - Texto escrito por la persona
  limit = LIMIT, // Number Optional - Máximo de resultados
) {
  const wanted = normalizeText(text ?? "");
  if (wanted.length < MIN_SEARCH_LENGTH) {
    return [];
  }
  const matches = [];
  for (const item of items) {
    const nombre = item.searchName ?? normalizeText(item.nombre);
    const siglas = item.searchAcronym ?? normalizeText(item.siglas ?? "");
    let rank = -1;
    if (nombre === wanted || siglas === wanted) {
      rank = 0;
    } else if (nombre.startsWith(wanted)) {
      rank = 1;
    } else if (nombre.includes(wanted)) {
      rank = 2;
    }
    if (rank >= 0) {
      matches.push({ rank, item });
    }
  }
  return matches
    .sort(
      (first, second) =>
        first.rank - second.rank || first.item.nombre.localeCompare(second.item.nombre, "es"),
    )
    .slice(0, limit)
    .map(({ item }) => item);
}

// Precalcula las claves de búsqueda de una lista que se consulta muchas veces, como las miles de
// instituciones en caché.
export function withSearchKeys(
  items, // Array - Elementos con nombre y siglas
) {
  return items.map((item) => ({
    ...item,
    searchName: normalizeText(item.nombre),
    searchAcronym: normalizeText(item.siglas ?? ""),
  }));
}

// Filtra una lista corta que ya está en la página (países, estados, dependencias): sin texto
// devuelve la lista completa para recorrerla como un selector; con texto, primero las opciones
// que empiezan con él y luego las que lo contienen, sin distinguir acentos ni mayúsculas.
export function filterByName(
  items, // Array - Elementos con nombre
  text, // String - Texto escrito
) {
  const wanted = normalizeText(text ?? "");
  if (!wanted) {
    return items;
  }
  const starts = [];
  const contains = [];
  for (const item of items) {
    const nombre = normalizeText(item.nombre);
    if (nombre.startsWith(wanted)) {
      starts.push(item);
    } else if (nombre.includes(wanted)) {
      contains.push(item);
    }
  }
  return [...starts, ...contains];
}
