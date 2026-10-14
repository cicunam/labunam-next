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
// Los patrones se escriben para el atributo `pattern`, que el navegador evalúa completo y con
// la bandera v; la validación del servidor los reutiliza para que ambas reglas no difieran.
export const RULES = {
  nombre: {
    minLength: 2,
    maxLength: 50,
    pattern: "[\\p{L} .'\\-]+",
    title: "Sólo letras, espacios, puntos, apóstrofos o guiones",
  },
  organizacion: {
    minLength: 2,
    maxLength: 100,
    pattern: "[\\p{L}\\p{N} .,'&\\-]+",
    title: "Sólo letras, números, espacios y signos básicos",
  },
  correo: { maxLength: 80 },
  telefono: {
    minLength: 8,
    maxLength: 13,
    pattern: "[0-9]+",
    title: "Sólo números, entre 8 y 13 dígitos",
  },
  descripcion: { minLength: 2, maxLength: 255 },
  norma: { minLength: 2, maxLength: 50 },
  dias: { min: 4, max: 365 },
};

// Definición del módulo
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
