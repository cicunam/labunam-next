// LabUNAM
// Utilidades compartidas
// solicitudes (opciones fijas, reglas de campos y coincidencias del formulario de solicitud)
// Ángelo M

// Dependencias
import { normalizeText } from "../texto/texto";

// Constantes
// Identificadores heredados del formulario PHP; la tabla de solicitudes los espera tal cual.
// section indica qué campos adicionales muestra cada opción.
export const TIPOS_SOLICITANTE = [
  { id: "1", label: "Persona física", section: null },
  { id: "2", label: "Empresa", section: "empresa" },
  { id: "3", label: "Entidad de la sociedad civil organizada", section: "sociedad" },
  { id: "4", label: "Institución de educación superior", section: "institucion" },
  { id: "5", label: "Centro o instituto de investigación", section: "institucion" },
  { id: "6", label: "Otro", section: "otro" },
];
export const TIPOS_SOLICITUD = [
  { id: "1", label: "Análisis o prueba", section: "analisis" },
  { id: "2", label: "Colaboración académica", section: "colaboracion" },
  { id: "3", label: "Capacitación", section: "capacitacion" },
  { id: "4", label: "Otro", section: "otra" },
];
export const TIEMPOS_ESPERA = [
  { id: "1", label: "De 1 a 3 días" },
  { id: "2", label: "Más de 3 días" },
];
export const TIEMPO_CON_DIAS = "2";
export const CERTIFICACIONES = [
  { id: "1", label: "Acreditación" },
  { id: "2", label: "Certificación" },
  { id: "0", label: "No aplica" },
];
export const TAMANOS_EMPRESA = ["Grande", "Mediana", "Pequeña", "Micro"].map((label) => ({
  id: label,
  label,
}));
// Sólo México y Estados Unidos tienen estados en el catálogo heredado.
const STATE_COUNTRIES = new Set(["MEX", "USA"]);
const UNAM = normalizeText("Universidad Nacional Autónoma de México");
// Reglas de los textos. Navegador y servidor las aplican con textError, sobre el mismo valor
// normalizado, para que ninguna persona reciba del servidor un error que el formulario no le advirtió.
// Los patrones se evalúan completos y con la bandera v.
export const RULES = {
  nombre: {
    minLength: 2,
    maxLength: 50,
    pattern: "[\\p{L} .'\\-]+",
    title: "Sólo letras, espacios, puntos, apóstrofos o guiones.",
  },
  organizacion: {
    minLength: 2,
    maxLength: 100,
    pattern: "[\\p{L}\\p{N} .,'&\\-]+",
    title: "Sólo letras, números, espacios y signos básicos.",
  },
  // Un correo puede contener «www.» o puntos seguidos de texto; no se revisa como texto libre.
  correo: {
    maxLength: 80,
    pattern: "[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}",
    title: "Escribe un correo electrónico válido.",
    allowUrls: true,
  },
  telefono: {
    minLength: 8,
    maxLength: 13,
    pattern: "[0-9]+",
    title: "Sólo números, entre 8 y 13 dígitos.",
  },
  descripcion: { minLength: 2, maxLength: 255 },
  norma: { minLength: 2, maxLength: 50 },
  dias: { min: 4, max: 365 },
};
// Igual que la versión anterior: los textos libres no admiten enlaces ni etiquetas HTML.
const FORBIDDEN = /[<>]|https?:\/\/|www\./iu;

// Definición del módulo
// Valor tal como se valida y se guarda: sin espacios en los extremos; en una línea, los espacios
// repetidos se reducen a uno, y en un texto largo se conservan los saltos de línea.
export function normalizeTextValue(
  value, // String - Texto escrito
  multiline = false, // Boolean Optional - El campo admite varias líneas
) {
  return multiline ? value.replace(/\r\n?/gu, "\n").trim() : value.replace(/\s+/gu, " ").trim();
}

// Devuelve el mensaje del primer problema del texto, o null si cumple la regla. Un texto vacío
// no tiene problemas aquí: la obligatoriedad la decide cada campo.
export function textError(
  value, // String - Texto escrito
  rule, // Object - Una de RULES
  multiline = false, // Boolean Optional - El campo admite varias líneas
) {
  const text = normalizeTextValue(value, multiline);
  if (!text) {
    return null;
  }
  // Se cuentan caracteres y no unidades UTF-16, igual en navegador y servidor.
  const length = [...text].length;
  if ((rule.minLength && length < rule.minLength) || (rule.maxLength && length > rule.maxLength)) {
    return `Debe tener entre ${rule.minLength ?? 1} y ${rule.maxLength} caracteres.`;
  }
  if (!rule.allowUrls && FORBIDDEN.test(text)) {
    return "No incluyas enlaces ni etiquetas HTML.";
  }
  if (rule.pattern && !new RegExp(`^(?:${rule.pattern})$`, "v").test(text)) {
    return rule.title ?? "Contiene caracteres no permitidos.";
  }
  return null;
}

// Devuelve la sección de campos adicionales de la opción con ese id, o null.
export function sectionFor(
  options, // Array - Opciones { id, section }
  id, // String - id elegido
) {
  return options.find((option) => option.id === id)?.section ?? null;
}

// El visitante puede escribir el nombre sin elegir la sugerencia; se acepta si coincide sin
// acentos ni mayúsculas.
export function findOption(
  options, // Array - Opciones de catálogo { clave, nombre }
  text, // String - Texto escrito
) {
  const wanted = normalizeText(text ?? "");
  return wanted
    ? (options.find((option) => normalizeText(option.nombre) === wanted) ?? null)
    : null;
}

export function requiresState(
  clavePais, // String - Clave del país elegido
) {
  return STATE_COUNTRIES.has(clavePais);
}

export function isUnam(
  nombre, // String - Nombre de la institución elegida
) {
  return normalizeText(nombre ?? "") === UNAM;
}
