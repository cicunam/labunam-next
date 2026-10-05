import { loadCatalog } from "@/lib/catalogo/catalogo";
import { normalizeCriteria } from "@/lib/buscador/buscador";
import { prepareFilters } from "@/lib/filtros/filtros";

export async function GET(request: Request) {
  try {
    const catalogo = await loadCatalog();
    const criterios = normalizeCriteria(catalogo.laboratorios, Object.fromEntries(new URL(request.url).searchParams));
    return Response.json(prepareFilters(catalogo, criterios));
  } catch { return Response.json({ error: "No se pudieron actualizar los conteos." }, { status: 503 }); }
}
