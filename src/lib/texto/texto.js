// LabUNAM
// Utilidades compartidas
// texto (normalización, claves y formato de títulos)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Constantes
// Vocales acentuadas y eñe con su equivalente sin acento.
const accents = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ü: "u",
  ñ: "n",
  à: "a",
  è: "e",
  ì: "i",
  ò: "o",
  ù: "u",
};
// Palabras que quedan en minúsculas dentro de un título, salvo al inicio.
const minorWords = new Set([
  "de",
  "del",
  "la",
  "las",
  "los",
  "el",
  "y",
  "e",
  "o",
  "u",
  "en",
  "a",
  "al",
  "con",
  "para",
  "por",
  "sobre",
  "sin",
]);
// Siglas y números romanos que conservan sus mayúsculas.
const acronyms = [
  "UNAM",
  "ISO",
  "ADN",
  "DNA",
  "RNA",
  "ARN",
  "PCR",
  "UV",
  "RMN",
  "IR",
  "HPLC",
  "GPS",
  "SIG",
  "GIS",
  "CO2",
  "HAWC",
  "MHZ",
  "IA",
  "TIC",
  "3D",
  "II",
  "III",
  "IV",
  "VI",
  "VII",
  "VIII",
  "IX",
  "XI",
  "XII",
  "XX",
  "XXI",
];

// Definición del módulo
// Texto en minúsculas, sin acentos ni espacios en los extremos, para comparar y buscar.
export function normalizeText(
  text, // String - Texto original
) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[áéíóúüñàèìòù]/g, (letter) => accents[letter]);
}
// Clave para URL con letras, números y guiones.
export function slugify(
  text, // String - Texto original
) {
  return normalizeText(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
// Convierte a tipo título los textos escritos casi por completo en mayúsculas; respeta la escritura manual.
export function toTitleCase(
  text, // String - Texto original, normalmente un nombre heredado en mayúsculas
  keep = [], // Array Optional - Siglas (String) adicionales que conservan sus mayúsculas
) {
  const clean = text.replace(/\s+/gu, " ").trim();
  const letters = clean.match(/\p{L}/gu)?.length ?? 0;
  const uppercase = clean.match(/\p{Lu}/gu)?.length ?? 0;
  if (!letters || uppercase / letters < 0.85) {
    return clean;
  }
  const intact = new Set(
    [...acronyms, ...keep].flatMap((acronym) => acronym.toUpperCase().split(/[^\p{L}\p{N}]+/u)),
  );
  return clean
    .split(" ")
    .map((word, position) => {
      const parts = word.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
      if (!parts) {
        return word;
      }
      const [, before, core, after] = parts;
      if (
        !core ||
        intact.has(core.toUpperCase()) ||
        /\p{N}/u.test(core) ||
        before.startsWith("(")
      ) {
        return word;
      }
      const lower = core.toLowerCase();
      const recased =
        position > 0 && minorWords.has(lower)
          ? lower
          : lower.charAt(0).toUpperCase() + lower.slice(1);
      return before + recased + after;
    })
    .join(" ");
}

// Convierte cualquier valor de la base en texto sin espacios en los extremos.
export const getText = (
  value, // String | Number - Valor de la base; null o undefined se convierten en cadena vacía
) => String(value ?? "").trim();
// Quita vacíos y repetidos que sólo difieren en acentos, mayúsculas o espacios.
export function uniqueValues(
  values, // Array - Valores de la base (String | Number), en el orden en que llegan
) {
  const found = new Map();
  for (const value of values) {
    const clean = getText(value).replace(/\s+/gu, " ");
    if (clean && !found.has(normalizeText(clean))) {
      found.set(normalizeText(clean), clean);
    }
  }
  return [...found.values()];
}
