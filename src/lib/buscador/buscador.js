// LabUNAM
// Utilidades compartidas
// buscador (búsqueda por palabras, filtros por eje y conteos sobre el catálogo en memoria)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { slugify, normalizeText } from "../texto/texto";

// Constantes
// Ejes de filtro que aceptan la URL y el diálogo de filtros.
export const ejes = ["tipo", "disciplina", "especialidad", "sede", "perfil", "reconocimiento"];
// Etiquetas visibles de las actividades del laboratorio.
export const perfiles = {
  servicios: "Presta servicios",
  docencia: "Apoya la docencia",
  basica: "Investigación básica",
  aplicada: "Investigación aplicada",
};
// Etiquetas visibles de los reconocimientos que se pueden filtrar.
export const reconocimientos = {
  certificacion: "Con certificación",
  acreditacion: "Con acreditación",
  micrositio: "Con micrositio en LabUNAM",
};

// Definición del módulo
// Valores que un laboratorio aporta a un eje, con las claves que usa la URL.
export function getFacetValues(
  lab, // Object - Laboratorio del catálogo; se leen tipo, sede, grupos, disciplinas, perfil, certificado, acreditado y micrositio
  eje, // String - Uno de los ejes de filtro (ver ejes)
) {
  switch (eje) {
    case "tipo":
      return [lab.tipo];
    case "sede":
      return [lab.sede];
    case "disciplina":
      return lab.grupos;
    case "especialidad":
      return lab.disciplinas.map(slugify);
    case "perfil":
      return lab.perfil;
    case "reconocimiento":
      return [
        lab.certificado ? "certificacion" : "",
        lab.acreditado ? "acreditacion" : "",
        lab.micrositio ? "micrositio" : "",
      ].filter(Boolean);
  }
}
// Conserva el texto buscado y sólo los filtros con algún laboratorio que los cumpla.
export function normalizeCriteria(
  laboratorios, // Array - Laboratorios del catálogo en memoria
  criterios, // Object - Criterios recibidos: q con el texto buscado y un valor por eje
) {
  const validos = { q: criterios.q?.trim() ?? "" };
  for (const eje of ejes) {
    const valor = criterios[eje];
    if (valor && laboratorios.some((lab) => getFacetValues(lab, eje).includes(valor))) {
      validos[eje] = valor;
    }
  }
  return validos;
}
// Indica si el texto contiene todas las palabras, en cualquier orden.
const contains = (
  texto, // String - Texto ya normalizado donde se busca
  palabras, // Array - Palabras (String) normalizadas que deben aparecer todas
) => palabras.every((palabra) => texto.includes(palabra));
// Separa el texto buscado en palabras normalizadas, sin vacíos.
const getWords = (
  q = "", // String Optional - Texto escrito en el buscador
) => normalizeText(q).split(/\s+/u).filter(Boolean);
// Indica si un laboratorio cumple todos los filtros y contiene todas las palabras.
function matchesCriteria(
  lab, // Object - Laboratorio del catálogo; se leen sus ejes y lab.indice, el texto normalizado de búsqueda
  criterios, // Object - Criterios ya validados con normalizeCriteria
  palabras, // Array - Palabras (String) normalizadas del texto buscado
) {
  return (
    ejes.every((eje) => !criterios[eje] || getFacetValues(lab, eje).includes(criterios[eje])) &&
    contains(lab.indice, palabras)
  );
}
// Busca todas las palabras y prioriza coincidencias en nombre, luego en equipos/servicios.
export function filterLaboratorios(
  laboratorios, // Array - Laboratorios del catálogo en memoria
  criterios, // Object - Criterios de la URL: q con el texto buscado y un valor por eje; se validan aquí
) {
  const validos = normalizeCriteria(laboratorios, criterios);
  const palabras = getWords(validos.q);
  const encontrados = laboratorios.filter((lab) => matchesCriteria(lab, validos, palabras));
  const resultados = encontrados.map((lab) => {
    const capacidades = [...lab.equipos, ...lab.servicios];
    const coincidencias = palabras.length
      ? capacidades.filter((texto) => contains(normalizeText(texto), palabras))
      : [];
    const enNombre =
      palabras.length > 0 && contains(normalizeText(`${lab.nombre} ${lab.siglas}`), palabras);
    return { ...lab, coincidencias, enNombre };
  });
  return resultados.sort(compareSearchResults);
}
// Cuántos laboratorios tiene cada valor de un eje con los demás filtros aplicados.
export function countFacet(
  laboratorios, // Array - Laboratorios del catálogo en memoria
  criterios, // Object - Criterios activos: q y un valor por eje; se validan aquí
  eje, // String - Eje que se cuenta; su propia selección se ignora
  valores, // Array - Valores (String) del eje que se cuentan; los que no aparecen quedan en cero
) {
  const validos = normalizeCriteria(laboratorios, criterios);
  // Excluimos el filtro de la categoría que contamos. Así las alternativas siguen
  // mostrando cuántos resultados darían si el usuario cambiara su selección.
  // Los filtros de las demás categorías sí siguen activos.
  delete validos[eje];
  const palabras = getWords(validos.q);
  const totales = Object.fromEntries(valores.map((valor) => [valor, 0]));
  for (const lab of laboratorios) {
    if (!matchesCriteria(lab, validos, palabras)) {
      continue;
    }
    for (const valor of new Set(getFacetValues(lab, eje))) {
      if (Object.hasOwn(totales, valor)) {
        totales[valor]++;
      }
    }
  }
  return totales;
}

// Utilidades

// Ordena primero por coincidencia en nombre, luego por número de capacidades y al final alfabéticamente.
function compareSearchResults(
  first, // Object - Resultado de filterLaboratorios con enNombre, coincidencias y nombre
  second, // Object - Resultado con el que se compara, con los mismos campos
) {
  const namePriority = Number(second.enNombre) - Number(first.enNombre);
  const matchPriority = second.coincidencias.length - first.coincidencias.length;
  return namePriority || matchPriority || first.nombre.localeCompare(second.nombre, "es");
}
