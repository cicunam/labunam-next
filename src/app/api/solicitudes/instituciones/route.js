import { loadRequestCatalogs } from "@/lib/catalogosSolicitud/catalogosSolicitud";
import { searchInstitutions } from "@/lib/instituciones/instituciones";
export async function GET(request) {
    // El texto se recorta para no procesar entradas arbitrariamente largas.
    const texto = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 100);
    try {
        const { instituciones } = await loadRequestCatalogs();
        return Response.json({ instituciones: searchInstitutions(instituciones, texto) });
    }
    catch {
        return Response.json({ error: "No se pudieron cargar las instituciones." }, { status: 503 });
    }
}
