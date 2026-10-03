import { clave, plano } from "./texto";
import type { Criterios, Eje, Laboratorio, Resultado } from "./tipos";

export const ejes: Eje[] = ["tipo", "disciplina", "especialidad", "sede", "perfil", "reconocimiento"];
export const perfiles = { servicios: "Presta servicios", docencia: "Apoya la docencia", basica: "Investigación básica", aplicada: "Investigación aplicada" };
export const reconocimientos = { certificacion: "Con certificación", acreditacion: "Con acreditación", micrositio: "Con micrositio en LabUNAM" };

export function valoresDe(lab: Laboratorio, eje: Eje): string[] {
  switch (eje) {
    case "tipo": return [lab.tipo];
    case "sede": return [lab.sede];
    case "disciplina": return lab.grupos;
    case "especialidad": return lab.disciplinas.map(clave);
    case "perfil": return lab.perfil;
    case "reconocimiento": return [lab.certificado ? "certificacion" : "", lab.acreditado ? "acreditacion" : "", lab.micrositio ? "micrositio" : ""].filter(Boolean);
  }
}

export function normalizarCriterios(laboratorios: Laboratorio[], criterios: Criterios): Criterios {
  const validos: Criterios = { q: criterios.q?.trim() ?? "" };
  for (const eje of ejes) {
    const valor = criterios[eje];
    if (valor && laboratorios.some((lab) => valoresDe(lab, eje).includes(valor))) validos[eje] = valor;
  }
  return validos;
}

const contiene = (texto: string, palabras: string[]) => palabras.every((palabra) => texto.includes(palabra));
const palabrasDe = (q = "") => plano(q).split(/\s+/u).filter(Boolean);

function cumple(lab: Laboratorio, criterios: Criterios, palabras: string[]): boolean {
  return ejes.every((eje) => !criterios[eje] || valoresDe(lab, eje).includes(criterios[eje]!)) && contiene(lab.indice, palabras);
}

export function filtrar(laboratorios: Laboratorio[], criterios: Criterios): Resultado[] {
  const validos = normalizarCriterios(laboratorios, criterios);
  const palabras = palabrasDe(validos.q);
  return laboratorios.filter((lab) => cumple(lab, validos, palabras)).map((lab) => ({
    ...lab,
    coincidencias: palabras.length ? [...lab.equipos, ...lab.servicios].filter((texto) => contiene(plano(texto), palabras)) : [],
    enNombre: palabras.length > 0 && contiene(plano(`${lab.nombre} ${lab.siglas}`), palabras),
  })).sort((a, b) => Number(b.enNombre) - Number(a.enNombre) || b.coincidencias.length - a.coincidencias.length || a.nombre.localeCompare(b.nombre, "es"));
}

export function contarEje(laboratorios: Laboratorio[], criterios: Criterios, eje: Eje, valores: string[]): Record<string, number> {
  const validos = normalizarCriterios(laboratorios, criterios);
  delete validos[eje];
  const palabras = palabrasDe(validos.q);
  const totales = Object.fromEntries(valores.map((valor) => [valor, 0]));
  for (const lab of laboratorios) {
    if (!cumple(lab, validos, palabras)) continue;
    for (const valor of new Set(valoresDe(lab, eje))) {
      if (Object.hasOwn(totales, valor)) totales[valor]++;
    }
  }
  return totales;
}
