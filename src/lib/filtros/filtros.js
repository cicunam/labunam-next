import { countFacet, filterLaboratorios, perfiles, reconocimientos } from "../buscador/buscador";
import { grupos } from "../grupos/grupos";
export function prepareFilters(catalogo, criterios) {
    const getOptions = (opciones) => Object.entries(opciones).map(([clave, etiqueta]) => ({ clave, etiqueta, total: 0 }));
    const definiciones = [
        { eje: "disciplina", etiqueta: "Área", opciones: grupos.map((g) => ({ clave: g.clave, etiqueta: g.etiqueta, total: 0 })) },
        { eje: "especialidad", etiqueta: "Disciplina", opciones: catalogo.disciplinas },
        { eje: "sede", etiqueta: "Sede", opciones: catalogo.sedes },
        { eje: "perfil", etiqueta: "Actividad", opciones: getOptions(perfiles) },
        { eje: "reconocimiento", etiqueta: "Reconocimientos", opciones: getOptions(reconocimientos) },
    ];
    return {
        total: filterLaboratorios(catalogo.laboratorios, criterios).length,
        filtros: definiciones.map((filtro) => {
            const cuentas = countFacet(catalogo.laboratorios, criterios, filtro.eje, filtro.opciones.map((o) => o.clave));
            const opciones = filtro.opciones.map((opcion) => ({ ...opcion, total: cuentas[opcion.clave] }));
            if (["especialidad", "sede"].includes(filtro.eje))
                opciones.sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"));
            return { ...filtro, opciones, cualquiera: filterLaboratorios(catalogo.laboratorios, { ...criterios, [filtro.eje]: "" }).length };
        }),
    };
}
