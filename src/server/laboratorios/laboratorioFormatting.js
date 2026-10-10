import { normalizeText, toTitleCase } from "../../lib/texto/texto";

export const getText = (valor) => String(valor ?? "").trim();
export function uniqueValues(valores) {
  const encontrados = new Map();
  for (const valor of valores) {
    const limpio = getText(valor).replace(/\s+/gu, " ");
    if (limpio && !encontrados.has(normalizeText(limpio))) {
      encontrados.set(normalizeText(limpio), limpio);
    }
  }
  return [...encontrados.values()];
}
export function formatDistinction(tipo, fila) {
  const organismo = getText(fila.organismo);
  const fecha = getText(fila.fFin);
  return `${tipo}: ${getText(fila.nombre)}${organismo ? ` · ${organismo}` : ""}${fecha && fecha !== "0000-00-00" ? ` (vigencia ${fecha.slice(0, 4)})` : ""}`;
}
export function formatAddress(fila) {
  const partes = [
    ...new Set(
      [fila.calleNum, fila.colonia, fila.muniDeleg]
        .map(getText)
        .filter((parte) => parte && parte !== "0"),
    ),
  ].map((parte) => toTitleCase(parte));
  const cp = getText(fila.cp);
  if (cp && cp !== "0") {
    partes.push(`C.P. ${cp}`);
  }
  return partes.join(", ");
}
export function normalizeWebsite(web) {
  const valor = getText(web);
  if (!valor) {
    return "";
  }
  // Los enlaces de la base son externos; sólo se admiten protocolos navegables.
  if (/^[a-z][a-z\d+.-]*:/i.test(valor) && !/^https?:\/\//i.test(valor)) {
    return "";
  }
  try {
    const url = new URL(/^https?:\/\//i.test(valor) ? valor : `http://${valor}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
