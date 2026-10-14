// LabUNAM
// Utilidades compartidas
// sugerencias (opciones del buscador y búsquedas recientes del navegador)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { normalizeText } from "../texto/texto";

// Definición del módulo
// Sin texto mostramos cinco búsquedas recientes. Con texto damos prioridad a hasta
// tres recientes y completamos con sugerencias del catálogo, sin duplicados, hasta ocho.
export function getSearchOptions(
  q, // String - Texto escrito en el buscador
  sugerencias, // Array - Textos (String) del catálogo que se ofrecen como sugerencia
  recientes, // Array - Búsquedas recientes (String) guardadas en el navegador, la más nueva primero
) {
  const clave = normalizeText(q);
  if (!clave) {
    return recientes.slice(0, 5).map((texto) => ({ texto, reciente: true }));
  }
  const anteriores = recientes
    .filter((texto) => normalizeText(texto).includes(clave) && normalizeText(texto) !== clave)
    .slice(0, 3);
  const nuevas = sugerencias.filter(
    (texto) =>
      normalizeText(texto).includes(clave) &&
      !anteriores.some((anterior) => normalizeText(anterior) === normalizeText(texto)),
  );
  return [
    ...anteriores.map((texto) => ({ texto, reciente: true })),
    ...nuevas.map((texto) => ({ texto, reciente: false })),
  ].slice(0, 8);
}
// Lee hasta cinco búsquedas recientes; devuelve una lista vacía si el almacenamiento falla o está dañado.
// No recibe parámetros.
export function readRecentSearches() {
  try {
    const datos = JSON.parse(localStorage.getItem("labunam.busquedas") ?? "[]");
    return Array.isArray(datos) ? datos.filter((dato) => typeof dato === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}
// Guarda la búsqueda al frente de las recientes, sin repetidos y con un máximo de cinco.
export function saveRecentSearch(
  q, // String - Texto buscado; se ignora si está vacío
) {
  if (!q.trim()) {
    return;
  }
  try {
    localStorage.setItem(
      "labunam.busquedas",
      JSON.stringify(
        [
          q.trim(),
          ...readRecentSearches().filter((texto) => normalizeText(texto) !== normalizeText(q)),
        ].slice(0, 5),
      ),
    );
  } catch {
    // La búsqueda sigue disponible cuando el navegador bloquea el almacenamiento.
  }
}
