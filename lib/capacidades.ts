import { plano } from "./texto";

export function capacidadesDe(servicios: string[], equipos: string[], coincidencias: string[] = []) {
  const encontrados = new Set(coincidencias.map(plano));
  const vistos = new Set<string>();
  const opciones = [
    ...servicios.map((texto) => ({ texto, tipo: "Servicio" })),
    ...equipos.map((texto) => ({ texto, tipo: "Equipo" })),
  ].filter(({ texto }) => {
    const clave = plano(texto);
    if (!clave || vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
  const relacionadas = opciones.filter(({ texto }) => encontrados.has(plano(texto)));
  const lista = relacionadas.length ? relacionadas : opciones;
  const primero = lista[0];
  const segundo = lista.find((item) => item.tipo !== primero?.tipo) ?? lista[1];
  return { coincide: relacionadas.length > 0, items: [primero, segundo].filter((item) => item !== undefined) };

}


// Fragmento literal: acerca la palabra buscada al inicio sin inventar un resumen.
export function fragmentoCapacidad(texto: string, busqueda = ""): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= 120) return limpio;
  const indices = plano(busqueda).split(/\s+/).filter(Boolean).map((p) => plano(limpio).indexOf(p)).filter((i) => i >= 0);
  const coincidencia = indices.length ? Math.min(...indices) : 0;
  let inicio = Math.max(0, coincidencia - 14);
  if (inicio > 0) inicio = limpio.lastIndexOf(" ", inicio) + 1;
  let fin = Math.min(limpio.length, inicio + 120);
  if (fin < limpio.length) { const corte = limpio.lastIndexOf(" ", fin); if (corte > inicio) fin = corte; }
  return (inicio ? "…" : "") + limpio.slice(inicio, fin) + (fin < limpio.length ? "…" : "");
}
