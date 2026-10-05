import { cargarCatalogo } from "@/lib/catalogo/catalogo";
import { normalizarCriterios } from "@/lib/buscador/buscador";
import { prepararFiltros } from "@/lib/filtros/filtros";

export async function GET(request: Request) {
  try {
    const catalogo = await cargarCatalogo();
    const criterios = normalizarCriterios(catalogo.laboratorios, Object.fromEntries(new URL(request.url).searchParams));
    return Response.json(prepararFiltros(catalogo, criterios));
  } catch { return Response.json({ error: "No se pudieron actualizar los conteos." }, { status: 503 }); }
}
