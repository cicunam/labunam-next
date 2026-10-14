// LabUNAM
// Utilidades compartidas
// instituciones (búsqueda de instituciones por nombre o siglas)
// Ángelo M

// Dependencias
import { normalizeText } from "../texto/texto";

// Constantes
export const MIN_SEARCH_LENGTH = 2;
const LIMIT = 15;

// Definición del módulo
// Las coincidencias exactas y por inicio aparecen primero para que el nombre completo siempre
// esté entre las sugerencias.
export function searchInstitutions(
  instituciones, // Array - Instituciones { clave, nombre, siglas }
  text, // String - Texto escrito por la persona
  limit = LIMIT, // Number Optional - Máximo de resultados
) {
  const wanted = normalizeText(text ?? "");
  if (wanted.length < MIN_SEARCH_LENGTH) {
    return [];
  }
  const matches = [];
  for (const institucion of instituciones) {
    const nombre = normalizeText(institucion.nombre);
    const siglas = normalizeText(institucion.siglas ?? "");
    let rank = -1;
    if (nombre === wanted || siglas === wanted) {
      rank = 0;
    } else if (nombre.startsWith(wanted)) {
      rank = 1;
    } else if (nombre.includes(wanted)) {
      rank = 2;
    }
    if (rank >= 0) {
      matches.push({ rank, institucion });
    }
  }
  return matches
    .sort(
      (first, second) =>
        first.rank - second.rank ||
        first.institucion.nombre.localeCompare(second.institucion.nombre, "es"),
    )
    .slice(0, limit)
    .map(({ institucion }) => institucion);
}
