// LabUNAM
// Utilidades compartidas
// buscador (los filtros del catálogo, búsqueda por palabras y conteos sobre el catálogo en memoria)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { slugify, normalizeText } from "../texto/texto";
import { redes } from "../redes/redes";
import { grupos } from "../grupos/grupos";

// Constantes
// Etiquetas visibles de las actividades del laboratorio; las claves son los valores de lab.perfil.
const perfiles = {
  servicios: "Presta servicios",
  docencia: "Apoya la docencia",
  basica: "Investigación básica",
  aplicada: "Investigación aplicada",
};
// Etiquetas visibles de los reconocimientos que se pueden filtrar.
const reconocimientos = {
  certificacion: "Con certificación",
  acreditacion: "Con acreditación",
  micrositio: "Con micrositio en LabUNAM",
};
// Convierte un objeto clave → etiqueta en la lista de opciones que usa el diálogo.
const toOptions = (
  etiquetas, // Object - Etiqueta visible (String) por cada clave
) => Object.entries(etiquetas).map(([clave, etiqueta]) => ({ clave, etiqueta }));

// Los seis filtros del catálogo, en el orden en que los muestra el diálogo. Cada uno define:
// - eje: el parámetro de la URL. Los nombres son heredados: "disciplina" filtra por área
//   (las diez de grupos) y "especialidad" por cada una de las 38 disciplinas.
// - etiqueta: el título visible de su grupo de opciones.
// - enDialogo: si aparece en el diálogo de filtros; la red se elige en el buscador.
// - reordenar: si sus opciones se ordenan por conteo en cada consulta (listas largas).
// - valores: las claves que un laboratorio aporta al filtro.
// - opciones: las que ofrece el diálogo, fijas o leídas del catálogo armado.
export const filtros = [
  {
    eje: "tipo",
    etiqueta: "Red",
    enDialogo: false,
    reordenar: false,
    valores: (lab) => [lab.tipo],
    opciones: () => Object.entries(redes).map(([clave, red]) => ({ clave, etiqueta: red.nombre })),
  },
  {
    eje: "disciplina",
    etiqueta: "Área",
    enDialogo: true,
    reordenar: false,
    valores: (lab) => lab.grupos,
    opciones: () => grupos.map((grupo) => ({ clave: grupo.clave, etiqueta: grupo.etiqueta })),
  },
  {
    eje: "especialidad",
    etiqueta: "Disciplina",
    enDialogo: true,
    reordenar: true,
    valores: (lab) => lab.disciplinas.map(slugify),
    opciones: (catalogo) => catalogo.disciplinas,
  },
  {
    eje: "sede",
    etiqueta: "Sede",
    enDialogo: true,
    reordenar: true,
    valores: (lab) => [lab.sede],
    opciones: (catalogo) => catalogo.sedes,
  },
  {
    eje: "perfil",
    etiqueta: "Actividad",
    enDialogo: true,
    reordenar: false,
    valores: (lab) => lab.perfil,
    opciones: () => toOptions(perfiles),
  },
  {
    eje: "reconocimiento",
    etiqueta: "Reconocimientos",
    enDialogo: true,
    reordenar: false,
    valores: (lab) =>
      [
        lab.certificado ? "certificacion" : "",
        lab.acreditado ? "acreditacion" : "",
        lab.micrositio ? "micrositio" : "",
      ].filter(Boolean),
    opciones: () => toOptions(reconocimientos),
  },
];
// Ejes de filtro que aceptan la URL y el diálogo de filtros.
export const ejes = filtros.map((filtro) => filtro.eje);
const filtrosPorEje = Object.fromEntries(filtros.map((filtro) => [filtro.eje, filtro]));

// Definición del módulo
// Valores que un laboratorio aporta a un eje, con las claves que usa la URL.
export function getFacetValues(
  lab, // Object - Laboratorio del catálogo; se leen los campos que pide cada filtro
  eje, // String - Uno de los ejes de filtro (ver ejes)
) {
  return filtrosPorEje[eje].valores(lab);
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
