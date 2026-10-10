import { slugify, normalizeText, toTitleCase } from "../../lib/texto/texto";
import { uniqueValues } from "../laboratorios/laboratorioFormatting";

export function buildOptions(valores, laboratorios, eje) {
  const etiquetas = new Map(valores.filter(Boolean).map((valor) => [slugify(valor), valor]));
  const totales = new Map();
  for (const lab of laboratorios) {
    const claves = eje === "sede" ? [lab.sede] : lab.disciplinas.map(slugify);
    for (const valor of new Set(claves)) {
      totales.set(valor, (totales.get(valor) ?? 0) + 1);
    }
  }
  return [...etiquetas]
    .map(([clave, etiqueta]) => ({ clave, etiqueta, total: totales.get(clave) ?? 0 }))
    .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"));
}
export function buildSuggestions(laboratorios, disciplinas) {
  const frecuencias = new Map();
  for (const laboratorio of laboratorios) {
    const equipos = laboratorio.equipos;
    for (const equipo of equipos) {
      const frecuencia = frecuencias.get(normalizeText(equipo)) ?? {
        etiqueta: toTitleCase(equipo.toUpperCase()),
        total: 0,
      };
      frecuencia.total++;
      frecuencias.set(normalizeText(equipo), frecuencia);
    }
  }
  // Las sugerencias combinan disciplinas con equipos presentes en al menos tres laboratorios.
  // Limitamos a 60 equipos antes de enviar esta lista pequeña al buscador del navegador.
  const frecuentes = [...frecuencias.values()]
    .filter((equipo) => equipo.total >= 3)
    .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"))
    .slice(0, 60);
  return uniqueValues([...disciplinas, ...frecuentes.map((equipo) => equipo.etiqueta)]);
}
