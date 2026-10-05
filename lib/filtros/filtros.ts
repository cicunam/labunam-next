import { contarEje, filtrar, perfiles, reconocimientos } from "../buscador/buscador";
import { grupos } from "../grupos/grupos";
import type { Catalogo, Criterios, Eje, Opcion } from "../tipos/tipos";

export type Filtro = { eje: Eje; etiqueta: string; opciones: Opcion[]; cualquiera: number };
export function prepararFiltros(catalogo: Catalogo, criterios: Criterios): { filtros: Filtro[]; total: number } {
  const opcionesDe = (opciones: Record<string, string>) => Object.entries(opciones).map(([clave, etiqueta]) => ({ clave, etiqueta, total: 0 }));
  const definiciones: Omit<Filtro, "cualquiera">[] = [
    { eje: "disciplina", etiqueta: "Área", opciones: grupos.map((g) => ({ clave: g.clave, etiqueta: g.etiqueta, total: 0 })) },
    { eje: "especialidad", etiqueta: "Disciplina", opciones: catalogo.disciplinas },
    { eje: "sede", etiqueta: "Sede", opciones: catalogo.sedes },
    { eje: "perfil", etiqueta: "Actividad", opciones: opcionesDe(perfiles) },
    { eje: "reconocimiento", etiqueta: "Reconocimientos", opciones: opcionesDe(reconocimientos) },
  ];
  return {
    total: filtrar(catalogo.laboratorios, criterios).length,
    filtros: definiciones.map((filtro) => {
      const cuentas = contarEje(catalogo.laboratorios, criterios, filtro.eje, filtro.opciones.map((o) => o.clave));
      const opciones = filtro.opciones.map((opcion) => ({ ...opcion, total: cuentas[opcion.clave] }));
      if (["especialidad", "sede"].includes(filtro.eje)) opciones.sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, "es"));
      return { ...filtro, opciones, cualquiera: filtrar(catalogo.laboratorios, { ...criterios, [filtro.eje]: "" }).length };
    }),
  };
}
