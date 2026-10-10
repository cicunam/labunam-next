import { loadCatalog } from "../catalogo/catalogoService";
import { readPhotos } from "../fotos/fotosService";
import { countFacet } from "../../lib/buscador/buscador";
import { grupos } from "../../lib/grupos/grupos";
import { homeNetworks } from "../../lib/home/homeContent";

export async function getHomeData() {
  const [catalogo, photos] = await Promise.all([loadCatalog(), readPhotos()]);
  const tipos = homeNetworks.map(({ tipo }) => tipo);
  const areas = grupos.map((grupo) => grupo.clave);
  const recentLaboratorios = [...catalogo.laboratorios]
    .sort((first, second) => second.fecha.localeCompare(first.fecha) || second.idLab - first.idLab)
    .slice(0, 4);

  return {
    locations: catalogo.sedes,
    suggestions: catalogo.sugerencias,
    total: catalogo.laboratorios.length,
    counts: countFacet(catalogo.laboratorios, {}, "tipo", tipos),
    areaCounts: countFacet(catalogo.laboratorios, {}, "disciplina", areas),
    recentLaboratorios,
    photos,
  };
}
