import { slugify, normalizeText } from "../texto/texto";
export const ejes = ["tipo", "disciplina", "especialidad", "sede", "perfil", "reconocimiento"];
export const perfiles = { servicios: "Presta servicios", docencia: "Apoya la docencia", basica: "Investigación básica", aplicada: "Investigación aplicada" };
export const reconocimientos = { certificacion: "Con certificación", acreditacion: "Con acreditación", micrositio: "Con micrositio en LabUNAM" };
export function getFacetValues(lab, eje) {
    switch (eje) {
        case "tipo": return [lab.tipo];
        case "sede": return [lab.sede];
        case "disciplina": return lab.grupos;
        case "especialidad": return lab.disciplinas.map(slugify);
        case "perfil": return lab.perfil;
        case "reconocimiento": return [lab.certificado ? "certificacion" : "", lab.acreditado ? "acreditacion" : "", lab.micrositio ? "micrositio" : ""].filter(Boolean);
    }
}
export function normalizeCriteria(laboratorios, criterios) {
    const validos = { q: criterios.q?.trim() ?? "" };
    for (const eje of ejes) {
        const valor = criterios[eje];
        if (valor && laboratorios.some((lab) => getFacetValues(lab, eje).includes(valor)))
            validos[eje] = valor;
    }
    return validos;
}
const contains = (texto, palabras) => palabras.every((palabra) => texto.includes(palabra));
const getWords = (q = "") => normalizeText(q).split(/\s+/u).filter(Boolean);
function matchesCriteria(lab, criterios, palabras) {
    return ejes.every((eje) => !criterios[eje] || getFacetValues(lab, eje).includes(criterios[eje])) && contains(lab.indice, palabras);
}
export function filterLaboratorios(laboratorios, criterios) {
    const validos = normalizeCriteria(laboratorios, criterios);
    const palabras = getWords(validos.q);
    return laboratorios.filter((lab) => matchesCriteria(lab, validos, palabras)).map((lab) => ({
        ...lab,
        coincidencias: palabras.length ? [...lab.equipos, ...lab.servicios].filter((texto) => contains(normalizeText(texto), palabras)) : [],
        enNombre: palabras.length > 0 && contains(normalizeText(`${lab.nombre} ${lab.siglas}`), palabras),
    })).sort((a, b) => Number(b.enNombre) - Number(a.enNombre) || b.coincidencias.length - a.coincidencias.length || a.nombre.localeCompare(b.nombre, "es"));
}
export function countFacet(laboratorios, criterios, eje, valores) {
    const validos = normalizeCriteria(laboratorios, criterios);
    delete validos[eje];
    const palabras = getWords(validos.q);
    const totales = Object.fromEntries(valores.map((valor) => [valor, 0]));
    for (const lab of laboratorios) {
        if (!matchesCriteria(lab, validos, palabras))
            continue;
        for (const valor of new Set(getFacetValues(lab, eje))) {
            if (Object.hasOwn(totales, valor))
                totales[valor]++;
        }
    }
    return totales;
}
