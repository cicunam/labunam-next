// LabUNAM
// Servidor: laboratorios
// laboratoriosController (respuestas HTTP de las rutas de API de laboratorios)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Servicios
import { getById, getFilterCounts, isValidId } from "./laboratoriosService";

// Definición del controlador
// Las páginas llaman al servicio directamente; estas funciones sólo atienden al navegador.

// GET /api/laboratorios/[id]: ficha para el modal.
export async function getDetails(
  _request, // Request - Petición HTTP; no se usa
  { params }, // Object - params es una promesa que resuelve a { id }
) {
  const { id } = await params;
  if (!isValidId(id)) {
    return Response.json({ error: "Identificador inválido." }, { status: 400 });
  }
  try {
    const laboratorio = await getById(id);
    if (!laboratorio) {
      return Response.json({ error: "El laboratorio no existe." }, { status: 404 });
    }
    return Response.json(laboratorio);
  } catch {
    return Response.json(
      { error: "La ficha no está disponible. Intenta de nuevo." },
      { status: 503 },
    );
  }
}

// GET /api/filtros: conteos del diálogo de filtros.
export async function getFilters(
  request, // Request - Petición HTTP; sus parámetros son los criterios del borrador
) {
  try {
    const parameters = Object.fromEntries(new URL(request.url).searchParams);
    return Response.json(await getFilterCounts(parameters));
  } catch {
    return Response.json({ error: "No se pudieron actualizar los conteos." }, { status: 503 });
  }
}
