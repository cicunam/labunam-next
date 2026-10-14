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
  recent, // Array - Búsquedas recientes (String) guardadas en el navegador, la más nueva primero
) {
  const key = normalizeText(q);
  if (!key) {
    return recent.slice(0, 5).map((texto) => ({ texto, reciente: true }));
  }
  const previous = recent
    .filter((texto) => normalizeText(texto).includes(key) && normalizeText(texto) !== key)
    .slice(0, 3);
  const added = sugerencias.filter(
    (texto) =>
      normalizeText(texto).includes(key) &&
      !previous.some((item) => normalizeText(item) === normalizeText(texto)),
  );
  return [
    ...previous.map((texto) => ({ texto, reciente: true })),
    ...added.map((texto) => ({ texto, reciente: false })),
  ].slice(0, 8);
}
// Lee hasta cinco búsquedas recientes; devuelve una lista vacía si el almacenamiento falla o está dañado.
// No recibe parámetros.
export function readRecentSearches() {
  try {
    const data = JSON.parse(localStorage.getItem("labunam.busquedas") ?? "[]");
    return Array.isArray(data) ? data.filter((item) => typeof item === "string").slice(0, 5) : [];
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
