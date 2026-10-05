const acentos: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n",
  à: "a", è: "e", ì: "i", ò: "o", ù: "u",
};
const menores = new Set(["de", "del", "la", "las", "los", "el", "y", "e", "o", "u", "en", "a", "al", "con", "para", "por", "sobre", "sin"]);
const siglas = ["UNAM", "ISO", "ADN", "DNA", "RNA", "ARN", "PCR", "UV", "RMN", "IR", "HPLC", "GPS", "SIG", "GIS", "CO2", "HAWC", "MHZ", "IA", "TIC", "3D", "II", "III", "IV", "VI", "VII", "VIII", "IX", "XI", "XII", "XX", "XXI"];

export function normalizeText(texto: string): string {
  return texto.trim().toLowerCase().replace(/[áéíóúüñàèìòù]/g, (letra) => acentos[letra]);
}

export function slugify(texto: string): string {
  return normalizeText(texto).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function toTitleCase(texto: string, conservar: string[] = []): string {
  const limpio = texto.replace(/\s+/gu, " ").trim();
  const letras = limpio.match(/\p{L}/gu)?.length ?? 0;
  const mayusculas = limpio.match(/\p{Lu}/gu)?.length ?? 0;
  if (!letras || mayusculas / letras < 0.85) return limpio;

  const intactas = new Set([...siglas, ...conservar].flatMap((sigla) => sigla.toUpperCase().split(/[^\p{L}\p{N}]+/u)));
  return limpio.split(" ").map((palabra, posicion) => {
    const partes = palabra.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
    if (!partes) return palabra;
    const [, antes, nucleo, despues] = partes;
    if (!nucleo || intactas.has(nucleo.toUpperCase()) || /\p{N}/u.test(nucleo) || antes.startsWith("(")) return palabra;
    const minusculas = nucleo.toLowerCase();
    const nuevo = posicion > 0 && menores.has(minusculas)
      ? minusculas
      : minusculas.charAt(0).toUpperCase() + minusculas.slice(1);
    return antes + nuevo + despues;
  }).join(" ");
}
