import { normalizeText } from "../texto/texto";

export function getSearchOptions(q: string, sugerencias: string[], recientes: string[]): { texto: string; reciente: boolean }[] {
  const clave = normalizeText(q);
  if (!clave) return recientes.slice(0, 5).map((texto) => ({ texto, reciente: true }));
  const anteriores = recientes.filter((texto) => normalizeText(texto).includes(clave) && normalizeText(texto) !== clave).slice(0, 3);
  const nuevas = sugerencias.filter((texto) => normalizeText(texto).includes(clave) && !anteriores.some((anterior) => normalizeText(anterior) === normalizeText(texto)));
  return [...anteriores.map((texto) => ({ texto, reciente: true })), ...nuevas.map((texto) => ({ texto, reciente: false }))].slice(0, 8);
}

export function readRecentSearches(): string[] {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem("labunam.busquedas") ?? "[]");
    return Array.isArray(datos) ? datos.filter((dato): dato is string => typeof dato === "string").slice(0, 5) : [];
  } catch { return []; }
}

export function saveRecentSearch(q: string): void {
  if (!q.trim()) return;
  try { localStorage.setItem("labunam.busquedas", JSON.stringify([q.trim(), ...readRecentSearches().filter((texto) => normalizeText(texto) !== normalizeText(q))].slice(0, 5))); }
  catch { /* La búsqueda sigue disponible cuando el navegador bloquea el almacenamiento. */ }
}
