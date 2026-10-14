// LabUNAM
// Utilidades compartidas
// texto (normalización, claves y formato de títulos)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Constantes
// Vocales acentuadas y eñe con su equivalente sin acento.
const acentos = {
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
const menores = new Set([
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
const siglas = [
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
  texto, // String - Texto original
) {
  return texto
    .trim()
    .toLowerCase()
    .replace(/[áéíóúüñàèìòù]/g, (letra) => acentos[letra]);
}
// Clave para URL con letras, números y guiones.
export function slugify(
  texto, // String - Texto original
) {
  return normalizeText(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
// Convierte a tipo título los textos escritos casi por completo en mayúsculas; respeta la escritura manual.
export function toTitleCase(
  texto, // String - Texto original, normalmente un nombre heredado en mayúsculas
  conservar = [], // Array Optional - Siglas (String) adicionales que conservan sus mayúsculas
) {
  const limpio = texto.replace(/\s+/gu, " ").trim();
  const letras = limpio.match(/\p{L}/gu)?.length ?? 0;
  const mayusculas = limpio.match(/\p{Lu}/gu)?.length ?? 0;
  if (!letras || mayusculas / letras < 0.85) {
    return limpio;
  }
  const intactas = new Set(
    [...siglas, ...conservar].flatMap((sigla) => sigla.toUpperCase().split(/[^\p{L}\p{N}]+/u)),
  );
  return limpio
    .split(" ")
    .map((palabra, posicion) => {
      const partes = palabra.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
      if (!partes) {
        return palabra;
      }
      const [, antes, nucleo, despues] = partes;
      if (
        !nucleo ||
        intactas.has(nucleo.toUpperCase()) ||
        /\p{N}/u.test(nucleo) ||
        antes.startsWith("(")
      ) {
        return palabra;
      }
      const minusculas = nucleo.toLowerCase();
      const nuevo =
        posicion > 0 && menores.has(minusculas)
          ? minusculas
          : minusculas.charAt(0).toUpperCase() + minusculas.slice(1);
      return antes + nuevo + despues;
    })
    .join(" ");
}

// Convierte cualquier valor de la base en texto sin espacios en los extremos.
export const getText = (
  valor, // String | Number - Valor de la base; null o undefined se convierten en cadena vacía
) => String(valor ?? "").trim();
// Quita vacíos y repetidos que sólo difieren en acentos, mayúsculas o espacios.
export function uniqueValues(
  valores, // Array - Valores de la base (String | Number), en el orden en que llegan
) {
  const encontrados = new Map();
  for (const valor of valores) {
    const limpio = getText(valor).replace(/\s+/gu, " ");
    if (limpio && !encontrados.has(normalizeText(limpio))) {
      encontrados.set(normalizeText(limpio), limpio);
    }
  }
  return [...encontrados.values()];
}
