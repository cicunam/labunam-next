import { cargarCatalogo } from "@/lib/catalogo";
import { normalizarCriterios } from "@/lib/buscador";
import { prepararFiltros } from "@/lib/filtros";

export async function GET(request: Request) {
  try {
    const catalogo = await cargarCatalogo();
    const criterios = normalizarCriterios(catalogo.laboratorios, Object.fromEntries(new URL(request.url).searchParams));
    return Response.json(prepararFiltros(catalogo, criterios));
  } catch { return Response.json({ error: "No se pudieron actualizar los conteos." }, { status: 503 }); }
}
