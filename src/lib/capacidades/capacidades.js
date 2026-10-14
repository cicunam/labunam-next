// LabUNAM
// Utilidades compartidas
// capacidades (servicios y equipos que se destacan en las tarjetas)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { normalizeText } from "../texto/texto";

// Definición del módulo
// Elige hasta dos capacidades sin repetir, preferentemente las que coinciden con la búsqueda y de tipos distintos.
export function getCapabilities(
  servicios, // Array - Servicios (String) del laboratorio, en el orden en que llegan
  equipos, // Array - Equipos (String) del laboratorio, en el orden en que llegan
  coincidencias = [], // Array Optional - Servicios o equipos (String) que coinciden con la búsqueda
) {
  const encontrados = new Set(coincidencias.map(normalizeText));
  const vistos = new Set();
  const opciones = [
    ...servicios.map((texto) => ({ texto, tipo: "Servicio" })),
    ...equipos.map((texto) => ({ texto, tipo: "Equipo" })),
  ].filter(({ texto }) => {
    const clave = normalizeText(texto);
    if (!clave || vistos.has(clave)) {
      return false;
    }
    vistos.add(clave);
    return true;
  });
  const relacionadas = opciones.filter(({ texto }) => encontrados.has(normalizeText(texto)));
  const lista = relacionadas.length ? relacionadas : opciones;
  const primero = lista[0];
  const segundo = lista.find((item) => item.tipo !== primero?.tipo) ?? lista[1];
  return {
    coincide: relacionadas.length > 0,
    items: [primero, segundo].filter((item) => item !== undefined),
  };
}
// Fragmento literal: acerca la palabra buscada al inicio sin inventar un resumen.
export function getCapabilityExcerpt(
  texto, // String - Descripción completa del servicio o equipo
  busqueda = "", // String Optional - Texto buscado; el fragmento empieza cerca de su primera palabra encontrada
) {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= 120) {
    return limpio;
  }
  const indices = normalizeText(busqueda)
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => normalizeText(limpio).indexOf(p))
    .filter((i) => i >= 0);
  const coincidencia = indices.length ? Math.min(...indices) : 0;
  let inicio = Math.max(0, coincidencia - 14);
  if (inicio > 0) {
    inicio = limpio.lastIndexOf(" ", inicio) + 1;
  }
  let fin = Math.min(limpio.length, inicio + 120);
  if (fin < limpio.length) {
    const corte = limpio.lastIndexOf(" ", fin);
    if (corte > inicio) {
      fin = corte;
    }
  }
  return (inicio ? "…" : "") + limpio.slice(inicio, fin) + (fin < limpio.length ? "…" : "");
}
