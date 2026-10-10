import { toLaboratorio } from "../laboratorios/laboratorioMapper";
import { indexRelations } from "./catalogoRelations";
import { buildOptions, buildSuggestions } from "./catalogoOptions";

/** Une las seis fuentes leídas por los DAO sin hacer nuevas consultas. */
export function assembleCatalog(rows) {
  const relations = indexRelations(rows);
  const laboratorios = rows.filas.map((row) => toLaboratorio(row, relations)).filter(Boolean);
  const disciplinas = [...relations.disciplinas.values()];

  const sugerencias = buildSuggestions(laboratorios, disciplinas);
  laboratorios.sort((first, second) => first.nombre.localeCompare(second.nombre, "es"));

  return {
    laboratorios,
    sedes: buildOptions(
      laboratorios.map((laboratorio) => laboratorio.sedeNombre),
      laboratorios,
      "sede",
    ),
    disciplinas: buildOptions(disciplinas, laboratorios, "disciplinas"),
    sugerencias,
  };
}
