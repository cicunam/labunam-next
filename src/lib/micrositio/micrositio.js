// LabUNAM
// Lib: micrositio
// micrositio (texto HTML del micrositio convertido en frases)
// Ivonne Aviles <daviles@cic.unam.mx>

// Constantes
const entidades = {
  nbsp: " ",
  aacute: "á",
  eacute: "é",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  Aacute: "Á",
  Eacute: "É",
  Iacute: "Í",
  Oacute: "Ó",
  Uacute: "Ú",
  ntilde: "ñ",
  Ntilde: "Ñ",
  iquest: "¿",
};

// Definición del módulo
export function htmlToParagraphs(
  html, // String - HTML de intro, mision o vision; puede llegar vacío
) {
  const conCortes = String(html ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  const texto = conCortes
    .replace(/&#(\d+);/g, (_, codigo) => String.fromCodePoint(Number(codigo)))
    .replace(/&([a-z]+);/gi, (original, nombre) => entidades[nombre] ?? original);
  return texto
    .split(/\n+/)
    .map((linea) => linea.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}