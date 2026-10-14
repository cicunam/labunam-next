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
  const found = new Set(coincidencias.map(normalizeText));
  const seen = new Set();
  const candidates = [
    ...servicios.map((texto) => ({ texto, tipo: "Servicio" })),
    ...equipos.map((texto) => ({ texto, tipo: "Equipo" })),
  ].filter(({ texto }) => {
    const key = normalizeText(texto);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  const related = candidates.filter(({ texto }) => found.has(normalizeText(texto)));
  const list = related.length ? related : candidates;
  const first = list[0];
  const second = list.find((item) => item.tipo !== first?.tipo) ?? list[1];
  return {
    coincide: related.length > 0,
    items: [first, second].filter((item) => item !== undefined),
  };
}
// Fragmento literal: acerca la palabra buscada al inicio sin inventar un resumen.
export function getCapabilityExcerpt(
  text, // String - Descripción completa del servicio o equipo
  query = "", // String Optional - Texto buscado; el fragmento empieza cerca de su primera palabra encontrada
) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 120) {
    return clean;
  }
  const indexes = normalizeText(query)
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => normalizeText(clean).indexOf(p))
    .filter((i) => i >= 0);
  const match = indexes.length ? Math.min(...indexes) : 0;
  let start = Math.max(0, match - 14);
  if (start > 0) {
    start = clean.lastIndexOf(" ", start) + 1;
  }
  let end = Math.min(clean.length, start + 120);
  if (end < clean.length) {
    const cut = clean.lastIndexOf(" ", end);
    if (cut > start) {
      end = cut;
    }
  }
  return (start ? "…" : "") + clean.slice(start, end) + (end < clean.length ? "…" : "");
}
