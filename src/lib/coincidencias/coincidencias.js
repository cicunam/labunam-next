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
// Sirve para instituciones y laboratorios. Las coincidencias exactas y por inicio aparecen
// primero para que el nombre completo siempre esté entre las sugerencias.
export function searchByName(
  items, // Array - Elementos con nombre y siglas (instituciones o laboratorios)
  text, // String - Texto escrito por la persona
  limit = LIMIT, // Number Optional - Máximo de resultados
) {
  const wanted = normalizeText(text ?? "");
  if (wanted.length < MIN_SEARCH_LENGTH) {
    return [];
  }
  const matches = [];
  for (const item of items) {
    const nombre = normalizeText(item.nombre);
    const siglas = normalizeText(item.siglas ?? "");
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
