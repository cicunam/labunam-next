// LabUNAM
// Utilidades compartidas
// redes (tipos de red de laboratorios: nombres visibles y tono de color)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Constantes
// La clave de cada red es el valor del eje tipo en la URL. El orden es el que muestran
// el buscador, el menú y el pie.
export const redes = {
  nacionales: {
    nombre: "Laboratorios nacionales",
    singular: "Laboratorio nacional",
    corto: "Nacionales",
    tone: "red",
  },
  universitarios: {
    nombre: "Laboratorios universitarios",
    singular: "Laboratorio universitario",
    corto: "Universitarios",
    tone: "blue",
  },
  unidades: {
    nombre: "Unidades de apoyo",
    singular: "Unidad de apoyo",
    corto: "Unidades de apoyo",
    tone: "green",
  },
  internacionales: {
    nombre: "Laboratorios internacionales",
    singular: "Laboratorio internacional",
    corto: "Internacionales",
    tone: "neutral",
  },
};
// Las tres redes que presentan el menú, el pie y la portada. Las internacionales existen
// en el catálogo, pero no forman parte de esa presentación institucional.
export const redesPrincipales = ["nacionales", "universitarios", "unidades"];
