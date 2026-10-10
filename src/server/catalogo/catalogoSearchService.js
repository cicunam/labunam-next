// LabUNAM
// Servidor: catálogo
// catalogoSearchService (resultados y facetas sobre el catálogo en caché)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Dependencias
import { filterLaboratorios, normalizeCriteria } from "../../lib/buscador/buscador";

// Servicios
import { loadCatalog } from "./catalogoService";
import { readPhotos } from "../fotos/fotosService";
import { prepareFilters } from "../filtros/filterOptions";

// Definición del servicio
// Prepara resultados y facetas del mismo catálogo para que sus conteos coincidan.
export async function searchCatalog(
  parameters, // Object - Parámetros de la URL tal como los entrega Next; sólo se conservan las cadenas
) {
  const [catalogo, photos] = await Promise.all([loadCatalog(), readPhotos()]);
  // Next puede entregar valores repetidos como arrays; sólo aceptamos criterios simples.
  const entries = Object.entries(parameters).filter(([, value]) => typeof value === "string");
  const criteria = normalizeCriteria(catalogo.laboratorios, Object.fromEntries(entries));
  const { filtros, total } = prepareFilters(catalogo, criteria);

  return {
    criteria,
    results: filterLaboratorios(catalogo.laboratorios, criteria),
    filters: filtros,
    total,
    locations: catalogo.sedes,
    suggestions: catalogo.sugerencias,
    photos,
  };
}
