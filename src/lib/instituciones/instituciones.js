import { normalizeText } from "../texto/texto";
export const MINIMO_BUSQUEDA = 2;
const LIMITE = 15;
// Las coincidencias exactas y por inicio aparecen primero para que el nombre completo siempre esté entre las sugerencias.
export function searchInstitutions(instituciones, texto, limite = LIMITE) {
    const buscado = normalizeText(texto ?? "");
    if (buscado.length < MINIMO_BUSQUEDA)
        {return [];}
    const resultados = [];
    for (const institucion of instituciones) {
        const nombre = normalizeText(institucion.nombre);
        const siglas = normalizeText(institucion.siglas ?? "");
        const rango = nombre === buscado || siglas === buscado ? 0 : nombre.startsWith(buscado) ? 1 : nombre.includes(buscado) ? 2 : -1;
        if (rango >= 0)
            {resultados.push({ rango, institucion });}
    }
    return resultados
        .sort((a, b) => a.rango - b.rango || a.institucion.nombre.localeCompare(b.institucion.nombre, "es"))
        .slice(0, limite)
        .map(({ institucion }) => institucion);
}
