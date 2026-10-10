import { loadCatalog } from "../catalogo/catalogoService";
import { normalizeCriteria } from "../../lib/buscador/buscador";
import { prepareFilters } from "./filterOptions";

export async function getFilters(parameters) {
  const catalogo = await loadCatalog();
  const criteria = normalizeCriteria(catalogo.laboratorios, parameters);
  return prepareFilters(catalogo, criteria);
}
