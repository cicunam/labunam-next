import { normalizeText } from "../texto/texto";
// Identificadores heredados del formulario PHP; la tabla de solicitudes los espera tal cual.
export const TIPOS_SOLICITANTE = [
    { id: "1", texto: "Persona física", seccion: null },
    { id: "2", texto: "Empresa", seccion: "empresa" },
    { id: "3", texto: "Entidad de la sociedad civil organizada", seccion: "sociedad" },
    { id: "4", texto: "Institución de educación superior", seccion: "institucion" },
    { id: "5", texto: "Centro o instituto de investigación", seccion: "institucion" },
    { id: "6", texto: "Otro", seccion: "otro" },
];
export const TIPOS_SOLICITUD = [
    { id: "1", texto: "Análisis o prueba", seccion: "analisis" },
    { id: "2", texto: "Colaboración académica", seccion: "colaboracion" },
    { id: "3", texto: "Capacitación", seccion: "capacitacion" },
    { id: "4", texto: "Otro", seccion: "otra" },
];
export const TIEMPOS_ESPERA = [
    { id: "1", texto: "De 1 a 3 días" },
    { id: "2", texto: "Más de 3 días" },
];
export const TIEMPO_CON_DIAS = "2";
export const CERTIFICACIONES = [
    { id: "1", texto: "Acreditación" },
    { id: "2", texto: "Certificación" },
    { id: "0", texto: "No aplica" },
];
export const TAMANOS_EMPRESA = ["Grande", "Mediana", "Pequeña", "Micro"].map((texto) => ({ id: texto, texto }));
// Sólo México y Estados Unidos tienen estados en el catálogo heredado.
const PAISES_CON_ESTADO = new Set(["MEX", "USA"]);
const INSTITUCION_UNAM = normalizeText("Universidad Nacional Autónoma de México");
// Los patrones se escriben para el atributo `pattern`, que el navegador evalúa completo y con la bandera v.
export const REGLAS = {
    nombre: { minLength: 2, maxLength: 50, pattern: "[\\p{L} .'\\-]+", title: "Sólo letras, espacios, puntos, apóstrofos o guiones" },
    organizacion: { minLength: 2, maxLength: 100, pattern: "[\\p{L}\\p{N} .,'&\\-]+", title: "Sólo letras, números, espacios y signos básicos" },
    correo: { maxLength: 80 },
    telefono: { minLength: 8, maxLength: 13, pattern: "[0-9]+", title: "Sólo números, entre 8 y 13 dígitos" },
    descripcion: { minLength: 2, maxLength: 255 },
    norma: { minLength: 2, maxLength: 50 },
    dias: { min: 4, max: 365 },
};
export function sectionFor(opciones, id) {
    return opciones.find((opcion) => opcion.id === id)?.seccion ?? null;
}
// El visitante puede escribir el nombre sin elegir la sugerencia; se acepta si coincide sin acentos ni mayúsculas.
export function findOption(opciones, texto) {
    const buscado = normalizeText(texto ?? "");
    return buscado ? opciones.find((opcion) => normalizeText(opcion.nombre) === buscado) ?? null : null;
}
export function requiresState(clavePais) {
    return PAISES_CON_ESTADO.has(clavePais);
}
export function isUnam(nombreInstitucion) {
    return normalizeText(nombreInstitucion ?? "") === INSTITUCION_UNAM;
}
